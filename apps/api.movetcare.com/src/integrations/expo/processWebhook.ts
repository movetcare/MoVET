import {Request, Response} from "express";
import {throwError, DEBUG} from "../../config/config";
import {logEvent} from "../../utils/logging/logEvent";

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
      const {platform, status, artifacts, error, metadata} = request.body;
      return (await logEvent({
        platform,
        status,
        artifacts,
        error,
        metadata,
        sendToSlack: true,
      }))
        ? response.status(200).send()
        : response.status(500).send();
    } catch (error: any) {
      await throwError(error);
      return response.status(500).send();
    }
  }
  return response.status(401).send();
};
