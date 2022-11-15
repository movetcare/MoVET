import { configureReasonGroups } from "./../integrations/provet/entities/reason/configureReasonGroups";
import { configureUsers } from "./configureUsers";
import { configureTelehealthStatus } from "../integrations/provet/entities/appointment/configure/configureTelehealthStatus";
import { configureShifts } from "../integrations/provet/entities/shift/configureShifts";
import { configureAppointments } from "../integrations/provet/entities/appointment/configure/configureAppointments";
import { configureAppointmentEstimates } from "../integrations/provet/entities/appointment/configure/configureAppointmentEstimates";
import { configureAppointmentOptionDetails } from "../integrations/provet/entities/appointment/configure/configureAppointmentOptionDetails";
import { configureBreeds } from "../integrations/provet/entities/patient/breeds/configureBreeds";
import { configureCancellationReasons } from "../integrations/provet/entities/reason/configureCancellationReasons";
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
    | "cancellation_reasons"
    | "reason_groups"
    | "reminders"
    | "estimates"
    | "options"
    | "shifts"
    | "users"
    | "items"
  >;
}) => {
  const entity = options?.entities[0];
  if (DEBUG)
    console.log(`PROCESSING ${entity.toUpperCase()} APP CONFIGURATION TASK`);
  switch (entity) {
    case "telehealth":
      await configureTelehealthStatus();
      break;
    case "breeds":
      await configureBreeds();
      break;
    case "reasons":
      await configureReasons();
      break;
    case "appointments":
      await configureAppointments();
      break;
    case "cancellation_reasons":
      await configureCancellationReasons();
      break;
    case "estimates":
      await configureAppointmentEstimates();
      break;
    case "options":
      await configureAppointmentOptionDetails();
      break;
    case "shifts":
      await configureShifts();
      break;
    case "users":
      await configureUsers();
      break;
    case "reason_groups":
      await configureReasonGroups();
      break;
    case "items":
      await configureItems();
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
        | "cancellation_reasons"
        | "reminders"
        | "estimates"
        | "options"
        | "shifts"
        | "reason_groups"
        | "users"
        | "items"
    ) => element !== entity
  );
  if (entities.length > 0)
    await admin
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
        { merge: true }
      )
      .then(async () => {
        console.log(
          "APP CONFIGURATION TASK ADDED TO QUEUE => ",
          `tasks_queue/configure_app_${entities[0]}`
        );
        console.log(
          `PLEASE WAIT ~${
            entities.length * 1.5
          } MINUTES FOR THE TASK QUEUE TO FINISH PROCESSING...`
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
