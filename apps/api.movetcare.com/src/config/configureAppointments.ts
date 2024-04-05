import { DEBUG, throwError } from "./config";
import type { Appointment } from "../types/appointment";
import { getProVetIdFromUrl } from "../utils/getProVetIdFromUrl";
import { fetchEntity } from "../integrations/provet/entities/fetchEntity";
import { saveAppointment } from "../integrations/provet/entities/appointment/saveAppointment";

export const configureAppointments = async (): Promise<boolean> => {
  // const alreadyHasConfiguration = await admin
  //   .firestore()
  //   .collection("appointments")
  //   .limit(1)
  //   .get()
  //   .then((documents: any) => documents.size);

  // if (alreadyHasConfiguration === 1) {
  //   console.log(
  //     "appointments/ COLLECTION DETECTED - SKIPPING APPOINTMENTS CONFIGURATION..."
  //   );
  //   console.log(
  //     "DELETE THE configuration/ COLLECTION AND RESTART TO REFRESH THE APPOINTMENTS CONFIGURATION"
  //   );
  //   return true;
  // } else {
  console.log("STARTING APPOINTMENTS CONFIGURATION");
  const appointments: Array<Appointment> = await fetchEntity("appointment");
  if (appointments) {
    const didSaveAppointments: boolean = await saveAppointments(appointments);
    return didSaveAppointments;
  } else return throwError("Failed to Process Appointments");
  //  }
};

const saveAppointments = async (
  appointments: Array<Appointment>,
): Promise<boolean> => {
  let appointmentsConfigured = 0;
  return await Promise.all(
    appointments.map(async (appointment: Appointment) => {
      if (
        appointment.active === 1 &&
        (new Date() <= new Date(appointment?.start) ||
          getProVetIdFromUrl(String(appointment?.client)) === 6008 ||
          getProVetIdFromUrl(String(appointment?.client)) === 5769)
      )
        await saveAppointment(appointment)
          .then(() => {
            appointmentsConfigured++;
          })
          .catch((error: any) => throwError(error));
    }),
  )
    .then(async () => {
      if (DEBUG) console.log(`SUCCESSFULLY UPDATED ${appointmentsConfigured}`);
      return true;
    })
    .catch((error: any) => throwError(error));
};
