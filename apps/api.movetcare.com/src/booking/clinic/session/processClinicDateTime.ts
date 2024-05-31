import { admin, throwError, environment, stripe } from "../../../config/config";
import { createProVetAppointment } from "../../../integrations/provet/entities/appointment/createProVetAppointment";
import { sendNotification } from "../../../notifications/sendNotification";
import type { ClinicBooking, BookingError } from "../../../types/booking";
import { formatToProVetTimestamp } from "../../../utils/formatToProVetTimestamp";
import { getCustomerId } from "../../../utils/getCustomerId";
import { verifyValidPaymentSource } from "../../../utils/verifyValidPaymentSource";
import { handleFailedBooking } from "../../session/handleFailedBooking";

const DEBUG = false;

export const processClinicDateTime = async (
  id: ClinicBooking["id"],
  requestedDateTime: ClinicBooking["requestedDateTime"],
): Promise<ClinicBooking | BookingError> => {
  if (DEBUG) console.log("DATE TIME DATA", requestedDateTime);
  if (requestedDateTime && id) {
    const bookingRef = admin.firestore().collection("clinic_bookings").doc(id);
    await bookingRef
      .set(
        {
          requestedDateTime,
          step: "datetime-selection",
          updatedOn: new Date(),
        },
        { merge: true },
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "UPDATE BOOKING DATA FAILED");
      });
    const session = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "GET BOOKING DATA FAILED");
      });
    const paymentMethodIsRequired = true;
    const customer: string = await getCustomerId(session?.client?.uid);
    let validFormOfPayment = null,
      checkoutSession = null;
    if (DEBUG) console.log("customer", customer);
    if (paymentMethodIsRequired) {
      validFormOfPayment = await verifyValidPaymentSource(
        session?.client?.uid,
        customer,
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
                "/booking-clinic/success",
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
    }
    if (session && customer) {
      const scheduleAppointment = async () => {
        if (DEBUG)
          console.log("Appointment Data to Format", {
            client: session?.client?.uid,
            time: requestedDateTime?.time,
            date: requestedDateTime?.date,
            resource: requestedDateTime?.resource,
            additionalNotes: requestedDateTime?.notes,
            sessionId: id,
            patients: session?.patients,
            patientSelection: session?.selectedPatients,
            totalPatients: session?.selectedPatients?.length,
            clinic: session?.clinic,
          });
        const { proVetData, movetData }: any = await formatAppointmentData({
          client: session?.client?.uid,
          time: requestedDateTime?.time,
          date: requestedDateTime?.date,
          resource: requestedDateTime?.resource,
          additionalNotes: requestedDateTime?.notes,
          sessionId: id,
          patients: session?.patients,
          patientSelection: session?.selectedPatients,
          totalPatients: session?.selectedPatients?.length,
          clinic: session?.clinic,
        });
        if (DEBUG)
          console.log("formatAppointmentData => { proVetData, movetData }", {
            proVetData,
            movetData,
          });
        return await createProVetAppointment(proVetData, movetData);
      };
      const appointmentIsScheduled = await scheduleAppointment();
      if (DEBUG) console.log("appointmentIsScheduled", appointmentIsScheduled);
      await bookingRef
        .update({
          needsRetry:
            appointmentIsScheduled === false ||
            appointmentIsScheduled === "ALREADY_BOOKED"
              ? true
              : false,
          step: checkoutSession
            ? ("datetime-selection" as ClinicBooking["step"])
            : appointmentIsScheduled === false ||
                appointmentIsScheduled === "ALREADY_BOOKED"
              ? "datetime-selection"
              : "success",
        })
        .then(() => DEBUG && console.log("DID UPDATE BOOKING"), {
          needsRetry:
            appointmentIsScheduled === false ||
            appointmentIsScheduled === "ALREADY_BOOKED"
              ? true
              : false,
          step: checkoutSession
            ? ("datetime-selection" as ClinicBooking["step"])
            : appointmentIsScheduled === false ||
                appointmentIsScheduled === "ALREADY_BOOKED"
              ? "datetime-selection"
              : "success",
        })
        .catch(async (error: any) => {
          throwError(error);
          return await handleFailedBooking(error, "UPDATE BOOKING DATA FAILED");
        });
      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: `:book: _Clinic Booking_ *UPDATED* (${id})`,
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
                  text: "*DATE & TIME*",
                },
                {
                  type: "plain_text",
                  text: requestedDateTime?.notes
                    ? requestedDateTime?.date + " @ " + requestedDateTime?.time
                    : requestedDateTime?.date +
                      " @ " +
                      requestedDateTime?.time +
                      " - " +
                      requestedDateTime?.notes,
                },
                {
                  type: "mrkdwn",
                  text: "*PROVET APPOINTMENT STATUS*",
                },
                {
                  type: "plain_text",
                  text: appointmentIsScheduled?.toString(),
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
        needsRetry:
          appointmentIsScheduled === false ||
          appointmentIsScheduled === "ALREADY_BOOKED"
            ? true
            : false,
        step: checkoutSession
          ? ("datetime-selection" as ClinicBooking["step"])
          : appointmentIsScheduled === false ||
              appointmentIsScheduled === "ALREADY_BOOKED"
            ? "datetime-selection"
            : "success",
        id,
        clinic: session?.clinic,
        client: {
          uid: session?.client?.uid,
          requiresInfo: session?.client?.requiresInfo,
        },
      };
    } else
      return await handleFailedBooking(
        { id, requestedDateTime },
        "FAILED TO GET SESSION",
      );
  } else
    return await handleFailedBooking(
      { id, requestedDateTime },
      "FAILED TO HANDLE LOCATION",
    );
};

const convertTime12to24 = (time12h: string): string => {
  const [time, modifier] = time12h.split(" ");
  if (DEBUG) {
    console.log("time", time);
    console.log("modifier", modifier);
  }
  const fixedTime = time?.toString()?.length === 3 ? `0${time}` : `${time}`;
  const [hours, minutes, seconds] = fixedTime.split(":");
  let finalHours: any = hours; //String(Number(hours) + 6);

  if (DEBUG) {
    console.log("finalHours START", finalHours);
    console.log("hours", hours);
    console.log("minutes", minutes);
    console.log("seconds", seconds);
  }

  if (hours === "12" && modifier == "AM") finalHours = "00";
  else if (modifier === "PM" && hours !== "12")
    finalHours = parseInt(hours, 10) + 12;
  if (finalHours.length === 1) finalHours = "0" + finalHours;
  if (DEBUG) {
    console.log("finalHours END", finalHours);
    console.log(
      "result",
      `${finalHours}:${minutes}:${seconds ? seconds : "00"}`,
    );
  }
  return `${finalHours}:${minutes}:${seconds ? seconds : "00"}`;
};

const formatAppointmentData = async (appointment: any) => {
  if (DEBUG) console.log("appointment", appointment);
  const time = appointment?.time.split("-");
  const date = appointment.date.substring(0, appointment.date.indexOf("T"));
  if (DEBUG) {
    console.log(
      "date + T + convertTime12to24(time[0].trim())",
      date + "T" + convertTime12to24(time[0].trim()),
    );
    console.log(
      "date + T + convertTime12to24(time[1].trim())",
      date + "T" + convertTime12to24(time[1].trim()),
    );
  }
  const start = new Date(date + "T" + convertTime12to24(time[0].trim()));
  const end = new Date(date + "T" + convertTime12to24(time[1].trim()));
  const duration = end.valueOf() - start.valueOf();
  if (DEBUG) {
    console.log("TIME", time);
    console.log("START", start);
    console.log("END", end);
    console.log("DURATION", duration);
  }
  let notes = "*";
  if (appointment?.additionalNotes)
    notes += ` | Client Notes / Promo: ${appointment?.additionalNotes?.substring(
      0,
      240,
    )}`;

  notes += ` | Clinic Booking Session ID: ${appointment?.sessionId}`;
  let configReason = null;
  await admin
    .firestore()
    .collection("configuration")
    .doc("pop_up_clinics")
    .get()
    .then(async (doc: any) => {
      if (doc.data()?.popUpClinics) {
        doc.data()?.popUpClinics.forEach((config: any) => {
          if (config?.id === appointment?.clinic?.id)
            configReason = config?.reason;
        });
      } else
        await handleFailedBooking(
          "UNABLE TO LOCATE CLINIC CONFIG REASON",
          "GET DEFAULT CONFIG REASON FAILED",
        );
    })
    .catch(async (error: any) => {
      throwError(error);
      await handleFailedBooking(error, "GET DEFAULT CONFIG REASON FAILED");
    });
  if (DEBUG) console.log("configReason", configReason);
  const reason = await admin
    .firestore()
    .collection("reasons")
    .where("name", "==", configReason)
    .limit(1)
    .get()
    .then((snapshot: any) => {
      let id = null;
      snapshot.forEach(async (doc: any) => {
        id = doc.data()?.id;
      });
      return id;
    })
    .catch(async (error: any) => {
      throwError(error);
      await handleFailedBooking(error, "GET REASONS FAILED");
    });
  if (DEBUG) console.log("reason", reason);
  if (DEBUG)
    console.log("appointment RETURN", {
      proVetData: {
        client: appointment?.client,
        title: `${appointment?.clinic?.name} Appointment (${
          appointment.totalPatients === 1
            ? "1 Patient"
            : appointment.totalPatients + " Patients"
        })`,
        start: formatToProVetTimestamp(start),
        end: formatToProVetTimestamp(end),
        complaint: configReason,
        resources: [appointment?.resource],
        reason,
        notes,
        patients: appointment.patientSelection,
        duration,
      },
      movetData: {
        patients: appointment.patientSelection,
      },
    });
  return {
    proVetData: {
      client: appointment?.client,
      title: `${appointment?.clinic?.name} Appointment (${
        appointment.totalPatients === 1
          ? "1 Patient"
          : appointment.totalPatients + " Patients"
      })`,
      start: formatToProVetTimestamp(start),
      end: formatToProVetTimestamp(end),
      complaint: configReason,
      resources: [appointment?.resource],
      reason,
      notes,
      patients: appointment.patientSelection,
      duration,
    },
    movetData: {
      patients: appointment.patientSelection,
      notes: appointment?.additionalNotes,
    },
  };
};
