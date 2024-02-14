import { configureReasonGroups } from "./../integrations/provet/entities/reason/configureReasonGroups";
import { configureUsers } from "./configureUsers";
import { configureTelehealthStatus } from "./configureTelehealthStatus";
import { configureAppointments } from "./configureAppointments";
import { configureBreeds } from "../integrations/provet/entities/patient/breeds/configureBreeds";
import { configureReasons } from "../integrations/provet/entities/reason/configureReasons";
import { admin, DEBUG, throwError } from "./config";
import { configureItems } from "../integrations/provet/entities/item/configureItems";
import { sendNotification } from "../notifications/sendNotification";

export const processConfiguration = async (options: {
  status: "scheduled" | "error" | "complete";
  entities: Array<
    | "telehealth"
    | "breeds"
    | "reasons"
    | "appointments"
    | "reason_groups"
    | "users"
    | "items"
  >;
}): Promise<void> => {
  const entity = options?.entities[0];
  if (DEBUG)
    console.log(`PROCESSING ${entity.toUpperCase()} APP CONFIGURATION TASK`);
  switch (entity) {
    case "telehealth":
      configureTelehealthStatus();
      break;
    case "breeds":
      configureBreeds();
      break;
    case "reasons":
      configureReasons();
      break;
    case "appointments":
      configureAppointments();
      break;
    case "users":
      configureUsers();
      break;
    case "reason_groups":
      configureReasonGroups();
      break;
    case "items":
      configureItems();
      break;
    default:
      break;
  }
  const entities = options?.entities.filter(
    (
      element:
        | "telehealth"
        | "breeds"
        | "reasons"
        | "appointments"
        | "reason_groups"
        | "users"
        | "items",
    ) => element !== entity,
  );
  if (entities.length > 0)
    admin
      .firestore()
      .collection("tasks_queue")
      .doc(`configure_app_${entities[0]}`)
      .set(
        {
          options: {
            entities,
            status: "queued",
          },
          worker: "configure_app",
          status: "scheduled",
          performAt: new Date(),
          createdOn: new Date(),
        },
        { merge: true },
      )
      .then(() => {
        console.log(
          "APP CONFIGURATION TASK ADDED TO QUEUE => ",
          `tasks_queue/configure_app_${entities[0]}`,
        );
        console.log(
          `PLEASE WAIT ~${
            entities.length * 1.5
          } MINUTES FOR THE TASK QUEUE TO FINISH PROCESSING...`,
        );
        sendNotification({
          type: "slack",
          payload: {
            message: `:white_check_mark: FINISHED INITIALIZING CONFIGURATION FOR APP ENTITY: ${entity.toUpperCase()}`,
          },
        });
      })
      .catch((error: any) => throwError(error));
  else
    sendNotification({
      type: "slack",
      payload: {
        message:
          ":white_check_mark: FINISHED INITIALIZING CONFIGURATION FOR ALL APP ENTITIES!",
      },
    });
};
