import {
  functions,
  defaultRuntimeOptions,
  throwError,
  admin,
  // trelloApiKey,
  // trelloOAuth,
  DEBUG,
  emailClient,
  environment,
} from "../../config/config";
import {logEvent} from "../../utils/logging/logEvent";
// import * as TrelloNodeAPI from 'trello-node-api';

// const Trello = new TrelloNodeAPI();

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
                return await logEvent({
                  tag: "contact",
                  origin: "api",
                  success: true,
                  data: payload,
                  sendToSlack: true,
                })
                  .then(() => {
                    // console.log('trelloApiKey', trelloApiKey);
                    // console.log('trelloOAuth', trelloOAuth);
                    // const createNewTrelloCard = async () => {
                    //   Trello.setApiKey(trelloApiKey);
                    //   Trello.setOauthToken(trelloOAuth);
                    //   const data = {
                    //     name: `MOBILE APP BUG REPORT${
                    //       errorMessage && `: ${errorMessage}`
                    //     }`,
                    //     desc: jsonString,
                    //     pos: 'top',
                    //     idList: '60ddfa9bfef78d35904aa274',
                    //     due: null,
                    //     dueComplete: false,
                    //     idMembers: ['alexrodriguez222'],
                    //   };
                    //   let response;
                    //   try {
                    //     response = await Trello.card.create(data);
                    //   } catch (error) {
                    //     if (error) {
                    //       console.log('error ', error);
                    //     }
                    //   }
                    //   console.log('response', response);
                    // };

                    // return createNewTrelloCard();
                    return true;
                  })
                  .catch(async (error: any) => await throwError(error));
              })
              .catch(async (error: any) => {
                if (DEBUG) console.error(error?.response?.body?.errors);
                return await throwError(error);
              });
          else
            return await logEvent({
              tag: "notification",
              origin: "api",
              success: true,
              data: emailConfig,
            });
        })
        .catch(async (error: any) => await throwError(error));
    }
  );
