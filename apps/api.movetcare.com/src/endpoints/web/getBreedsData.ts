import {
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
} from "../../config/config";

export const getBreedsData = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (): Promise<false | Array<{ specie: string; breeds: any }>> => {
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
    }
  );
