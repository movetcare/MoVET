import {
  admin,
  defaultRuntimeOptions,
  functions,
  throwError,
} from "../../../config/config";
import { fetchEntity } from "../../../integrations/provet/entities/fetchEntity";
import { getAuthUserById } from "../../../utils/auth/getAuthUserById";
import { requestIsAuthorized } from "../../admin/pos/requestIsAuthorized";
const DEBUG = true;
interface AccountData {
  email: string;
  displayName: string;
  phoneNumber: string;
  uid: string;
  emailVerified: boolean;
  errors?: Array<string>;
  customer?: string | Array<string>;
}
export const verifyAccount = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      { id }: { id: string },
      context: any
    ): Promise<AccountData | false> => {
      if (DEBUG) console.log("verifyAccount DATA =>", id);
      if (await requestIsAuthorized(context)) {
        const { email, displayName, phoneNumber, uid, emailVerified } =
          await getAuthUserById(id, [
            "email",
            "displayName",
            "phoneNumber",
            "uid",
            "emailVerified",
          ]);
        const movetData = await admin
          .firestore()
          .collection("clients")
          .doc(uid)
          .get()
          .then(async (document: any) => document.data())
          .catch((error: any) => throwError(error));
        if (DEBUG) console.log("movetData", movetData);
        const proVetClientData = await fetchEntity("client", Number(uid));
        if (DEBUG) console.log("proVetClientData", proVetClientData);
        // verify first name last name match
        // Verify phone numbers match
        // verify address match
        // verify sendEmail match
        // verify sendSms match

        // Verify client exists in stripe
        // Verify client exists in sendgrid

        return { email, displayName, phoneNumber, uid, emailVerified };
      } else return false;
    }
  );
