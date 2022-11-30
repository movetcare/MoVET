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
        : document.data()?.customer?.id || document.data()?.customer;
    })
    .catch((error: any) => throwError(error));

const createNewCustomer = async (
  id: string,
  document: any
): Promise<string> => {
  const { firstName, lastName, email, phone, street, state, city, zipCode } =
    document.data() || {};
  const { data: matchingCustomers } = await stripe.customers.list({
    email,
  });
  if (DEBUG) {
    console.log("Existing Customers => ", matchingCustomers);
    console.log(
      "Number of Existing Customers w/ Same Email",
      matchingCustomers.length
    );
  }
  let customer: Stripe.Customer | any = null;
  if (matchingCustomers.length === 0) {
    if (DEBUG)
      console.log("Creating NEW Customer: ", {
        address: {
          line1: street,
          city: city,
          state: state,
          postal_code: zipCode,
          country: "US",
        },
        name:
          firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName
            ? firstName
            : lastName
            ? lastName
            : null,
        email,
        phone,
        metadata: {
          clientId: id,
        },
      });
    customer = await stripe.customers
      .create({
        address: {
          line1: street,
          city: city,
          state: state,
          postal_code: zipCode,
          country: "US",
        },
        name:
          firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName
            ? firstName
            : lastName
            ? lastName
            : null,
        email,
        phone,
        metadata: {
          clientId: id,
        },
      })
      .catch((error: any) => throwError(error) as any);
  } else {
    let matchedCustomer = null;
    matchingCustomers.forEach((customerData: any) => {
      if (DEBUG)
        console.log(
          `customer.metadata?.clientId (${customerData.metadata?.clientId}) === id  (${id}) `,
          customerData.metadata?.clientId === id
        );
      if (customerData.metadata?.clientId === id)
        matchedCustomer = customerData;
    });
    if (matchedCustomer === null) {
      if (DEBUG)
        console.log("No Matching clientIds Found. Creating NEW Customer: ", {
          address: {
            line1: street,
            city: city,
            state: state,
            postal_code: zipCode,
            country: "US",
          },
          name: `${firstName} ${lastName}`,
          email,
          phone,
          metadata: {
            clientId: id,
          },
        });
      customer = await stripe.customers
        .create({
          address: {
            line1: street,
            city: city,
            state: state,
            postal_code: zipCode,
            country: "US",
          },
          name: `${firstName} ${lastName}`,
          email,
          phone,
          metadata: {
            clientId: id,
          },
        })
        .catch((error: any) => throwError(error) as any);
    } else {
      customer = matchedCustomer;
      if (DEBUG) console.log("Matched an existing customer ID => ", customer);
    }
  }

  if (DEBUG) console.log("NEW STRIPE CUSTOMER -> ", customer);
  updateProVetClient({
    customer: customer?.id,
    id,
  });
  return customer?.id;
};
