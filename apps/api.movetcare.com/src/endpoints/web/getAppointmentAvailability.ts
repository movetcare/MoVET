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
    }: {
      date: any;
      schedule: "clinic" | "housecall" | "virtual";
      patients: Array<{ id: string }>;
    }): Promise<any> => {
      const calendarDay = new Date(date).getDate();
      const monthNumber = new Date(date).getMonth();
      let existingAppointments: Array<{ start: any; end: any }> = [];
      if (DEBUG) {
        console.log("date", date);
        console.log("schedule", schedule);
        console.log("calendarDay", calendarDay);
        console.log("monthNumber", monthNumber);
      }
      const bookingConfiguration = await admin
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
      const { isOpenOnDate, closedReason } = await verifyScheduleIsOpen(
        schedule,
        date,
        bookingConfiguration
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
      } else return closedReason;
    }
  );

const verifyScheduleIsOpen = async (
  schedule: string,
  date: number,
  data: any
): Promise<{ isOpenOnDate: boolean; closedReason: string | null }> => {
  let isOpenOnDate = false;
  const weekdayNumber = new Date(date).getDay();
  switch (schedule) {
    case "clinic":
      if (weekdayNumber === 0) isOpenOnDate = data.clinicOpenSunday;
      else if (weekdayNumber === 1) isOpenOnDate = data.clinicOpenMonday;
      else if (weekdayNumber === 2) isOpenOnDate = data.clinicOpenTuesday;
      else if (weekdayNumber === 3) isOpenOnDate = data.clinicOpenWednesday;
      else if (weekdayNumber === 4) isOpenOnDate = data.clinicOpenThursday;
      else if (weekdayNumber === 5) isOpenOnDate = data.clinicOpenFriday;
      else if (weekdayNumber === 6) isOpenOnDate = data.clinicOpenSaturday;
      break;
    case "housecall":
      if (weekdayNumber === 0) isOpenOnDate = data.housecallOpenSunday;
      else if (weekdayNumber === 1) isOpenOnDate = data.housecallOpenMonday;
      else if (weekdayNumber === 2) isOpenOnDate = data.housecallOpenTuesday;
      else if (weekdayNumber === 3) isOpenOnDate = data.housecallOpenWednesday;
      else if (weekdayNumber === 4) isOpenOnDate = data.housecallOpenThursday;
      else if (weekdayNumber === 5) isOpenOnDate = data.housecallOpenFriday;
      else if (weekdayNumber === 6) isOpenOnDate = data.housecallOpenSaturday;
      break;
    case "virtual":
      if (weekdayNumber === 0) isOpenOnDate = data.virtualOpenSunday;
      else if (weekdayNumber === 1) isOpenOnDate = data.virtualOpenMonday;
      else if (weekdayNumber === 2) isOpenOnDate = data.virtualOpenTuesday;
      else if (weekdayNumber === 3) isOpenOnDate = data.virtualOpenWednesday;
      else if (weekdayNumber === 4) isOpenOnDate = data.virtualOpenThursday;
      else if (weekdayNumber === 5) isOpenOnDate = data.virtualOpenFriday;
      else if (weekdayNumber === 6) isOpenOnDate = data.virtualOpenSaturday;
      break;
    default:
      break;
  }
  if (isOpenOnDate) {
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

    return { isOpenOnDate: true, closedReason: null };
  } else return { isOpenOnDate: false, closedReason: "CLOSED" };
};
