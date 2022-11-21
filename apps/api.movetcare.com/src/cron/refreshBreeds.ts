import {
  functions,
  defaultRuntimeOptions,
  DEBUG,
  admin,
} from "../config/config";
import { configureBreeds } from "../integrations/provet/entities/patient/breeds/configureBreeds";
import { deleteCollection } from "../utils/deleteCollection";

export const refreshBreeds: Promise<void> = functions
  .runWith(defaultRuntimeOptions)
  .pubsub.schedule("every 24 hours")
  .onRun(async () => {
    await deleteCollection("breeds").then(
      () => DEBUG && console.log("DELETED ALL BREEDS!")
    );
    await admin
      .firestore()
      .collection("configuration")
      .doc("breeds_canine")
      .delete()
      .then(() => DEBUG && console.log("DELETED ALL CANINE BREEDS!"));
    await admin
      .firestore()
      .collection("configuration")
      .doc("breeds_feline")
      .delete()
      .then(() => DEBUG && console.log("DELETED ALL FELINE BREEDS!"));
    await configureBreeds();
  });
