import {
  admin,
  DEBUG,
  environment,
  stripe,
  throwError,
} from "../../../../config/config";
import { createAuthClient } from "./createAuthClient";
import { getAuthUserById } from "../../../../utils/auth/getAuthUserById";
import { sendNotification } from "../../../../notifications/sendNotification";

export const saveClient = async (
  clientId: number | string,
  proVetClientData: any,
  movetClientData?: any
): Promise<boolean> => {
  const data: any = {};
  if (proVetClientData) {
    if (environment.type === "production")
      updateStripeCustomerData(proVetClientData);
    if (proVetClientData?.archived) data.archived = proVetClientData?.archived;
    if (proVetClientData?.email)
      data.email = proVetClientData?.email?.toLowerCase();
    if (proVetClientData?.firstname)
      data.firstName = proVetClientData?.firstname;
    if (proVetClientData?.lastname) data.lastName = proVetClientData?.lastname;
    if (proVetClientData?.street_address)
      data.street = proVetClientData?.street_address;
    if (proVetClientData?.no_sms === true || proVetClientData?.no_sms === false)
      data.sendSms = !proVetClientData?.no_sms;
    if (
      proVetClientData?.no_email === true ||
      proVetClientData?.no_email === false
    )
      data.sendEmail = !proVetClientData?.no_email;
    if (proVetClientData?.city) data.city = proVetClientData?.city;
    if (proVetClientData?.state) data.state = proVetClientData?.state;
    if (proVetClientData?.zip_code) data.zipCode = proVetClientData?.zip_code;
    if (
      proVetClientData?.phone_numbers !== undefined &&
      proVetClientData?.phone_numbers.length
    ) {
      const originalPhoneNumber = proVetClientData?.phone_numbers[0].number;
      let formattedPhoneNumber = originalPhoneNumber.replace("+1", "(");
      formattedPhoneNumber =
        formattedPhoneNumber.slice(0, 4) +
        ") " +
        formattedPhoneNumber.slice(4, 7) +
        "-" +
        formattedPhoneNumber.slice(7);
      data.phone = formattedPhoneNumber;
    }
    //   if (
    //     proVetClientData?.fields_rel &&
    //     proVetClientData?.fields_rel?.length > 0
    //   ) {
    //     proVetClientData.fields_rel.forEach(
    //       (customField: {
    //         value: null | string;
    //         field_id: number;
    //         label: string;
    //       }) => {
    //         if (customField.field_id === 3) {
    //           if (DEBUG) console.log(`saveClient => ${customField.label}`, customField.value);
    //           data.howDidYouHearAboutUs = customField.value;
    //         } else if (DEBUG) console.log(`saveClient => ${customField.label} SKIPPED`);
    //       }
    //     );
    //   }
  }
  if (movetClientData) {
    if (movetClientData?.customer) data.customer = movetClientData?.customer;
    if (movetClientData?.phone) {
      data.phone = movetClientData?.phone;
    }
    if (movetClientData?.defaultPayment)
      data.defaultPayment = movetClientData?.defaultPayment;
    if (movetClientData?.defaultLocation)
      data.defaultLocation = movetClientData?.defaultLocation;
    if (movetClientData?.location) data.location = movetClientData?.location;
    if (movetClientData?.sendPush !== null)
      data.sendPush = movetClientData?.sendPush;
    if (movetClientData?.pushToken) data.pushToken = movetClientData?.pushToken;
  }

  if (DEBUG) console.log("saveClient => DATA", data);

  if (!data?.archived) {
    const clientAuthUser = await getAuthUserById(`${clientId}`, [
      "email",
      "uid",
    ]);
    const { email, uid } = clientAuthUser;
    if (DEBUG) {
      console.log(`saveClient => CLIENT AUTH USER EMAIL => ${email}`);
      console.log(`saveClient => CLIENT AUTH USER UID => ${uid}`);
    }

    if (
      (email === null || email === undefined) &&
      (uid === null || uid === undefined) &&
      proVetClientData?.email
    ) {
      if (DEBUG)
        console.log(
          `saveClient => ATTEMPTING TO CREATE NEW AUTH USER FOR CLIENT #${clientId}`
        );
      createAuthClient(
        {
          id: `${clientId}`,
          ...proVetClientData,
        },
        movetClientData
      );
    } else if (
      (proVetClientData?.email === null ||
        proVetClientData?.email === undefined) &&
      DEBUG
    )
      console.log(
        `saveClient => CLIENT #${clientId} DOES NOT HAVE AN EMAIL ADDRESS IN PROVET - SKIPPING AUTH USER CREATION`
      );
    else {
      const { firstName, lastName, phone, email, uid } = data;
      if (firstName || lastName || phone || email || uid) {
        if (DEBUG) console.log("saveClient => STARTING AUTH USER DATA UPDATE");
        const newAuthData: any = {};
        if (phone) {
          newAuthData.phoneNumber =
            "+1" +
            phone
              .replace("(", "")
              .replace(")", "")
              .replace("-", "")
              .replace("", "");
          if (DEBUG)
            console.log("saveClient => PHONE NUMBER DETECTED => ", phone);
        }
        if (firstName) {
          newAuthData.displayName = firstName;
          if (DEBUG)
            console.log(
              "saveClient => CLIENT FIRST NAME DETECTED => ",
              firstName
            );
        }
        if (lastName) {
          newAuthData.displayName += " " + lastName;
          if (DEBUG)
            console.log(
              "saveClient => CLIENT LAST NAME DETECTED => ",
              lastName
            );
        }
        if (email) {
          newAuthData.email = email;
          if (DEBUG)
            console.log("saveClient => CLIENT EMAIL DETECTED => ", email);
        }
        if (uid) {
          newAuthData.uid = `${uid}`;
          if (DEBUG) console.log("saveClient => CLIENT ID DETECTED => ", uid);
        }
        if (DEBUG) {
          console.log("saveClient => AUTH USER DATA UPDATES =>", newAuthData);
          console.log("saveClient => USER ID =>", clientId);
        }
        admin
          .auth()
          .updateUser(`${clientId}`, newAuthData)
          .then((userRecord: any) => {
            if (DEBUG)
              console.log(
                "saveClient => SUCCESSFULLY UPDATED AUTH USER ->",
                userRecord.toJSON()
              );
          })
          .catch((error: any) => DEBUG && console.error(error.message));
      }
    }
  } else if (DEBUG)
    console.log(
      `saveClient => CLIENT #${clientId} IS ARCHIVED - SKIPPING AUTH USER UPDATES`
    );

  const clientDocument = await admin
    .firestore()
    .collection("clients")
    .doc(`${clientId}`);

  return await clientDocument
    .get()
    .then(async (document: any) => {
      if (document.exists) {
        if (DEBUG)
          console.log(
            `saveClient => EXISTING CLIENT DOCUMENT FOUND: #${clientId}`
          );
        return await clientDocument
          .set(
            {
              ...data,
              updatedOn: new Date(),
            },
            { merge: true }
          )
          .then(async () => {
            if (DEBUG)
              console.log(
                `saveClient => SYNCHRONIZED PROVET DATA W/ FIRESTORE FOR CLIENT #${clientId}`
              );
            return true;
          })
          .catch((error: any) => throwError(error));
      } else if (proVetClientData.email) {
        if (DEBUG)
          console.log(
            `saveClient => UNABLE TO LOCATE DOCUMENT FOR CLIENT #${clientId} IN FIRESTORE`
          );
        return await admin
          .firestore()
          .collection("clients")
          .doc(`${proVetClientData?.id}`)
          .set(
            {
              ...data,
              createdOn: new Date(),
            },
            { merge: true }
          )
          .then(() => true)
          .catch((error: any) => throwError(error));
      } else {
        console.error(
          `PROVET CLOUD INTEGRATION FAILURE:\n\nFailed to Generate a MoVET Account for Client #${clientId} \n\nREASON: No Email Address Provided. Please login to PROVET Cloud and save an email address to Client #${clientId} to retry this action - ${
            environment.type === "production"
              ? "https://us.provetcloud.com/4285"
              : "https://provetcloud.com/3785"
          }/client/${clientId}/tabs/`
        );
        return false;
      }
    })
    .catch((error: any) => throwError(error));
};

const updateStripeCustomerData = (proVetClientData: any) => {
  if (
    proVetClientData?.id_number !== undefined &&
    proVetClientData?.id_number !== null &&
    proVetClientData?.id_number !== "" &&
    proVetClientData?.archived === false &&
    environment?.type === "production"
  ) {
    if (DEBUG)
      console.log(
        "updateStripeCustomerData => UPDATING EXISTING STRIPE CUSTOMER",
        {
          email: proVetClientData?.email,
          address: {
            line1: proVetClientData?.street_address,
            line2: proVetClientData?.street_address_2,
            city: proVetClientData?.city,
            state: proVetClientData?.state,
            postal_code: proVetClientData?.zip_code,
            country: proVetClientData?.country_region,
          },
          description: proVetClientData?.critical_notes,
          name:
            proVetClientData?.firstname && proVetClientData?.lastname
              ? `${proVetClientData?.firstname} ${proVetClientData?.lastname}`
              : proVetClientData?.firstname
              ? proVetClientData?.firstname
              : proVetClientData?.lastname
              ? proVetClientData?.lastname
              : null,
          phone: proVetClientData?.phone_numbers[0]?.number || "",
        }
      );
    stripe.customers
      .update(proVetClientData?.id_number, {
        email: proVetClientData?.email,
        address: {
          line1: proVetClientData?.street_address,
          line2: proVetClientData?.street_address_2,
          city: proVetClientData?.city,
          state: proVetClientData?.state,
          postal_code: proVetClientData?.zip_code,
          country: proVetClientData?.country_region,
        },
        description: proVetClientData?.critical_notes,
        name:
          proVetClientData?.firstname && proVetClientData?.lastname
            ? `${proVetClientData?.firstname} ${proVetClientData?.lastname}`
            : proVetClientData?.firstname
            ? proVetClientData?.firstname
            : proVetClientData?.lastname
            ? proVetClientData?.lastname
            : null,
        phone: proVetClientData?.phone_numbers[0]?.number || "",
      })
      .then(() =>
        sendNotification({
          type: "slack",
          payload: {
            message: `:money_mouth_face: Customer Information Updated in Stripe\n\nhttps://dashboard.stripe.com/customers/${proVetClientData?.id_number}\n\n`,
          },
        })
      )
      .catch((error: any) =>
        // eslint-disable-next-line quotes
        error?.message?.includes("No such customer: 'cus_LYg1C7Et5ySQKC'")
          ? console.log(error)
          : throwError(error)
      );
  } else if (DEBUG) {
    console.log("updateStripeCustomerData => SKIPPING STRIPE CUSTOMER UPDATE");
    if (
      proVetClientData?.id_number !== undefined ||
      proVetClientData?.id_number !== null ||
      proVetClientData?.id_number !== ""
    )
      console.log(
        "updateStripeCustomerData => SKIP REASON -  MISSING id_number in PROVET"
      );
    if (environment?.type !== "production")
      console.log(
        "updateStripeCustomerData => SKIP REASON -  ENVIRONMENT IS NOT PRODUCTION!"
      );
  }
};
