import { admin, throwError, DEBUG } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
// import {configureReminders} from '../integrations/provet/entities/reminder/configureReminders';
import { workers } from "./workers";
export const processTaskQueue = async (): Promise<void> => {
  if (DEBUG) {
    console.log("*** PROCESSING TASK QUEUE ***");
    console.log("process.env.TZ", process.env.TZ);
  }
  const query = admin
    .firestore()
    .collection("tasks_queue")
    .where("performAt", "<=", new Date())
    .where("status", "==", "scheduled");
  const tasks = await query.get().catch((error: any) => throwError(error));
  const failedTaskQuery = admin
    .firestore()
    .collection("tasks_queue")
    .where("performAt", "<=", new Date())
    .where("status", "==", "error");
  const failedTasks = await failedTaskQuery
    .get()
    .catch((error: any) => throwError(error));
  const jobs: Promise<any>[] = [];
  if (tasks.docs.length > 0) {
    tasks.forEach((task: any) => {
      if (DEBUG) console.log("TASK => ", task.data());
      const { worker, options } = task.data();
      const job = workers[worker](options)
        .then(() => {
          if (DEBUG) {
            console.log("*** TASK COMPLETE ***");
            console.log(`WORKER: ${worker}`);
            console.log(`OPTIONS: ${JSON.stringify(options)}`);
          }
          admin
            .firestore()
            .collection("tasks_completed")
            .doc(task.id)
            .set(
              {
                ...task.data(),
                status: "complete",
                markedCompleteOn: new Date(),
              },
              { merge: true },
            )
            .then(() =>
              task.ref
                .delete()
                .catch((error: any) => DEBUG && console.error(error)),
            )
            .catch((error: any) => throwError(error));
        })
        .catch((error: any) => {
          if (DEBUG) {
            console.error("*** TASK FAILED ***");
            console.error(`WORKER: ${worker}`);
            console.error(`OPTIONS: ${JSON.stringify(options)}`);
          }
          task.ref
            .update({
              status: "scheduled",
              error: error?.message || "UNKNOWN",
            })
            .then(() =>
              sendNotification({
                type: "slack",
                payload: {
                  message: JSON.stringify(task.data()),
                },
              }),
            )
            .catch((error: any) => console.error(error));
          throwError(error);
        });
      jobs.push(job);
    });
  } else if (DEBUG) console.log("*** NO NEW TASKS FOUND IN QUEUE ***");
  if (failedTasks.docs.length > 0) {
    failedTasks.forEach((task: any) => {
      if (DEBUG) console.log("TASK => ", task.data());
      const { worker, options } = task.data();
      const job = workers[worker](options)
        .then(async () => {
          if (DEBUG) {
            console.log("*** TASK COMPLETE ***");
            console.log(`WORKER: ${worker}`);
            console.log(`OPTIONS: ${JSON.stringify(options)}`);
          }
          admin
            .firestore()
            .collection("tasks_completed")
            .doc(task.id)
            .set(
              {
                ...task.data(),
                status: "complete",
                markedCompleteOn: new Date(),
              },
              { merge: true },
            )
            .then(() =>
              task.ref
                .delete()
                .catch((error: any) => DEBUG && console.error(error)),
            )
            .catch((error: any) => throwError(error));
        })
        .catch((error: any) => {
          if (DEBUG) {
            console.error("*** TASK FAILED ***");
            console.error(`WORKER: ${worker}`);
            console.error(`OPTIONS: ${JSON.stringify(options)}`);
          }
          task.ref
            .update({ status: "scheduled", ...error })
            .then(() =>
              sendNotification({
                type: "slack",
                payload: {
                  message: JSON.stringify(task.data()),
                },
              }),
            )
            .catch((error: any) => DEBUG && console.error(error));
          return throwError(error);
        });
      jobs.push(job);
    });
  } else if (DEBUG) console.log("*** NO FAILED TASKS FOUND IN QUEUE ***");
  await Promise.all(jobs).catch((error: any) => throwError(error));
};
