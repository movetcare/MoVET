import { admin, throwError, DEBUG } from "../../../../../config/config";
const { FieldValue } = require("firebase-admin/firestore");

export const saveBreeds = async (
  breedData: Array<{ value: number; label: string }>,
  type: "canine" | "feline"
): Promise<boolean> => {
  const breeds = breedData.map(
    ({ value, label }: { value: number; label: string }) => ({
      id: value.toString(),
      title: label,
    })
  );
  if (DEBUG) console.log("breeds", breeds);
  const didUpdateOldBreedsList = await Promise.all(
    breeds.map(async (breed: { id: string; title: string }) => {
      if (DEBUG) console.log("BREED", breed);
      await admin
        .firestore()
        .collection("configuration")
        .doc(`breeds_${type}`)
        .set(
          {
            record: FieldValue.arrayUnion(breed),
            updatedOn: new Date(),
          },
          { merge: true }
        )
        .catch((error: any) => throwError(error));
    })
  )
    .then(() => true)
    .catch((error: any) => throwError(error));
  if (DEBUG) console.log("didUpdateOldBreedsList", didUpdateOldBreedsList);
  return didUpdateOldBreedsList;
};
