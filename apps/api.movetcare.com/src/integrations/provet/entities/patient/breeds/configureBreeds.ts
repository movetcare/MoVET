import {DEBUG, throwError} from "../../../../../config/config";
import {fetchBreedIds} from "./fetchBreedIds";
import {fetchBreedData} from "./fetchBreedData";
import {supportedBreeds} from "./supportedBreeds";
import {saveBreeds} from "./saveBreeds";

export const configureBreeds = async (): Promise<boolean> => {
  console.log("STARTING BREEDS CONFIGURATION");
  let breedsConfigured = 0;
  return await Promise.all(
    supportedBreeds.map(async (breed: BreedType) => {
      const breedIds: Array<string> | boolean = await fetchBreedIds(
        breed.listId
      );
      if (breedIds) {
        const breedData: Array<{value: number; label: string}> =
          await fetchBreedData(breedIds as Array<string>, breed);
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
    .catch(async (error: any) => await throwError(error));
};
