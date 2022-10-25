import {DEBUG} from "../../../../../config/config";
import {fetchBreedData} from "./fetchBreedData";
import {saveBreeds} from "./saveBreeds";

export const processBreedConfiguration = async (options: any) => {
  if (DEBUG) console.log("PROCESSING BREED CONFIGURATION => ", options);
  if (options?.breedIds) {
    const breedData: Array<{value: number; label: string}> | null =
      await fetchBreedData(options?.breedIds as Array<string>, options?.breed);
    if (breedData)
      await saveBreeds(breedData, options?.breed.name).then(
        () => DEBUG && console.log("SUCCESSFULLY CONFIGURED BREEDS", options)
      );
    else if (DEBUG)
      console.log("FAILED BREED CONFIGURATION - MISSING BREED DATA");
  } else if (DEBUG)
    console.log("FAILED BREED CONFIGURATION - MISSING BREED IDS");
};
