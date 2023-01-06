import { admin, DEBUG, throwError } from "../../../../../config/config";
import { fetchBreedIds } from "./fetchBreedIds";
import { fetchBreedData } from "./fetchBreedData";
import { supportedBreeds } from "./supportedBreeds";
import { saveBreeds } from "./saveBreeds";
import type { Breed } from "../../../../../types/breed";

export const configureBreeds = async (): Promise<boolean> => {
  const alreadyHasCanineBreeds = await admin
    .firestore()
    .collection("configuration")
    .doc("breeds_canine")
    .get()
    .then((doc: any) => (doc.data()?.record ? true : false))
    .catch(() => false);

  const alreadyHasFemaleBreeds = await admin
    .firestore()
    .collection("configuration")
    .doc("breeds_feline")
    .get()
    .then((doc: any) => (doc.data()?.record ? true : false))
    .catch(() => false);

  if (alreadyHasCanineBreeds && alreadyHasFemaleBreeds) {
    console.log(
      "breeds_canine & breeds_feline COLLECTIONS DETECTED - SKIPPING BREEDS CONFIGURATION..."
    );
    console.log(
      "DELETE THE breeds_canine & breeds_feline DOCUMENTS AND RESTART TO REFRESH THE BREEDS CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING BREEDS CONFIGURATION");
    let breedsConfigured = 0;
    if (DEBUG) console.log("supportedBreeds", supportedBreeds);
    return await Promise.all(
      supportedBreeds.map(async (breed: Breed) => {
        const breedIds: Array<string> | boolean = await fetchBreedIds(
          breed.listId
        );
        if (DEBUG) console.log("breedIds", breedIds);
        if (breedIds) {
          const breedData: Array<{ value: number; label: string }> =
            await fetchBreedData(breedIds as Array<string>, breed);
          if (DEBUG) console.log("breedData", breedData);
          if (breedData) {
            const didSaveBreedData: boolean = await saveBreeds(
              breedData,
              breed.name
            );
            if (didSaveBreedData) breedsConfigured += 1;
          }
        }
      })
    )
      .then(async () => {
        if (breedsConfigured === supportedBreeds.length) return true;
        if (DEBUG)
          console.log(
            `WARNING: ${breedsConfigured} Out of ${supportedBreeds.length} Breeds Configured`
          );
        return false;
      })
      .catch((error: any) => throwError(error));
  }
};
