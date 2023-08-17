import { admin, environment, stripe, throwError } from "../../config/config";
import { createProVetAppointment } from "../../integrations/provet/entities/appointment/createProVetAppointment";
import { sendNotification } from "../../notifications/sendNotification";
import type { BookingError, Booking } from "../../types/booking";
import { getCustomerId } from "../../utils/getCustomerId";
import { verifyValidPaymentSource } from "../../utils/verifyValidPaymentSource";
import { handleFailedBooking } from "./handleFailedBooking";
const DEBUG = true;
export const processDateTime = async (
  id: string,
  requestedDateTime: { resource: number; date: string; time: string },
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
      const scheduleAppointment = async () => {
        if (DEBUG)
          console.log("Appointment Data to Format", {
            client: session?.client?.uid,
            time: requestedDateTime?.time,
            date: requestedDateTime?.date,
            resource: requestedDateTime?.resource,
            locationType: session?.location,
            address: session?.address?.full,
            patients: session?.patients,
            patientSelection: session?.selectedPatients,
            establishCareExamRequired: session?.establishCareExamRequired,
            totalPatients: session?.selectedPatients?.length,
          });
        const { proVetData, movetData }: any = await formatAppointmentData({
          client: session?.client?.uid,
          time: requestedDateTime?.time,
          date: requestedDateTime?.date,
          resource: requestedDateTime?.resource,
          locationType: session?.location,
          address: session?.address?.full,
          patients: session?.patients,
          patientSelection: session?.selectedPatients,
          establishCareExamRequired: session?.establishCareExamRequired,
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
          needsRetry: !appointmentIsScheduled,
          step: checkoutSession
            ? ("datetime-selection" as Booking["step"])
            : appointmentIsScheduled
            ? "success"
            : "datetime-selection",
        })
        .then(() => DEBUG && console.log("DID UPDATE BOOKING"))
        .catch(async (error: any) => {
          throwError(error);
          return await handleFailedBooking(error, "UPDATE BOOKING DATA FAILED");
        });
      return {
        ...session,
        requestedDateTime,
        checkoutSession: checkoutSession ? checkoutSession?.url : null,
        step: checkoutSession
          ? ("datetime-selection" as Booking["step"])
          : appointmentIsScheduled
          ? "success"
          : "datetime-selection",
        id,
        needsRetry: !appointmentIsScheduled,
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

const formatToProVetTimestamp = (date: Date) => {
  const tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = (num: number) => {
      const norm = Math.floor(Math.abs(num));
      return (norm < 10 ? "0" : "") + norm;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ":" +
    pad(tzo % 60)
  );
};

const formatAppointmentData = async (appointment: any) => {
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
    appointment?.locationType === "Housecall"
      ? `Appointment Location: ${appointment?.locationType} - ${appointment?.address}`
      : appointment?.locationType === "Virtual"
      ? "Virtual Telehealth Consultation"
      : "*";

  appointment?.patients?.forEach((patient: any) => {
    appointment?.patientSelection?.forEach((selectedPatient: any) => {
      if (DEBUG) {
        console.log("patient?.id ", patient?.id);
        console.log("selectedPatient?.id ", selectedPatient);
        console.log("patient?.illnessDetails ", patient?.illnessDetails);
      }
      if (patient?.id === selectedPatient && patient?.illnessDetails) {
        // complaintObject.push({
        //   patient: patient?.name,
        //   symptom: JSON.stringify(patient?.illnessDetails?.symptoms),
        //   notes: patient?.illnessDetails?.notes,
        // });
        notes += ` Patient: ${patient?.name} - Symptom(s): ${JSON.stringify(
          patient?.illnessDetails?.symptoms,
        )} - Details: ${JSON.stringify(patient?.illnessDetails?.notes)} |`;
      }
    });
  });
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

  const complaint =
    // complaintObject.length > 0
    //   ? JSON.stringify(complaintObject).length > 255
    //     ? "Unknown - Too Many Patients"
    //     : JSON.stringify(complaintObject) :
    appointment?.establishCareExamRequired
      ? appointment?.locationType === "Housecall"
        ? defaultBookingReasons?.housecallStandardVcprReason?.label
        : appointment?.locationType === "Clinic"
        ? defaultBookingReasons?.clinicStandardVcprReason?.label
        : defaultBookingReasons?.virtualStandardVcprReason?.label
      : "No Symptoms of Illness"; // TODO:// get reason name from list of reasons

  return {
    proVetData: {
      client: appointment?.client,
      user:
        appointment?.locationType === "Clinic"
          ? 7
          : appointment?.locationType === "Housecall"
          ? 8
          : 9,
      title: `${
        appointment?.locationType === "Housecall"
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
      reason: appointment?.establishCareExamRequired
        ? appointment?.locationType === "Housecall"
          ? defaultBookingReasons?.housecallStandardVcprReason?.value
          : appointment?.locationType === "Clinic"
          ? defaultBookingReasons?.clinicStandardVcprReason?.value
          : defaultBookingReasons?.virtualStandardVcprReason?.value
        : null,
      resources: [appointment?.resource],
      notes,
      patients: appointment.patientSelection,
      duration,
    },
    movetData: {
      locationType: appointment?.locationType,
      address: appointment?.address,
      patients: appointment.patientSelection,
    },
  };
};
