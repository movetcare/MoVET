import {admin, DEBUG} from "../../../../config/config";
// import {sendVerificationEmail} from '../../../../utils/auth/sendVerificationEmail';
import {saveClient} from "./saveClient";
import {sendWelcomeEmail} from "../../../../notifications/sendWelcomeEmail";

export const createAuthClient = async (
  proVetClientData: any,
  movetClientData?: any
): Promise<boolean> =>
  await admin
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
      const customClaims = {
        onboardingComplete: false,
        isClient: true,
      };
      await admin.auth().setCustomUserClaims(userRecord.uid, customClaims);
      if (DEBUG) {
        const user = await admin.auth().getUser(userRecord.uid);
        console.log("Custom claims added:", user);
      }
      // await sendVerificationEmail(userRecord);'
      if (
        proVetClientData?.password === null ||
        proVetClientData?.password === undefined
      ) {
        if (DEBUG) console.log("ATTEMPTING TO SEND WELCOME EMAIL WITH LINK");
        await sendWelcomeEmail(proVetClientData?.email, true);
      } else {
        if (DEBUG) console.log("ATTEMPTING TO SEND WELCOME EMAIL WITHOUT LINK");
        await sendWelcomeEmail(proVetClientData?.email, false);
      }
      return await saveClient(
        proVetClientData?.id,
        proVetClientData,
        movetClientData
      );
    })
    .catch((error: any) => console.error(error));
