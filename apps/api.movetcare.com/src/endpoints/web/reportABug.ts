import {
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
  DEBUG,
} from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import { EmailConfiguration } from "../../types/email.d";

export const reportABug = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async ({
      isDevice,
      brand,
      manufacturer,
      modelName,
      modelId,
      designName,
      productName,
      deviceYearClass,
      totalMemory,
      supportedCpuArchitectures,
      osName,
      osVersion,
      osBuildId,
      osInternalBuildId,
      osBuildFingerprint,
      platformApiLevel,
      deviceName,
      errorMessage,
      uid,
      displayName,
      email,
      emailVerified,
      isAnonymous,
      phoneNumber,
      photoURL,
      providerData,
      screenshots,
    }: any): Promise<boolean> => {
      const payload = {
        isDevice,
        brand,
        manufacturer,
        modelName,
        modelId,
        designName,
        productName,
        deviceYearClass,
        totalMemory,
        supportedCpuArchitectures,
        osName,
        osVersion,
        osBuildId,
        osInternalBuildId,
        osBuildFingerprint,
        platformApiLevel,
        deviceName,
        errorMessage,
        uid,
        displayName,
        email,
        emailVerified,
        isAnonymous,
        phoneNumber,
        photoURL,
        providerData,
        screenshots,
      };
      if (DEBUG) console.log("INCOMING REQUEST PAYLOAD => ", payload);

      return await admin
        .firestore()
        .collection("report_a_bug")
        .doc(`${new Date().toString()}`)
        .set({
          ...payload,
          createdOn: new Date(),
        })
        .then(async () => {
          if (DEBUG)
            console.log("Successfully Saved New Bug Report", {
              ...payload,
              createdOn: new Date(),
            });
          const jsonString = JSON.stringify({
            screenshots,
            isDevice,
            brand,
            manufacturer,
            modelName,
            modelId,
            designName,
            productName,
            deviceYearClass,
            totalMemory,
            supportedCpuArchitectures,
            osName,
            osVersion,
            osBuildId,
            osInternalBuildId,
            osBuildFingerprint,
            platformApiLevel,
            deviceName,
            errorMessage,
            uid,
            displayName,
            email,
            emailVerified,
            isAnonymous,
            phoneNumber,
            photoURL,
            providerData,
          });
          const emailConfig: EmailConfiguration = {
            to: "support@movetcare.com",
            subject: `New Bug Report: ${errorMessage}`,
            message: jsonString,
          };
          sendNotification({
            type: "email",
            payload: {
              client: uid,
              ...emailConfig,
            },
          });
          sendNotification({
            type: "slack",
            payload: {
              message: `:interrobang: PLATFORM ERROR \`\`\`${jsonString}\`\`\``,
            },
          });
          return true;
        })
        .catch((error: any) => throwError(error));
    }
  );
