import {environment, sendGridAPI} from "../../config/config";
import {logEvent} from "../../utils/logging/logEvent";
const DEBUG = false;
export const updateSendGridContact = async ({
  email,
  firstName,
  lastName,
  customFields,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
  customFields?: {e1_T?: "mobile" | "contact" | "join"; e2_N?: 1 | 0};
}): Promise<boolean> => {
  if (DEBUG) {
    console.log("updateSendGridContact", {
      email,
      firstName,
      lastName,
      customFields,
    });
    if (environment.type !== "production")
      await sendGridAPI
        .request({
          url: "/v3/marketing/field_definitions",
          method: "GET",
        })
        .then(([response]) => {
          console.log("SENDGRID RESPONSE STATUS: ", response.statusCode);
          console.log("SENDGRID RESPONSE BODY: ", response.body);
        })
        .catch(async (error: any) => DEBUG && console.error(error));
  }
  return environment.type === "production"
    ? await sendGridAPI
        .request({
          url: "/v3/marketing/contacts",
          method: "PUT",
          body: {
            contacts:
              firstName || lastName
                ? [
                    {
                      email,
                      first_name: firstName,
                      last_name: lastName,
                      custom_fields: customFields,
                    },
                  ]
                : [
                    {
                      email,
                      custom_fields: customFields,
                    },
                  ],
          },
        })
        .then(async ([response]) => {
          if (DEBUG) {
            console.log("SENDGRID RESPONSE STATUS: ", response.statusCode);
            console.log("SENDGRID RESPONSE BODY: ", response.body);
          }
          await logEvent({
            tag: "sendgrid",
            origin: "api",
            success: true,
            data: {message: `:tada: ${email} has bee updated in SendGrid`},
          });
          return true;
        })
        .catch(async (error: any) => DEBUG && console.error(error))
    : true &&
        (console.log("SIMULATED updateSendGridContact REQUEST", {
          url: "/v3/marketing/contacts",
          method: "PUT",
          body:
            firstName || lastName
              ? [
                  {
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    custom_fields: customFields,
                  },
                ]
              : [
                  {
                    email,
                    custom_fields: customFields,
                  },
                ],
        }) as any);
};
