import {admin, throwError, environment, DEBUG} from "../config/config";
// import {configureReminders} from '../integrations/provet/entities/reminder/configureReminders';
import {logEvent} from "../utils/logging/logEvent";
import {timestampString} from "../utils/timestampString";
import {workers} from "./workers";

export const processTaskQueue = async (): Promise<any> => {
  if (DEBUG) console.log("*** PROCESSING TASK QUEUE ***");
  const query = admin
    .firestore()
    .collection("tasks_queue")
    .where("performAt", "<=", new Date())
    .where("status", "==", "scheduled");
  const tasks = await query
    .get()
    .catch(async (error: any) => await throwError(error));
  const failedTaskQuery = admin
    .firestore()
    .collection("tasks_queue")
    .where("performAt", "<=", new Date())
    .where("status", "==", "error");
  const failedTasks = await failedTaskQuery
    .get()
    .catch(async (error: any) => await throwError(error));
  const jobs: Promise<any>[] = [];
  if (tasks.docs.length > 0) {
    tasks.forEach((task: any) => {
      if (DEBUG) console.log("TASK => ", task.data());
      const {worker, options} = task.data();
      const job = workers[worker](options)
        .then(async () => {
          if (DEBUG) {
            console.log("*** TASK COMPLETE ***");
            console.log(`WORKER: ${worker}`);
            console.log(`OPTIONS: ${JSON.stringify(options)}`);
          }
          if (task.id === "refresh_reminders") {
            if (environment?.type === "development")
              await admin
                .firestore()
                .collection("tasks_completed")
                .doc(`${task.id}_${timestampString(new Date(), "_")}`)
                .set(
                  {
                    ...task.data(),
                    status: "complete",
                    markedCompleteOn: new Date(),
                  },
                  {merge: true}
                );
            return;
            //  return await configureReminders();
          } else
            return await admin
              .firestore()
              .collection("tasks_completed")
              .doc(task.id)
              .set(
                {
                  ...task.data(),
                  status: "complete",
                  markedCompleteOn: new Date(),
                },
                {merge: true}
              )
              .then(() =>
                task.ref
                  .delete()
                  .then(
                    async () =>
                      environment.type !== "development" &&
                      (await logEvent({
                        tag: "queue",
                        origin: "api",
                        success: true,
                        data: task.data(),
                      }))
                  )
                  .catch((error: any) => DEBUG && console.error(error))
              )
              .catch(async (error: any) => await throwError(error));
        })
        .catch(async (error: any) => {
          if (DEBUG) {
            console.error("*** TASK FAILED ***");
            console.error(`WORKER: ${worker}`);
            console.error(`OPTIONS: ${JSON.stringify(options)}`);
          }
          await task.ref
            .update({status: "scheduled", error: error?.message || "UNKNOWN"})
            .then(
              async () =>
                environment.type !== "development" &&
                (await logEvent({
                  tag: "queue",
                  origin: "api",
                  success: false,
                  data: task.data(),
                }))
            )
            .catch((error: any) => console.error(error));
          return throwError(error);
        });
      jobs.push(job);
    });
  } else if (DEBUG) console.log("*** NO NEW TASKS FOUND IN QUEUE ***");
  if (failedTasks.docs.length > 0) {
    failedTasks.forEach((task: any) => {
      if (DEBUG) console.log("TASK => ", task.data());
      const {worker, options} = task.data();
      const job = workers[worker](options)
        .then(async () => {
          if (DEBUG) {
            console.log("*** TASK COMPLETE ***");
            console.log(`WORKER: ${worker}`);
            console.log(`OPTIONS: ${JSON.stringify(options)}`);
          }
          return await admin
            .firestore()
            .collection("tasks_completed")
            .doc(task.id)
            .set(
              {
                ...task.data(),
                status: "complete",
                markedCompleteOn: new Date(),
              },
              {merge: true}
            )
            .then(() =>
              task.ref
                .delete()
                .then(
                  async () =>
                    environment.type !== "development" &&
                    (await logEvent({
                      tag: "queue",
                      origin: "api",
                      success: true,
                      data: task.data(),
                    }))
                )
                .catch((error: any) => DEBUG && console.error(error))
            )
            .catch(async (error: any) => await throwError(error));
        })
        .catch(async (error: any) => {
          if (DEBUG) {
            console.error("*** TASK FAILED ***");
            console.error(`WORKER: ${worker}`);
            console.error(`OPTIONS: ${JSON.stringify(options)}`);
          }
          await task.ref
            .update({status: "scheduled", ...error})
            .then(
              async () =>
                environment.type !== "development" &&
                (await logEvent({
                  tag: "queue",
                  origin: "api",
                  success: false,
                  data: task.data(),
                }))
            )
            .catch((error: any) => DEBUG && console.error(error));
          return throwError(error);
        });
      jobs.push(job);
    });
  } else if (DEBUG) console.log("*** NO FAILED TASKS FOUND IN QUEUE ***");
  return await Promise.all(jobs).catch(
    async (error: any) => await throwError(error)
  );
};
