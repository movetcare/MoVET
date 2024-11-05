import { admin, environment, stripe, throwError } from "../../config/config";
import { createProVetAppointment } from "../../integrations/provet/entities/appointment/createProVetAppointment";
import { sendNotification } from "../../notifications/sendNotification";
import type { BookingError, Booking } from "../../types/booking";
import { formatToProVetTimestamp } from "../../utils/formatToProVetTimestamp";
import { getCustomerId } from "../../utils/getCustomerId";
import { verifyValidPaymentSource } from "../../utils/verifyValidPaymentSource";
import { handleFailedBooking } from "./handleFailedBooking";
const DEBUG = false;
export const processDateTime = async (
  id: string,
  requestedDateTime: {
    resource: number;
    date: string;
    time: string;
    notes: string | null;
  },
): Promise<Booking | BookingError> => {
  if (DEBUG) console.log("DATE TIME DATA", requestedDateTime);
  if (requestedDateTime && id) {
    const bookingRef = admin.firestore().collection("bookings").doc(id);
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
    const paymentMethodIsRequired = await admin
      .firestore()
      .collection("configuration")
      .doc("bookings")
      .get()
      .then(
        (doc: any) => doc.data()?.requirePaymentMethodToRequestAnAppointment,
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "PAYMENT CONFIGURATION FAILED");
      });
    const customer: string = await getCustomerId(session?.client?.uid);
    let validFormOfPayment = null,
      checkoutSession = null;
    if (DEBUG) console.log("customer", customer);
    if (paymentMethodIsRequired || session.location === "Home") {
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
            reason: session?.reason?.value,
            selectedStaff: session?.selectedStaff,
            locationType: session?.location,
            address: session?.address?.full,
            addressInfo: session?.address?.info,
            patients: session?.patients,
            patientSelection: session?.selectedPatients,
            illPatientSelection: session?.illPatientSelection,
            establishCareExamRequired: session?.establishCareExamRequired,
            reestablishCareExamRequired: session.reestablishCareExamRequired,
            totalPatients: session?.selectedPatients?.length,
          });
        const { proVetData, movetData }: any = await formatAppointmentData({
          client: session?.client?.uid,
          time: requestedDateTime?.time,
          date: requestedDateTime?.date,
          resource: requestedDateTime?.resource,
          additionalNotes: requestedDateTime?.notes,
          reason: session?.reason?.value,
          sessionId: id,
          selectedStaff: session?.selectedStaff,
          locationType: session?.location,
          address: session?.address?.full,
          addressInfo: session?.address?.info,
          patients: session?.patients,
          patientSelection: session?.selectedPatients,
          illPatientSelection: session?.illPatientSelection,
          establishCareExamRequired: session?.establishCareExamRequired,
          reestablishCareExamRequired: session.reestablishCareExamRequired,
          totalPatients: session?.selectedPatients?.length,
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
            ? ("datetime-selection" as Booking["step"])
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
            ? ("datetime-selection" as Booking["step"])
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
          ? ("datetime-selection" as Booking["step"])
          : appointmentIsScheduled === false ||
              appointmentIsScheduled === "ALREADY_BOOKED"
            ? "datetime-selection"
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
  // const complaintObject: any = [];
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
  let notes =
    appointment?.locationType === "Home"
      ? `Appointment Location: ${appointment?.locationType} - ${appointment?.address} ${
          appointment?.addressInfo ? `(${appointment?.addressInfo})` : ""
        }`
      : appointment?.locationType === "Virtual"
        ? "Virtual Telehealth Consultation"
        : "*";

  let illnessDetails = "";
  appointment?.illPatientSelection?.forEach((illPatient: string) =>
    appointment?.patients?.forEach((patient: any) => {
      if (patient?.id === illPatient) {
        if (DEBUG)
          console.log(
            "ILL PATIENT NOTE",
            ` | Ill Patient: ${patient?.name} - Symptom(s): ${JSON.stringify(
              patient?.illnessDetails?.symptoms,
            )} - Details: ${JSON.stringify(patient?.illnessDetails?.notes)}`,
          );
        notes += ` | Ill Patient: ${patient?.name} - Symptom(s): ${JSON.stringify(
          patient?.illnessDetails?.symptoms,
        )} - Details: ${JSON.stringify(patient?.illnessDetails?.notes)}`;
        illnessDetails += `${patient?.name} - Symptom(s): ${JSON.stringify(
          patient?.illnessDetails?.symptoms,
        )} - Details: ${JSON.stringify(patient?.illnessDetails?.notes)} | `;
      }
    }),
  );

  if (appointment?.selectedStaff && appointment?.selectedStaff !== "NONE")
    notes += ` | Requested Staff: ${appointment?.selectedStaff?.title} ${appointment?.selectedStaff?.firstName} ${appointment?.selectedStaff?.lastName}`;

  if (appointment?.additionalNotes)
    notes += ` | Client Notes / Promo: ${appointment?.additionalNotes?.substring(
      0,
      180,
    )}`;
  notes += ` | Booking Session ID: ${appointment?.sessionId}`;
  const defaultBookingReasons = await admin
    .firestore()
    .collection("configuration")
    .doc("bookings")
    .get()
    .then((doc: any) => doc.data())
    .catch(async (error: any) => {
      throwError(error);
      return await handleFailedBooking(error, "GET DEFAULT REASONS FAILED");
    });

  const complaint = appointment?.reestablishCareExamRequired
    ? appointment?.locationType === "Home"
      ? defaultBookingReasons?.housecallRenewVcprReason?.label
      : appointment?.locationType === "Clinic"
        ? defaultBookingReasons?.clinicRenewVcprReason?.label
        : defaultBookingReasons?.virtualRenewVcprReason?.label
    : appointment?.establishCareExamRequired
      ? appointment?.locationType === "Home"
        ? defaultBookingReasons?.housecallStandardVcprReason?.label
        : appointment?.locationType === "Clinic"
          ? defaultBookingReasons?.clinicStandardVcprReason?.label
          : defaultBookingReasons?.virtualStandardVcprReason?.label
      : appointment?.reason
        ? await admin
            .firestore()
            .collection("reasons")
            .doc(`${appointment?.reason}`)
            .get()
            .then((doc: any) => doc.data()?.name || "REASON NAME NOT FOUND...")
            .catch(async (error: any) => {
              console.error(error);
              return "REASON NOT FOUND...";
            })
        : "No Symptoms of Illness";
  if (DEBUG)
    console.log("appointment RETURN", {
      proVetData: {
        client: appointment?.client,
        title: `${
          appointment?.locationType === "Home"
            ? "Housecall Appointment"
            : appointment?.locationType === "Virtual"
              ? "Virtual Telehealth Consultation"
              : "Clinic"
        } Appointment (${
          appointment.totalPatients === 1
            ? "1 Patient"
            : appointment.totalPatients + " Patients"
        })`,
        start: formatToProVetTimestamp(start),
        end: formatToProVetTimestamp(end),
        complaint,
        reason: appointment?.reestablishCareExamRequired
          ? appointment?.locationType === "Home"
            ? defaultBookingReasons?.housecallRenewVcprReason?.value
            : appointment?.locationType === "Clinic"
              ? defaultBookingReasons?.clinicRenewVcprReason?.value
              : defaultBookingReasons?.virtualRenewVcprReason?.value
          : appointment?.establishCareExamRequired
            ? appointment?.locationType === "Home"
              ? defaultBookingReasons?.housecallStandardVcprReason?.value
              : appointment?.locationType === "Clinic"
                ? defaultBookingReasons?.clinicStandardVcprReason?.value
                : defaultBookingReasons?.virtualStandardVcprReason?.value
            : appointment?.reason,
        resources: [appointment?.resource],
        notes,
        patients: appointment.patientSelection,
        duration,
      },
      movetData: {
        locationType: appointment?.locationType,
        address: appointment?.address,
        patients: appointment.patientSelection,
        status: "PENDING",
      },
    });
  console.log(
    "reason",
    appointment?.reestablishCareExamRequired
      ? appointment?.locationType === "Home"
        ? defaultBookingReasons?.housecallRenewVcprReason?.value
        : appointment?.locationType === "Clinic"
          ? defaultBookingReasons?.clinicRenewVcprReason?.value
          : defaultBookingReasons?.virtualRenewVcprReason?.value
      : appointment?.establishCareExamRequired
        ? appointment?.locationType === "Home"
          ? defaultBookingReasons?.housecallStandardVcprReason?.value
          : appointment?.locationType === "Clinic"
            ? defaultBookingReasons?.clinicStandardVcprReason?.value
            : defaultBookingReasons?.virtualStandardVcprReason?.value
        : appointment?.reason,
  );
  return {
    proVetData: {
      client: appointment?.client,
      title: `${
        appointment?.locationType === "Home"
          ? "Housecall Appointment"
          : appointment?.locationType === "Virtual"
            ? "Virtual Telehealth Consultation"
            : "Clinic"
      } Appointment (${
        appointment.totalPatients === 1
          ? "1 Patient"
          : appointment.totalPatients + " Patients"
      })`,
      start: formatToProVetTimestamp(start),
      end: formatToProVetTimestamp(end),
      complaint,
      reason: appointment?.reestablishCareExamRequired
        ? appointment?.locationType === "Home"
          ? defaultBookingReasons?.housecallRenewVcprReason?.value
          : appointment?.locationType === "Clinic"
            ? defaultBookingReasons?.clinicRenewVcprReason?.value
            : defaultBookingReasons?.virtualRenewVcprReason?.value
        : appointment?.establishCareExamRequired
          ? appointment?.locationType === "Home"
            ? defaultBookingReasons?.housecallStandardVcprReason?.value
            : appointment?.locationType === "Clinic"
              ? defaultBookingReasons?.clinicStandardVcprReason?.value
              : defaultBookingReasons?.virtualStandardVcprReason?.value
          : appointment?.reason,
      resources: [appointment?.resource],
      notes,
      patients: appointment.patientSelection,
      duration,
    },
    movetData: {
      locationType: appointment?.locationType,
      address: appointment?.address,
      patients: appointment.patientSelection,
      notes: appointment?.additionalNotes,
      illnessDetails: illnessDetails.length > 0 ? illnessDetails : null,
    },
  };
};
