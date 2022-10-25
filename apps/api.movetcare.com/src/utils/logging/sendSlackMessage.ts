import {slackClient, slackBotToken} from "../../config/config";

export const sendSlackMessage = async (
  id: string,
  text: string | null,
  blocks?: null | Array<any>
) => {
  try {
    const result = await slackClient.chat.postMessage(
      blocks
        ? {
            token: slackBotToken,
            channel: id,
            blocks,
          }
        : {
            token: slackBotToken,
            channel: id,
            text: text as string,
          }
    );
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
};
