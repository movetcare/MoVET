import {functions, defaultRuntimeOptions, DEBUG} from "../config/config";
import {configureBreeds} from "../integrations/provet/entities/patient/breeds/configureBreeds";
import {deleteCollection} from "../utils/deleteCollection";

export const refreshBreeds: Promise<void> = functions
  .runWith(defaultRuntimeOptions)
  .pubsub.schedule("every 24 hours")
  .onRun(async () => {
    await deleteCollection("breeds_feline").then(
      () => DEBUG && console.log("DELETED ALL FELINE BREEDS!")
    );
    await deleteCollection("breeds_canine").then(
      () => DEBUG && console.log("DELETED ALL CANINE BREEDS!")
    );
    await configureBreeds();
  });
