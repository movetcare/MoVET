import { getCustomerId } from "./../../../utils/getCustomerId";
import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
  stripe,
  DEBUG,
} from "../../../config/config";
import { saveClient } from "../../../integrations/provet/entities/client/saveClient";
import { getAuthUserById } from "../../../utils/auth/getAuthUserById";
import { verifyValidPaymentSource } from "../../../utils/verifyValidPaymentSource";

export const createCustomer = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<any> => {
    if (DEBUG) console.log("INCOMING REQUEST PAYLOAD => ", context.auth?.uid);
    if (!context.auth) return throwError({ message: "MISSING AUTHENTICATION" });
    if (data.apiKey === mobileClientApiKey) {
      const { emailVerified } = await getAuthUserById(context.auth?.uid, [
        "email",
        "emailVerified",
        "phoneNumber",
      ]);
      if (emailVerified) {
        const customer = await getCustomerId(context.auth?.uid);

        const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer },
          { apiVersion: "2022-11-15" }
        );

        if (DEBUG) console.log("Ephemeral Key Generated:", ephemeralKey);

        const setupIntent = await stripe.setupIntents
          .create({
            customer,
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
              customer
            );
            if (DEBUG)
              console.log("Final Result => ", {
                setupIntent: setupIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer,
                validPaymentMethods:
                  validPaymentMethods !== false
                    ? validPaymentMethods.length
                    : 0,
              });
            return {
              setupIntent: setupIntent.client_secret,
              ephemeralKey: ephemeralKey.secret,
              customer,
              validPaymentMethods:
                validPaymentMethods !== false ? validPaymentMethods.length : 0,
            };
          })
          .catch((error: any) => throwError(error));
      } else return throwError({ message: "ACCOUNT NOT VERIFIED" });
    } else return throwError({ message: "INVALID API KEY" });
  });
