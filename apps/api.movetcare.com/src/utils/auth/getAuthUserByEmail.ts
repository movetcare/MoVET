import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { admin, DEBUG, throwError } from "../../config/config";

export const getAuthUserByEmail = async (
  email: string
): Promise<UserRecord | null> =>
  await admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord: any) => {
      if (DEBUG) console.log(userRecord);
      return userRecord;
    })
    .catch((error: any) => {
      throwError(error);
      return null;
    });
