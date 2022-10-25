import {
  admin,
  functions,
  mobileClientApiKey,
  defaultRuntimeOptions,
  throwError,
  DEBUG,
} from "../../../config/config";

export const getCancellationReasons = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: {apiKey: string},
      context: any
    ): Promise<false | Array<{specie: string; breeds: any}>> => {
      if (DEBUG) console.log("getCancellationReasons Payload =>", data);

      if (!context.auth) return throwError({message: "MISSING AUTHENTICATION"});
      if (data.apiKey === mobileClientApiKey) {
        if (DEBUG) console.log("Loading Cancellation Reason from Firestore...");
        return await admin
          .firestore()
          .collection("configuration")
          .doc("cancellation_reasons")
          .get()
          .then((document: any) => {
            if (DEBUG)
              console.log("Cancellation Reason Returned => ", document.data());
            return document.data().record;
          })
          .catch((error: any) => throwError(error));
      } else return false;
    }
  );
