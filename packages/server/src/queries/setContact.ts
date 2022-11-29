import { firestore } from "../firebase";
import type { ContactForm } from "types";
import { CONTACT_STATUS } from "constant";
const DEBUG = false;
export const setContact = async (payload: ContactForm) => {
  try {
    return await firestore
      .collection("contact")
      .add({
        ...payload,
        status: CONTACT_STATUS.NEEDS_PROCESSING,
        createdOn: new Date(),
      } as ContactForm)
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
