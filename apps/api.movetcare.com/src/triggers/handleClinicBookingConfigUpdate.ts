import { sendNotification } from "../notifications/sendNotification";
import {
  environment,
  functions,
  request,
  DEBUG,
  admin,
  throwError,
} from "../config/config";

export const handleClinicBookingConfigUpdate = functions.firestore
  .document("configuration/pop_up_clinics")
  .onUpdate(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    if (DEBUG)
      console.log("handleBookingConfigUpdate => DATA", {
        id,
        data,
      });
    if (data !== undefined) {
      admin
        .firestore()
        .collection("alerts")
        .doc("pop_up_clinics")
        .set(
          {
            ...data,
            updatedOn: new Date(),
          },
          { merge: true },
        )
        .catch((error: any) => throwError(error));
      const didTriggerVercelBuildWebhookForMarketingWebsite =
        environment.type === "production"
          ? await request
              .post(
                "https://api.vercel.com/v1/integrations/deploy/prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS?buildCache=false",
              )
              .then(async (response: any) => {
                const { data, status } = response;
                if (DEBUG)
                  console.log(
                    "API Response: POST https://api.vercel.com/v1/integrations/deploy/prj_U3YE4SJdfQooyh9TsZsZmvdoL28T/exR90BAbzS?buildCache=false =>",
                    data,
                  );
                return status !== 200 && status !== 201 ? "ERROR" : data;
              })
              .catch(() => false)
          : false;
      const didTriggerVercelBuildWebhookForWebApp =
        environment.type === "production"
          ? await request
              .post(
                "https://api.vercel.com/v1/integrations/deploy/prj_da86e8MG9HWaYYjOhzhDRwznKPtc/Kv7tDyrjjO?buildCache=false",
              )
              .then(async (response: any) => {
                const { data, status } = response;
                if (DEBUG)
                  console.log(
                    "API Response: POST https://api.vercel.com/v1/integrations/deploy/prj_da86e8MG9HWaYYjOhzhDRwznKPtc/Kv7tDyrjjO?buildCache=false =>",
                    data,
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
                text: ":robot_face: _Pop Up Clinic Configuration Updated!_",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*BUILD TRIGGERED:*",
                },
                {
                  type: "plain_text",
                  text:
                    (didTriggerVercelBuildWebhookForWebApp
                      ? "Web App: :white_check_mark: "
                      : "Web App: :red_circle: ") +
                    (didTriggerVercelBuildWebhookForMarketingWebsite
                      ? "Website: :white_check_mark: "
                      : "Website: :red_circle: "),
                },
              ],
            },
          ],
        },
      });
    }
    return true;
  });
