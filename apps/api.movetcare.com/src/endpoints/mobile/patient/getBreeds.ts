import {
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
} from "../../../config/config";

export const getBreeds = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      data: { apiKey: string },
      context: any,
    ): Promise<false | Array<{ specie: string; breeds: any }>> => {
      if (!context.auth)
        return throwError({ message: "MISSING AUTHENTICATION" });
      return [
        {
          specie: "canine",
          breeds: await admin
            .firestore()
            .collection("configuration")
            .doc("breeds_canine")
            .get()
            .then((document: any) => document.data().record)
            .catch((error: any) => throwError(error)),
        },
        {
          specie: "feline",
          breeds: await admin
            .firestore()
            .collection("configuration")
            .doc("breeds_feline")
            .get()
            .then((document: any) => document.data().record)
            .catch((error: any) => throwError(error)),
        },
      ];
    },
  );
