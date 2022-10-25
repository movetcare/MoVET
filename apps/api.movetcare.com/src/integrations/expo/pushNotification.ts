import {DEBUG, expoAccessToken, throwError} from "../../config/config";
import {Expo} from "expo-server-sdk";
import {Request, Response} from "express";

const expo = new Expo({accessToken: expoAccessToken});

export const pushNotification = async (
  request: Request,
  response: Response
): Promise<any> => {
  const {to, sound, title, body, data} = request.body;
  if (DEBUG) console.log("NEW PUSH REQUEST: ", {to, sound, title, body, data});
  const messages = [];
  if (!Expo.isExpoPushToken(to))
    console.error(`Push token ${to} is not a valid Expo push token`);

  messages.push({
    to,
    sound,
    body: JSON.stringify(body),
    title,
    data,
  });
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      if (DEBUG) console.log("TICKET: ", ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error: any) {
      return throwError(error);
    }
  }
  return response.status(200).send();
};
