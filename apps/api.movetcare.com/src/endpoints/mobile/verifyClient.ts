import {
  functions,
  defaultRuntimeOptions,
  admin,
  throwError,
  DEBUG,
} from "../../config/config";
import { createAuthClient } from "../../integrations/provet/entities/client/createAuthClient";
import { createProVetClient } from "../../integrations/provet/entities/client/createProVetClient";
import { sendNotification } from "../../notifications/sendNotification";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { verifyExistingClient } from "../../utils/auth/verifyExistingClient";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

export const verifyClient = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (data: {
      email: string;
      device: {
        ip: string;
        brand: string;
        designName?: string;
        deviceName: string;
        deviceType: string;
        deviceYearClass: string;
        isDevice: string;
        manufacturer: string;
        modelId?: string;
        modelName: string;
        osBuildFingerprint?: string;
        osBuildId: string;
        osInternalBuildId: string;
        osName: string;
        osVersion: string;
        platformApiLevel?: string;
        productName?: string;
        supportedCpuArchitectures: string;
        totalMemory: string;
      };
    }): Promise<boolean | null> => {
      const { email, device } = data;
      if (email) {
        const isExistingClient = await verifyExistingClient(email);
        if (DEBUG)
          console.log("verifyClient => isExistingClient", isExistingClient);
        if (isExistingClient) {
          const authUser: UserRecord | null = await getAuthUserByEmail(email);
          if (DEBUG) console.log("verifyClient => authUser", authUser);
          admin
            .firestore()
            .collection("clients")
            .doc(`${authUser?.uid}`)
            .set(
              {
                updatedOn: new Date(),
                device: { lastLogin: new Date(), ...device },
              },
              { merge: true },
            )
            .catch((error: any) => throwError(error));
          sendNotification({
            type: "push",
            payload: {
              category: "admin",
              title:
                "New Mobile App Sign In (Existing Client) - " +
                  authUser?.displayName || email,
              message: `${
                authUser?.displayName || email
              } has signed into the mobile app!`,
              path: `/client/?id=${authUser?.uid}`,
            },
          });
          return true;
        } else {
          if (DEBUG) console.log("verifyClient => NEW CLIENT SIGN UP");
          const proVetClientData: any = await createProVetClient(data);
          if (DEBUG)
            console.log("verifyClient => proVetClientData", proVetClientData);
          if (proVetClientData) {
            sendNotification({
              type: "push",
              payload: {
                category: "admin",
                title: "New Mobile App Sign Up - " + email,
                message: `${email} has signed up for the mobile app as client #${proVetClientData?.id}`,
                path: `/client/?id=${proVetClientData?.id}`,
              },
            });
            return await createAuthClient(
              {
                ...proVetClientData,
                password: null,
              },
              undefined,
              false,
            ).then((result: boolean) => {
              if (DEBUG)
                console.log("verifyClient => createAuthClient result", result);
              admin
                .firestore()
                .collection("clients")
                .doc(`${proVetClientData?.id}`)
                .set(
                  {
                    updatedOn: new Date(),
                    device: { lastLogin: new Date(), ...device },
                  },
                  { merge: true },
                )
                .then(() => true)
                .catch((error: any) => throwError(error));
              return result;
            });
          } else {
            if (DEBUG)
              console.log(
                "verifyClient => FAILED Mobile App Sign Up - " + email,
              );
            sendNotification({
              type: "push",
              payload: {
                category: "admin",
                title: "FAILED Mobile App Sign Up - " + email,
                message: `${email} has FAILED to sign up for the mobile app...`,
                path: `/client/?id=${proVetClientData?.id}`,
              },
            });
            return false;
          }
        }
      } else {
        if (DEBUG)
          console.log("verifyClient => FAILED MISSING EMAIL ADDRESS " + email);
        return null;
      }
    },
  );
