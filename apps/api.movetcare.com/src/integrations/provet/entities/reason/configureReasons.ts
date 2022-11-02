import {admin, DEBUG, throwError} from "../../../../config/config";
import type { Reason } from "../../../../types/reason";
import { deleteCollection } from "../../../../utils/deleteCollection";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";

const visibleReasonsInApp = [
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 46, 47, 51, 58, 73,
  74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
];
export const configureReasons = async (): Promise<boolean> => {
  console.log("STARTING REASONS CONFIGURATION");
  await deleteCollection("reasons").then(
    () => DEBUG && console.log("DELETED ALL REASONS!")
  );
  const reasons: Array<Reason> = await fetchEntity("reason");
  if (reasons) return await saveReasonsData(reasons);
  else return await throwError("Failed to Process Reasons");
};

const saveReasonsData = async (reasons: Array<Reason>): Promise<boolean> =>
  await Promise.all(
    reasons.map(
      async (reason: any) =>
        await admin
          .firestore()
          .collection("reasons")
          .doc(`${reason?.id}`)
          .set(
            {
              isVisible: visibleReasonsInApp.includes(reason.id),
              id: reason?.id,
              name: reason?.name,
              duration: reason?.duration,
              availableOnline: reason?.available_online,
              instructions: reason?.instructions,
              availableFrom: reason?.available_from,
              availableTo: reason?.available_to,
              preventReminders: reason?.prevent_reminders,
              preventConfirmations: reason?.prevent_confirmations,
              emailMessage: reason?.email_message,
              emailConfirmationText: reason?.email_confirmation_text,
              emailReminderText: reason?.email_reminder_text,
              smsMessage: reason?.sms_message,
              smsReminderText: reason?.sms_reminder_text,
              smsConfirmationText: reason?.sms_confirmation_text,
              color: reason.color,
              archived: reason?.archived,
              telemedicine: reason?.telemedicine,
              noMessages: reason?.no_message,
              noConfirmations: reason?.no_confirmations,
              category: reason?.category,
              dataExcludedFromCommunication: {
                hideAppointmentTime:
                  reason?.data_excluded_from_communication
                    ?.hide_appointment_time,
                hideVeterinarian:
                  reason?.data_excluded_from_communication?.hide_veterinarian,
              },
              defaultClinicalNote: getProVetIdFromUrl(
                reason?.default_clinical_note
              ),
              shiftTypes: reason.shift_types.map((type: string) =>
                getProVetIdFromUrl(type)
              ),
              defaultResources: reason.default_resources.map(
                (resource: string) => getProVetIdFromUrl(resource)
              ),
              group: getProVetIdFromUrl(reason?.group),
              proficientStaff: reason?.proficient_staff.map((user: string) =>
                getProVetIdFromUrl(user)
              ),
              defaultItems: reason?.default_items.map((item: string) =>
                getProVetIdFromUrl(item)
              ),
              species: reason?.species.map((specie: string) =>
                getProVetIdFromUrl(specie)
              ),
              updatedOn: new Date(),
            } as Reason,
            { merge: true }
          )
          .then(() => true)
          .catch(async (error: any) => await throwError(error))
    )
  )
    .then(async () => true)
    .catch(async (error: any) => await throwError(error));
