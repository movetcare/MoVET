import {Stripe} from "stripe";
import { admin, stripe, throwError } from "../config/config";
import { updateProVetClient } from "../integrations/provet/entities/client/updateProVetClient";
const DEBUG = true;
export interface UserNotificationSettings {
  sendEmail: boolean;
  sendSms: boolean;
}

export const getCustomerId = async (id: string): Promise<string> =>
  await admin
    .firestore()
    .collection("clients")
    .doc(id)
    .get()
    .then(async (document: any) => {
      if (DEBUG) {
        console.log("document.data()?.customer", document.data()?.customer);
        console.log(
          "document.data()?.customer === undefined || document.data()?.customer === null",
          document.data()?.customer === undefined ||
            document.data()?.customer === null
        );
      }
      return document.data()?.customer === undefined ||
        document.data()?.customer === null
        ? await createNewCustomer(id, document)
        : document.data()?.customer;
    })
    .catch((error: any) => throwError(error));

const createNewCustomer = async (
  id: string,
  document: any
): Promise<string> => {
  const { firstName, lastName, email, phone } = document.data() || {};
  if (DEBUG) {
    console.log("CLIENT DATA", document.data());
    console.log("CREATING NEW STRIPE CUSTOMER", {
      address: {
        line1: "UNKNOWN",
        city: "DENVER",
        state: "CO",
        country: "US",
      },
      name:
        firstName && lastName
          ? `${document.data()?.firstname} ${document.data()?.lastName}`
          : firstName
          ? firstName
          : lastName
          ? lastName
          : null,
      email: email ? email : "UNKNOWN",
      phone: phone ? phone : "UNKNOWN",
      metadata: {
        clientId: id,
      },
    });
  }
  const customer: Stripe.Customer | any = await stripe.customers
    .create({
      address: {
        line1: "UNKNOWN",
        city: "DENVER",
        state: "CO",
        country: "US",
      },
      name:
        firstName && lastName
          ? `${document.data()?.firstName} ${document.data()?.lastName}`
          : firstName
          ? firstName
          : lastName
          ? lastName
          : null,
      email: email ? email : "UNKNOWN",
      phone: phone ? phone : "UNKNOWN",
      metadata: {
        clientId: id,
      },
    })
    .catch((error: any) => throwError(error));
  if (DEBUG) console.log("NEW STRIPE CUSTOMER DATA", customer);
  updateProVetClient({
    customer: customer?.id,
    id,
  });
  return customer;
};
