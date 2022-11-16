import { formatDateToMMDDYY } from "./../utils/formatDateToMMDDYYY";
import {
  throwError,
  admin,
  environment,
  stripe,
  DEBUG,
} from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
import { getCustomerId } from "../utils/getCustomerId";
import { verifyValidPaymentSource } from "../utils/verifyValidPaymentSource";

export const updateBookingRequestedDateTime = async (
  id: string,
  client: string,
  requestedDateTime: { date: any; time: string }
) => {
  if (DEBUG) console.log("updateBookingRequestedDateTime", requestedDateTime);
  const customer = await getCustomerId(client);
  const validFormOfPayment = await verifyValidPaymentSource(client, customer);
  if (DEBUG) console.log("validFormOfPayment", validFormOfPayment);
  const session =
    validFormOfPayment === false
      ? await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "setup",
          customer,
          client_reference_id: client,
          metadata: {
            clientId: client,
          },
          success_url:
            (environment?.type === "development"
              ? "http://localhost:3001"
              : "https://app.movetcare.com") +
            "/request-an-appointment/success?id=" +
            id,
          cancel_url:
            (environment?.type === "development"
              ? "http://localhost:3001"
              : "https://app.movetcare.com") + "/request-an-appointment",
        })
      : null;
  if (DEBUG) console.log("STRIPE CHECKOUT SESSION", session);
  admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      session !== null
        ? {
            step: "payment-confirmation",
            checkout: session,
            updatedOn: new Date(),
          }
        : {
            step: "complete",
            updatedOn: new Date(),
          },
      { merge: true }
    )
    .then(() =>
      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: ":book: _Appointment Booking_ *UPDATE*",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*Session ID*",
                },
                {
                  type: "plain_text",
                  text: id,
                },
                {
                  type: "mrkdwn",
                  text: "*Step*",
                },
                {
                  type: "plain_text",
                  text: "Request Date / Time",
                },
                {
                  type: "mrkdwn",
                  text: "*Selected Date & Time*",
                },
                {
                  type: "plain_text",
                  text:
                    formatDateToMMDDYY(requestedDateTime?.date?.toDate()) +
                    " @ " +
                    requestedDateTime?.time,
                },
              ],
            },
          ],
        },
      })
    )
    .catch((error: any) => throwError(error));
};
