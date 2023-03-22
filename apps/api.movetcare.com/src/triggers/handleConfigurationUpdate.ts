import { sendNotification } from "../notifications/sendNotification";
import { environment, functions, request } from "../config/config";
const DEBUG = true;
export const handleConfigurationUpdate = functions.firestore
  .document("configuration/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    if ((id === "closures" || id === "openings") && data !== undefined) {
      if (DEBUG)
        console.log("handleConfigurationUpdate => DATA", {
          id,
          data,
        });
      // https://vercel.com/docs/concepts/git/deploy-hooks
      const didTriggerVercelBuildWebhook =
        environment.type === "production"
          ? await request
              .post(
                "https://api.vercel.com/v1/integrations/deploy/prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS?buildCache=false"
              )
              .then(async (response: any) => {
                const { data, status } = response;
                if (DEBUG)
                  console.log(
                    "API Response: POST https://api.vercel.com/v1/integrations/deploy/prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS?buildCache=false =>",
                    data
                  );
                return status !== 200 && status !== 201 ? "ERROR" : data;
              })
              .catch(() => false)
          : false;

      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: `:door: _${id?.toUpperCase()} Hours Updated!_`,
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*DETAILS:*",
                },
                {
                  type: "plain_text",
                  text: JSON.stringify(data) || "NOT FOUND",
                },
                {
                  type: "mrkdwn",
                  text: "*START DATE:*",
                },
                {
                  type: "mrkdwn",
                  text: "*BUILD TRIGGERED:*",
                },
                {
                  type: "plain_text",
                  text:
                    "Website: " + didTriggerVercelBuildWebhook
                      ? ":white_check_mark:"
                      : ":red_circle:",
                },
              ],
            },
          ],
        },
      });
    }
    return true;
  });
