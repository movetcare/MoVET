import { admin, DEBUG } from "../../config/config";

export const getAuthUserById = async (
  id: string,
  values: Array<
    "uid" | "email" | "phoneNumber" | "emailVerified" | "displayName"
  > = []
): Promise<any> =>
  await admin
    .auth()
    .getUser(id)
    .then((userRecord: any) => {
      if (values.length > 0) {
        const result: any = {};
        values.map((value: string, index: number) => {
          result[values[index]] = userRecord.toJSON()[value];
        });
        if (DEBUG)
          console.log("SUCCESSFULLY RETRIEVED CLIENT AUTH DATA:", result);
        return result;
      } else {
        if (DEBUG)
          console.log("SUCCESSFULLY RETRIEVED CLIENT AUTH DATA:", userRecord);
        return userRecord.toJSON();
      }
    })
    .catch((error: any) => {
      if (DEBUG) console.log(`${error?.message} -> ${id}`);
      if (values.length > 0) {
        const result: any = {};
        values.map((value: string, index: number) => {
          result[values[index]] = null;
        });
        if (DEBUG) console.log("FAILED TO RETRIEVE CLIENT AUTH DATA:", result);
        return result;
      } else {
        if (DEBUG) console.log("FAILED TO RETRIEVE CLIENT AUTH DATA:", id);
        return null;
      }
    });
