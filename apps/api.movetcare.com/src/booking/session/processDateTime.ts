import {
  admin,
  environment,
  stripe,
  throwError,
  DEBUG,
} from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import type { BookingError, Booking } from "../../types/booking";
import { getCustomerId } from "../../utils/getCustomerId";
import { verifyValidPaymentSource } from "../../utils/verifyValidPaymentSource";
import { handleFailedBooking } from "./handleFailedBooking";

export const processDateTime = async (
  id: string,
  requestedDateTime: { date: string; time: string }
): Promise<Booking | BookingError> => {
  if (DEBUG) console.log("DATE TIME DATA", requestedDateTime);
  if (requestedDateTime && id) {
    const bookingRef = admin.firestore().collection("bookings").doc(id);
    const session = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "GET BOOKING DATA FAILED");
      });
    const paymentMethodIsRequired = await admin
      .firestore()
      .collection("configuration")
      .doc("bookings")
      .get()
      .then(
        (doc: any) => doc.data()?.requirePaymentMethodToRequestAnAppointment
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "PAYMENT CONFIGURATION FAILED");
      });
    const customer: string = await getCustomerId(session?.client?.uid);
    let validFormOfPayment = null,
      checkoutSession = null;
    if (DEBUG) console.log("customer", customer);
    if (paymentMethodIsRequired) {
      validFormOfPayment = await verifyValidPaymentSource(
        session?.client?.uid,
        customer
      );
      if (DEBUG) console.log("validFormOfPayment", validFormOfPayment);
      checkoutSession =
        validFormOfPayment === false
          ? await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              mode: "setup",
              customer,
              client_reference_id: session?.client?.uid,
              metadata: {
                clientId: session?.client?.uid,
              },
              success_url:
                (environment?.type === "development"
                  ? "http://localhost:3001"
                  : environment?.type === "production"
                  ? "https://app.movetcare.com"
                  : "https://stage.app.movetcare.com") +
                "/schedule-an-appointment/success",
              cancel_url:
                (environment?.type === "development"
                  ? "http://localhost:3001"
                  : environment?.type === "production"
                  ? "https://app.movetcare.com"
                  : "https://stage.app.movetcare.com") +
                "/schedule-an-appointment",
            })
          : null;
      if (DEBUG) console.log("STRIPE CHECKOUT SESSION", checkoutSession);
      await bookingRef
        .set(
          {
            requestedDateTime,
            checkoutSession: checkoutSession ? checkoutSession?.url : null,
            step: checkoutSession
              ? ("datetime-selection" as Booking["step"])
              : "success",
            updatedOn: new Date(),
          },
          { merge: true }
        )
        .catch(async (error: any) => {
          throwError(error);
          return await handleFailedBooking(error, "UPDATE DATE TIME FAILED");
        });
    } else {
      await bookingRef
        .set(
          {
            requestedDateTime,
            checkoutSession: null,
            step: "success",
            updatedOn: new Date(),
          },
          { merge: true }
        )
        .catch(async (error: any) => {
          throwError(error);
          return await handleFailedBooking(error, "UPDATE DATE TIME FAILED");
        });
    }
    if (session && customer) {
      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: `:book: _Appointment Booking_ *UPDATED* (${id})`,
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*STEP*",
                },
                {
                  type: "plain_text",
                  text: "DATE / TIME SELECTION",
                },
                {
                  type: "mrkdwn",
                  text: "*DATE*",
                },
                {
                  type: "plain_text",
                  text: requestedDateTime?.date,
                },
                {
                  type: "mrkdwn",
                  text: "*TIME*",
                },
                {
                  type: "plain_text",
                  text: requestedDateTime?.time,
                },
                {
                  type: "mrkdwn",
                  text: "*CUSTOMER ID*",
                },
                {
                  type: "plain_text",
                  text: customer,
                },
                {
                  type: "mrkdwn",
                  text: "*CHECKOUT STATUS*",
                },
                {
                  type: "plain_text",
                  text: checkoutSession
                    ? "ACTIVE"
                    : `SKIPPED - Customer has ${
                        (validFormOfPayment as Array<any>)?.length || "0"
                      } Valid Payment Sources`,
                },
              ],
            },
          ],
        },
      });
      return {
        ...session,
        requestedDateTime,
        checkoutSession: checkoutSession ? checkoutSession?.url : null,
        step: checkoutSession
          ? ("datetime-selection" as Booking["step"])
          : "success",
        id,
        client: {
          uid: session?.client?.uid,
          requiresInfo: session?.client?.requiresInfo,
        },
      };
    } else
      return await handleFailedBooking(
        { id, requestedDateTime },
        "FAILED TO GET SESSION"
      );
  } else
    return await handleFailedBooking(
      { id, requestedDateTime },
      "FAILED TO HANDLE LOCATION"
    );
};
