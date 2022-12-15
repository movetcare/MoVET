import { admin, DEBUG, throwError } from "../../config/config";
import type { BookingError, PatientData } from "../../types/booking";
import { handleFailedBooking } from "./handleFailedBooking";

export const getAllActivePatients = async (
  uid: string
): Promise<BookingError | Array<PatientData>> =>
  await admin
    .firestore()
    .collection("patients")
    .where("client", "==", parseInt(uid))
    .get()
    .then((patients: any) => {
      const patientsArray: Array<PatientData> = [];
      patients.forEach((patient: { data(): PatientData; id: string }) =>
        !patient.data().archived
          ? patientsArray.push({
              id: patient.id,
              name: patient.data().name,
              species: patient.data().species,
              vcprRequired: patient.data().vcprRequired,
              gender: patient.data().gender,
            } as PatientData)
          : null
      );
      if (DEBUG) console.log("patientsArray", patientsArray);
      return patientsArray;
    })
    .catch(async (error: any) => {
      throwError(error);
      return await handleFailedBooking(error, "GET PATIENTS FAILED");
    });
