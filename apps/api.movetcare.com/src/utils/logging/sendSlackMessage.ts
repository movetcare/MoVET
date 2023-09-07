import { slackClient, slackBotToken, environment } from "../../config/config";
const DEBUG = true;
export const sendSlackMessage = (
  id: string,
  text: string | null,
  blocks?: null | Array<any>,
): void => {
  if (DEBUG)
    console.log(
      "sendSlackMessage DATA",
      blocks
        ? {
            token: slackBotToken,
            channel: id,
            text: text || "EMPTY",
            blocks: JSON.stringify(blocks),
          }
        : {
            token: slackBotToken,
            channel: id,
            text: text as string,
          },
    );
  if (environment.type === "production")
    slackClient.chat
      .postMessage(
        blocks
          ? {
              token: slackBotToken,
              channel: id,
              text: text || "EMPTY",
              blocks,
            }
          : {
              token: slackBotToken,
              channel: id,
              text: text as string,
            },
      )
      .catch((error: any) => console.error(error));
};
