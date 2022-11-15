import {
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
  DEBUG,
  emailClient,
  environment,
} from "../../config/config";

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
          const emailConfig: any = {
            to: "support@movetcare.com",
            from: "info@movetcare.com",
            subject: `New Bug Report: ${errorMessage}`,
            text: jsonString.replace(/(<([^>]+)>)/gi, ""),
            html: jsonString,
          };
          if (environment?.type === "production")
            return await emailClient
              .send(emailConfig)
              .then(async () => {
                if (DEBUG) console.log("EMAIL SENT!", emailConfig);
                return true;
              })
              .catch(async (error: any) => {
                if (DEBUG) console.error(error?.response?.body?.errors);
                return throwError(error);
              });
          else return true;
        })
        .catch((error: any) => throwError(error));
    }
  );
