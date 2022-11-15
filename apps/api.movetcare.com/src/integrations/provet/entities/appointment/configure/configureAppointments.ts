import {admin, DEBUG, throwError} from "../../../../../config/config";
import type { Appointment } from "../../../../../types/appointment";
import { fetchEntity } from "../../fetchEntity";
import { saveAppointment } from "../saveAppointment";

export const configureAppointments = async (): Promise<boolean> => {
  const alreadyHasConfiguration = await admin
    .firestore()
    .collection("appointments")
    .limit(1)
    .get()
    .then((documents: any) => documents.size);

  if (alreadyHasConfiguration === 1) {
    console.log(
      "appointments/ COLLECTION DETECTED - SKIPPING APPOINTMENTS CONFIGURATION..."
    );
    console.log(
      "DELETE THE configuration/ COLLECTION AND RESTART TO REFRESH THE APPOINTMENTS CONFIGURATION"
    );
    return true;
  } else {
    console.log("STARTING APPOINTMENTS CONFIGURATION");
    const appointments: Array<Appointment> = await fetchEntity("appointment");
    if (appointments) {
      const didSaveAppointments: boolean = await saveAppointments(appointments);
      return didSaveAppointments;
    } else return throwError("Failed to Process Appointments");
  }
};

const saveAppointments = async (
  appointments: Array<Appointment>
): Promise<boolean> => {
  let appointmentsConfigured = 0;
  return await Promise.all(
    appointments.map(async (appointment: Appointment) => {
      if (new Date(appointment?.start) >= new Date()) {
        await saveAppointment(appointment)
          .then(() => {
            appointmentsConfigured++;
          })
          .catch((error: any) => throwError(error));
      }
    })
  )
    .then(async () => {
      if (DEBUG) console.log(`SUCCESSFULLY UPDATED ${appointmentsConfigured}`);
      return true;
    })
    .catch((error: any) => throwError(error));
};
