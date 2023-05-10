import { sendNotification } from "../notifications/sendNotification";
import { environment, functions, request } from "../config/config";
const DEBUG = true;
export const handleHoursStatusUpdate = functions.firestore
  .document("configuration/hours_status")
  .onUpdate(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    if (DEBUG)
      console.log("handleHoursStatusUpdate => DATA", {
        id,
        data,
      });
    if (data !== undefined) {
      const didTriggerVercelBuildWebhookForMarketingWebsite =
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
      const didTriggerVercelBuildWebhookForWebApp =
        environment.type === "production"
          ? await request
              .post(
                "https://api.vercel.com/v1/integrations/deploy/prj_da86e8MG9HWaYYjOhzhDRwznKPtc/Kv7tDyrjjO?buildCache=false"
              )
              .then(async (response: any) => {
                const { data, status } = response;
                if (DEBUG)
                  console.log(
                    "API Response: POST https://api.vercel.com/v1/integrations/deploy/prj_da86e8MG9HWaYYjOhzhDRwznKPtc/Kv7tDyrjjO?buildCache=false =>",
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
                text: ":robot_face: _Website Hours Status Configuration Updated!_",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*STATUS:*",
                },
                {
                  type: "plain_text",
                  text:
                    (data?.boutiqueStatus
                      ? "Boutique: :white_check_mark: "
                      : "Boutique: :red_circle: ") +
                    " | " +
                    (data?.clinicStatus
                      ? "Clinic: :white_check_mark: "
                      : "Clinic: :red_circle: ") +
                    " | " +
                    (data?.walkinsStatus
                      ? "Walk-Ins: :white_check_mark: "
                      : "Walk-Ins: :red_circle: ") +
                    " | " +
                    (data?.housecallStatus
                      ? "Housecalls: :white_check_mark: "
                      : "Housecalls: :red_circle: "),
                },
                {
                  type: "mrkdwn",
                  text: "*BUILD TRIGGERED:*",
                },
                {
                  type: "plain_text",
                  text:
                    (didTriggerVercelBuildWebhookForMarketingWebsite
                      ? "Website: :white_check_mark: "
                      : "Website: :red_circle: ") +
                    " | " +
                    (didTriggerVercelBuildWebhookForWebApp
                      ? "Web App: :white_check_mark: "
                      : "Web App: :red_circle: "),
                },
              ],
            },
          ],
        },
      });
    }
    return true;
  });
