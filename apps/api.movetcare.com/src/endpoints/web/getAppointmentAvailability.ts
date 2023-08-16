import {
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
  environment,
} from "../../config/config";
import { formatTimeHoursToDate } from "../../utils/formatTimeHoursToDate";
import { formatTimeHoursToString } from "../../utils/formatTimeHoursToString";
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
import { getTimeHoursFromDate } from "../../utils/getTimeHoursFromDate";
const DEBUG = true;
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
      date: any;
      schedule: AppointmentScheduleTypes;
      patients: Array<string>;
    }): Promise<any> => {
      if (DEBUG) {
        console.log("date", date);
        console.log("patients", patients);
        console.log("schedule", schedule);
      }
      if (patients && patients.length > 0) {
        const {
          standardOpenTime,
          standardCloseTime,
          standardLunchTime,
          standardLunchDuration,
          appointmentBuffer,
          sameDayAppointmentLeadTime,
          resources,
          appointmentDuration,
        } = await assignConfiguration({ schedule, patients, date });
        const { isOpenOnDate, closedReason } = await verifyScheduleIsOpen(
          schedule,
          patients,
          date,
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
                date,
                schedule,
                resource,
                standardLunchTime,
                standardLunchDuration,
              });
              allAvailableAppointmentTimes.push(
                await calculateAvailableAppointments({
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
          if (DEBUG)
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
          if (DEBUG)
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
        } else return closedReason || "Something Went Wrong...";
      }
      return "Loading...";
    },
  );
const getConfiguration = async () =>
  await admin
    .firestore()
    .collection("configuration")
    .doc("bookings")
    .get()
    .then((doc: any) => {
      // if (DEBUG)
      //   console.log("configuration/bookings => doc.data()", doc.data());
      return doc.data();
    })
    .catch((error: any) => throwError(error));
const assignConfiguration = async ({
  schedule,
  patients,
  date,
}: {
  schedule: AppointmentScheduleTypes;
  patients: Array<string>;
  date: any;
}): Promise<{
  standardOpenTime: any;
  standardCloseTime: any;
  standardLunchTime: any;
  standardLunchDuration: any;
  appointmentBuffer: any;
  sameDayAppointmentLeadTime: any;
  resources: any;
  appointmentDuration: any;
}> => {
  const configuration = await getConfiguration();
  const weekdayNumber = new Date(date).getDay();
  let standardOpenTime: any,
    standardCloseTime: any,
    standardLunchTime: any,
    standardLunchDuration: any,
    appointmentBuffer: any,
    sameDayAppointmentLeadTime: any,
    resources: any,
    appointmentDuration: any = null;
  switch (schedule) {
    case "clinic":
      standardLunchTime = configuration?.clinicLunchTime;
      standardLunchDuration = configuration?.clinicLunchDuration;
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
      standardLunchTime = configuration?.housecallLunchTime;
      standardLunchDuration = configuration?.housecallLunchDuration;
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
      standardLunchTime = configuration?.virtualLunchTime;
      standardLunchDuration = configuration?.virtualLunchDuration;
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
  if (DEBUG) {
    console.log("standardOpenTime INIT", standardOpenTime);
    console.log("standardCloseTime", standardCloseTime);
    console.log("standardLunchTime", standardLunchTime);
    console.log("standardLunchDuration", standardLunchDuration);
    console.log("appointmentDuration", appointmentDuration);
    console.log("appointmentBuffer", appointmentBuffer);
  }
  return {
    standardOpenTime,
    standardCloseTime,
    standardLunchTime,
    standardLunchDuration,
    appointmentBuffer,
    sameDayAppointmentLeadTime,
    resources,
    appointmentDuration,
  };
};
const verifyScheduleIsOpen = async (
  schedule: string,
  patients: Array<string>,
  date: string,
): Promise<{ isOpenOnDate: boolean; closedReason: string | null }> => {
  if (DEBUG) console.log("verifyScheduleIsOpen", { schedule, patients, date });
  let isOpenOnDate = false;
  let vcprRequired = false;
  const calendarDay = Number(
    new Date(date.slice(0, -13) + "24:00:00.000Z")?.toLocaleDateString(
      "en-us",
      {
        day: "numeric",
      },
    ),
  );
  if (DEBUG) {
    console.log("FIRST calendarDay", calendarDay);
    console.log("exactDateString", date.slice(0, -13) + "24:00:00.000Z");
  }
  const monthNumber = new Date(date).getMonth();
  const weekdayNumber = new Date(date).getDay();
  const configuration = await getConfiguration();
  const globalClosures = await admin
    .firestore()
    .collection("configuration")
    .doc("closures")
    .get()
    .then((doc: any) => {
      // if (DEBUG)
      //   console.log("configuration/closures => doc.data()", doc.data());
      return doc.data()?.closureDates;
    })
    .catch((error: any) => throwError(error));
  // if (DEBUG) console.log("globalClosures", globalClosures);
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
        // if (DEBUG) {
        //   console.log("date", new Date(date));
        //   console.log("closure OBJECT", closure);
        //   console.log("closure.startDate", closure.startDate.toDate());
        //   console.log("closure.endDate", closure.endDate.toDate());
        //   console.log(
        //     "date >= closure.startDate",
        //     new Date(date) >= closure.startDate.toDate()
        //   );
        //   console.log(
        //     "date <= closure.endDate",
        //     new Date(date) <= closure.endDate.toDate()
        //   );
        // }
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
          case "virtual":
            if (closure.isActiveForTelehealth) {
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
          default:
            closureData = {
              isOpenOnDate: false,
              closedReason: "SCHEDULE ERROR",
            };
        }
        // if (DEBUG) console.log("isGlobalClosure", isGlobalClosure);
      },
    );
    if (isGlobalClosure && closureData) return closureData;
  }
  if (DEBUG)
    console.log(
      "configuration?.clinicOpenSaturday",
      configuration?.clinicOpenSaturday,
    );
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
  if (DEBUG) {
    console.log("VCPR Required - Skipping Today's Appointments");
    console.log("vcprRequired", vcprRequired);
    console.log(
      "schedule",
      schedule === "clinic"
        ? configuration?.clinicSameDayAppointmentVcprRequired
        : schedule === "housecall"
        ? configuration?.housecallSameDayAppointmentVcprRequired
        : schedule === "virtual"
        ? configuration?.virtualSameDayAppointmentVcprRequired
        : null,
    );
    console.log("schedule", schedule);
    console.log("calendarDay", calendarDay);
    console.log("new Date().getDate()", new Date().getDate());
    console.log("monthNumber", monthNumber);
    console.log("new Date().getMonth()", new Date().getMonth());
    console.log(
      "calendarDay === new Date().getDate()",
      calendarDay === new Date().getDate(),
    );
    console.log(
      "monthNumber === new Date().getMonth()",
      monthNumber === new Date().getMonth(),
    );
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
    monthNumber === new Date().getMonth()
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
  standardLunchTime,
  standardLunchDuration,
}: {
  date: string;
  schedule: AppointmentScheduleTypes;
  resource: ActiveResource;
  standardLunchTime: number;
  standardLunchDuration: number;
}) =>
  await admin
    .firestore()
    .collection("appointments")
    .where("active", "==", 1)
    .where("start", ">=", new Date(date))
    .orderBy("start", "asc")
    .get()
    .then(async (querySnapshot: any) => {
      const calendarDay = Number(
        new Date(date.slice(0, -13) + "24:00:00.000Z")?.toLocaleDateString(
          "en-us",
          {
            day: "numeric",
          },
        ),
      );
      const monthNumber = new Date(date).getMonth();
      const existingAppointments: Array<Appointment> = [];
      const scheduleClosures = await getScheduledClosures(schedule);
      if (DEBUG) {
        console.log("querySnapshot?.docs?.length", querySnapshot?.docs?.length);
        console.log("scheduleClosures", scheduleClosures);
      }
      if (querySnapshot?.docs?.length > 0) {
        const reasons = await getReasons(schedule);
        querySnapshot.forEach(async (doc: any) => {
          if (DEBUG) {
            console.log("appointment id", doc.id);
            console.log("resource", resource);
            console.log("doc.data()?.resources", doc.data()?.resources);
            console.log(
              "doc.data()?.resources.includes(resource.id)",
              doc.data()?.resources &&
                doc.data()?.resources.includes(resource.id),
            );
          }
          if (
            doc.data()?.start?.toDate().getDate() === calendarDay &&
            doc.data()?.start?.toDate().getMonth() === monthNumber &&
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
      if (environment.type === "production")
        existingAppointments.push({
          id: null,
          reason: null,
          resources: [resource?.id],
          start: formatTimeHoursToString(standardLunchTime),
          end: addMinutes(
            standardLunchDuration,
            formatTimeHoursToDate(standardLunchTime),
          ).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }),
        });
      if (scheduleClosures && scheduleClosures.length > 0)
        scheduleClosures.map((closure: any) => {
          if (
            closure?.date?.toDate().getDate() === calendarDay &&
            closure?.date?.toDate().getMonth() === monthNumber
          ) {
            // if (DEBUG) console.log("Schedule Closure Found =>", closure);
            existingAppointments.push({
              id: null,
              reason: closure?.name,
              resources: [resource.id],
              start: formatTimeHoursToString(closure?.startTime),
              end: formatTimeHoursToString(closure?.endTime),
            });
          }
        });
      if (DEBUG) console.log("existingAppointments", existingAppointments);
      return existingAppointments;
    })
    .catch((error: any) => throwError(error));
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
      // if (DEBUG) {
      //   console.log("reasonGroup", reasonGroup);
      //   console.log(
      //     "getReasons querySnapshot?.docs?.length",
      //     querySnapshot?.docs?.length
      //   );
      // }
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
      if (DEBUG) console.log("reasons", reasons);
      return reasons;
    })
    .catch((error: any) => throwError(error));
const calculateAvailableAppointments = async ({
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
    new Date(date.slice(0, -13) + "24:00:00.000Z")?.toLocaleDateString(
      "en-us",
      {
        day: "numeric",
      },
    ),
  );
  const monthNumber = new Date(date).getMonth();
  const appointmentSlotsToRemove: any = [];
  let availableAppointmentSlots = [];
  let staggeredOpenTime: null | number = null;
  const numberOfAppointments = Math.floor(
    differenceInMinutes(
      formatTimeHoursToDate(standardOpenTime),
      formatTimeHoursToDate(standardCloseTime),
    ) / appointmentDuration,
  );
  if (DEBUG) {
    console.log("standardOpenTime", standardOpenTime);
    console.log("standardCloseTime", standardCloseTime);
    console.log("numberOfAppointments", numberOfAppointments);
    console.log(
      "existingAppointmentsForResource",
      existingAppointmentsForResource,
    );
  }

  if (DEBUG) console.log("resource PRE", resource);
  if (resource.staggerTime !== 0) {
    if (DEBUG) {
      console.log("CUSTOM STAGGER TIME DETECTED", resource.staggerTime);
    }
    staggeredOpenTime = Number(
      addMinutes(resource.staggerTime, formatTimeHoursToDate(standardOpenTime))
        .toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
        .replaceAll(":", ""),
    );
    // if (DEBUG) {
    //   console.log("staggeredOpenTime", staggeredOpenTime);
    // }
  }
  let nextAppointmentStartTime =
    resource.staggerTime === 0 ? standardOpenTime : staggeredOpenTime;
  for (let i = 0; i < numberOfAppointments; i++) {
    // if (DEBUG)
    //   console.log(
    //     "nextAppointmentStartTime PRE",
    //     formatTimeHoursToDate(nextAppointmentStartTime)
    //   );
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
    // if (DEBUG)
    //   console.log(
    //     "nextAppointmentStartTime POST",
    //     formatTimeHoursToDate(nextAppointmentStartTime)
    //   );
  }

  if (
    new Date()?.getDate() === calendarDay &&
    new Date()?.getMonth() === monthNumber
  ) {
    if (DEBUG) {
      console.log("REMOVING PAST APPOINTMENTS!");
      console.log("sameDayAppointmentLeadTime", sameDayAppointmentLeadTime);
    }
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
    if (DEBUG) {
      console.log("BUFFER TIME FROM NOW", bufferTime);
    }
    availableAppointmentSlots.map((availableAppointmentSlot: any) => {
      if (
        Number(availableAppointmentSlot.start.replaceAll(":", "")) < bufferTime
      )
        pastAppointments.push(availableAppointmentSlot);
    });
    if (DEBUG) console.log("pastAppointments", pastAppointments);
    availableAppointmentSlots = availableAppointmentSlots.filter(
      (appointmentSlot: any) => !pastAppointments.includes(appointmentSlot),
    );
  }
  availableAppointmentSlots.map((availableAppointmentSlot: any) => {
    existingAppointmentsForResource.map((existingAppointment: any) => {
      if (DEBUG) {
        console.log("existingAppointment.start", existingAppointment.start);
        console.log("existingAppointment.end", existingAppointment.end);
        console.log(
          "availableAppointmentSlot.start",
          availableAppointmentSlot.start,
        );
        console.log(
          "availableAppointmentSlot.start",
          availableAppointmentSlot.start,
        );
        console.log(
          "formatTimeHoursToDate(existingAppointment.start",
          formatTimeHoursToDate(existingAppointment.start),
        );
        console.log(
          "formatTimeHoursToDate(existingAppointment.end",
          formatTimeHoursToDate(existingAppointment.end),
        );
        console.log(
          "formatTimeHoursToDate(availableAppointmentSlot.start)",
          formatTimeHoursToDate(availableAppointmentSlot.start),
        );
        console.log(
          "formatTimeHoursToDate(availableAppointmentSlot.start)",
          formatTimeHoursToDate(availableAppointmentSlot.start),
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
        // if (DEBUG)
        //   console.log("INTERVAL NOT OVERLAPPING", {
        //     availableAppointmentSlot,
        //     existingAppointment,
        //   });
        appointmentSlotsToRemove.push(availableAppointmentSlot);
      }
      // else if (DEBUG)
      //   console.log("INTERVALS ARE OVERLAPPING", {
      //     availableAppointmentSlot,
      //     existingAppointment,
      //   });
    });
  });
  if (DEBUG) {
    console.log("availableAppointmentSlots", availableAppointmentSlots);
    console.log("appointmentSlotsToRemove", appointmentSlotsToRemove);
  }
  return availableAppointmentSlots.filter(
    (appointmentSlot: any) =>
      !appointmentSlotsToRemove.includes(appointmentSlot),
  );
};
const getScheduledClosures = async (schedule: string) =>
  await admin
    .firestore()
    .collection("configuration")
    .doc("closures")
    .get()
    .then((doc: any) => {
      // if (DEBUG)
      //   console.log("configuration/closures => doc.data()", doc.data());
      return schedule === "clinic"
        ? doc.data()?.closureDatesClinic || false
        : schedule === "housecall"
        ? doc.data()?.closureDatesHousecall || false
        : doc.data()?.closureDatesVirtual || false;
    })
    .catch((error: any) => throwError(error));
