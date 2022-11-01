import { sendNotifications } from "../notifications/sendNotifications";
import { functions } from "./../config/config";
// import type { ContactForm } from "types";
// import { CONTACT_STATUS } from "constant";

const DEBUG = true;
export const sendContactFormNotifications = functions.firestore
  .document("contact/{id}")
  .onWrite(async (change: any, context: any) => {
    const { id } = context.params || {};
    const data = change.after.data();
    const { email, firstName, lastName, message, phone, reason, status } =
      data || {};
    if (DEBUG)
      console.log("sendContactFormNotifications => DATA", { id, data });
    if (status === "Needs Processing...") {
      await sendNotifications({
        type: "slack",
        payload: {
          tag: "contact-form",
          origin: "api",
          success: true,
          channel: "contact-form-submissions",
          data: {
            id,
            ...data,
            updatedOn: new Date(),
            message: [
              {
                type: "section",
                text: {
                  text: ":speech_balloon: _New Contact Form Submission_",
                  type: "mrkdwn",
                },
                fields: [
                  {
                    type: "mrkdwn",
                    text: "*NAME*",
                  },
                  {
                    type: "plain_text",
                    text: firstName + "" + lastName,
                  },
                  {
                    type: "mrkdwn",
                    text: "*EMAIL*",
                  },
                  {
                    type: "plain_text",
                    text: email,
                  },
                  {
                    type: "mrkdwn",
                    text: "*PHONE*",
                  },
                  {
                    type: "plain_text",
                    text: phone,
                  },
                  {
                    type: "mrkdwn",
                    text: "*REASON*",
                  },
                  {
                    type: "plain_text",
                    text: reason?.name,
                  },
                  {
                    type: "mrkdwn",
                    text: "*MESSAGE*",
                  },
                  {
                    type: "plain_text",
                    text: message,
                  },
                  {
                    type: "mrkdwn",
                    text: "*PHONE*",
                  },
                  {
                    type: "plain_text",
                    text: phone,
                  },
                ],
              },
            ],
          },
          sendToSlack: true,
        },
      });
      await sendNotifications({
        type: "email",
        payload: {
          tag: "contact-form",
          origin: "api",
          success: true,
          data: {
            id,
            ...data,
            to: "alex.rodriguez@movetcare.com",
            subject: "New MoVET Contact Form Submission!",
            message: "",
            updatedOn: new Date(),
          },
        },
      });
    }
  });
