import { sendNotification } from "../notifications/sendNotification";
import { environment, functions, request } from "../config/config";
const DEBUG = true;
export const handleClosuresConfigurationUpdates = functions.firestore
  .document("configuration/closures")
  .onWrite(async (change: any) => {
    if (change.after.data() !== undefined) {
      const data = change.after.data();
      if (DEBUG)
        console.log("handleClosuresConfigurationUpdates => DATA", data);
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
                text: ":door: _Closures Hours Updated!_",
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
