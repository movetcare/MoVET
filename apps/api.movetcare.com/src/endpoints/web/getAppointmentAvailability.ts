// Reasons exclude list - ignore "Drive Time" and other internal reasons
// Number of rooms available (or max appointments per day?)
// Filter down schedules by ward
// TODOs:
// Integrate closures with provet appointments
// Migrate appointments veterinary filed (Clinic, housecall, virtual) to wards

import {
  admin,
  defaultRuntimeOptions,
  functions,
  throwError,
} from "../../config/config";
const DEBUG = true;
export const getAppointmentAvailability = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async ({
      date,
      schedule,
      patients,
    }: {
      date: any;
      schedule: "clinic" | "housecall" | "virtual";
      patients: Array<string>;
    }): Promise<any> => {
      const calendarDay = new Date(date).getDate();
      const monthNumber = new Date(date).getMonth();
      let existingAppointments: Array<{ start: any; end: any }> = [];
      if (DEBUG) {
        console.log("date", date);
        console.log("patients", patients);
        console.log("schedule", schedule);
        console.log("calendarDay", calendarDay);
        console.log("monthNumber", monthNumber);
      }
      if (patients && patients.length > 0) {
        const { isOpenOnDate, closedReason } = await verifyScheduleIsOpen(
          schedule,
          patients,
          date
        );
        if (isOpenOnDate && closedReason === null) {
          existingAppointments = await admin
            .firestore()
            .collection("appointments")
            .where("active", "==", 1)
            .where("start", ">=", new Date(date))
            .orderBy("start", "asc")
            .get()
            .then((querySnapshot: any) => {
              const appointments: Array<{ start: any; end: any }> = [];
              if (DEBUG)
                console.log(
                  "querySnapshot?.docs?.length",
                  querySnapshot?.docs?.length
                );
              if (querySnapshot?.docs?.length > 0)
                querySnapshot.forEach(async (doc: any) => {
                  if (
                    doc.data()?.start?.toDate().getDate() === calendarDay &&
                    doc.data()?.start?.toDate().getMonth() === monthNumber
                  )
                    appointments.push({
                      start: doc.data()?.start?.toDate()?.toString(),
                      end: doc.data()?.end?.toDate()?.toString(),
                    });
                });
              if (DEBUG) console.log("appointments", appointments);
              return appointments;
            })
            .catch((error: any) => throwError(error));
          return existingAppointments;
        } else return closedReason || "Something Went Wrong...";
      }
      return "Patient(s) Required - Please try again...";
    }
  );

const verifyScheduleIsOpen = async (
  schedule: string,
  patients: Array<string>,
  date: number
): Promise<{ isOpenOnDate: boolean; closedReason: string | null }> => {
  let isOpenOnDate = false;
  let vcprRequired = false;
  const calendarDay = new Date(date).getDate();
  const monthNumber = new Date(date).getMonth();
  const weekdayNumber = new Date(date).getDay();
  const configuration = await admin
    .firestore()
    .collection("configuration")
    .doc("bookings")
    .get()
    .then((doc: any) => {
      if (DEBUG)
        console.log("configuration/bookings => doc.data()", doc.data());
      return doc.data();
    })
    .catch((error: any) => throwError(error));
  const { globalClosures, scheduleClosures } = await admin
    .firestore()
    .collection("configuration")
    .doc("closures")
    .get()
    .then((doc: any) => {
      if (DEBUG)
        console.log("configuration/closures => doc.data()", doc.data());
      return {
        globalClosures: doc.data()?.closureDates,
        scheduleClosures:
          schedule === "clinic"
            ? doc.data()?.closureDatesClinic
            : schedule === "housecall"
            ? doc.data()?.closureDatesHousecall
            : doc.data()?.closureDatesVirtual,
      };
    })
    .catch((error: any) => throwError(error));
  if (DEBUG) {
    console.log("globalClosures", globalClosures);
    console.log("scheduleClosures", scheduleClosures);
  }
  if (globalClosures && globalClosures.length > 0) {
    let isGlobalClosure = false;
    let closureData = null;
    globalClosures.forEach(
      (closure: {
        startDate: any;
        endDate: any;
        name: string;
        isActiveForTelehealth: boolean;
        isActiveForHousecalls: true;
        isActiveForClinic: boolean;
      }) => {
        if (DEBUG) {
          console.log("date", new Date(date));
          console.log("closure.startDate", closure.startDate.toDate());
          console.log("closure.endDate", closure.endDate.toDate());
          console.log(
            "date >= closure.startDate",
            new Date(date) >= closure.startDate.toDate()
          );
          console.log(
            "date <= closure.endDate",
            new Date(date) <= closure.endDate.toDate()
          );
        }
        switch (schedule) {
          case "clinic":
            if (closure.isActiveForClinic) {
              if (
                new Date(date) >= closure.startDate.toDate() &&
                new Date(date) <= closure.endDate.toDate()
              ) {
                isGlobalClosure = true;
                closureData = {
                  isOpenOnDate: false,
                  closedReason: "Closed - " + closure.name,
                };
              }
            }
            break;
          case "housecall":
            if (closure.isActiveForHousecalls) {
              if (
                date >= closure.startDate.toDate() &&
                date <= closure.endDate.toDate()
              ) {
                isGlobalClosure = true;
                closureData = {
                  isOpenOnDate: false,
                  closedReason: "Closed - " + closure.name,
                };
              }
            }
            break;
          case "virtual":
            if (closure.isActiveForTelehealth) {
              if (
                date >= closure.startDate.toDate() &&
                date <= closure.endDate.toDate()
              ) {
                isGlobalClosure = true;
                closureData = {
                  isOpenOnDate: false,
                  closedReason: "Closed - " + closure.name,
                };
              }
            }
            break;
          default:
            closureData = {
              isOpenOnDate: false,
              closedReason: "SCHEDULE ERROR",
            };
        }
        if (DEBUG) console.log("isGlobalClosure", isGlobalClosure);
      }
    );
    if (isGlobalClosure && closureData) return closureData;
  }
  switch (schedule) {
    case "clinic":
      if (weekdayNumber === 0) isOpenOnDate = configuration?.clinicOpenSunday;
      else if (weekdayNumber === 1)
        isOpenOnDate = configuration?.clinicOpenMonday;
      else if (weekdayNumber === 2)
        isOpenOnDate = configuration?.clinicOpenTuesday;
      else if (weekdayNumber === 3)
        isOpenOnDate = configuration?.clinicOpenWednesday;
      else if (weekdayNumber === 4)
        isOpenOnDate = configuration?.clinicOpenThursday;
      else if (weekdayNumber === 5)
        isOpenOnDate = configuration?.clinicOpenFriday;
      else if (weekdayNumber === 6)
        isOpenOnDate = configuration?.clinicOpenSaturday;
      break;
    case "housecall":
      if (weekdayNumber === 0)
        isOpenOnDate = configuration?.housecallOpenSunday;
      else if (weekdayNumber === 1)
        isOpenOnDate = configuration?.housecallOpenMonday;
      else if (weekdayNumber === 2)
        isOpenOnDate = configuration?.housecallOpenTuesday;
      else if (weekdayNumber === 3)
        isOpenOnDate = configuration?.housecallOpenWednesday;
      else if (weekdayNumber === 4)
        isOpenOnDate = configuration?.housecallOpenThursday;
      else if (weekdayNumber === 5)
        isOpenOnDate = configuration?.housecallOpenFriday;
      else if (weekdayNumber === 6)
        isOpenOnDate = configuration?.housecallOpenSaturday;
      break;
    case "virtual":
      if (weekdayNumber === 0) isOpenOnDate = configuration?.virtualOpenSunday;
      else if (weekdayNumber === 1)
        isOpenOnDate = configuration?.virtualOpenMonday;
      else if (weekdayNumber === 2)
        isOpenOnDate = configuration?.virtualOpenTuesday;
      else if (weekdayNumber === 3)
        isOpenOnDate = configuration?.virtualOpenWednesday;
      else if (weekdayNumber === 4)
        isOpenOnDate = configuration?.virtualOpenThursday;
      else if (weekdayNumber === 5)
        isOpenOnDate = configuration?.virtualOpenFriday;
      else if (weekdayNumber === 6)
        isOpenOnDate = configuration?.virtualOpenSaturday;
      break;
    default:
      break;
  }
  if (!isOpenOnDate) return { isOpenOnDate: false, closedReason: "CLOSED" };
  await Promise.all(
    patients.map(
      async (patientId: string) =>
        await admin
          .firestore()
          .collection("patients")
          .doc(`${patientId}`)
          .get()
          .then((doc: any) => {
            if (DEBUG) console.log("patients doc.data()", doc.data());
            if (doc.data()?.vcprRequired) {
              vcprRequired = true;
              return;
            }
          })
          .catch((error: any) => throwError(error))
    )
  );
  if (
    vcprRequired &&
    (schedule === "clinic"
      ? configuration?.clinicSameDayAppointmentVcprRequired
      : schedule === "housecall"
      ? configuration?.housecallSameDayAppointmentVcprRequired
      : schedule === "clinic"
      ? configuration?.virtualSameDayAppointmentVcprRequired
      : true) &&
    calendarDay === new Date().getDate() &&
    monthNumber === new Date().getMonth()
  ) {
    if (DEBUG) console.log("VCPR Required - Skipping Today's Appointments");
    return {
      isOpenOnDate: false,
      closedReason:
        "Same day appointments are not available for new patients. Please select a future date.",
    };
  }
  return { isOpenOnDate: true, closedReason: null };
};
