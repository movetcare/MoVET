import admin from "../firebase";
import type { ContactForm } from "types";
const DEBUG = true;
export const setContact = async (payload: ContactForm) => {
  try {
    return await admin
      .collection("contact")
      .add({ ...payload, createdOn: new Date() })
      .then(() => {
        if (DEBUG)
          console.log("(API) FIRESTORE QUERY -> setContact() =>", {
            payload,
          });
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  } catch (error) {
    console.error(error);
    return false;
  }
};
