import {Stripe} from "stripe";
import { admin, stripe, throwError, DEBUG } from "../config/config";

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
        console.log(
          "document.data()?.customer?.id",
          document.data()?.customer?.id
        );
        console.log(
          "document.data()?.customer?.id === undefined || document.data()?.customer?.id === null",
          document.data()?.customer?.id === undefined ||
            document.data()?.customer?.id === null
        );
      }
      return document.data()?.customer?.id === undefined ||
        document.data()?.customer?.id === null
        ? await createNewCustomer(id, document)
        : document.data()?.customer?.id;
    })
    .catch((error: any) => throwError(error));

const createNewCustomer = async (
  id: string,
  document: any
): Promise<string> => {
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
        document.data()?.firstName && document.data()?.lastName
          ? `${document.data()?.firstname} ${document.data()?.lastName}`
          : document.data()?.firstName
          ? document.data()?.firstName
          : document.data()?.lastName
          ? document.data()?.lastName
          : null,
      email: document.data()?.email ? document.data()?.email : "UNKNOWN",
      phone: document.data()?.phone ? document.data()?.phone : "UNKNOWN",
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
        document.data()?.firstName && document.data()?.lastName
          ? `${document.data()?.firstName} ${document.data()?.lastName}`
          : document.data()?.firstName
          ? document.data()?.firstName
          : document.data()?.lastName
          ? document.data()?.lastName
          : null,
      email: document.data()?.email ? document.data()?.email : "UNKNOWN",
      phone: document.data()?.phone ? document.data()?.phone : "UNKNOWN",
      metadata: {
        clientId: id,
      },
    })
    .catch((error: any) => throwError(error));
  if (DEBUG) console.log("NEW STRIPE CUSTOMER DATA", customer);
  await admin
    .firestore()
    .collection("clients")
    .doc(id)
    .set(
      { customer: { id: customer?.id }, updatedOn: new Date() },
      { merge: true }
    )
    .then(
      () =>
        DEBUG &&
        console.log("SUCCESSFULLY SAVED NEW CLIENT CUSTOMER ID", customer?.id)
    )
    .catch((error: any) => throwError(error));
  return customer?.id;
};
