import { sendNotification } from "../notifications/sendNotification";
import {
  environment,
  functions,
  request,
  admin,
  throwError,
} from "../config/config";
import { addMinutesToDateObject } from "../utils/addMinutesToDateObject";
const DEBUG = true;
type AutomationTypes = "clinic" | "housecall" | "boutique" | "walkins";
export const handleBookingConfigUpdate = functions.firestore
  .document("configuration/bookings")
  .onUpdate(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    if (DEBUG)
      console.log("handleBookingConfigUpdate => DATA", {
        id,
        data,
      });
    if (data !== undefined) {
      const didTriggerVercelBuildWebhookForMarketingWebsite =
        environment.type === "production"
          ? await request
              .post(
                "https://api.vercel.com/v1/integrations/deploy/prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS?buildCache=false"
              )
              .then(async (response: any) => {
                const { data, status } = response;
                if (DEBUG)
                  console.log(
                    "API Response: POST https://api.vercel.com/v1/integrations/deploy/prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS?buildCache=false =>",
                    data
                  );
                return status !== 200 && status !== 201 ? "ERROR" : data;
              })
              .catch(() => false)
          : false;
      const didTriggerVercelBuildWebhookForWebApp =
        environment.type === "production"
          ? await request
              .post(
                "https://api.vercel.com/v1/integrations/deploy/prj_da86e8MG9HWaYYjOhzhDRwznKPtc/Kv7tDyrjjO?buildCache=false"
              )
              .then(async (response: any) => {
                const { data, status } = response;
                if (DEBUG)
                  console.log(
                    "API Response: POST https://api.vercel.com/v1/integrations/deploy/prj_da86e8MG9HWaYYjOhzhDRwznKPtc/Kv7tDyrjjO?buildCache=false =>",
                    data
                  );
                return status !== 200 && status !== 201 ? "ERROR" : data;
              })
              .catch(() => false)
          : false;
      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: ":robot_face: _Booking Configuration Updated!_",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*BUILD TRIGGERED:*",
                },
                {
                  type: "plain_text",
                  text:
                    (didTriggerVercelBuildWebhookForMarketingWebsite
                      ? "Website: :white_check_mark: "
                      : "Website: :red_circle: ") +
                    " | " +
                    (didTriggerVercelBuildWebhookForWebApp
                      ? "Web App: :white_check_mark: "
                      : "Web App: :red_circle: "),
                },
              ],
            },
          ],
        },
      });
      updateHoursStatusAutomationTasks(data);
    }
    return true;
  });

const updateHoursStatusAutomationTasks = async (data: any) => {
  const {
    clinicAutomationStatus,
    housecallAutomationStatus,
    boutiqueAutomationStatus,
    walkinsAutomationStatus,
    automatedOpenTimeSunday,
    automatedCloseTimeSunday,
    automatedOpenTimeMonday,
    automatedCloseTimeMonday,
    automatedOpenTimeTuesday,
    automatedCloseTimeTuesday,
    automatedOpenTimeWednesday,
    automatedCloseTimeWednesday,
    automatedOpenTimeThursday,
    automatedCloseTimeThursday,
    automatedOpenTimeFriday,
    automatedCloseTimeFriday,
    automatedOpenTimeSaturday,
    automatedCloseTimeSaturday,
    isOpenMondayAutomation,
    isOpenTuesdayAutomation,
    isOpenWednesdayAutomation,
    isOpenThursdayAutomation,
    isOpenFridayAutomation,
    isOpenSaturdayAutomation,
    isOpenSundayAutomation,
  } = data;
  const deleteAutomationTasks = async (type: AutomationTypes) => {
    const taskId = type + "_hours_status_automation_";
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "monday_open")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "tuesday_open")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "wednesday_open")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "thursday_open")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "friday_open")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "saturday_open")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "sunday_open")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "monday_close")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "tuesday_close")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "wednesday_close")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "thursday_close")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "friday_close")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "saturday_close")
      .delete();
    await admin
      .firestore()
      .collection("tasks_queue")
      .doc(taskId + "sunday_close")
      .delete();
  };
  const configureAutomationTasks = async (type: AutomationTypes) => {
    await deleteAutomationTasks(type);
    const taskId = type + "_hours_status_automation_";
    const updateAutomationTask = (
      taskName: string,
      dayOfWeek: number,
      automatedOpenTime: number,
      automatedCloseTime: number
    ) => {
      const nextDate = new Date();
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
      // if (DEBUG) {
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
      admin
        .firestore()
        .collection("tasks_queue")
        .doc(taskName + "open")
        .set(
          {
            options: {
              type,
              action: "open",
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
            console.log("TASK ADDED TO QUEUE => ", taskName + "open", openDate)
        )
        .catch((error: any) => throwError(error));
      admin
        .firestore()
        .collection("tasks_queue")
        .doc(taskName + "close")
        .set(
          {
            options: {
              type,
              action: "close",
              dayOfWeek,
              automatedOpenTime,
              automatedCloseTime,
            },
            worker: "hours_status_automation",
            status: "scheduled",
            performAt: closeDate,
            createdOn: new Date(),
          },
          { merge: true }
        )
        .then(
          () =>
            DEBUG &&
            console.log(
              "TASK ADDED TO QUEUE => ",
              taskName + "close",
              closeDate
            )
        )
        .catch((error: any) => throwError(error));
    };
    if (isOpenMondayAutomation)
      updateAutomationTask(
        taskId + "monday_",
        1,
        automatedOpenTimeMonday,
        automatedCloseTimeMonday
      );
    if (isOpenTuesdayAutomation)
      updateAutomationTask(
        taskId + "tuesday_",
        2,
        automatedOpenTimeTuesday,
        automatedCloseTimeTuesday
      );
    if (isOpenWednesdayAutomation)
      updateAutomationTask(
        taskId + "wednesday_",
        3,
        automatedOpenTimeWednesday,
        automatedCloseTimeWednesday
      );
    if (isOpenThursdayAutomation)
      updateAutomationTask(
        taskId + "thursday_",
        4,
        automatedOpenTimeThursday,
        automatedCloseTimeThursday
      );
    if (isOpenFridayAutomation)
      updateAutomationTask(
        taskId + "friday_",
        5,
        automatedOpenTimeFriday,
        automatedCloseTimeFriday
      );
    if (isOpenSaturdayAutomation)
      updateAutomationTask(
        taskId + "saturday_",
        6,
        automatedOpenTimeSaturday,
        automatedCloseTimeSaturday
      );
    if (isOpenSundayAutomation)
      updateAutomationTask(
        taskId + "sunday_",
        0,
        automatedOpenTimeSunday,
        automatedCloseTimeSunday
      );
  };
  if (clinicAutomationStatus) await configureAutomationTasks("clinic");
  else await deleteAutomationTasks("clinic");
  if (housecallAutomationStatus) await configureAutomationTasks("housecall");
  else await deleteAutomationTasks("housecall");
  if (boutiqueAutomationStatus) await configureAutomationTasks("boutique");
  else await deleteAutomationTasks("boutique");
  if (walkinsAutomationStatus) await configureAutomationTasks("walkins");
  else await deleteAutomationTasks("walkins");
};
