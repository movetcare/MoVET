import { sendNotification } from "../notifications/sendNotification";
import { environment, functions, request, DEBUG } from "../config/config";

export const handleClosureUpdate = functions.firestore
  .document("configuration/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    if (DEBUG)
      console.log("handleClosureUpdate => DATA", {
        id,
        data,
      });
    if (id === "closures" && data !== undefined) {
      const {
        name,
        isActiveForClinic,
        isActiveForHousecalls,
        isActiveForTelehealth,
        startDate,
        endDate,
        showOnWebsite,
      } = data || {};
      // https://vercel.com/docs/concepts/git/deploy-hooks
      const didTriggerVercelBuildWebhook =
        showOnWebsite && environment.type === "production"
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
                text: ":door: _Hours Closures Updated!_",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*Name:*",
                },
                {
                  type: "plain_text",
                  text: name,
                },
                {
                  type: "mrkdwn",
                  text: "*START DATE:*",
                },
                {
                  type: "plain_text",
                  text:
                    startDate?.toDate()?.toLocaleDateString("en-us", {
                      weekday: "short",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    }) +
                    endDate?.toDate()?.toLocaleDateString("en-us", {
                      weekday: "short",
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    }),
                },
                {
                  type: "mrkdwn",
                  text: "*SHOW ON WEBSITE*",
                },
                {
                  type: "plain_text",
                  text: showOnWebsite ? ":white_check_mark: " : ":red_circle:",
                },
                {
                  type: "mrkdwn",
                  text: "*IS ACTIVE:*",
                },
                {
                  type: "plain_text",
                  text:
                    (isActiveForClinic
                      ? "CLINIC: :white_check_mark: "
                      : "CLINIC: :red_circle: ") +
                    " | " +
                    (isActiveForHousecalls
                      ? "HOUSECALLS: :white_check_mark: "
                      : "HOUSECALLS: :red_circle: ") +
                    (isActiveForTelehealth
                      ? "TELEHEALTH: :white_check_mark: "
                      : "TELEHEALTH: :red_circle: "),
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
