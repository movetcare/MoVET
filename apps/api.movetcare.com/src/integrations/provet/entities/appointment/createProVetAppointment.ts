import {
  request,
  throwError,
  proVetApiUrl,
  DEBUG,
} from "../../../../config/config";
import type { Appointment } from "../../../../types/appointment";
import { createVirtualAppointment } from "./createVirtualAppointment";
import { saveAppointment } from "./saveAppointment";
export const createProVetAppointment = async (
  proVetData: Appointment,
  movetData: any
): Promise<boolean | string> => {
  if (DEBUG)
    console.log("createProVetAppointment -> ", { proVetData, movetData });
  if (incomingDataIsValid(proVetData)) {
    const {
      client,
      start,
      end,
      title,
      complaint,
      duration,
      notes,
      patients,
      user,
    } = proVetData;
    if (DEBUG)
      console.log("API REQUEST PAYLOAD ->", {
        client: `${proVetApiUrl}/client/${client}/`,
        user: `${proVetApiUrl}/user/${user}/`,
        start,
        end,
        title,
        complaint,
        duration,
        notes,
        active: 1,
        type: 2,
        patients: patients.map(
          (patient: any) => `${proVetApiUrl}/patient/${patient}/`
        ),
        department: `${proVetApiUrl}/department/${
          2
          // environment?.type === 'production' ? '2' : '1'
        }/`,
      });
    const appointmentData = await request
      .post("/appointment/", {
        client: `${proVetApiUrl}/client/${client}/`, // Required by PROVET API
        user: `${proVetApiUrl}/user/${user}/`, // Required by PROVET API
        start, // Required by PROVET API
        end, // Required by PROVET API
        title, // Required by PROVET API
        complaint, // Required by PROVET API
        // reason: complaint,
        duration,
        notes,
        active: 1,
        type: 2,
        patients: patients.map(
          (patient: any) => `${proVetApiUrl}/patient/${patient}/`
        ),
        department: `${proVetApiUrl}/department/${
          2
          // environment?.type === 'production' ? '2' : '1'
        }/`,
      })
      .then(async (response: any) => {
        const { data } = response;
        if (DEBUG) console.log("API Response: POST /appointment/ => ", data);
        return data;
      })
      .catch((error: any) => {
        if (DEBUG)
          console.log(
            "error?.response?.data?.non_field_errors",
            error?.response?.data?.non_field_errors
          );
        if (
          error?.response?.data?.non_field_errors[0]?.includes(
            "already an appointment for this time slot"
          )
        )
          return "ALREADY_BOOKED";
        else return throwError(error);
      });
    if (DEBUG) console.log("appointmentData", appointmentData);
    if (appointmentData !== "ALREADY_BOOKED") {
      if (movetData?.locationType === "Virtually") {
        if (DEBUG) console.log("VIRTUAL APPOINTMENT DETECTED");
        const virtualAppointmentUrl = await createVirtualAppointment(
          appointmentData?.id,
          start,
          end,
          appointmentData?.request_hash
        );
        if (virtualAppointmentUrl === false) {
          if (DEBUG)
            console.log("FAILED TO CREATE VIRTUAL APPOINTMENT", {
              id: appointmentData?.id,
              start,
              end,
              request_hash: appointmentData?.request_hash,
            });
          return await saveAppointment(appointmentData, movetData);
        } else if (
          await saveAppointment(
            { ...appointmentData, telemedicine_url: virtualAppointmentUrl },
            movetData
          )
        ) {
          return virtualAppointmentUrl;
        } else return false;
      }
      return await saveAppointment(appointmentData, movetData);
    } else {
      console.log("RETURNING", appointmentData);
      return appointmentData;
    }
  } else return false;
};

const incomingDataIsValid = (data: Appointment): boolean => {
  if (
    !(typeof data?.client === "string") ||
    data?.client.length === 0 ||
    !(typeof data?.start === "string") ||
    data?.start.length === 0 ||
    !(typeof data?.user === "string") ||
    data?.user.length === 0 ||
    !(typeof data?.end === "string") ||
    data?.end.length === 0 ||
    !(typeof data?.title === "string") ||
    data?.title.length === 0 ||
    !(typeof data?.complaint === "string") ||
    data?.complaint.length === 0 ||
    !(typeof data?.notes === "string") ||
    data?.notes.length === 0 ||
    !(typeof data?.patients === null) ||
    data?.patients.length === 0 ||
    !(typeof data?.duration === "number")
  )
    return true;
  else return throwError({ message: "INVALID_PAYLOAD" });
};
