import { auth } from "firebase-config";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AuthStore } from "stores";

export const signIn = async (email: string, password: string) => {
  console.log("LOGIN ATTEMPT:", { email, password });
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);
    console.log("AUTH USER", resp.user);
    AuthStore.update((store) => {
      store.user = resp.user;
      store.isLoggedIn = resp.user ? true : false;
    });
    return { user: auth.currentUser };
  } catch (error: any) {
    console.error(error);
    alert(error?.code + '\n\n"' + error?.customData?.message + '"');
    return false;
  }
};

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

export const updateUserAuth = async (user: any) => {
  console.log("updateUserAuth", user);
  AuthStore.update((store) => {
    store.user = user;
    store.isLoggedIn = user ? true : false;
    store.initialized = true;
  });
};