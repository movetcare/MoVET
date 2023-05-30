import {
  slackClient,
  slackBotToken,
  throwError,
  environment,
} from "../../config/config";

export const findSlackChannel = async (
  name: string
): Promise<string | null> => {
  try {
    if (environment?.type !== "production") return "SIMULATOR";
    const result = await slackClient.conversations.list({
      token: slackBotToken,
    });
    for (const channel of result.channels as any) {
      if (channel.name === name) return channel.id;
    }
  } catch (error) {
    return throwError(error) as any;
  }
  return null;
};
