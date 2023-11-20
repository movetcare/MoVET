import { router } from "expo-router";
import { auth, functions } from "firebase-config";
import {
  signInWithEmailAndPassword,
  signOut as signOff,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { AuthStore } from "stores";
import { getPlatformUrl } from "utils/getPlatformUrl";
import * as Device from "expo-device";
import * as Network from "expo-network";

export const signIn = async (email: string, password?: string | undefined) => {
  AuthStore.update((store) => {
    store.user = { email };
  });
  const device = Device?.isDevice
    ? Device?.brand === "Apple"
      ? {
          ip: await Network.getIpAddressAsync(),
          brand: Device?.brand || "UNKNOWN",
          deviceName: Device?.deviceName || "UNKNOWN",
          deviceType: Device?.deviceType || "UNKNOWN",
          deviceYearClass: Device?.deviceYearClass || "UNKNOWN",
          isDevice: Device?.isDevice || "UNKNOWN",
          manufacturer: Device?.manufacturer || "UNKNOWN",
          modelId: Device?.modelId || "UNKNOWN",
          modelName: Device?.modelName || "UNKNOWN",
          osBuildId: Device?.osBuildId || "UNKNOWN",
          osInternalBuildId: Device?.osInternalBuildId || "UNKNOWN",
          osName: Device?.osName || "UNKNOWN",
          osVersion: Device?.osVersion || "UNKNOWN",
          supportedCpuArchitectures:
            Device?.supportedCpuArchitectures || "UNKNOWN",
          totalMemory: Device?.totalMemory || "UNKNOWN",
        }
      : {
          ip: await Network.getIpAddressAsync(),
          brand: Device?.brand || "UNKNOWN",
          designName: Device?.designName || "UNKNOWN",
          deviceName: Device?.deviceName || "UNKNOWN",
          deviceType: Device?.deviceType || "UNKNOWN",
          deviceYearClass: Device?.deviceYearClass || "UNKNOWN",
          isDevice: Device?.isDevice || "UNKNOWN",
          manufacturer: Device?.manufacturer || "UNKNOWN",
          modelName: Device?.modelName || "UNKNOWN",
          osBuildFingerprint: Device?.osBuildFingerprint || "UNKNOWN",
          osBuildId: Device?.osBuildId || "UNKNOWN",
          osInternalBuildId: Device?.osInternalBuildId || "UNKNOWN",
          osName: Device?.osName || "UNKNOWN",
          osVersion: Device?.osVersion || "UNKNOWN",
          platformApiLevel: Device?.platformApiLevel || "UNKNOWN",
          productName: Device?.productName || "UNKNOWN",
          supportedCpuArchitectures:
            Device?.supportedCpuArchitectures || "UNKNOWN",
          totalMemory: Device?.totalMemory || "UNKNOWN",
        }
    : {
        ip: await Network.getIpAddressAsync(),
        brand: Device?.brand || "UNKNOWN",
        designName: Device?.designName || "UNKNOWN",
        deviceName: Device?.deviceName || "UNKNOWN",
        deviceType: Device?.deviceType || "UNKNOWN",
        deviceYearClass: Device?.deviceYearClass || "UNKNOWN",
        isDevice: Device?.isDevice || "UNKNOWN",
        manufacturer: Device?.manufacturer || "UNKNOWN",
        modelId: Device?.modelId || "UNKNOWN",
        modelName: Device?.modelName || "UNKNOWN",
        osBuildFingerprint: Device?.osBuildFingerprint || "UNKNOWN",
        osBuildId: Device?.osBuildId || "UNKNOWN",
        osInternalBuildId: Device?.osInternalBuildId || "UNKNOWN",
        osName: Device?.osName || "UNKNOWN",
        osVersion: Device?.osVersion || "UNKNOWN",
        platformApiLevel: Device?.platformApiLevel || "UNKNOWN",
        productName: Device?.productName || "UNKNOWN",
        supportedCpuArchitectures:
          Device?.supportedCpuArchitectures || "UNKNOWN",
        totalMemory: Device?.totalMemory || "UNKNOWN",
      };
  if (password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const verifyClient = httpsCallable(functions, "verifyClient");
      verifyClient({
        email,
        device,
      });
      AuthStore.update((store) => {
        store.user = auth.currentUser;
        store.isLoggedIn = true;
      });
      router.replace("/(app)/home");
    } catch (error: any) {
      console.error(error);
      return error?.code || "Unknown Error...";
    }
  } else
    try {
      const verifyClient = httpsCallable(functions, "verifyClient");
      verifyClient({ email, device }).then(async (result) => {
        if (result.data) {
          await sendSignInLinkToEmail(auth, email, {
            url: getPlatformUrl() + "/home",
            iOS: {
              bundleId: "com.movet.inc",
            },
            android: {
              packageName: "com.movet",
              installApp: true,
              minimumVersion: "12",
            },
            handleCodeInApp: true,
          });
        } else return "Client Verification FAILED: " + JSON.stringify(result);
      });
    } catch (error: any) {
      console.error(error);
      return error?.code || "Unknown Error...";
    }
};

export const signInWithLink = async (email: string, link: string) =>
  await signInWithEmailLink(auth, email, link)
    .then(() => {
      AuthStore.update((store) => {
        store.user = auth.currentUser;
        store.isLoggedIn = true;
      });
    })
    .catch((error) => {
      console.error(error);
      return error?.code || "Unknown Error...";
    });

export const signOut = async () =>
  await signOff(auth)
    .then(() => {
      AuthStore.update((store) => {
        store.user = null;
        store.isLoggedIn = false;
      });
    })
    .catch((error: any) => {
      console.error(error);
      return error?.code || "Unknown Error...";
    });

// export const signUp = async (email: string, password: string) => {
//   try {
//     await createUserWithEmailAndPassword(auth, email, password);
//     AuthStore.update((store) => {
//       store.user = auth.currentUser;
//       store.isLoggedIn = true;
//     });
//     return { user: auth.currentUser };
//   } catch (error: any) {
//     console.error(error);
//     return error?.code || "Unknown Error...";
//   }
// };

export const updateUserAuth = async (user: any) =>
  AuthStore.update((store) => {
    store.user = user;
    store.isLoggedIn = user ? true : false;
    store.initialized = true;
  });

