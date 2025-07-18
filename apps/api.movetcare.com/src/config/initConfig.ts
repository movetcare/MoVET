import { configureReasonGroups } from "./../integrations/provet/entities/reason/configureReasonGroups";
import { configureTerminals } from "./configureTerminals";
import { Request, Response } from "express";
import { mobileClientApiKey, environment, admin, throwError } from "./config";
import { configureAppointments } from "./configureAppointments";
import { configureBreeds } from "../integrations/provet/entities/patient/breeds/configureBreeds";
import { configureReasons } from "../integrations/provet/entities/reason/configureReasons";
import { configureTelehealthStatus } from "./configureTelehealthStatus";
import { configureInvoices } from "../integrations/provet/entities/invoice/configureInvoices";
import { configureUsers } from "./configureUsers";
import { configureItems } from "../integrations/provet/entities/item/configureItems";
import { configureBooking } from "./configureBooking";
import { sendNotification } from "../notifications/sendNotification";
import { configureSchedule } from "./configureSchedule";
import { configureResources } from "../integrations/provet/entities/resource/configureResources";
import { configurePopUpAd } from "./configurePopUpAd";

export const initProVetConfig = async (
  { body: { apiKey, type } }: Request<{ body: any }>,
  response: Response,
): Promise<Response> => {
  if (apiKey === mobileClientApiKey) {
    if (environment.type === "production")
      sendNotification({
        type: "slack",
        payload: {
          message: `:warning: Platform Configuration "${type?.toUpperCase()}" Triggered!`,
        },
      });
    const entities: Array<string> = [
      "users",
      "terminals",
      "reasons",
      "reason_groups",
      "cancellation_reasons",
      "breeds",
      "invoices",
      "items",
    ];
    switch (type) {
      case "all":
        if (environment.type !== "production")
          return (
            (await configureSchedule()) &&
            (await configureBooking()) &&
            (await configureTelehealthStatus()) &&
            (await configurePopUpAd()) &&
            (await configureAppointments()) &&
            (await configureResources()) &&
            (await admin
              .firestore()
              .collection("tasks_queue")
              .doc("configure_app")
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
              .then(async () => {
                console.log("APP CONFIGURATION TASK ADDED TO QUEUE!");
                console.log(
                  `PLEASE WAIT ~${
                    entities.length * 1.5
                  } MINUTES FOR THE TASK QUEUE TO FINISH PROCESSING...`,
                );

                return response.status(200).send();
              })
              .catch((error: any) => {
                throwError(error);
                return response.status(500).send();
              }))
          );
        else {
          console.log(
            "PRODUCTION ENVIRONMENT DETECTED - SKIPPING APP CONFIGURATION AUTOMATION",
          );
          return response.status(200).send();
        }
      case "telehealth":
        return (await configureTelehealthStatus())
          ? response.status(200).send()
          : response.status(500).send();
      case "breeds":
        return (await configureBreeds())
          ? response.status(200).send()
          : response.status(500).send();
      case "invoices":
        return (await configureInvoices())
          ? response.status(200).send()
          : response.status(500).send();
      case "reasons":
        return (await configureReasons())
          ? response.status(200).send()
          : response.status(500).send();
      case "resources":
        return (await configureResources())
          ? response.status(200).send()
          : response.status(500).send();
      case "booking":
        return (await configureBooking())
          ? response.status(200).send()
          : response.status(500).send();
      case "reason_groups":
        return (await configureReasonGroups())
          ? response.status(200).send()
          : response.status(500).send();
      case "appointments":
        return (await configureAppointments())
          ? response.status(200).send()
          : response.status(500).send();
      case "items":
        return (await configureItems())
          ? response.status(200).send()
          : response.status(500).send();
      case "users":
        return environment.type !== "production"
          ? (await configureUsers())
            ? response.status(200).send()
            : response.status(500).send()
          : response.status(500).send();
      case "terminals":
        return environment.type !== "production"
          ? (await configureTerminals())
            ? response.status(200).send()
            : response.status(500).send()
          : response.status(500).send();
      default:
        return response.status(500).send();
    }
  } else return response.status(500).send();
};
