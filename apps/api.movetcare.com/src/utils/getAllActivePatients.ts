import { admin, throwError } from "../config/config";
import type { BookingError, PatientBookingData } from "../types/booking";
import { handleFailedBooking } from "../booking/session/handleFailedBooking";
const DEBUG = false;
export const getAllActivePatients = async (
  uid: string
): Promise<BookingError | Array<PatientBookingData>> =>
  await admin
    .firestore()
    .collection("patients")
    .where("client", "==", parseInt(uid))
    .get()
    .then((patients: any) => {
      const patientsArray: Array<PatientBookingData> = [];
      patients.forEach((patient: { data(): PatientBookingData; id: string }) =>
        !patient.data().archived
          ? patientsArray.push({
              id: patient.id,
              name: patient.data().name,
              species: patient.data().species,
              birthday: patient.data().birthday,
              breed: patient.data().breed,
              vcprRequired: getCustomFieldValue(
                "VCPR Required",
                patient.data()?.customFields || null
              ) as boolean,
              aggressionStatus: getCustomFieldValue(
                "Is Aggressive",
                patient.data()?.customFields || null
              ) as boolean,
              previousVet: getCustomFieldValue(
                "Previous Vet",
                patient.data()?.customFields || null
              ),
              clientNote: getCustomFieldValue(
                "Client Note",
                patient.data()?.customFields || null
              ),
              photo: getCustomFieldValue(
                "Patient Photo",
                patient.data()?.customFields || null
              ),
              rabiesTag: getCustomFieldValue(
                "Rabies Tag",
                patient.data()?.customFields || null
              ),
              gender: patient.data().gender,
            } as PatientBookingData)
          : null
      );
      if (DEBUG) console.log("patientsArray", patientsArray);
      return patientsArray;
    })
    .catch(async (error: any) => {
      throwError(error);
      return await handleFailedBooking(error, "GET PATIENTS FAILED");
    });

const getCustomFieldValue = (
  customFieldLabel: string,
  customFieldValues: Array<{
    field_id: number;
    id: number;
    label: string;
    value: string;
  }> | null
): boolean | string | null => {
  let customFieldValue = null;
  if (customFieldValues)
    customFieldValues.forEach(
      ({ label, value }: { label: string; value: string }) => {
        if (
          (label.toLowerCase().includes("aggressive") &&
            customFieldLabel.toLowerCase().includes("aggressive")) ||
          (label.toLowerCase().includes("vcpr") &&
            customFieldLabel.toLowerCase().includes("vcpr"))
        )
          customFieldValue = getBooleanValue(value);
        else if (
          (label.toLowerCase().includes("note") &&
            customFieldLabel.toLowerCase().includes("note")) ||
          (label.toLowerCase().includes("photo") &&
            customFieldLabel.toLowerCase().includes("photo")) ||
          (label.toLowerCase().includes("vet") &&
            customFieldLabel.toLowerCase().includes("vet")) ||
          (label.toLowerCase().includes("rabies") &&
            customFieldLabel.toLowerCase().includes("rabies"))
        )
          customFieldValue = value;
      }
    );
  return customFieldValue;
};

const getBooleanValue = (value: string) =>
  value === "True" || value === "true"
    ? true
    : value === "False" || value === "false"
    ? false
    : value;
