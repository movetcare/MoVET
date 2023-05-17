import { sendNotification } from "../notifications/sendNotification";
import { functions, admin, throwError, DEBUG } from "../config/config";
import { addMinutesToDateObject } from "../utils/addMinutesToDateObject";

export const handleCompletedTask = functions.firestore
  .document("tasks_completed/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    if (DEBUG)
      console.log("handleCompletedTask => DATA", {
        id,
        data,
      });
    if (
      data !== undefined &&
      data?.options &&
      id.includes("hours_status_automation")
    ) {
      const { action, automatedCloseTime, automatedOpenTime, dayOfWeek, type } =
        data.options;
      updateAutomationTask(
        type,
        action,
        id,
        dayOfWeek,
        automatedOpenTime,
        automatedCloseTime
      );
      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: ":robot_face: _Hours Status Automation Task Regenerated!_",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*TYPE:*",
                },
                {
                  type: "plain_text",
                  text: data?.options?.type,
                },
                {
                  type: "mrkdwn",
                  text: "*ACTION:*",
                },
                {
                  type: "plain_text",
                  text: data?.options?.action,
                },
                {
                  type: "mrkdwn",
                  text: "*PERFORM AT:*",
                },
                {
                  type: "plain_text",
                  text: data?.performAt.toDate().toString(),
                },
              ],
            },
          ],
        },
      });
    }
    return true;
  });
const updateAutomationTask = (
  type: string,
  action: "open" | "close",
  taskName: string,
  dayOfWeek: number,
  automatedOpenTime: number,
  automatedCloseTime: number
) => {
  const nextDate = new Date();
  if (nextDate.getDay() === dayOfWeek) nextDate.setDate(nextDate.getDate() + 7);
  else
    nextDate.setDate(
      nextDate.getDate() + ((dayOfWeek + 7 - nextDate.getDay()) % 7)
    );
  const nextDateYear = nextDate.getFullYear();
  const nextDateMonth = nextDate.getMonth() + 1;
  const nextDateDate = nextDate.getDate();
  const openHours =
    automatedOpenTime.toString().length === 3
      ? `0${automatedOpenTime}`.slice(0, 2)
      : `${automatedOpenTime}`.slice(0, 2);
  const openMinutes =
    automatedOpenTime.toString().length === 3
      ? `0${automatedOpenTime}`.slice(2)
      : `${automatedOpenTime}`.slice(3)?.length === 1
      ? `0${automatedOpenTime}`.slice(3)
      : `${automatedOpenTime}`.slice(3);
  const closeHours =
    automatedCloseTime.toString().length === 3
      ? `0${automatedCloseTime}`.slice(0, 2)
      : `${automatedCloseTime}`.slice(0, 2);
  const closeMinutes =
    automatedCloseTime.toString().length === 3
      ? `0${automatedCloseTime}`.slice(2)
      : `${automatedCloseTime}`.slice(3)?.length === 1
      ? `0${automatedCloseTime}`.slice(3)
      : `${automatedCloseTime}`.slice(3);
  const openDate = addMinutesToDateObject(
    new Date(
      nextDateMonth +
        " " +
        nextDateDate +
        " ," +
        nextDateYear +
        " " +
        [openHours, ":", openMinutes].join("") +
        ":00"
    ),
    300
  );
  const closeDate = addMinutesToDateObject(
    new Date(
      nextDateMonth +
        " " +
        nextDateDate +
        " ," +
        nextDateYear +
        " " +
        [closeHours, ":", closeMinutes].join("") +
        ":00"
    ),
    300
  );
  if (DEBUG) {
    console.log("nextDateYear", nextDateYear);
    console.log("nextDateMonth", nextDateMonth);
    console.log("nextDateDate", nextDateDate);
    console.log("openHours", openHours);
    console.log("openMinutes", openMinutes);
    console.log("closeHours", closeHours);
    console.log("closeMinutes", closeMinutes);
    console.log("openDate", openDate);
    console.log("closeDate", closeDate);
  }
  admin
    .firestore()
    .collection("tasks_queue")
    .doc(taskName)
    .set(
      {
        options: {
          type,
          action,
          dayOfWeek,
          automatedOpenTime,
          automatedCloseTime,
        },
        worker: "hours_status_automation",
        status: "scheduled",
        performAt: openDate,
        createdOn: new Date(),
      },
      { merge: true }
    )
    .then(
      () =>
        DEBUG &&
        console.log("TASK ADDED TO QUEUE => ", {
          id: taskName,
          object: {
            options: {
              type,
              action,
              dayOfWeek,
              automatedOpenTime,
              automatedCloseTime,
            },
            worker: "hours_status_automation",
            status: "scheduled",
            performAt: openDate,
            createdOn: new Date(),
          },
        })
    )
    .catch((error: any) => throwError(error));
};
