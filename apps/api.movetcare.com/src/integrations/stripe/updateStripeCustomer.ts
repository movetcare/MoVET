import { stripe, environment, DEBUG, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";

export const updateStripeCustomer = (proVetClientData: {
  id_number: string | undefined | null;
  archived: boolean;
  email: string;
  street_address: string | undefined;
  street_address_2: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zip_code: string | undefined;
  country_region: string | undefined;
  critical_notes: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  phone_numbers: Array<{ number: string }>;
}) => {
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
            : "",
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
