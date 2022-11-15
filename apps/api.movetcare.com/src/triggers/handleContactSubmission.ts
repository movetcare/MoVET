import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import { sendNotification } from "../notifications/sendNotification";
import { admin, functions, throwError } from "../config/config";
import { CONTACT_STATUS } from "../constant";
import type { ContactForm } from "../types/forms";
import { getAuthUserByEmail } from "../utils/auth/getAuthUserByEmail";
import { createProVetNote } from "../integrations/provet/entities/note/createProVetNote";

const DEBUG = false;
export const handleContactSubmission = functions.firestore
  .document("contact/{id}")
  .onCreate(async (snapshot: any, context: any) => {
    const { id } = context.params || {};
    if (DEBUG)
      console.log("handleContactSubmission => DATA", {
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
        updateContactStatus({
          status: CONTACT_STATUS.STARTED_PROCESSING,
          id,
        });
        sendNotification({
          type: "slack",
          payload: {
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
        });
        sendNotification({
          type: "email",
          payload: {
            to: "info@movetcare.com",
            replyTo: email,
            subject: `New "${reason.name}" Contact Form Submission from ${firstName} ${lastName}`,
            message: `<p><b>Name:</b> ${firstName} ${lastName}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> <a href="tel://+1${phone}">${formatPhoneNumber(
              phone
            )}</a></p><p><b>Message:</b> ${message}</p><p><b>Source:</b> ${source}</p>`,
            updatedOn: new Date(),
          },
        });
        updateContactStatus({
          status: CONTACT_STATUS.NEEDS_REPLY,
          id,
        });
        const isClient = await getAuthUserByEmail(email);
        if (DEBUG) console.log("isClient", isClient);
        if (isClient)
          createProVetNote({
            type: 1,
            subject: `New "${reason.name}" Contact Form Submission from ${firstName} ${lastName} @ ${source}`,
            message: `<p><b>Name:</b> ${firstName} ${lastName}</p><p><b>Email:</b> ${email}</p><p><b>Phone:</b> <a href="tel://+1${phone}">${formatPhoneNumber(
              phone
            )}</a></p><p><b>Message:</b> ${message}</p><p><b>Source:</b> ${source}</p>`,
            client: isClient?.uid,
            patients: [],
          });
      } catch (error: any) {
        updateContactStatus({
          status: CONTACT_STATUS.ERROR_PROCESSING,
          id,
        });
        throwError(error);
      }
    }
    return true;
  });

const updateContactStatus = ({
  id,
  status,
}: {
  id: string;
  status: ContactForm["status"];
}) =>
  admin
    .firestore()
    .collection("contact")
    .doc(id)
    .set({ status, updatedOn: new Date() }, { merge: true })
    .then(() => DEBUG && console.log("CONTACT_STATUS CHANGED", status))
    .catch((error: any) => throwError(error));

