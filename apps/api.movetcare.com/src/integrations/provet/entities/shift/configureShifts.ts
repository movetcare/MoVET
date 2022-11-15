import { sendNotification } from "./../../../../notifications/sendNotification";
import { admin, DEBUG, throwError } from "../../../../config/config";
import type { Shift } from "../../../../types/shift";
import { deleteCollection } from "../../../../utils/deleteCollection";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";

export const configureShifts = async (): Promise<boolean> => {
  await deleteCollection("shifts").then(
    () => DEBUG && console.log("DELETED ALL SHIFTS!")
  );
  const clinicShifts: Array<Shift> = await fetchEntity(
    "shift",
    null,
    `?user__is=7&start__gte=${
      new Date().toISOString().split("T")[0]
    }%2000:00%2B00:00`
  );

  const mobileShifts: Array<Shift> = await fetchEntity(
    "shift",
    null,
    `?user__is=8&start__gte=${
      new Date().toISOString().split("T")[0]
    }%2000:00%2B00:00`
  );
  const telehealthShifts: Array<Shift> = await fetchEntity(
    "shift",
    null,
    `?user__is=9&start__gte=${
      new Date().toISOString().split("T")[0]
    }%2000:00%2B00:00`
  );

  try {
    const clinic = clinicShifts && (await updateShiftDocuments(clinicShifts));
    const mobile = mobileShifts && (await updateShiftDocuments(mobileShifts));
    const telehealth =
      telehealthShifts && (await updateShiftDocuments(telehealthShifts));

    if (clinic || mobile || telehealth) {
      sendNotification({
        type: "slack",
        payload: {
          message: ":spiral_calendar_pad: ProVET Shifts Successfully Synced",
        },
      });
      return true;
    }
  } catch (error) {
    throwError(error);
  }
  return false;
};

const updateShiftDocuments = async (shifts: Array<Shift>): Promise<boolean> => {
  let shiftsConfigured = 0;
  return await Promise.all(
    shifts.map(async (shift: any) => {
      await admin
        .firestore()
        .collection("shifts")
        .doc(`${shift?.id}`)
        .set(
          {
            record: shift, // DO NOT DELETE UNTIL NEW v2 BOOKING IS LAUNCHED
            id: shift?.id,
            department: getProVetIdFromUrl(shift?.department),
            ward: shift?.ward,
            team: shift?.team,
            shiftType: getProVetIdFromUrl(shift?.shift_type),
            web: shift?.web,
            note: shift?.note,
            isSlot: shift?.is_slot,
            user: getProVetIdFromUrl(shift?.user),
            start: new Date(shift?.start),
            end: new Date(shift?.end),
            updatedOn: new Date(),
          } as Shift,
          { merge: true }
        )
        .then(() => {
          shiftsConfigured++;
          return true;
        })
        .catch((error: any) => throwError(error));
    })
  )
    .then(async () => {
      if (shiftsConfigured === shifts.length) return true;
      else
        return throwError(
          `ERROR: ${shiftsConfigured} Out of ${shifts.length} Shifts Configured`
        );
    })
    .catch((error: any) => throwError(error));
};
