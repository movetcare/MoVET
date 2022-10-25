import {admin, throwError} from "../../../config/config";
const DEBUG = false;
export const terminalReaderDisconnected = async (event: any) =>
  await admin
    .firestore()
    .collection("configuration")
    .doc("pos")
    .collection("terminals")
    .doc(`${event?.data?.object?.id}`)
    .set(
      {
        ...event?.data?.object,
        updatedOn: new Date(),
      },
      {merge: true}
    )
    .then(() => {
      if (DEBUG)
        console.log("terminalReaderConnected", {
          ...event?.data?.object,
          updatedOn: new Date(),
        });
      return true;
    })
    .catch(async (error: any) => await throwError(error));
