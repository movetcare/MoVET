import { formatPhoneNumber } from "utilities";
import { sendNotification } from "../notifications/sendNotification";
import { admin, functions, throwError } from "./../config/config";
import type { ContactForm } from "types";
import { CONTACT_STATUS } from "constant";

const DEBUG = true;
export const sendContactFormNotifications = functions.firestore
  .document("contact/{id}")
  .onCreate(async (snapshot: any, context: any) => {
    const { id } = context.params || {};
    if (DEBUG)
      console.log("sendContactFormNotifications => DATA", {
        id,
        data: snapshot.data(),
      });
    const {
      email,
      firstName,
      lastName,
      message,
      phone,
      reason,
      status,
      source,
    } = (snapshot.data() as ContactForm) || {};

    if (status === CONTACT_STATUS.NEEDS_PROCESSING) {
      try {
        await updateContactStatus({
          status: CONTACT_STATUS.STARTED_PROCESSING,
          id,
        });
        await sendNotification({
          type: "slack",
          payload: {
            tag: "contact-form",
            origin: "api",
            success: true,
            channel: reason.id,
            data: {
              id,
              ...snapshot.data(),
              updatedOn: new Date(),
              message: [
                {
                  type: "section",
                  text: {
                    text: `:speech_balloon: _New "${reason.name}" Contact Form Submission @ ${source}_`,
                    type: "mrkdwn",
                  },
                  fields: [
                    {
                      type: "mrkdwn",
                      text: "*Name:*",
                    },
                    {
                      type: "plain_text",
                      text: firstName + "" + lastName,
                    },
                    {
                      type: "mrkdwn",
                      text: "*Email:*",
                    },
                    {
                      type: "plain_text",
                      text: email,
                    },
                    {
                      type: "mrkdwn",
                      text: "*Phone:*",
                    },
                    {
                      type: "plain_text",
                      text: phone,
                    },
                    {
                      type: "mrkdwn",
                      text: "*Message:*",
                    },
                    {
                      type: "plain_text",
                      text: message,
                    },
                    {
                      type: "mrkdwn",
                      text: "*Source*",
                    },
                    {
                      type: "plain_text",
                      text: source,
                    },
                  ],
                },
              ],
            },
            sendToSlack: true,
          },
        });
        await sendNotification({
          type: "email",
          payload: {
            tag: "contact-form",
            origin: "api",
            success: true,
            id,
            ...snapshot.data(),
            to: "alex.rodriguez@movetcare.com",
            replyTo: email,
            subject: `New "${reason.name}" Contact Form Submission from ${firstName} ${lastName}`,
            message: `<p><b>Name:</b> ${firstName} ${lastName}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> <a href="tel://+1${phone}">${formatPhoneNumber(
              phone
            )}</a></p><p><b>Message:</b> ${message}</p><p><b>Source:</b> ${source}</p>`,
            updatedOn: new Date(),
          },
        });
        await updateContactStatus({
          status: CONTACT_STATUS.NEEDS_REPLY,
          id,
        });
      } catch (error: any) {
        await updateContactStatus({
          status: CONTACT_STATUS.ERROR_PROCESSING,
          id,
        });
        await throwError(error);
      }
    }
  });

const updateContactStatus = async ({
  id,
  status,
}: {
  id: string;
  status: ContactForm["status"];
}) => {
  await admin
    .firestore()
    .collection("contact")
    .doc(id)
    .set({ status, updatedOn: new Date() }, { merge: true })
    .then(() => DEBUG && console.log("CONTACT_STATUS CHANGED", status))
    .catch(async (error: any) => await throwError(error));
};
