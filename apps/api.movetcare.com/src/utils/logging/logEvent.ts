// import { admin, environment, throwError } from "../../config/config";
// import { sendNotification } from "../../notifications/sendNotification";
// import { timestampString } from "../timestampString";
export const logEvent = async (payload: any): Promise<boolean> => {
  // if (payload.success === false && environment.type !== "production")
  //   return await saveLogEvent(payload);
  // else return await sendLogAlerts(payload);
  console.log("EVENT DATA", payload);
  return true;
};
// const saveLogEvent = async (payload: any) =>
//   await admin
//     .firestore()
//     .collection("events")
//     .doc(`${payload.tag || "unknown"}`)
//     .collection(
//       `${
//         payload.success === true
//           ? "success"
//           : payload.success === false
//           ? "fail"
//           : "attempt"
//       }`
//     )
//     .doc(`${timestampString(new Date(), "_")}`)
//     .set(
//       payload
//         ? {
//             ...payload,
//             createdOn: new Date(),
//           }
//         : {
//             payload: null,
//             createdOn: new Date(),
//           }
//     )
//     .then(async () => sendLogAlerts(payload))
//     .catch(async (error: any) => await throwError(error));
// const sendLogAlerts = async (payload: any) => {
//   console.log(
//     `NEW EVENT ${payload.tag || "unknown"} => ${JSON.stringify(payload)}`
//   );
//   if (
//     payload?.code !== "auth/wrong-password" &&
//     payload?.code !== "auth/email-already-exists" &&
//     payload?.code !== "auth/user-not-found" &&
//     payload?.data?.code !== "auth/wrong-password" &&
//     payload?.data?.code !== "auth/email-already-exists" &&
//     payload?.data?.code !== "auth/user-not-found"
//   ) {
//     if (payload?.sendToSlack) {
//       await sendNotification({
//         type: "slack",
//         payload,
//       });
//     }
//     // if (payload?.success === false)
//     //   emailClient.send({
//     //     to: 'support@movetcare.com',
//     //     from: 'info@movetcare.com',
//     //     subject: `New App Issue: ${payload?.tag}`,
//     //     text: `NEW APP ISSUE => ${JSON.stringify(payload)}`.replace(
//     //       /(<([^>]+)>)/gi,
//     //       ''
//     //     ),
//     //     html: `NEW APP ISSUE => ${JSON.stringify(payload)}`,
//     //   });
//   }
//   return true;
// };
