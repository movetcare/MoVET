import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
  stripe,
  DEBUG,
  admin,
} from "../../../config/config";
import Stripe from "stripe";
import {saveClient} from "../../../integrations/provet/entities/client/saveClient";
import {getAuthUserById} from "../../../utils/auth/getAuthUserById";
import {updateProVetClient} from "../../../integrations/provet/entities/client/updateProVetClient";
import {verifyValidPaymentSource} from "../../../utils/verifyValidPaymentSource";

export const createCustomer = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<any> => {
    if (DEBUG) console.log("INCOMING REQUEST PAYLOAD => ", context.auth?.uid);
    if (!context.auth) return throwError({message: "MISSING AUTHENTICATION"});
    if (data.apiKey === mobileClientApiKey) {
      const {email, phoneNumber, emailVerified} = await getAuthUserById(
        context.auth?.uid,
        ["email", "emailVerified", "phoneNumber"]
      );
      if (emailVerified) {
        const client = await admin
          .firestore()
          .collection("clients")
          .doc(context.auth?.uid)
          .get()
          .then((document: any) => document.data())
          .catch((error: any) => throwError(error));

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
                line1: client?.street,
                city: client?.city,
                state: client?.state,
                postal_code: client?.zipCode,
                country: "US",
              },
              name:
                client?.firstName && client?.lastName
                  ? `${client?.firstName} ${client?.lastName}`
                  : client?.firstName
                  ? client?.firstName
                  : client?.lastName
                  ? client?.lastName
                  : null,
              email,
              phone: phoneNumber,
              metadata: {
                clientId: context.auth.uid,
              },
            });
          customer = await stripe.customers
            .create({
              address: {
                line1: client?.street,
                city: client?.city,
                state: client?.state,
                postal_code: client?.zipCode,
                country: "US",
              },
              name:
                client?.firstName && client?.lastName
                  ? `${client?.firstName} ${client?.lastName}`
                  : client?.firstName
                  ? client?.firstName
                  : client?.lastName
                  ? client?.lastName
                  : null,
              email,
              phone: phoneNumber,
              metadata: {
                clientId: context.auth.uid,
              },
            })
            .catch((error: any) => throwError(error) as any);
        } else {
          let matchedCustomer = null;
          matchingCustomers.forEach((customerData: any) => {
            if (DEBUG)
              console.log(
                `customer.metadata?.clientId (${customerData.metadata?.clientId}) === context.auth.uid  (${context.auth.uid}) `,
                customerData.metadata?.clientId === context.auth.uid
              );
            if (customerData.metadata?.clientId === context.auth.uid)
              matchedCustomer = customerData;
          });
          if (matchedCustomer === null) {
            if (DEBUG)
              console.log(
                "No Matching clientIds Found. Creating NEW Customer: ",
                {
                  address: {
                    line1: client?.street,
                    city: client?.city,
                    state: client?.state,
                    postal_code: client?.zipCode,
                    country: "US",
                  },
                  name: `${client.firstName} ${client.lastName}`,
                  email,
                  phone: phoneNumber,
                  metadata: {
                    clientId: context.auth.uid,
                  },
                }
              );
            customer = await stripe.customers
              .create({
                address: {
                  line1: client?.street,
                  city: client?.city,
                  state: client?.state,
                  postal_code: client?.zipCode,
                  country: "US",
                },
                name: `${client.firstName} ${client.lastName}`,
                email,
                phone: phoneNumber,
                metadata: {
                  clientId: context.auth.uid,
                },
              })
              .catch((error: any) => throwError(error) as any);
          } else {
            customer = matchedCustomer;
            if (DEBUG)
              console.log("Matched an existing customer ID => ", customer);
          }
        }

        if (DEBUG) console.log("CUSTOMER -> ", customer);

         updateProVetClient({
           customer: customer?.id,
           id: context.auth.uid,
         });

        const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer: customer?.id },
          { apiVersion: "2020-03-02" }
        );

        if (DEBUG) console.log("Ephemeral Key Generated:", ephemeralKey);

        const setupIntent = await stripe.setupIntents
          .create({
            customer: customer?.id,
          })
          .catch((error: any) => throwError(error) as any);

        if (DEBUG) console.log("Setup Intent Created:", setupIntent);

        return await saveClient(context.auth.uid, null, {
          customer,
        })
          .then(async () => {
            if (DEBUG)
              console.log("Updated Client Document:", {
                customer,
              });
            const validPaymentMethods = await verifyValidPaymentSource(
              context.auth.uid,
              customer.id
            );
            if (DEBUG)
              console.log("Final Result => ", {
                setupIntent: setupIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer?.id,
                validPaymentMethods:
                  validPaymentMethods !== false
                    ? validPaymentMethods.length
                    : 0,
              });
            return {
              setupIntent: setupIntent.client_secret,
              ephemeralKey: ephemeralKey.secret,
              customer: customer?.id,
              validPaymentMethods:
                validPaymentMethods !== false ? validPaymentMethods.length : 0,
            };
          })
          .catch((error: any) => throwError(error));
      } else return throwError({message: "ACCOUNT NOT VERIFIED"});
    } else return throwError({message: "INVALID API KEY"});
  });
