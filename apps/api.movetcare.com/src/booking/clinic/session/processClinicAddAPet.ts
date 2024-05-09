import { admin, throwError, DEBUG } from "../../../config/config";
import { createProVetPatient } from "../../../integrations/provet/entities/patient/createProVetPatient";
import { updateCustomField } from "../../../integrations/provet/entities/patient/updateCustomField";
import { sendNotification } from "../../../notifications/sendNotification";
import type {
  BookingError,
  AddAPet,
  ClinicBooking,
  PatientBookingData,
} from "../../../types/booking";
import { reverseDateStringMDY } from "../../../utils/reverseDateStringMDY";
import { getAllActivePatients } from "../../../utils/getAllActivePatients";
import { handleFailedBooking } from "../../session/handleFailedBooking";

export const processClinicAddAPet = async (
  id: string,
  {
    name,
    type,
    gender,
    spayedOrNeutered,
    aggressionStatus,
    breed,
    birthday,
    weight,
    vet,
    notes,
  }: AddAPet,
): Promise<ClinicBooking | BookingError> => {
  const data = {
    name,
    type,
    gender,
    spayedOrNeutered,
    aggressionStatus,
    breed,
    birthday,
    weight,
    vet,
    notes,
  };
  if (DEBUG) console.log("ADD A PET DATA", data);
  if (
    name &&
    type &&
    gender &&
    (spayedOrNeutered === true || spayedOrNeutered === false) &&
    aggressionStatus &&
    breed &&
    birthday &&
    weight
  ) {
    const bookingRef = admin.firestore().collection("clinic_bookings").doc(id);
    await bookingRef
      .set(
        {
          addAPet: {
            ...data,
          } as AddAPet,
          step: "add-a-pet" as ClinicBooking["step"],
          updatedOn: new Date(),
        },
        { merge: true },
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "UPDATE ADD A PET FAILED");
      });
    const session = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "GET BOOKING DATA FAILED");
      });

    const newPatientId = await createProVetPatient({
      client: session?.client?.uid,
      name: session?.addAPet?.name,
      species: session?.addAPet?.type,
      gender: session?.addAPet?.gender,
      breed: session?.addAPet?.breed?.value,
      birthday: reverseDateStringMDY(session?.addAPet?.birthday),
      weight: session?.addAPet?.weight,
      notes: `${
        session?.addAPet?.aggressionStatus?.name
          ? `${
              session?.addAPet?.aggressionStatus?.name.includes(
                "no history of aggression",
              )
                ? ""
                : "BE CAREFUL - PATIENT IS AGGRESSIVE!"
            }\n\n`
          : ""
      }`,
      vcprRequired: true,
      spayedOrNeutered: session?.addAPet?.spayedOrNeutered,
    });
    if (newPatientId) {
      if (session?.addAPet?.aggressionStatus?.name)
        updateCustomField(
          newPatientId,
          4,
          session?.addAPet?.aggressionStatus?.name.includes(
            "no history of aggression",
          )
            ? "False"
            : "True",
        );
      if (session?.addAPet?.notes)
        updateCustomField(newPatientId, 6, session?.addAPet?.notes);
      if (session?.addAPet?.vet?.label)
        updateCustomField(
          newPatientId,
          5,
          `${session?.addAPet?.vet?.label}${
            session?.addAPet?.vet?.value?.place_id
              ? ` - https://www.google.com/maps/place/?q=place_id:${session?.addAPet?.vet?.value?.place_id}`
              : ""
          }`,
        );
      const patients: Array<PatientBookingData> | BookingError | any =
        await getAllActivePatients(session?.client?.uid);
      if (patients) {
        await bookingRef
          .set(
            {
              patients,
              updatedOn: new Date(),
            },
            { merge: true },
          )
          .catch(async (error: any) => {
            throwError(error);
            return await handleFailedBooking(error, "UPDATE PATIENTS FAILED");
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
                    text: "ADD A PET",
                  },
                  {
                    type: "mrkdwn",
                    text: "*NAME*",
                  },
                  {
                    type: "plain_text",
                    text: name,
                  },
                  {
                    type: "mrkdwn",
                    text: "*SPECIES*",
                  },
                  {
                    type: "plain_text",
                    text: type === "dog" ? ":dog:" : ":cat:",
                  },
                  {
                    type: "mrkdwn",
                    text: "*IS AGGRESSIVE?*",
                  },
                  {
                    type: "plain_text",
                    text: session?.addAPet?.aggressionStatus?.name.includes(
                      "no history of aggression",
                    )
                      ? "No"
                      : "Yes",
                  },
                ],
              },
            ],
          },
        });
        return {
          patients,
          id,
          step: "pet-selection",
          vcprRequired: null,
          schedule: null,
          selectedPatients: null,
          requestedDateTime: null,
          clinic: session.clinic,
          client: {
            uid: session?.client?.uid,
            requiresInfo: session?.client?.requiresInfo,
          },
        } as any;
      }
      return await handleFailedBooking(data, "FAILED TO GET PATIENTS");
    } else return await handleFailedBooking(data, "FAILED TO CREATE NEW PET");
  } else return await handleFailedBooking(data, "FAILED TO HANDLE ADD A PET");
};
