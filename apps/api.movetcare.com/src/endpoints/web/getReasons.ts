import {
  admin,
  defaultRuntimeOptions,
  functions,
  throwError,
  DEBUG,
} from "../../config/config";

export const getReasons = functions.runWith(defaultRuntimeOptions).https.onCall(
  async (data: { reasonGroup: number }): Promise<any> =>
    await admin
      .firestore()
      .collection("reasons")
      .where("isVisible", "==", true)
      .get()
      .then((querySnapshot: any) => {
        if (DEBUG)
          console.log(
            "querySnapshot?.docs?.length",
            querySnapshot?.docs?.length
          );
        const reasons: Array<{ label: string; value: string }> = [];
        if (querySnapshot?.docs?.length > 0)
          querySnapshot.forEach(async (doc: any) => {
            if (data.reasonGroup === doc.data().group)
              reasons.push({
                label: doc.data()?.name,
                value: doc.data()?.id,
              });
          });
        const compare = (a: any, b: any) => {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        };
        if (DEBUG) console.log("reasons.sort(compare)", reasons.sort(compare));
        return reasons.sort(compare);
      })
      .catch((error: any) => throwError(error))
);
