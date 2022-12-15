import { sendNotification } from "./../../notifications/sendNotification";
import { Request, Response } from "express";
import { throwError, DEBUG } from "../../config/config";

export const processExpoWebhook = async (
  request: Request,
  response: Response
): Promise<any> => {
  if (DEBUG)
    console.log(
      "INCOMING REQUEST PAYLOAD: processExpoWebhook => ",
      request.body
    );
  if (request.headers["expo-signature"]) {
    if (DEBUG) console.log("EXPO WEBHOOK RECEIVED => ", request.body);
    try {
      const { platform, status, artifacts, error, metadata } = request.body;
      sendNotification({
        type: "slack",
        payload: {
          channel: "production-logs",
          message: `:building_construction: Expo Build Update!\n\nPlatform: ${platform}\n\nStatus: ${status}\n\nArtifacts: ${JSON.stringify(
            artifacts
          )}\n\nMetadata: ${JSON.stringify(
            metadata
          )}\n\nError: ${JSON.stringify(error)}\n\n`,
        },
      });
      return response.status(200).send();
    } catch (error: any) {
      throwError(error);
      return response.status(500).send();
    }
  }
  return response.status(401).send();
};
