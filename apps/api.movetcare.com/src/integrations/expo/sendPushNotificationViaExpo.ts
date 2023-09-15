import { expoAccessToken, throwError } from "../../config/config";
import { Expo, ExpoPushTicket } from "expo-server-sdk";
const DEBUG = true;
const expo = new Expo({ accessToken: expoAccessToken });

export const sendPushNotificationViaExpo = async ({
  to,
  sound = "default",
  title,
  body,
  data,
}: {
  to: string;
  sound?: string;
  title: string;
  body: string;
  data: any;
}): Promise<{
  failureCount: number;
  responses: Array<ExpoPushTicket>;
}> => {
  if (DEBUG)
    console.log("NEW EXPO PUSH REQUEST: ", { to, sound, title, body, data });
  const messages: Array<any> = [];

  if (Array.isArray(to)) {
    for (const pushToken of to) {
      if (!Expo.isExpoPushToken(pushToken))
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
      messages.push({
        to: pushToken,
        sound,
        body: JSON.stringify(body),
        title,
        data,
      });
    }
  } else {
    if (!Expo.isExpoPushToken(to))
      console.error(`Push token ${to} is not a valid Expo push token`);
    messages.push({
      to,
      sound,
      body: JSON.stringify(body),
      title,
      data,
    });
  }
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: Array<any> = [];
  const failedTokens = [];
  await Promise.all(
    chunks.map(async (chunk: any) => {
      try {
        const ticketChunks: Array<ExpoPushTicket> =
          await expo.sendPushNotificationsAsync(chunk);
        if (DEBUG) console.log("TICKET: ", ticketChunks);
        tickets.push(...ticketChunks);
        ticketChunks.forEach((ticket: ExpoPushTicket) => {
          if (ticket?.status === "error") {
            if (DEBUG) console.log("FAILED TICKET", ticket);
            failedTokens.push((ticket?.details as any)?.expoPushToken);
          }
        });
      } catch (error: any) {
        throwError(error);
      }
    }),
  );
  if (DEBUG)
    console.log("EXPO PUSH RESPONSE: ", {
      failureCount: failedTokens.length,
      responses: JSON.stringify(tickets),
    });
  return { failureCount: failedTokens.length, responses: tickets };
  // const receiptIds: Array<any> = [];
  // for (const ticket of tickets) {
  //   if (ticket?.id) {
  //     receiptIds.push(ticket?.id);
  //   }
  // }

  // const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  // for (const chunk of receiptIdChunks) {
  //   try {
  //     const receipts: any = await expo.getPushNotificationReceiptsAsync(chunk);
  //     if (DEBUG) console.log(receipts);
  //     for (const receiptId in receipts) {
  //       const { status, message, details } = receipts[receiptId];
  //       if (status === "ok") continue;
  //       else if (status === "error") {
  //         console.error(
  //           `There was an error sending a notification: ${message}`,
  //         );
  //         if (details && details.error) {
  //           return throwError({
  //             message: `The error code is ${details.error} "${message}"`,
  //           });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     return throwError(error);
  //   }
  // }
  // return true;
};
