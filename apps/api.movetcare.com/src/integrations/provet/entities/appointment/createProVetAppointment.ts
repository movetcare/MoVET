import { request, throwError, proVetApiUrl } from "../../../../config/config";
import type { Appointment } from "../../../../types/appointment";
import { createVirtualAppointment } from "./createVirtualAppointment";
import { saveAppointment } from "./saveAppointment";
const DEBUG = true;
export const createProVetAppointment = async (
  proVetData: Appointment,
  movetData: any,
): Promise<boolean | string> => {
  if (DEBUG)
    console.log("createProVetAppointment -> ", { proVetData, movetData });
  const {
    client,
    start,
    end,
    title,
    complaint,
    reason,
    duration,
    notes,
    patients,
    user,
    resources,
  } = proVetData;
  if (DEBUG)
    console.log(
      "API REQUEST PAYLOAD ->",
      reason !== null && reason !== undefined
        ? {
            client: `${proVetApiUrl}/client/${client}/`,
            start, // Required by PROVET API
            end, // Required by PROVET API
            title, // Required by PROVET API
            complaint: complaint?.substring(0, 254),
            reason: `${proVetApiUrl}/reason/${reason}/`,
            resources: resources?.map(
              (resource: any) => `${proVetApiUrl}/resource/${resource}/`,
            ),
            duration,
            notes,
            active: 1,
            type: 2, // Required by PROVET API
            patients: patients?.map(
              (patient: any) => `${proVetApiUrl}/patient/${patient}/`,
            ),
            department: `${proVetApiUrl}/department/${
              2
              // environment?.type === 'production' ? '2' : '1'
            }/`, // Required by PROVET API
          }
        : {
            client: `${proVetApiUrl}/client/${client}/`,
            user: `${proVetApiUrl}/user/${user}/`,
            start, // Required by PROVET API
            end, // Required by PROVET API
            title, // Required by PROVET API
            complaint: complaint?.substring(0, 254),
            duration,
            notes,
            active: 1,
            type: 2, // Required by PROVET API
            patients: patients?.map(
              (patient: any) => `${proVetApiUrl}/patient/${patient}/`,
            ),
            department: `${proVetApiUrl}/department/${
              2
              // environment?.type === 'production' ? '2' : '1'
            }/`, // Required by PROVET API
          },
    );
  const appointmentData = await request
    .post(
      "/appointment/",
      reason !== null && reason !== undefined
        ? {
            client: `${proVetApiUrl}/client/${client}/`,
            //user: `${proVetApiUrl}/user/${user}/`,
            start, // Required by PROVET API
            end, // Required by PROVET API
            title, // Required by PROVET API
            complaint: complaint?.substring(0, 254),
            reason: `${proVetApiUrl}/reason/${reason}/`,
            resources: resources?.map(
              (resource: any) => `${proVetApiUrl}/resource/${resource}/`,
            ),
            duration,
            notes,
            active: 1,
            type: 2, // Required by PROVET API
            patients: patients?.map(
              (patient: any) => `${proVetApiUrl}/patient/${patient}/`,
            ),
            department: `${proVetApiUrl}/department/${
              2
              // environment?.type === 'production' ? '2' : '1'
            }/`, // Required by PROVET API
          }
        : {
            client: `${proVetApiUrl}/client/${client}/`,
            user: `${proVetApiUrl}/user/${user}/`,
            start, // Required by PROVET API
            end, // Required by PROVET API
            title, // Required by PROVET API
            complaint: complaint?.substring(0, 254),
            duration,
            notes,
            active: 1,
            type: 2, // Required by PROVET API
            patients: patients?.map(
              (patient: any) => `${proVetApiUrl}/patient/${patient}/`,
            ),
            department: `${proVetApiUrl}/department/${
              2
              // environment?.type === 'production' ? '2' : '1'
            }/`, // Required by PROVET API
          },
    )
    .then(async (response: any) => {
      const { data } = response;
      if (DEBUG) console.log("API Response: POST /appointment/ => ", data);
      return data;
    })
    .catch((error: any) => {
      if (DEBUG) {
        console.log(
          "API Response ERROR: POST /appointment/ => ",
          JSON.stringify(error?.response?.data),
        );
        console.log(
          "error?.response?.data?.non_field_errors",
          error?.response?.data?.non_field_errors,
        );
      }
      if (
        error?.response?.data?.non_field_errors[0]?.includes(
          "already an appointment for this time slot",
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
        appointmentData?.request_hash,
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
          movetData,
        )
      ) {
        return virtualAppointmentUrl;
      } else return false;
    }
    return await saveAppointment(appointmentData, movetData);
  } else {
    if (DEBUG) console.log("RETURNING", appointmentData);
    return appointmentData;
  }
};
