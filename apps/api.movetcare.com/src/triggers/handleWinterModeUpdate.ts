import { formatDateToMMDDYY } from "./../utils/formatDateToMMDDYYY";
import { sendNotification } from "../notifications/sendNotification";
import { environment, functions, request } from "../config/config";
const DEBUG = false;
export const handleWinterModeUpdate = functions.firestore
  .document("configuration/bookings")
  .onUpdate(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data()?.winterHousecallMode;
    if (DEBUG)
      console.log("handleWinterModeUpdate => DATA", {
        id,
        data,
      });
    if (data !== undefined) {
      const {
        isActiveOnWebsite,
        isActiveOnMobileApp,
        isActiveOnWebApp,
        message,
        startDate,
        endDate,
      } = data || {};
      // https://vercel.com/docs/concepts/git/deploy-hooks
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
                text: ":snowflake: _Winter Mode Updated!_",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*ACTIVE PERIOD:*",
                },
                {
                  type: "plain_text",
                  text: `${
                    startDate?.toDate() !== undefined
                      ? formatDateToMMDDYY(startDate?.toDate())
                      : "Missing Start Date"
                  } - ${
                    endDate?.toDate() !== undefined
                      ? formatDateToMMDDYY(endDate?.toDate())
                      : "Missing End Date"
                  }`,
                },
                {
                  type: "mrkdwn",
                  text: "*MESSAGE:*",
                },
                {
                  type: "plain_text",
                  text: message,
                },
                {
                  type: "mrkdwn",
                  text: "*ACTIVE ON:*",
                },
                {
                  type: "plain_text",
                  text:
                    (isActiveOnWebsite
                      ? "WEBSITE: :white_check_mark: "
                      : "WEBSITE: :red_circle: ") +
                    "\n" +
                    (isActiveOnWebApp
                      ? "WEB APP: :white_check_mark: "
                      : "WEB APP: :red_circle: ") +
                    "\n" +
                    (isActiveOnMobileApp
                      ? "MOBILE: :white_check_mark: "
                      : "MOBILE: :red_circle: "),
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
