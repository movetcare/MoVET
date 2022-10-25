import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
  admin,
} from "../../../config/config";

export const getEstimates = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: {apiKey: string},
      context: any
    ): Promise<false | Array<{specie: string; breeds: any}>> => {
      if (!context.auth) return throwError({message: "MISSING AUTHENTICATION"});
      if (data.apiKey === mobileClientApiKey)
        return await admin
          .firestore()
          .collection("configuration")
          .doc("estimates")
          .get()
          .then((document: any) => document.data())
          .catch(async (error: any) => await throwError(error));
      else return false;
    }
  );
