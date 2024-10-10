import {
  functions,
  defaultRuntimeOptions,
  DEBUG,
  admin,
  environment,
  stripe,
  throwError,
} from "../../config/config";
import { getCustomerId } from "../../utils/getCustomerId";
import { recaptchaIsVerified } from "../../utils/recaptchaIsVerified";

interface UpdatePaymentMethodRequest {
  token: string;
  email: string;
}

export const updatePaymentMethod = functions
  .runWith({ ...defaultRuntimeOptions, memory: "4GB" })
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
            const customer = await getCustomerId(client.uid);
            if (DEBUG) console.log("CUSTOMER -> ", customer);
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              mode: "setup",
              customer,
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
    },
  );
