import { slackClient, slackBotToken, environment } from "../../config/config";
const DEBUG = true;
export const sendSlackMessage = (
  id: string,
  text: string | null,
  blocks?: null | Array<any>
): void => {
  if (DEBUG)
    console.log("sendSlackMessage DATA", {
      id,
      text,
      blocks: JSON.stringify(blocks),
    });
  try {
    if (environment.type === "production")
      slackClient.chat.postMessage(
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
            }
      );
  } catch (error) {
    console.error(error);
  }
};
