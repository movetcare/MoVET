import {
  admin,
  defaultRuntimeOptions,
  environment,
  functions,
  smsClient,
  throwError,
  DEBUG,
} from "../../../config/config";
import {requestIsAuthorized} from "../../admin/pos/requestIsAuthorized";

export const checkInText = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async ({id}: {id: string}, context: any): Promise<boolean> => {
    if (DEBUG) console.log("checkInText DATA =>", id);
    const isAuthorized = await requestIsAuthorized(context);
    if (isAuthorized) {
      const phone = await admin
        .firestore()
        .collection("clients")
        .doc(`${id}`)
        .get()
        .then((doc: any) =>
          doc
            .data()
            ?.phone.replace("(", "")
            .replace(")", "")
            .replace("-", "")
            .replace(" ", "")
        )
        .catch(async (error: any) => await throwError(error));
      const message =
        "This is MoVET checking in to let you know that we are ready to start your appointment! Please meet us at the front desk.";
      if (environment?.type === "production" && phone) {
        await smsClient.messages
          .create({
            body: message,
            from: "+17206775047",
            to: `+1${phone}`,
          })
          .then((message: any) => DEBUG && console.log(message.sid));
      } else if (phone) {
        console.log("SIMULATED SMS REMINDER", {
          body: message,
          from: "+17206775047",
          to: `+1${phone}`,
        });
        if (DEBUG)
          console.log(
            `SUCCESSFULLY SENT CHECK IN NOTIFICATION FOR CLIENT: ${id}`
          );
        await admin
          .firestore()
          .collection("clients")
          .doc(`${id}`)
          .collection("notifications")
          .add({
            type: "sms",
            body: message,
            from: "+17206775047",
            to: `+1${phone}`,
            createdOn: new Date(),
          })
          .catch(async (error: any) => await throwError(error));
      } else return false;
      return true;
    } else return false;
  });
