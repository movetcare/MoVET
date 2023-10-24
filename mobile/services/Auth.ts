import { router } from "expo-router";
import { auth, functions } from "firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { AuthStore } from "stores";
import { getPlatformUrl } from "utils/getPlatformUrl";

export const signIn = async (email: string, password?: string | undefined) => {
  AuthStore.update((store) => {
    store.user = { email };
  });
  if (password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      AuthStore.update((store) => {
        store.user = auth.currentUser;
        store.isLoggedIn = true;
      });
      router.replace("/(app)/home");
    } catch (error: any) {
      console.error(error);
      alert(error?.code + '\n\n"' + error?.customData?.message + '"');
      return false;
    }
  } else
    try {
      const verifyClient = httpsCallable(functions, "verifyClient");
      verifyClient({ email })
        .then(async (result) => {
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
            return true;
          } else alert("Client Verification FAILED: " + JSON.stringify(result));
          return false;
        })
        .catch((error) => {
          alert(JSON.stringify(error));
        });

      return true;
    } catch (error: any) {
      console.error(error);
      alert(error?.code + '\n\n"' + error?.customData?.message + '"');
      return false;
    }
};

export const signInWithLink = async (email: string, link: string) =>
  await signInWithEmailLink(auth, email, link)
    .then((result) => {
      AuthStore.update((store) => {
        store.user = auth.currentUser;
        store.isLoggedIn = true;
      });
      return { user: auth.currentUser };
    })
    .catch((error) => {
      console.error(error);
      alert(error?.code + '\n\n"' + error?.customData?.message + '"');
      return false;
    });

export const signOff = async () =>
  await signOut(auth)
    .then(() => {
      AuthStore.update((store) => {
        store.user = null;
        store.isLoggedIn = false;
      });
      return true;
    })
    .catch((error: any) => {
      console.error(error);
      alert(error?.code + '\n\n"' + error?.customData?.message + '"');
      return false;
    });

export const signUp = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    AuthStore.update((store) => {
      store.user = auth.currentUser;
      store.isLoggedIn = true;
    });
    return { user: auth.currentUser };
  } catch (error: any) {
    console.error(error);
    alert(error?.code + '\n\n"' + error?.customData?.message + '"');
    return false;
  }
};

export const updateUserAuth = async (user: any) =>
  AuthStore.update((store) => {
    store.user = user;
    store.isLoggedIn = user ? true : false;
    store.initialized = true;
  });

