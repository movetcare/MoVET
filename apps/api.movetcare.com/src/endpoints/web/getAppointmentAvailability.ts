import {
  // isWithinInterval,
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  isAfter,
  isEqual,
} from "date-fns/fp";
import {
  admin,
  defaultRuntimeOptions,
  functions,
  throwError,
  //environment,
  // DEBUG,
} from "../../config/config";
import { formatTimeHoursToDate } from "../../utils/formatTimeHoursToDate";
import { formatTimeHoursToString } from "../../utils/formatTimeHoursToString";
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
import { getTimeHoursFromDate } from "../../utils/getTimeHoursFromDate";
const DEBUG = true;
const DEBUG_SUMMARY = true;
const DEBUG_ASSIGN_CONFIG = false;
const DEBUG_VERIFY_SCHEDULE = false;
const DEBUG_EXISTING_APPOINTMENTS = true;
const DEBUG_CALCULATE_APPOINTMENTS = false;
//const DEBUG_FORCED_OPENINGS = false;
interface Appointment {
  start: any;
  end: any;
  id: null | number;
  resources: null | Array<ActiveResource["id"]>;
  reason: null | number;
}
type AppointmentScheduleTypes = "clinic" | "housecall" | "virtual";

interface ActiveResource {
  id: number;
  staggerTime: number;
}
export const getAppointmentAvailability = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async ({
      date,
      schedule,
      patients,
    }: {
      date: string;
      schedule: AppointmentScheduleTypes;
      patients: Array<string>;
    }): Promise<any> => {
      const dateObject = new Date(date.slice(0, -13) + "24:00:00.000Z");
      if (DEBUG) {
        console.log("---------- getAppointmentAvailability ARGS ----------");
        console.log("date       => ", date);
        console.log("dateObject => ", dateObject);
        console.log("patients   => ", patients);
        console.log("schedule   => ", schedule);
      }
      if (patients && patients.length > 0) {
        const {
          standardOpenTime,
          standardCloseTime,
          // standardLunchTime,
          // standardLunchDuration,
          appointmentBuffer,
          sameDayAppointmentLeadTime,
          resources,
          appointmentDuration,
        } = await assignConfiguration({
          schedule,
          patients,
          weekdayNumber: dateObject.getDay(),
        });
        const { isOpenOnDate, closedReason } = await verifyScheduleIsOpen(
          schedule,
          patients,
          dateObject,
        );
        if (isOpenOnDate && closedReason === null) {
          const allAvailableAppointmentTimes: any = [];
          await Promise.all(
            resources.map(async (resource: ActiveResource) => {
              let existingAppointmentsForResource: Array<{
                start: any;
                end: any;
              }> = [];
              existingAppointmentsForResource = await getExistingAppointments({
                date: dateObject,
                schedule,
                resource,
                // standardLunchTime,
                // standardLunchDuration,
              });
              allAvailableAppointmentTimes.push(
                await calculateAvailableAppointments({
                  schedule,
                  existingAppointmentsForResource,
                  date,
                  resource,
                  standardOpenTime,
                  standardCloseTime,
                  appointmentDuration,
                  appointmentBuffer,
                  sameDayAppointmentLeadTime,
                }),
              );
            }),
          );
          if (DEBUG_SUMMARY)
            console.log(
              "allAvailableAppointmentTimes",
              allAvailableAppointmentTimes,
            );
          const consolidatedAvailableAppointmentTimes: any = [];
          allAvailableAppointmentTimes.forEach((timeSlots: any) =>
            timeSlots.forEach((timeSlot: any) =>
              consolidatedAvailableAppointmentTimes.push(timeSlot),
            ),
          );
          if (DEBUG_SUMMARY)
            console.log(
              "consolidatedAvailableAppointmentTimes",
              consolidatedAvailableAppointmentTimes,
            );
          const uniqueIds: any = [];
          const uniqueAppointmentTimes =
            consolidatedAvailableAppointmentTimes.filter((element: any) => {
              const isDuplicate = uniqueIds.includes(element.start);
              if (!isDuplicate) {
                uniqueIds.push(element.start);
                return true;
              }
              return false;
            });
          return uniqueAppointmentTimes.sort((a: any, b: any) => {
            if (a.start > b.start) return 1;
            if (b.start > a.start) return -1;
            return 0;
          });
        } else {
          // const forcedOpenings = await getForcedOpenings(schedule);
          // const calendarDay = Number(
          //   new Date(date.slice(0, -13) + "24:00:00.000Z")?.toLocaleDateString(
          //     "en-US",
          //     {
          //       timeZone: "America/Denver",
          //       day: "numeric",
          //     },
          //   ),
          // );
          // const monthNumber =
          //   new Date(date.slice(0, -13) + "24:00:00.000Z").getMonth() + 1;
          // const yearNumber = new Date(
          //   date.slice(0, -13) + "24:00:00.000Z",
          // ).getFullYear();
          // if (DEBUG_FORCED_OPENINGS) {
          //   console.log("CLOSED calendarDay", calendarDay);
          //   console.log("CLOSED monthNumber", monthNumber);
          //   console.log("CLOSED yearNumber", yearNumber);
          // }
          // if (forcedOpenings && forcedOpenings.length > 0) {
          //   let uniqueAppointmentTimes: any = [];
          //   await Promise.all(
          //     forcedOpenings.map(async (opening: any) => {
          //       if (DEBUG_FORCED_OPENINGS) {
          //         console.log(
          //           "opening?.date?.toDate().getDate()",
          //           opening?.date?.toDate().getDate(),
          //         );
          //         console.log("calendarDay", calendarDay);
          //         console.log(
          //           "opening?.date?.toDate().getMonth() + 1",
          //           opening?.date?.toDate().getMonth() + 1,
          //         );
          //         console.log("monthNumber", monthNumber);
          //       }
          //       if (
          //         calendarDay === opening?.date?.toDate().getDate() &&
          //         monthNumber === opening?.date?.toDate().getMonth() + 1 &&
          //         yearNumber === opening?.date?.toDate().getFullYear()
          //       ) {
          //         const allAvailableAppointmentTimes: any = [];
          //         await Promise.all(
          //           resources.map(async (resource: ActiveResource) => {
          //             let existingAppointmentsForResource: Array<{
          //               start: any;
          //               end: any;
          //             }> = [];
          //             existingAppointmentsForResource =
          //               await getExistingAppointments({
          //                 date: dateObject,
          //                 schedule,
          //                 resource,
          //                 standardLunchTime,
          //                 standardLunchDuration,
          //               });
          //             allAvailableAppointmentTimes.push(
          //               await calculateAvailableAppointments({
          //                 schedule,
          //                 existingAppointmentsForResource,
          //                 date: dateObject,
          //                 resource,
          //                 standardOpenTime: opening?.startTime,
          //                 standardCloseTime: opening?.endTime,
          //                 appointmentDuration,
          //                 appointmentBuffer,
          //                 sameDayAppointmentLeadTime,
          //               }),
          //             );
          //           }),
          //         );
          //         if (DEBUG_SUMMARY)
          //           console.log(
          //             "allAvailableAppointmentTimes",
          //             allAvailableAppointmentTimes,
          //           );
          //         const consolidatedAvailableAppointmentTimes: any = [];
          //         allAvailableAppointmentTimes.forEach((timeSlots: any) =>
          //           timeSlots.forEach((timeSlot: any) =>
          //             consolidatedAvailableAppointmentTimes.push(timeSlot),
          //           ),
          //         );
          //         if (DEBUG_SUMMARY)
          //           console.log(
          //             "consolidatedAvailableAppointmentTimes",
          //             consolidatedAvailableAppointmentTimes,
          //           );
          //         const uniqueIds: any = [];
          //         uniqueAppointmentTimes =
          //           consolidatedAvailableAppointmentTimes.filter(
          //             (element: any) => {
          //               const isDuplicate = uniqueIds.includes(element.start);
          //               if (!isDuplicate) {
          //                 uniqueIds.push(element.start);
          //                 return true;
          //               }
          //               return false;
          //             },
          //           );
          //         uniqueAppointmentTimes.sort((a: any, b: any) => {
          //           if (a.start > b.start) return 1;
          //           if (b.start > a.start) return -1;
          //           return 0;
          //         });
          //       }
          //     }),
          //   );
          //   if (DEBUG_SUMMARY)
          //     console.log("uniqueAppointmentTimes", uniqueAppointmentTimes);
          //   return uniqueAppointmentTimes.length > 0
          //     ? uniqueAppointmentTimes
          //     : closedReason;
          // } else
          return closedReason || "Something Went Wrong...";
        }
      }
      return "Select a Date...";
    },
  );
const getConfiguration = async () =>
  await admin
    .firestore()
    .collection("configuration")
    .doc("bookings")
    .get()
    .then((doc: any) => doc.data())
    .catch((error: any) => throwError(error));
const assignConfiguration = async ({
  schedule,
  patients,
  weekdayNumber,
}: {
  schedule: AppointmentScheduleTypes;
  patients: Array<string>;
  weekdayNumber: number;
}): Promise<{
  standardOpenTime: any;
  standardCloseTime: any;
  // standardLunchTime: any;
  // standardLunchDuration: any;
  appointmentBuffer: any;
  sameDayAppointmentLeadTime: any;
  resources: any;
  appointmentDuration: any;
}> => {
  const configuration = await getConfiguration();
  if (DEBUG_ASSIGN_CONFIG) {
    console.log("---------- assignConfiguration ----------");
    console.log("ARGS => ", { configuration, weekdayNumber });
    console.log("-----------------------------------------");
  }
  let standardOpenTime: any,
    standardCloseTime: any,
    // standardLunchTime: any,
    // standardLunchDuration: any,
    appointmentBuffer: any,
    sameDayAppointmentLeadTime: any,
    resources: any,
    appointmentDuration: any = null;
  switch (schedule) {
    case "clinic":
      // standardLunchTime = configuration?.clinicLunchTime;
      // standardLunchDuration = configuration?.clinicLunchDuration;
      sameDayAppointmentLeadTime =
        configuration?.clinicSameDayAppointmentLeadTime;
      appointmentBuffer = configuration?.clinicAppointmentBufferTime;
      resources = configuration?.clinicActiveResources;
      appointmentDuration =
        patients?.length >= 3
          ? configuration?.clinicThreePatientDuration
          : patients?.length === 2
            ? configuration?.clinicTwoPatientDuration
            : configuration?.clinicOnePatientDuration;
      break;
    case "housecall":
      // standardLunchTime = configuration?.housecallLunchTime;
      // standardLunchDuration = configuration?.housecallLunchDuration;
      appointmentBuffer = configuration?.housecallAppointmentBufferTime;
      sameDayAppointmentLeadTime =
        configuration?.housecallSameDayAppointmentLeadTime;
      resources = configuration?.housecallActiveResources;
      appointmentDuration =
        patients?.length >= 3
          ? configuration?.housecallThreePatientDuration
          : patients?.length === 2
            ? configuration?.housecallTwoPatientDuration
            : configuration?.housecallOnePatientDuration;
      break;
    case "virtual":
      // standardLunchTime = configuration?.virtualLunchTime;
      // standardLunchDuration = configuration?.virtualLunchDuration;
      sameDayAppointmentLeadTime =
        configuration?.virtualSameDayAppointmentLeadTime;
      appointmentBuffer = configuration?.virtualAppointmentBufferTime;
      resources = configuration?.virtualActiveResources;
      appointmentDuration =
        patients?.length >= 3
          ? configuration?.virtualThreePatientDuration
          : patients?.length === 2
            ? configuration?.virtualTwoPatientDuration
            : configuration?.virtualOnePatientDuration;
      break;
    default:
      break;
  }
  if (DEBUG_ASSIGN_CONFIG) {
    // console.log("standardLunchTime          => ", standardLunchTime);
    // console.log("standardLunchDuration      => ", standardLunchDuration);
    console.log("sameDayAppointmentLeadTime => ", sameDayAppointmentLeadTime);
    console.log("appointmentBuffer          => ", appointmentBuffer);
    console.log("resources                  => ", resources);
    console.log("appointmentDuration        => ", appointmentDuration);
    console.log("-----------------------------------------");
  }
  switch (schedule) {
    case "clinic":
      if (weekdayNumber === 0) {
        standardOpenTime = configuration?.clinicOpenSundayTime;
        standardCloseTime = configuration?.clinicClosedSundayTime;
      } else if (weekdayNumber === 1) {
        standardOpenTime = configuration?.clinicOpenMondayTime;
        standardCloseTime = configuration?.clinicClosedMondayTime;
      } else if (weekdayNumber === 2) {
        standardOpenTime = configuration?.clinicOpenTuesdayTime;
        standardCloseTime = configuration?.clinicClosedTuesdayTime;
      } else if (weekdayNumber === 3) {
        standardOpenTime = configuration?.clinicOpenWednesdayTime;
        standardCloseTime = configuration?.clinicClosedWednesdayTime;
      } else if (weekdayNumber === 4) {
        standardOpenTime = configuration?.clinicOpenThursdayTime;
        standardCloseTime = configuration?.clinicClosedThursdayTime;
      } else if (weekdayNumber === 5) {
        standardOpenTime = configuration?.clinicOpenFridayTime;
        standardCloseTime = configuration?.clinicClosedFridayTime;
      } else if (weekdayNumber === 6) {
        standardOpenTime = configuration?.clinicOpenSaturdayTime;
        standardCloseTime = configuration?.clinicClosedSaturdayTime;
      }
      break;
    case "housecall":
      if (weekdayNumber === 0) {
        standardOpenTime = configuration?.housecallOpenSundayTime;
        standardCloseTime = configuration?.housecallClosedSundayTime;
      } else if (weekdayNumber === 1) {
        standardOpenTime = configuration?.housecallOpenMondayTime;
        standardCloseTime = configuration?.housecallClosedMondayTime;
      } else if (weekdayNumber === 2) {
        standardOpenTime = configuration?.housecallOpenTuesdayTime;
        standardCloseTime = configuration?.housecallClosedTuesdayTime;
      } else if (weekdayNumber === 3) {
        standardOpenTime = configuration?.housecallOpenWednesdayTime;
        standardCloseTime = configuration?.housecallClosedWednesdayTime;
      } else if (weekdayNumber === 4) {
        standardOpenTime = configuration?.housecallOpenThursdayTime;
        standardCloseTime = configuration?.housecallClosedThursdayTime;
      } else if (weekdayNumber === 5) {
        standardOpenTime = configuration?.housecallOpenFridayTime;
        standardCloseTime = configuration?.housecallClosedFridayTime;
      } else if (weekdayNumber === 6) {
        standardOpenTime = configuration?.housecallOpenSaturdayTime;
        standardCloseTime = configuration?.housecallClosedSaturdayTime;
      }
      break;
    case "virtual":
      if (weekdayNumber === 0) {
        standardOpenTime = configuration?.virtualOpenSundayTime;
        standardCloseTime = configuration?.virtualClosedSundayTime;
      } else if (weekdayNumber === 1) {
        standardOpenTime = configuration?.virtualOpenMondayTime;
        standardCloseTime = configuration?.virtualClosedMondayTime;
      } else if (weekdayNumber === 2) {
        standardOpenTime = configuration?.virtualOpenTuesdayTime;
        standardCloseTime = configuration?.virtualClosedTuesdayTime;
      } else if (weekdayNumber === 3) {
        standardOpenTime = configuration?.virtualOpenWednesdayTime;
        standardCloseTime = configuration?.virtualClosedWednesdayTime;
      } else if (weekdayNumber === 4) {
        standardOpenTime = configuration?.virtualOpenThursdayTime;
        standardCloseTime = configuration?.virtualClosedThursdayTime;
      } else if (weekdayNumber === 5) {
        standardOpenTime = configuration?.virtualOpenFridayTime;
        standardCloseTime = configuration?.virtualClosedFridayTime;
      } else if (weekdayNumber === 6) {
        standardOpenTime = configuration?.virtualOpenSaturdayTime;
        standardCloseTime = configuration?.virtualClosedSaturdayTime;
      }
      break;
    default:
      break;
  }
  if (DEBUG_ASSIGN_CONFIG) {
    console.log("standardOpenTime      => ", standardOpenTime);
    console.log("standardCloseTime     => ", standardCloseTime);
    // console.log("standardLunchTime     => ", standardLunchTime);
    // console.log("standardLunchDuration => ", standardLunchDuration);
    console.log("appointmentDuration   => ", appointmentDuration);
    console.log("appointmentBuffer     =>", appointmentBuffer);
    console.log("-----------------------------------------");
  }
  return {
    standardOpenTime,
    standardCloseTime,
    // standardLunchTime,
    // standardLunchDuration,
    appointmentBuffer,
    sameDayAppointmentLeadTime,
    resources,
    appointmentDuration,
  };
};
const verifyScheduleIsOpen = async (
  schedule: string,
  patients: Array<string>,
  date: Date,
): Promise<{ isOpenOnDate: boolean; closedReason: string | null }> => {
  if (DEBUG_VERIFY_SCHEDULE) {
    console.log("---------- verifyScheduleIsOpen ----------");
    console.log("ARGS => ", { schedule, patients, date });
    console.log("-----------------------------------------");
  }
  let isOpenOnDate = false;
  let vcprRequired = false;
  const calendarDay = Number(
    new Date(date)?.toLocaleDateString("en-US", {
      timeZone: "America/Denver",
      day: "numeric",
    }),
  );
  const monthNumber = new Date(date).getMonth() + 1;
  const weekdayNumber = new Date(date).getDay();
  const configuration = await getConfiguration();
  const globalClosures = await admin
    .firestore()
    .collection("configuration")
    .doc("closures")
    .get()
    .then((doc: any) => doc.data()?.closureDates)
    .catch((error: any) => throwError(error));
  if (DEBUG_VERIFY_SCHEDULE) {
    console.log("calendarDay                => ", calendarDay);
    console.log("exactDateString            => ", date);
    console.log(
      "exactDateString.toLocaleDateString() => ",
      new Date(date)?.toLocaleDateString("en-US", {
        timeZone: "America/Denver",
        day: "numeric",
      }),
    );
    console.log("monthNumber                => ", monthNumber);
    console.log("weekdayNumber              => ", weekdayNumber);
    console.log("globalClosures              => ", globalClosures);
    console.log("-----------------------------------------");
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
        isActiveForHousecalls: boolean;
        isActiveForClinic: boolean;
      }) => {
        const checkDate = new Date(date);
        //checkDate.setUTCDate(checkDate.getUTCDate() + 1);
        checkDate.setHours(0, 0, 0, 0);
        const closureStartDate = closure.startDate.toDate();
        closureStartDate.setHours(0, 0, 0, 0);
        const closureEndDate = closure.endDate.toDate();
        closureEndDate.setHours(0, 0, 0, 0);
        if (DEBUG_VERIFY_SCHEDULE) {
          console.log("checkDate              => ", checkDate);
          console.log("closure                => ", closure);
          console.log("closureStartDate       => ", closureStartDate);
          console.log("closureEndDate         =>", closureEndDate);
          console.log(
            "date >= closureStartDate =>",
            checkDate >= closureStartDate,
          );
          console.log(
            "date <= closureEndDate => ",
            checkDate <= closureEndDate,
          );
          console.log("-----------------------------------------");
        }
        switch (schedule) {
          case "clinic":
            if (closure.isActiveForClinic) {
              if (
                checkDate >= closureStartDate &&
                checkDate <= closureEndDate
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
                checkDate >= closureStartDate &&
                checkDate <= closureEndDate
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
                checkDate >= closureStartDate &&
                checkDate <= closureEndDate
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
      },
    );
    if (DEBUG_VERIFY_SCHEDULE) {
      console.log("isGlobalClosure", isGlobalClosure);
      console.log("closureData => ", closureData);
      console.log("-----------------------------------------");
    }
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
            // if (DEBUG) console.log("patients doc.data()", doc.data());
            if (doc.data()?.vcprRequired) {
              vcprRequired = true;
              return;
            }
          })
          .catch((error: any) => throwError(error)),
    ),
  );
  if (DEBUG_VERIFY_SCHEDULE) {
    console.log("isOpenOnDate => ", isOpenOnDate);
    console.log("vcprRequired => ", vcprRequired);
    console.log(
      "schedule     =>",
      schedule === "clinic"
        ? configuration?.clinicSameDayAppointmentVcprRequired
        : schedule === "housecall"
          ? configuration?.housecallSameDayAppointmentVcprRequired
          : schedule === "virtual"
            ? configuration?.virtualSameDayAppointmentVcprRequired
            : null,
    );
    console.log("schedule     => ", schedule);
    console.log("calendarDay  => ", calendarDay);
    console.log("new Date().getDate() => ", new Date().getDate());
    console.log("monthNumber  =>", monthNumber);
    console.log("new Date().getMonth()+ 1 => ", new Date().getMonth() + 1);
    console.log(
      "calendarDay === new Date().getDate() => ",
      calendarDay === new Date().getDate(),
    );
    console.log(
      "monthNumber === new Date().getMonth() + 1 => ",
      monthNumber === new Date().getMonth() + 1,
    );
    console.log("-----------------------------------------");
  }
  if (
    vcprRequired &&
    (schedule === "clinic"
      ? configuration?.clinicSameDayAppointmentVcprRequired
      : schedule === "housecall"
        ? configuration?.housecallSameDayAppointmentVcprRequired
        : schedule === "virtual"
          ? configuration?.virtualSameDayAppointmentVcprRequired
          : null) &&
    calendarDay === new Date().getDate() &&
    monthNumber === new Date().getMonth() + 1
  ) {
    return {
      isOpenOnDate: false,
      closedReason:
        "Same day appointments are not available for new patients. Please select a future date.",
    };
  }
  return { isOpenOnDate: true, closedReason: null };
};
const getExistingAppointments = async ({
  date,
  schedule,
  resource,
  // standardLunchTime,
  // standardLunchDuration,
}: {
  date: Date;
  schedule: AppointmentScheduleTypes;
  resource: ActiveResource;
  // standardLunchTime: number;
  // standardLunchDuration: number;
}) => {
  const updatedDate = new Date(date);
  updatedDate.setDate(updatedDate.getDate() - 1);
  return await admin
    .firestore()
    .collection("appointments")
    .where("active", "==", 1)
    .where("start", ">=", updatedDate)
    .orderBy("start", "asc")
    .get()
    .then(async (querySnapshot: any) => {
      const calendarDay = Number(
        new Date(date)?.toLocaleDateString("en-US", {
          timeZone: "America/Denver",
          day: "numeric",
        }),
      );
      const monthNumber = new Date(date).getMonth() + 1;
      const existingAppointments: Array<Appointment> = [];
      // const scheduleClosures = await getScheduledClosures(schedule);

      if (DEBUG_EXISTING_APPOINTMENTS) {
        console.log("---------- getExistingAppointments ----------");
        console.log("date              => ", date);
        console.log("queryDate         => ", updatedDate);
        console.log("appointmentsCount => ", querySnapshot?.docs?.length);
        console.log("calendarDay       =>", calendarDay);
        console.log("monthNumber       =>", monthNumber);
        // console.log("scheduleClosures  => ", scheduleClosures);
        console.log("-----------------------------------------");
      }
      if (querySnapshot?.docs?.length > 0) {
        const reasons = await getReasons(schedule);
        querySnapshot.forEach(async (doc: any) => {
          if (
            DEBUG_EXISTING_APPOINTMENTS &&
            doc.data()?.resources &&
            doc.data()?.resources.includes(resource.id)
          ) {
            console.log("appointmentId         => ", doc.id);
            console.log(
              "appointmentStartDate  => ",
              doc.data()?.start?.toDate().getDate(),
            );
            console.log(
              "appointmentStartMonth => ",
              doc.data()?.start?.toDate().getMonth() + 1,
            );
          }
          if (
            doc.data()?.start?.toDate().getDate() === calendarDay &&
            doc.data()?.start?.toDate().getMonth() + 1 === monthNumber &&
            doc.data()?.resources &&
            doc.data()?.resources.includes(resource.id) &&
            reasons.includes(getProVetIdFromUrl(doc.data()?.reason))
          )
            existingAppointments.push({
              id: Number(doc.id),
              reason: getProVetIdFromUrl(doc.data()?.reason),
              resources: doc.data()?.resources,
              start: doc.data()?.start?.toDate()?.toLocaleString("en-US", {
                timeZone: "America/Denver",
                hour: "numeric",
                minute: "numeric",
                hour12: false,
              }),
              end: doc.data()?.end?.toDate()?.toLocaleString("en-US", {
                timeZone: "America/Denver",
                hour: "numeric",
                minute: "numeric",
                hour12: false,
              }),
            });
        });
      }
      //if (environment.type === "production")
      // existingAppointments.push({
      //   id: null,
      //   reason: null,
      //   resources: [resource?.id],
      //   start: formatTimeHoursToString(standardLunchTime),
      //   end: addMinutes(
      //     standardLunchDuration,
      //     formatTimeHoursToDate(standardLunchTime),
      //   ).toLocaleString("en-US", {
      //     timeZone: "America/Denver",
      //     hour: "numeric",
      //     minute: "numeric",
      //     hour12: false,
      //   }),
      // });
      // if (scheduleClosures && scheduleClosures.length > 0)
      //   scheduleClosures.map((closure: any) => {
      //     if (DEBUG_EXISTING_APPOINTMENTS) {
      //       console.log(
      //         "closure.getDate()      => ",
      //         closure?.date?.toDate().getDate(),
      //       );
      //       console.log("calendarDay", calendarDay);
      //       console.log(
      //         "closure.getMonth() + 1 => ",
      //         closure?.date?.toDate().getMonth() + 1,
      //       );
      //       console.log("monthNumber          => ", monthNumber);
      //     }
      //     if (
      //       closure?.date?.toDate().getDate() === calendarDay &&
      //       closure?.date?.toDate().getMonth() + 1 === monthNumber
      //     ) {
      //       if (DEBUG_EXISTING_APPOINTMENTS) console.log("closure =>", closure);

      //       existingAppointments.push({
      //         id: null,
      //         reason: closure?.name,
      //         resources: [resource.id],
      //         start: formatTimeHoursToString(closure?.startTime),
      //         end: formatTimeHoursToString(closure?.endTime),
      //       });
      //     }
      //   });
      if (DEBUG_EXISTING_APPOINTMENTS)
        console.log("existingAppointments => ", existingAppointments);
      return existingAppointments;
    })
    .catch((error: any) => throwError(error));
};
const getReasons = async (schedule: AppointmentScheduleTypes) =>
  await admin
    .firestore()
    .collection("reasons")
    .get()
    .then((querySnapshot: any) => {
      let reasonGroup: any = null;
      if (schedule === "clinic") reasonGroup = 36;
      else if (schedule === "housecall") reasonGroup = 35;
      else if (schedule === "virtual") reasonGroup = 37;
      const reasons: Array<string> = [];
      if (querySnapshot?.docs?.length > 0)
        querySnapshot.forEach(async (doc: any) => {
          if (
            doc.data().isVisible &&
            !doc.data().archived &&
            reasonGroup === doc.data().group
          )
            reasons.push(doc.data()?.id);
          else if (doc.data().id === 106 && schedule === "clinic")
            reasons.push(doc.data()?.id);
          else if (
            (doc.data().id === 105 || doc.data().id === 111) &&
            schedule === "housecall"
          )
            reasons.push(doc.data()?.id);
        });
      //if (DEBUG) console.log("reasons", reasons);
      return reasons;
    })
    .catch((error: any) => throwError(error));
const calculateAvailableAppointments = async ({
  // schedule,
  existingAppointmentsForResource,
  date,
  standardOpenTime,
  standardCloseTime,
  appointmentDuration,
  appointmentBuffer,
  sameDayAppointmentLeadTime,
  resource,
}: any) => {
  const calendarDay = Number(
    new Date(date)?.toLocaleDateString("en-US", {
      timeZone: "America/Denver",
      day: "numeric",
    }),
  );
  const monthNumber = new Date(date).getMonth() + 1;
  const yearNumber = new Date(date).getFullYear();
  const appointmentSlotsToRemove: any = [];
  let availableAppointmentSlots = [];
  let staggeredOpenTime: null | number = null;
  const numberOfAppointments = Math.floor(
    differenceInMinutes(
      formatTimeHoursToDate(standardOpenTime),
      formatTimeHoursToDate(standardCloseTime),
    ) / appointmentDuration,
  );
  if (DEBUG_CALCULATE_APPOINTMENTS) {
    console.log("---------- calculateAvailableAppointments ----------");
    console.log("calendarDay                     => ", calendarDay);
    console.log("monthNumber                     => ", monthNumber);
    console.log("yearNumber                      => ", yearNumber);
    console.log("standardOpenTime                => ", standardOpenTime);
    console.log("standardCloseTime               => ", standardCloseTime);
    console.log("numberOfAppointments            => ", numberOfAppointments);
    console.log(
      "existingAppointmentsForResource => ",
      existingAppointmentsForResource,
    );
  }
  if (resource.staggerTime !== 0) {
    staggeredOpenTime = Number(
      addMinutes(resource.staggerTime, formatTimeHoursToDate(standardOpenTime))
        .toLocaleString("en-US", {
          timeZone: "America/Denver",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
        .replaceAll(":", ""),
    );
  }
  let nextAppointmentStartTime =
    resource.staggerTime === 0 ? standardOpenTime : staggeredOpenTime;
  for (let i = 0; i < numberOfAppointments; i++) {
    if (
      !isAfter(
        formatTimeHoursToDate(standardCloseTime),
        formatTimeHoursToDate(nextAppointmentStartTime),
      ) &&
      !isEqual(
        formatTimeHoursToDate(standardCloseTime),
        formatTimeHoursToDate(nextAppointmentStartTime),
      )
    )
      availableAppointmentSlots.push({
        name: i,
        resource: resource?.id,
        start: formatTimeHoursToString(nextAppointmentStartTime),
        end: getTimeHoursFromDate(
          addMinutes(
            appointmentDuration,
            formatTimeHoursToDate(nextAppointmentStartTime),
          ),
        ),
      });
    nextAppointmentStartTime = getTimeHoursFromDate(
      addMinutes(
        appointmentBuffer,
        addMinutes(
          appointmentDuration,
          formatTimeHoursToDate(nextAppointmentStartTime),
        ),
      ),
    );
    if (nextAppointmentStartTime.length === 4)
      nextAppointmentStartTime = `0${nextAppointmentStartTime}`;
    if (DEBUG_CALCULATE_APPOINTMENTS) {
      console.log("staggerTime              => ", resource.staggerTime);
      console.log("staggeredOpenTime        => ", staggeredOpenTime);
      console.log(
        "nextAppointmentStartTime => ",
        formatTimeHoursToDate(nextAppointmentStartTime),
      );
    }
  }

  if (
    new Date()?.getDate() === calendarDay &&
    new Date()?.getMonth() + 1 === monthNumber &&
    new Date()?.getFullYear() === yearNumber
  ) {
    const pastAppointments: any = [];
    const bufferTime = Number(
      addMinutes(sameDayAppointmentLeadTime, new Date())
        .toLocaleTimeString("en-US", {
          timeZone: "America/Denver",
          hour12: false,
          hour: "numeric",
          minute: "numeric",
        })
        .replaceAll(":", ""),
    );
    if (DEBUG_CALCULATE_APPOINTMENTS) {
      console.log("sameDayAppointmentLeadTime => ", sameDayAppointmentLeadTime);
      console.log("bufferTime                 => ", bufferTime);
    }
    availableAppointmentSlots.map((availableAppointmentSlot: any) => {
      if (
        Number(availableAppointmentSlot.start.replaceAll(":", "")) < bufferTime
      )
        pastAppointments.push(availableAppointmentSlot);
    });
    if (DEBUG_CALCULATE_APPOINTMENTS)
      console.log("pastAppointments       => ", pastAppointments);
    availableAppointmentSlots = availableAppointmentSlots.filter(
      (appointmentSlot: any) => !pastAppointments.includes(appointmentSlot),
    );
  }
  //const forcedOpenings = await getForcedOpenings(schedule);
  if (DEBUG_CALCULATE_APPOINTMENTS) {
    console.log("availableAppointmentSlots => ", availableAppointmentSlots);
    //console.log("forcedOpenings            => ", forcedOpenings);
  }
  availableAppointmentSlots.map((availableAppointmentSlot: any) => {
    existingAppointmentsForResource.map((existingAppointment: any) => {
      if (DEBUG_CALCULATE_APPOINTMENTS) {
        console.log(
          "existingAppointment.start                             => ",
          existingAppointment.start,
        );
        console.log(
          "existingAppointment.end                               => ",
          existingAppointment.end,
        );
        console.log(
          "availableAppointmentSlot.start                        => ",
          availableAppointmentSlot.start,
        );
        console.log(
          "availableAppointmentSlot.start                        => ",
          availableAppointmentSlot.start,
        );
        console.log(
          "formatTimeHoursToDate(existingAppointment.start       => ",
          formatTimeHoursToDate(existingAppointment.start),
        );
        console.log(
          "formatTimeHoursToDate(existingAppointment.end         => ",
          formatTimeHoursToDate(existingAppointment.end),
        );
        console.log(
          "formatTimeHoursToDate(availableAppointmentSlot.start) => ",
          formatTimeHoursToDate(availableAppointmentSlot.start),
        );
        console.log(
          "formatTimeHoursToDate(availableAppointmentSlot.end)   => ",
          formatTimeHoursToDate(availableAppointmentSlot.end),
        );
      }
      if (
        areIntervalsOverlapping(
          {
            start: formatTimeHoursToDate(existingAppointment.start),
            end: formatTimeHoursToDate(existingAppointment.end),
          },
          {
            start: formatTimeHoursToDate(availableAppointmentSlot.start),
            end: formatTimeHoursToDate(availableAppointmentSlot.end),
          },
        ) &&
        !appointmentSlotsToRemove.includes(availableAppointmentSlot)
      ) {
        if (DEBUG_CALCULATE_APPOINTMENTS)
          console.log("INTERVAL NOT OVERLAPPING", {
            availableAppointmentSlot,
            existingAppointment,
          });
        // if (forcedOpenings && forcedOpenings.length > 0)
        //   forcedOpenings.forEach((opening: any) => {
        //     if (DEBUG_CALCULATE_APPOINTMENTS) {
        //       console.log(
        //         "forcedOpening Date        => ",
        //         opening?.date?.toDate().getDate(),
        //       );
        //       console.log("forcedOpening calendarDay => ", calendarDay);
        //       console.log(
        //         "forcedOpening Month       => ",
        //         opening?.date?.toDate().getMonth() + 1,
        //       );
        //       console.log("forcedOpening monthNumber => ", monthNumber);
        //     }
        //     if (
        //       opening?.date?.toDate().getDate() === calendarDay &&
        //       opening?.date?.toDate().getMonth() + 1 === monthNumber &&
        //       opening?.date?.toDate().getFullYear() === yearNumber
        //     ) {
        //       if (DEBUG) console.log("Schedule opening Found =>", opening);
        //       const selectedDayStartHours =
        //         availableAppointmentSlot.start.toString().length === 3
        //           ? `0${availableAppointmentSlot.start}`.slice(0, 2)
        //           : `${availableAppointmentSlot.start}`.slice(0, 2);
        //       const selectedDayStartMinutes =
        //         availableAppointmentSlot.start.toString().length === 3
        //           ? `0${availableAppointmentSlot.start}`.slice(2)
        //           : `${availableAppointmentSlot.start}`.slice(3)?.length === 1
        //             ? `0${availableAppointmentSlot.start}`.slice(3)
        //             : `${availableAppointmentSlot.start}`.slice(3);
        //       const forcedOpenStartHours =
        //         opening.startTime.toString().length === 3
        //           ? `0${opening.startTime}`.slice(0, 2)
        //           : `${opening.startTime}`.slice(0, 2);
        //       const forcedOpenStartMinutes =
        //         opening.startTime.toString().length === 3
        //           ? `0${opening.startTime}`.slice(2)
        //           : `${opening.startTime}`.slice(3)?.length === 1
        //             ? `0${opening.startTime}`.slice(3)
        //             : `${opening.startTime}`.slice(3);
        //       const forcedOpenCloseHours =
        //         opening.endTime.toString().length === 3
        //           ? `0${opening.endTime}`.slice(0, 2)
        //           : `${opening.endTime}`.slice(0, 2);
        //       const forcedOpenCloseMinutes =
        //         opening.endTime.toString().length === 3
        //           ? `0${opening.endTime}`.slice(2)
        //           : `${opening.endTime}`.slice(3)?.length === 1
        //             ? `0${opening.endTime}`.slice(3)
        //             : `${opening.endTime}`.slice(3);
        //       if (DEBUG_CALCULATE_APPOINTMENTS) {
        //         console.log("interval", {
        //           start: new Date(
        //             `${yearNumber} ${monthNumber} ${calendarDay} ` +
        //               [forcedOpenStartHours, ":", forcedOpenStartMinutes].join(
        //                 "",
        //               ) +
        //               ":00",
        //           ),
        //           end: new Date(
        //             `${yearNumber} ${monthNumber} ${calendarDay} ` +
        //               [forcedOpenCloseHours, ":", forcedOpenCloseMinutes].join(
        //                 "",
        //               ) +
        //               ":00",
        //           ),
        //         });
        //         console.log(
        //           "apt slot",
        //           new Date(
        //             `${yearNumber} ${monthNumber} ${calendarDay} ` +
        //               [
        //                 selectedDayStartHours,
        //                 ":",
        //                 selectedDayStartMinutes,
        //               ].join("") +
        //               ":00",
        //           ),
        //         );
        //       }
        //       if (
        //         !isWithinInterval(
        //           {
        //             start: new Date(
        //               `${yearNumber} ${monthNumber} ${calendarDay} ` +
        //                 [
        //                   forcedOpenStartHours,
        //                   ":",
        //                   forcedOpenStartMinutes,
        //                 ].join("") +
        //                 ":00",
        //             ),
        //             end: new Date(
        //               `${yearNumber} ${monthNumber} ${calendarDay} ` +
        //                 [
        //                   forcedOpenCloseHours,
        //                   ":",
        //                   forcedOpenCloseMinutes,
        //                 ].join("") +
        //                 ":00",
        //             ),
        //           },
        //           new Date(
        //             `${yearNumber} ${monthNumber} ${calendarDay} ` +
        //               [
        //                 selectedDayStartHours,
        //                 ":",
        //                 selectedDayStartMinutes,
        //               ].join("") +
        //               ":00",
        //           ),
        //         )
        //       )
        //         appointmentSlotsToRemove.push(availableAppointmentSlot);
        //       else
        //         console.log(
        //           "SKIPPING CLOSURE REMOVAL DUE TO OVERLAP W/ FORCED OPENING",
        //           {
        //             start: new Date(
        //               `${yearNumber} ${monthNumber} ${calendarDay} ` +
        //                 [
        //                   forcedOpenStartHours,
        //                   ":",
        //                   forcedOpenStartMinutes,
        //                 ].join("") +
        //                 ":00",
        //             ),
        //             end: new Date(
        //               `${yearNumber} ${monthNumber} ${calendarDay} ` +
        //                 [
        //                   forcedOpenCloseHours,
        //                   ":",
        //                   forcedOpenCloseMinutes,
        //                 ].join("") +
        //                 ":00",
        //             ),
        //           },
        //         );
        //     } else {
        //       appointmentSlotsToRemove.push(availableAppointmentSlot);
        //     }
        //   });
        // else
        appointmentSlotsToRemove.push(availableAppointmentSlot);
      } else if (DEBUG_CALCULATE_APPOINTMENTS)
        console.log("INTERVALS ARE OVERLAPPING", {
          availableAppointmentSlot,
          existingAppointment,
        });
    });
  });
  if (DEBUG_CALCULATE_APPOINTMENTS) {
    console.log("availableAppointmentSlots => ", availableAppointmentSlots);
    console.log("appointmentSlotsToRemove  => ", appointmentSlotsToRemove);
  }
  return availableAppointmentSlots.filter(
    (appointmentSlot: any) =>
      !appointmentSlotsToRemove.includes(appointmentSlot),
  );
};
// const getScheduledClosures = async (schedule: string) =>
//   await admin
//     .firestore()
//     .collection("configuration")
//     .doc("closures")
//     .get()
//     .then((doc: any) =>
//       schedule === "clinic"
//         ? doc.data()?.closureDatesClinic || false
//         : schedule === "housecall"
//           ? doc.data()?.closureDatesHousecall || false
//           : doc.data()?.closureDatesVirtual || false,
//     )
//     .catch((error: any) => throwError(error));

// const getForcedOpenings = async (schedule: string) =>
//   await admin
//     .firestore()
//     .collection("configuration")
//     .doc("openings")
//     .get()
//     .then((doc: any) =>
//       schedule === "clinic"
//         ? doc.data()?.openingDatesClinic || false
//         : schedule === "housecall"
//           ? doc.data()?.openingDatesHousecall || false
//           : doc.data()?.openingDatesVirtual || false,
//     )
//     .catch((error: any) => throwError(error));
