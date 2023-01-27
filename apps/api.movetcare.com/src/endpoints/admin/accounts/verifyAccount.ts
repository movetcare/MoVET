import {
  admin,
  defaultRuntimeOptions,
  environment,
  functions,
  stripe,
  throwError,
} from "../../../config/config";
import { fetchEntity } from "../../../integrations/provet/entities/fetchEntity";
import { sendNotification } from "../../../notifications/sendNotification";
import { getAuthUserById } from "../../../utils/auth/getAuthUserById";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { verifyValidPaymentSource } from "../../../utils/verifyValidPaymentSource";
import { requestIsAuthorized } from "../../admin/pos/requestIsAuthorized";
const DEBUG = false;
let paymentMethods: Array<any> = [];
interface AccountData {
  email: string;
  displayName: string;
  sendEmail: boolean;
  sendSms: boolean;
  emailVerified: boolean;
  phoneNumber: string | null;
  city: string;
  street: string;
  state: string;
  zipCode: string;
  errors: Array<string | undefined>;
  customer: string | Array<string>;
  paymentMethods: any;
}

interface AuthData {
  email: string;
  displayName: string;
  phoneNumber: string;
  uid: string;
  emailVerified: boolean;
}

interface MovetData {
  email: string;
  phone: string;
  sendEmail: boolean;
  sendSms: boolean;
  firstName: string;
  lastName: string;
  city: string;
  street: string;
  state: string;
  zipCode: string;
  customer: string | { id: string | undefined };
}

interface ProvetData {
  email: string;
  phone_numbers: Array<{
    description: "Default Phone Number - Used for SMS Alerts";
    number: string;
  }>;
  no_email: boolean;
  no_sms: boolean;
  firstname: string;
  lastname: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
}

interface StripeData {
  customer: Array<string>;
}
export const verifyAccount = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      { id }: { id: string },
      context: any
    ): Promise<AccountData | false> => {
      if (DEBUG) console.log("verifyAccount DATA =>", id);
      if (await requestIsAuthorized(context)) {
        const { authData, movetData, provetData, stripeData } =
          await getAllAccountData(id);
        if (DEBUG)
          console.log("accountData", {
            authData,
            movetData,
            provetData,
            stripeData,
          });
        let errors: Array<string | undefined> = [];
        errors = [
          ...getEmailErrors({ authData, movetData, provetData }),
          ...getNotificationErrors({ movetData, provetData }),
          ...getNameErrors({ authData, movetData, provetData }),
          ...getPhoneNumberErrors({ authData, movetData, provetData }),
          ...getAddressErrors({ movetData, provetData }),
          ...getCustomerErrors({ stripeData, movetData }),
          ...(await getPaymentMethodErrors({ id, stripeData, movetData })),
        ];
        // Verify client exists in sendgrid
        if (errors.length > 0) {
          sendNotification({
            type: "slack",
            payload: {
              message:
                ":fire_extinguisher: MoVET Account Errors Detected! Please Fix ASAP!\n\n" +
                "```" +
                JSON.stringify(errors) +
                "```\n" +
                (environment.type === "production"
                  ? "https://admin.movetcare.com"
                  : "http://localhost:3002") +
                "/client?id=" +
                id,
            },
          });
          sendNotification({
            type: "email",
            payload: {
              client: id,
              to: "support@movetcare.com",
              subject: "MoVET Account Errors Detected! Please Fix ASAP!",
              message:
                "<p>" +
                JSON.stringify(errors) +
                "</p><p><b>" +
                (environment.type === "production"
                  ? "https://admin.movetcare.com"
                  : "http://localhost:3002") +
                "/client?id=" +
                id +
                "</b></p>",
            },
          });
        }
        return {
          errors,
          email: authData?.email,
          sendEmail: movetData?.sendEmail,
          sendSms: movetData?.sendSms,
          emailVerified: authData?.emailVerified,
          phoneNumber: formatPhoneNumber(authData?.phoneNumber),
          displayName: authData?.displayName,
          city: movetData?.city,
          street: movetData?.street,
          state: movetData?.state,
          zipCode: movetData?.zipCode,
          customer: stripeData?.customer,
          paymentMethods: paymentMethods,
        };
      } else return false;
    }
  );

const getAllAccountData = async (
  id: string
): Promise<{
  authData: AuthData;
  movetData: MovetData;
  provetData: ProvetData;
  stripeData: StripeData;
}> => {
  return {
    authData: await getAuthUserById(id, [
      "email",
      "displayName",
      "phoneNumber",
      "uid",
      "emailVerified",
    ]),
    movetData: await admin
      .firestore()
      .collection("clients")
      .doc(id)
      .get()
      .then(async (document: any) => document.data())
      .catch((error: any) => throwError(error)),
    provetData: await fetchEntity("client", Number(id)),
    stripeData: {
      customer: (
        (await stripe.customers
          .search({
            query: `metadata['clientId']:'${id}'`,
          })
          .catch((error: any) => throwError(error))) as any
      ).data?.map((customer: { id: string }) => customer?.id),
    },
  };
};

const getEmailErrors = ({
  authData,
  movetData,
  provetData,
}: {
  authData: AuthData;
  movetData: MovetData;
  provetData: ProvetData;
}): Array<string | undefined> => {
  const errors: Array<string | undefined> = [];
  if (movetData?.email !== provetData?.email)
    errors.push(
      `MoVET Email Address (${movetData?.email}) does NOT match ProVet Email Address (${provetData?.email})`
    );
  if (authData?.email !== provetData?.email)
    errors.push(
      `Auth Email Address (${authData?.email}) does NOT match ProVet Email Address (${provetData?.email})`
    );
  if (authData?.email !== movetData?.email)
    errors.push(
      `Auth Email Address (${authData?.email}) does NOT match MoVET Email Address (${movetData?.email})`
    );
  if (DEBUG) console.log("getEmailErrors", errors);
  return errors;
};

const getNotificationErrors = ({
  movetData,
  provetData,
}: {
  movetData: MovetData;
  provetData: ProvetData;
}): Array<string | undefined> => {
  const errors: Array<string | undefined> = [];
  if (movetData?.sendEmail !== !provetData?.no_email)
    errors.push(
      `MoVET Email Notifications (${
        movetData?.sendEmail
      }) does NOT match ProVet Email Notifications (${!provetData?.no_email})`
    );
  if (movetData?.sendSms !== !provetData?.no_sms)
    errors.push(
      `MoVET Email Notifications (${
        movetData?.sendSms
      }) does NOT match ProVet Email Notifications (${!provetData?.no_sms})`
    );
  if (DEBUG) console.log("getNotificationErrors", errors);
  return errors;
};

const getNameErrors = ({
  authData,
  movetData,
  provetData,
}: {
  authData: AuthData;
  movetData: MovetData;
  provetData: ProvetData;
}): Array<string | undefined> => {
  const errors: Array<string | undefined> = [];
  if (movetData?.firstName !== provetData?.firstname)
    errors.push(
      `MoVET First Name (${movetData?.firstName}) does NOT match ProVet First Name (${provetData?.firstname})`
    );
  if (movetData?.lastName !== provetData?.lastname)
    errors.push(
      `MoVET Last Name (${movetData?.lastName}) does NOT match ProVet Last Name (${provetData?.lastname})`
    );
  if (
    authData?.displayName !== `${movetData?.firstName} ${movetData?.lastName}`
  )
    errors.push(
      `Auth Display Name (${
        authData?.displayName
      }) does NOT match MoVET First Name & Last Name (${`${movetData?.firstName} ${movetData?.lastName}`})`
    );
  if (
    authData?.displayName !== `${provetData?.firstname} ${provetData?.lastname}`
  )
    errors.push(
      `Auth Display Name (${
        authData?.displayName
      }) does NOT match MoVET First Name & Last Name (${`${provetData?.firstname} ${provetData?.lastname}`})`
    );
  if (DEBUG) console.log("getNameErrors", errors);
  return errors;
};

const getPhoneNumberErrors = ({
  authData,
  movetData,
  provetData,
}: {
  authData: AuthData;
  movetData: MovetData;
  provetData: ProvetData;
}): Array<string | undefined> => {
  const errors: Array<string | undefined> = [];
  const authPhone = formatPhoneNumber(authData?.phoneNumber);
  const movetPhone = formatPhoneNumber(movetData?.phone);
  let provetPhone: string | null = null;
  provetData?.phone_numbers?.map((phone: any) => {
    if (phone.description === "Default Phone Number - Used for SMS Alerts")
      provetPhone = formatPhoneNumber(phone.number);
  });
  if (DEBUG) {
    console.log("authPhone", authPhone);
    console.log("movetPhone", movetPhone);
    console.log("provetPhone", provetPhone);
  }
  if (movetPhone !== provetPhone)
    errors.push(
      `MoVET Phone Number (${movetPhone}) does NOT match ProVet Phone Number (${provetPhone})`
    );
  if (movetPhone !== authPhone)
    errors.push(
      `MoVET Phone Number (${movetPhone}) does NOT match Auth Phone Number (${authPhone})`
    );
  if (provetPhone !== authPhone)
    errors.push(
      `MoVET Phone Number (${provetPhone}) does NOT match Auth Phone Number (${authPhone})`
    );
  if (DEBUG) console.log("getPhoneNumberErrors", errors);
  return errors;
};

const getAddressErrors = ({
  movetData,
  provetData,
}: {
  movetData: MovetData;
  provetData: ProvetData;
}): Array<string | undefined> => {
  const errors: Array<string | undefined> = [];
  if (movetData?.street !== provetData?.street_address)
    errors.push(
      `MoVET Street Address (${movetData?.street}) does NOT match ProVet Street Address (${provetData?.street_address})`
    );
  if (movetData?.city !== provetData?.city)
    errors.push(
      `MoVET City (${movetData?.city}) does NOT match ProVet City (${provetData?.city})`
    );
  if (movetData?.state !== provetData?.state)
    errors.push(
      `MoVET State (${movetData?.state}) does NOT match ProVet State (${provetData?.state})`
    );
  if (movetData?.zipCode !== provetData?.zip_code)
    errors.push(
      `MoVET Zipcode (${movetData?.zipCode}) does NOT match ProVet Zipcode (${provetData?.zip_code})`
    );

  if (DEBUG) console.log("getAddressErrors", errors);
  return errors;
};

const getCustomerErrors = ({
  stripeData,
  movetData,
}: {
  stripeData: StripeData;
  movetData: MovetData;
}): Array<string | undefined> => {
  const errors: Array<string | undefined> = [];
  if (movetData.customer === undefined)
    console.log(
      `No MoVET Client ID Found! (Should be ${JSON.stringify(
        stripeData.customer
      )})`
    );
  if (stripeData.customer.length < 1)
    errors.push("No Stripe Customer Found...");
  if (stripeData.customer.length > 1)
    errors.push(
      "Multiple Stripe Customers Found: " + JSON.stringify(stripeData.customer)
    );
  stripeData.customer.map((customer: string) => {
    if (
      typeof movetData?.customer !== "string" &&
      movetData?.customer?.id !== undefined &&
      movetData?.customer?.id !== customer
    )
      errors.push(
        `MoVET Customer ID (${movetData.customer?.id}) does NOT match Stripe Customer ID (${customer})`
      );
    else if (movetData.customer !== customer)
      errors.push(
        `MoVET Customer ID (${movetData.customer}) does NOT match Stripe Customer ID (${customer})`
      );
  });
  if (DEBUG) console.log("getCustomerErrors", errors);
  return errors;
};

const getPaymentMethodErrors = async ({
  id,
  stripeData,
  movetData,
}: {
  id: string;
  stripeData: StripeData;
  movetData: MovetData;
}): Promise<Array<string | undefined>> => {
  const errors: Array<string | undefined> = [];
  if (movetData.customer === undefined)
    errors.push(
      "Can NOT determine Payment Methods as no MoVET Customer was found..."
    );
  else if (stripeData.customer.length === 0)
    errors.push(
      "Can NOT determine Payment Methods as no Stripe Customer was found..." +
        JSON.stringify(stripeData.customer)
    );
  else if (stripeData.customer.length > 1)
    errors.push(
      "Can NOT determine Payment Methods as multiple Stripe Customers were found: " +
        JSON.stringify(stripeData.customer)
    );
  else {
    stripeData.customer.map((customer: string) => {
      if (
        typeof movetData?.customer !== "string" &&
        movetData?.customer?.id !== undefined &&
        movetData?.customer?.id !== customer
      )
        errors.push(
          `Can NOT determine Payment Methods as MoVET Customer ID (${movetData.customer?.id}) does NOT match Stripe Customer ID (${customer})`
        );
      else if (movetData.customer !== customer)
        errors.push(
          `Can NOT determine Payment Methods as MoVET Customer ID (${movetData.customer}) does NOT match Stripe Customer ID (${customer})`
        );
    });
    const movetPaymentMethods = await admin
      .firestore()
      .collection("clients")
      .doc(id)
      .collection("payment_methods")
      .get()
      .then((snapshot: any) => {
        const paymentMethods: Array<any> = [];
        snapshot.docs.map((doc: any) => {
          if (doc.data().active) paymentMethods.push(doc.data());
        });
        return paymentMethods;
      })
      .catch((error: any) => throwError(error));
    const stripePaymentMethods = await verifyValidPaymentSource(
      id,
      stripeData.customer[0],
      true
    );
    if (DEBUG) {
      console.log("movetPaymentMethods", movetPaymentMethods);
      console.log("stripePaymentMethods", stripePaymentMethods);
    }
    if (movetPaymentMethods.length === 0)
      errors.push(
        "Customer does NOT have a VALID Payment Method on MoVET Account"
      );
    if (!stripePaymentMethods)
      errors.push("Customer does NOT have a VALID Payment Method in Stripe");
    if (stripePaymentMethods && movetPaymentMethods.length !== 0)
      paymentMethods = stripePaymentMethods;
  }
  if (DEBUG) console.log("getPaymentMethodErrors", errors);
  return errors;
};