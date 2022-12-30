import {
  admin,
  defaultRuntimeOptions,
  functions,
  throwError,
} from "../../config/config";
const DEBUG = true;
export const getAppointmentLocations = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (): Promise<any> =>
      await admin
        .firestore()
        .collection("reason_groups")
        .where("isVisible", "==", true)
        .get()
        .then((querySnapshot: any) => {
          if (DEBUG)
            console.log(
              "querySnapshot?.docs?.length",
              querySnapshot?.docs?.length
            );
          const reasonGroups: Array<{ label: string; value: string }> = [];
          if (querySnapshot?.docs?.length > 0)
            querySnapshot.forEach(async (doc: any) =>
              reasonGroups.push({
                label: doc.data()?.name,
                value: doc.data()?.id,
              })
            );
          if (DEBUG) console.log("reasonGroups", reasonGroups);
          return reasonGroups;
        })
        .catch((error: any) => throwError(error))
  );
