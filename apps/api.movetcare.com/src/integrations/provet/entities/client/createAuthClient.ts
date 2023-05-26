import { admin, DEBUG, throwError } from "../../../../config/config";
// import {sendVerificationEmail} from '../../../../utils/auth/sendVerificationEmail';
import { saveClient } from "./saveClient";
import { sendWelcomeEmail } from "../../../../notifications/templates/sendWelcomeEmail";

export const createAuthClient = (
  proVetClientData: any,
  movetClientData?: any,
  withResetLink?: boolean
): Promise<boolean> =>
  admin
    .auth()
    .createUser(
      proVetClientData?.password
        ? {
            uid: `${proVetClientData?.id}`,
            email: proVetClientData?.email,
            password: proVetClientData?.password,
          }
        : {
            uid: `${proVetClientData?.id}`,
            email: proVetClientData?.email,
          }
    )
    .then(async (userRecord: any) => {
      if (DEBUG) console.log("Successfully Created New User:", userRecord);
      admin.auth().setCustomUserClaims(userRecord.uid, {
        isClient: true,
      });
      if (DEBUG) {
        const user = await admin.auth().getUser(userRecord.uid);
        console.log("Custom claims added:", user);
      }
      // await sendVerificationEmail(userRecord);'
      if (withResetLink === false) {
        if (DEBUG) console.log("ATTEMPTING TO SEND WELCOME EMAIL WITHOUT LINK");
        sendWelcomeEmail(proVetClientData?.email, false);
      } else if (
        proVetClientData?.password === null ||
        proVetClientData?.password === undefined
      ) {
        if (DEBUG) console.log("ATTEMPTING TO SEND WELCOME EMAIL WITH LINK");
        sendWelcomeEmail(proVetClientData?.email, true);
      } else {
        if (DEBUG) console.log("ATTEMPTING TO SEND WELCOME EMAIL WITHOUT LINK");
        sendWelcomeEmail(proVetClientData?.email, false);
      }
      return await saveClient(
        proVetClientData?.id,
        proVetClientData,
        movetClientData
      );
    })
    .catch((error: any) => {
      if (
        proVetClientData?.email !==
          "dev+test_vcpr_not_required@movetcare.com" &&
        proVetClientData?.email !== "dev+test_vcpr_required@movetcare.com" &&
        proVetClientData?.email !== "dev+test@movetcare.com"
      )
        throwError(error);
    });
