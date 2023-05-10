import { admin } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
const DEBUG = true;
export const processHoursStatusAutomationUpdate = async (options: {
  action: "open" | "close";
  type: "clinic" | "housecall" | "walkins" | "boutique";
  dayOfWeek: number;
  automatedOpenTime: number;
  automatedCloseTime: number;
}) => {
  const { action, type } = options;
  if (DEBUG) console.log("options", { action, type });
  if (action === "open") {
    switch (type) {
      case "clinic":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              clinicStatus: true,
              updatedOn: new Date(),
            },
            { merge: true }
          );
        break;
      case "walkins":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              walkinsStatus: true,
              updatedOn: new Date(),
            },
            { merge: true }
          );
        break;
      case "boutique":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              boutiqueStatus: true,
              updatedOn: new Date(),
            },
            { merge: true }
          );
        break;
      case "housecall":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              housecallStatus: true,
              updatedOn: new Date(),
            },
            { merge: true }
          );
        break;
      default:
        break;
    }
  } else if (action === "close") {
    switch (type) {
      case "clinic":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              clinicStatus: false,
              updatedOn: new Date(),
            },
            { merge: true }
          );
        break;
      case "walkins":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              walkinsStatus: false,
              updatedOn: new Date(),
            },
            { merge: true }
          );
        break;
      case "boutique":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              boutiqueStatus: false,
              updatedOn: new Date(),
            },
            { merge: true }
          );
        break;
      case "housecall":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              housecallStatus: false,
              updatedOn: new Date(),
            },
            { merge: true }
          );
        break;
      default:
        break;
    }
  }
  // const nextDate = new Date();
  // if (nextDate.getDay() === dayOfWeek) nextDate.setDate(nextDate.getDate() + 7);
  // else
  //   nextDate.setDate(
  //     nextDate.getDate() + ((dayOfWeek + 7 - nextDate.getDay()) % 7)
  //   );
  // const nextDateYear = nextDate.getFullYear();
  // const nextDateMonth = nextDate.getMonth() + 1;
  // const nextDateDate = nextDate.getDate();
  // const openHours =
  //   automatedOpenTime.toString().length === 3
  //     ? `0${automatedOpenTime}`.slice(0, 2)
  //     : `${automatedOpenTime}`.slice(0, 2);
  // const openMinutes =
  //   automatedOpenTime.toString().length === 3
  //     ? `0${automatedOpenTime}`.slice(2)
  //     : `${automatedOpenTime}`.slice(3)?.length === 1
  //     ? `0${automatedOpenTime}`.slice(3)
  //     : `${automatedOpenTime}`.slice(3);
  // const closeHours =
  //   automatedCloseTime.toString().length === 3
  //     ? `0${automatedCloseTime}`.slice(0, 2)
  //     : `${automatedCloseTime}`.slice(0, 2);
  // const closeMinutes =
  //   automatedCloseTime.toString().length === 3
  //     ? `0${automatedCloseTime}`.slice(2)
  //     : `${automatedCloseTime}`.slice(3)?.length === 1
  //     ? `0${automatedCloseTime}`.slice(3)
  //     : `${automatedCloseTime}`.slice(3);
  // const openDate = addMinutesToDateObject(
  //   new Date(
  //     nextDateMonth +
  //       " " +
  //       nextDateDate +
  //       " ," +
  //       nextDateYear +
  //       " " +
  //       [openHours, ":", openMinutes].join("") +
  //       ":00"
  //   ),
  //   300
  // );
  // const closeDate = addMinutesToDateObject(
  //   new Date(
  //     nextDateMonth +
  //       " " +
  //       nextDateDate +
  //       " ," +
  //       nextDateYear +
  //       " " +
  //       [closeHours, ":", closeMinutes].join("") +
  //       ":00"
  //   ),
  //   300
  // );
  // let dayOfWeekString = "";
  // switch (dayOfWeek) {
  //   case 0:
  //     dayOfWeekString = "sunday";
  //     break;
  //   case 1:
  //     dayOfWeekString = "monday";
  //     break;
  //   case 2:
  //     dayOfWeekString = "tuesday";
  //     break;
  //   case 3:
  //     dayOfWeekString = "wednesday";
  //     break;
  //   case 4:
  //     dayOfWeekString = "thursday";
  //     break;
  //   case 5:
  //     dayOfWeekString = "friday";
  //     break;
  //   case 6:
  //     dayOfWeekString = "saturday";
  //     break;
  //   default:
  //     break;
  // }
  // if (DEBUG) {
  //   console.log("dayOfWeek", dayOfWeek);
  //   console.log("dayOfWeekString", dayOfWeekString);
  //   console.log("nextDate", nextDate);
  //   console.log("nextDateYear", nextDateYear);
  //   console.log("nextDateMonth", nextDateMonth);
  //   console.log("nextDateDate", nextDateDate);
  //   console.log("openHours", openHours);
  //   console.log("openMinutes", openMinutes);
  //   console.log("closeHours", closeHours);
  //   console.log("closeMinutes", closeMinutes);
  //   console.log("openDate", openDate);
  //   console.log("closeDate", closeDate);
  // }
  // if (action === "open")
  //   await admin
  //     .firestore()
  //     .collection("tasks_queue")
  //     .doc(type + "_hours_status_automation_" + dayOfWeekString + "_open")
  //     .set(
  //       {
  //         options: {
  //           type,
  //           action: "open",
  //           dayOfWeek,
  //           automatedOpenTime,
  //           automatedCloseTime,
  //         },
  //         worker: "hours_status_automation",
  //         status: "scheduled",
  //         performAt: openDate,
  //         updatedOn: new Date(),
  //       },
  //       { merge: true }
  //     )
  //     .then(
  //       () =>
  //         DEBUG &&
  //         console.log("TASK ADDED TO QUEUE => ", {
  //           id: type + "_hours_status_automation_" + dayOfWeekString + "_open",
  //           object: {
  //             options: {
  //               type,
  //               action: "open",
  //               dayOfWeek,
  //               automatedOpenTime,
  //               automatedCloseTime,
  //             },
  //             worker: "hours_status_automation",
  //             status: "scheduled",
  //             performAt: openDate,
  //             updatedOn: new Date(),
  //           },
  //         })
  //     )
  //     .catch((error: any) => throwError(error));
  // if (action === "close")
  //   await admin
  //     .firestore()
  //     .collection("tasks_queue")
  //     .doc(type + "_hours_status_automation_" + dayOfWeekString + "_close")
  //     .set(
  //       {
  //         options: {
  //           type,
  //           action: "close",
  //           dayOfWeek,
  //           automatedOpenTime,
  //           automatedCloseTime,
  //         },
  //         worker: "hours_status_automation",
  //         status: "scheduled",
  //         performAt: closeDate,
  //         updatedOn: new Date(),
  //       },
  //       { merge: true }
  //     )
  //     .then(
  //       () =>
  //         DEBUG &&
  //         console.log("TASK ADDED TO QUEUE =>", {
  //           id: type + "_hours_status_automation_" + dayOfWeekString + "_close",
  //           object: {
  //             options: {
  //               type,
  //               action: "close",
  //               dayOfWeek,
  //               automatedOpenTime,
  //               automatedCloseTime,
  //             },
  //             worker: "hours_status_automation",
  //             status: "scheduled",
  //             performAt: closeDate,
  //             updatedOn: new Date(),
  //           },
  //         })
  //     )
  //     .catch((error: any) => throwError(error));
  sendNotification({
    type: "slack",
    payload: {
      message: [
        {
          type: "section",
          text: {
            text: ":robot_face: _Automated Hours Status Update Triggered!_",
            type: "mrkdwn",
          },
          fields: [
            {
              type: "mrkdwn",
              text: "*TYPE:*",
            },
            {
              type: "plain_text",
              text: type,
            },
            {
              type: "mrkdwn",
              text: "*ACTION:*",
            },
            {
              type: "plain_text",
              text: action,
            },
          ],
        },
      ],
    },
  });
  return true;
};
