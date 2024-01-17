import {
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
  DEBUG,
} from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import { EmailConfiguration } from "../../types/email.d";
import { randomUUID } from "crypto";

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
      uid,
      displayName,
      email,
      emailVerified,
      isAnonymous,
      phoneNumber,
      photoURL,
      providerData,
      issue,
    }: any): Promise<boolean> => {
      const payload = {
        issue,
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
        uid,
        displayName,
        email,
        emailVerified,
        isAnonymous,
        phoneNumber,
        photoURL,
        providerData,
      };
      if (DEBUG)
        console.log("reportABug => INCOMING REQUEST PAYLOAD => ", payload);

      return await admin
        .firestore()
        .collection("report_a_bug")
        .doc(`${uid}`)
        .collection(`${randomUUID()}`)
        .add({
          ...payload,
          createdOn: new Date(),
        })
        .then(async () => {
          if (DEBUG)
            console.log("reportABug => Successfully Saved New Bug Report", {
              ...payload,
              createdOn: new Date(),
            });
          const jsonString = JSON.stringify({
            issue,
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
            subject: "New Bug Report",
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
              message: `:interrobang: NEW ERROR REPORT => ${jsonString}`,
            },
          });
          return true;
        })
        .catch((error: any) => throwError(error));
    },
  );
