import { firestore } from "../firebase";

const DEBUG = false;
export const saveK9SmilesRequest = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdOn?: Date;
  updatedOn?: Date;
  source: "movetcare.com/k9-smiles/";
  status?: "started";
}) => {
  try {
    return await firestore
      .collection("k9_smiles")
      .add({
        ...payload,
        status: "started",
        createdOn: new Date(),
      })
      .then(() => {
        if (DEBUG)
          console.log("(API) FIRESTORE QUERY -> saveK9SmilesRequest() =>", {
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
