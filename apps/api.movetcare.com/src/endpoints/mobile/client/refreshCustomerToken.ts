import {
  defaultRuntimeOptions,
  functions,
  DEBUG,
  throwError,
  admin,
  stripe,
  mobileClientApiKey,
} from "../../../config/config";

export const refreshCustomerToken = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: any,
      context: any
    ): Promise<
      | {
          setupIntent: string;
          ephemeralKey: string | undefined;
          customer: string;
        }
      | false
    > => {
      if (!context.auth || data?.apiKey !== mobileClientApiKey)
        return throwError({ message: "MISSING AUTHENTICATION" });
      else {
        if (DEBUG)
          console.log("INCOMING REQUEST PAYLOAD => ", context.auth?.uid);
        const customerId = await admin
          .firestore()
          .collection("clients")
          .doc(context.auth?.uid)
          .get()
          .then((document: any) => document.data()?.customer?.id)
          .catch((error: any) => throwError(error));

        if (DEBUG) console.log("Customer ID Found:", customerId);

        if (customerId) {
          const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customerId },
            { apiVersion: "2022-11-15" }
          );

          if (DEBUG) console.log("Ephemeral Key Generated:", ephemeralKey);

          const setupIntent = await stripe.setupIntents
            .create({
              customer: customerId,
            })
            .catch((error: any) => throwError(error) as any);

          if (DEBUG) console.log("Setup Intent Created:", setupIntent);
          return {
            setupIntent: setupIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customerId,
          };
        } else return false;
      }
    }
  );
