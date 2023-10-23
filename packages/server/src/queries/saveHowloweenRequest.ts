import { firestore } from "../firebase";

const DEBUG = false;
export const saveHowloweenRequest = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdOn?: Date;
  updatedOn?: Date;
  source: "movetcare.com/howloween/";
  status?: "submitted";
}) => {
  try {
    return await firestore
      .collection("howloween")
      .add({
        ...payload,
        status: "submitted",
        createdOn: new Date(),
      })
      .then(() => {
        if (DEBUG)
          console.log("(API) FIRESTORE QUERY -> saveHowloweenRequest() =>", {
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
