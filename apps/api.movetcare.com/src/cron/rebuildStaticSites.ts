import {
  functions,
  defaultRuntimeOptions,
  DEBUG,
  environment,
  request,
} from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
export const rebuildStaticSites: Promise<void> = functions
  .runWith(defaultRuntimeOptions)
  .pubsub.schedule("0 0 * * *")
  .timeZone("America/Denver")
  .onRun(async () => {
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
              text: ":building_construction: _Nightly Static Site Rebuild(s) Triggered!_",
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
                  (didTriggerVercelBuildWebhookForMarketingWebsite
                    ? "Website: :white_check_mark:"
                    : "Website: :red_circle:") +
                  " |  " +
                  (didTriggerVercelBuildWebhookForWebApp
                    ? "Web App: :white_check_mark:"
                    : "Web App: :red_circle:"),
              },
            ],
          },
        ],
      },
    });
  });
