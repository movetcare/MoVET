import { admin, throwError, DEBUG } from "../../../config/config";

export const terminalReaderConnected = (event: any): void =>
  admin
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
      { merge: true }
    )
    .then(() => {
      if (DEBUG)
        console.log("terminalReaderConnected", {
          ...event?.data?.object,
          updatedOn: new Date(),
        });
    })
    .catch((error: any) => throwError(error));
