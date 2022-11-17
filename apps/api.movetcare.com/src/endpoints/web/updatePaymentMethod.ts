import {
  functions,
  defaultRuntimeOptions,
  DEBUG,
  admin,
  environment,
  stripe,
  throwError,
} from "../../config/config";
import {recaptchaIsVerified} from "../../utils/recaptchaIsVerified";

interface UpdatePaymentMethodRequest {
  token: string;
  email: string;
}

export const updatePaymentMethod = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async ({
      token,
      email,
    }: UpdatePaymentMethodRequest): Promise<any | false> => {
      if (DEBUG)
        console.log("INCOMING REQUEST PAYLOAD => ", {
          token,
          email,
        });
      if (token) {
        if (await recaptchaIsVerified(token)) {
          const isNewClient = await admin
            .auth()
            .getUserByEmail(email)
            .then((userRecord: any) => {
              if (DEBUG) console.log(userRecord);
              return false;
            })
            .catch((error: any) => {
              if (DEBUG) console.log(error.code);
              if (error.code === "auth/user-not-found") return true;
              else return false;
            });
          if (DEBUG) console.log("isNewClient", isNewClient);
          if (isNewClient) return false;
          else {
            console.log("LOOKING UP EXISTING CLIENT IN STRIPE");
            const client = await admin
              .auth()
              .getUserByEmail(email)
              .then((userRecord: any) => {
                if (DEBUG) console.log("userRecord", userRecord);
                return userRecord;
              })
              .catch((error: any) => throwError(error));
            const {data: matchingCustomers} = await stripe.customers.list({
              email,
            });
            if (DEBUG) {
              console.log("Existing Customers => ", matchingCustomers);
              console.log(
                "Number of Existing Customers w/ Same Email",
                matchingCustomers.length
              );
            }
            let customer: any = null;
            if (matchingCustomers.length === 0) {
              if (DEBUG)
                console.log("Creating NEW Customer: ", {
                  address: {
                    line1: "UNKNOWN",
                    city: "DENVER",
                    state: "CO",
                    country: "US",
                  },
                  email,
                  metadata: {
                    clientId: client.uid,
                  },
                });
              customer = await stripe.customers
                .create({
                  address: {
                    line1: "UNKNOWN",
                    city: "DENVER",
                    state: "CO",
                    country: "US",
                  },
                  email,
                  metadata: {
                    clientId: client.uid,
                  },
                })
                .catch((error: any) => throwError(error) as any);
            } else {
              let matchedCustomer = null;
              matchingCustomers.forEach((customerData: any) => {
                if (customerData.metadata?.clientId === client.uid)
                  matchedCustomer = customerData;
              });
              if (matchedCustomer === null) {
                if (DEBUG)
                  console.log(
                    "No Matching clientIds Found. Creating NEW Customer: ",
                    {
                      address: {
                        line1: "UNKNOWN",
                        city: "DENVER",
                        state: "CO",
                        country: "US",
                      },
                      email,
                      metadata: {
                        clientId: client.uid,
                      },
                    }
                  );
                customer = await stripe.customers
                  .create({
                    address: {
                      line1: "UNKNOWN",
                      city: "DENVER",
                      state: "CO",
                      country: "US",
                    },
                    email,
                    metadata: {
                      clientId: client.uid,
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
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              mode: "setup",
              customer: customer?.id,
              client_reference_id: client.uid,
              metadata: {
                clientId: client.uid,
              },
              success_url:
                (environment?.type === "development"
                  ? "http://localhost:3001"
                  : environment.type === "staging"
                  ? "https://stage.app.movetcare.com"
                  : "https://app.movetcare.com") +
                "/update-payment-method/?success=true",
              cancel_url:
                (environment?.type === "development"
                  ? "http://localhost:3001"
                  : environment.type === "staging"
                  ? "https://stage.app.movetcare.com"
                  : "https://app.movetcare.com") + "/update-payment-method/",
            });
            if (DEBUG) console.log("session", session);
            return session?.url;
          }
        } else return false;
      } else return false;
    }
  );
