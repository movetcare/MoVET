import { throwError, admin, environment, stripe } from "../config/config";
import { getCustomerId } from "../utils/getCustomerId";
import { logEvent } from "../utils/logging/logEvent";
import { verifyValidPaymentSource } from "../utils/verifyValidPaymentSource";

const DEBUG = true;

export const updateBookingRequestedDateTime = async (
  id: string,
  client: string,
  requestedDateTime: { date: string; time: string }
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
  await admin
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
    .then(
      async () =>
        await logEvent({
          tag: "appointment-booking",
          origin: "api",
          success: true,
          sendToSlack: true,
          data: {
            id,
            step: "choose-datetime",
            updatedOn: new Date(),
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
                    text: JSON.stringify(requestedDateTime),
                  },
                ],
              },
            ],
          },
        })
    )
    .catch(async (error: any) => await throwError(error));
};
