import {
  functions,
  defaultRuntimeOptions,
  DEBUG,
  throwError,
  environment,
} from "../../config/config";
import { Response } from "express";
import { EventWebhook, EventWebhookHeader } from "@sendgrid/eventwebhook";
import { findSlackChannel } from "../../utils/logging/findSlackChannel";
import { sendSlackMessage } from "../../utils/logging/sendSlackMessage";

const verifyRequest = function (
  publicKey: string,
  payload: any,
  signature: string,
  timestamp: string
) {
  const eventWebhook = new EventWebhook();
  const ecPublicKey = eventWebhook.convertPublicKeyToECDSA(publicKey);
  return eventWebhook.verifySignature(
    ecPublicKey,
    payload,
    signature,
    timestamp
  );
};

export const sendgridWebhook: Promise<Response> = functions
  .runWith(defaultRuntimeOptions)
  .https.onRequest(async (request: any, response: any) => {
    if (DEBUG) {
      console.log("request.headers", request.headers);
      console.log("request.body", request.body);
    }
    try {
      const key =
        "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE8o+9otYX5aBXK8fwPu2PDWfx+hFw6zeur/8JA7mx6nimH6aKLoxD3zMHeSSsCi3x8J7f03Hj2M9KRzCW7qbFfw==";
      const signature = request.get(EventWebhookHeader.SIGNATURE());
      const timestamp = request.get(EventWebhookHeader.TIMESTAMP());
      const requestBody = request.rawBody;
      if (verifyRequest(key, requestBody, signature, timestamp)) {
        const channelId: any = await findSlackChannel(
          environment.type === "production"
            ? "production-email-logs"
            : "staging-email-logs"
        );
        for (const [key, value] of Object.entries(request?.body)) {
          if (DEBUG) console.log(`${key}: ${JSON.stringify(value)}`);
          const { email, event, sg_event_id, sg_message_id } =
            request.body[key];
          if (
            email !== "support@movetcare.com" &&
            email !== "info@movetcare.com" &&
            email !== "dev@movetcare.com"
          ) {
            sendSlackMessage(channelId, null, [
              {
                type: "section",
                text: {
                  text: "*NEW* _SendGrid Log_",
                  type: "mrkdwn",
                },
                fields: [
                  {
                    type: "mrkdwn",
                    text: "*Email*",
                  },
                  {
                    type: "plain_text",
                    text: email,
                  },
                  {
                    type: "mrkdwn",
                    text: "*Event Type*",
                  },
                  {
                    type: "plain_text",
                    text: event,
                  },
                  {
                    type: "mrkdwn",
                    text: "*Event Id*",
                  },
                  {
                    type: "plain_text",
                    text: sg_event_id,
                  },
                  {
                    type: "mrkdwn",
                    text: "*MessageId*",
                  },
                  {
                    type: "plain_text",
                    text: sg_message_id,
                  },
                ],
              },
            ]);
          }
        }
        return response.sendStatus(204);
      } else {
        return response.sendStatus(403);
      }
    } catch (error) {
      throwError(error);
      return response.status(500).send(error);
    }
  });
