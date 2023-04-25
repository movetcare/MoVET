import {
  addMinutes,
  areIntervalsOverlapping,
  differenceInMinutes,
  isAfter,
  isEqual,
} from "date-fns/fp";
// TODOs:
// Number of rooms available in clinic
// Filter down schedules by ward
// Integrate closures with provet appointments
// Migrate appointments veterinary filed (Clinic, housecall, virtual) to wards

import {
  admin,
  defaultRuntimeOptions,
  functions,
  throwError,
} from "../../config/config";
import { formatTimeHoursToDate } from "../../utils/formatTimeHoursToDate";
import { formatTimeHoursToString } from "../../utils/formatTimeHoursToString";
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
import { getTimeHoursFromDate } from "../../utils/getTimeHoursFromDate";

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
          const configuration = await getConfiguration();
          let standardOpenTime: any,
            standardCloseTime: any,
            standardLunchTime: any,
            standardLunchDuration: any,
            appointmentBuffer: any,
            sameDayAppointmentLeadTime: any,
            appointmentDuration: any = null;
          switch (schedule) {
            case "clinic":
              standardOpenTime = configuration?.clinicStartTime;
              standardCloseTime = configuration?.clinicEndTime;
              standardLunchTime = configuration?.clinicLunchTime;
              standardLunchDuration = configuration?.clinicLunchDuration;
              sameDayAppointmentLeadTime =
                configuration?.clinicSameDayAppointmentLeadTime;
              appointmentBuffer = configuration?.clinicAppointmentBufferTime;
              appointmentDuration =
                patients?.length >= 3
                  ? configuration?.clinicThreePatientDuration
                  : patients?.length === 2
                  ? configuration?.clinicTwoPatientDuration
                  : configuration?.clinicOnePatientDuration;
              break;
            case "housecall":
              standardOpenTime = configuration?.housecallStartTime;
              standardCloseTime = configuration?.housecallEndTime;
              standardLunchTime = configuration?.housecallLunchTime;
              standardLunchDuration = configuration?.housecallLunchDuration;
              appointmentBuffer = configuration?.housecallAppointmentBufferTime;
              sameDayAppointmentLeadTime =
                configuration?.housecallSameDayAppointmentLeadTime;
              appointmentDuration =
                patients?.length >= 3
                  ? configuration?.housecallThreePatientDuration
                  : patients?.length === 2
                  ? configuration?.housecallTwoPatientDuration
                  : configuration?.housecallOnePatientDuration;
              break;
            case "virtual":
              standardOpenTime = configuration?.startStartTime;
              standardCloseTime = configuration?.startEndTime;
              standardLunchTime = configuration?.startLunchTime;
              standardLunchDuration = configuration?.startLunchDuration;
              sameDayAppointmentLeadTime =
                configuration?.virtualSameDayAppointmentLeadTime;
              appointmentBuffer = configuration?.virtualAppointmentBufferTime;
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
          if (DEBUG) {
            console.log("standardOpenTime", standardOpenTime);
            console.log("standardCloseTime", standardCloseTime);
            console.log("standardLunchTime", standardLunchTime);
            console.log("standardLunchDuration", standardLunchDuration);
            console.log("appointmentDuration", appointmentDuration);
            console.log("appointmentBuffer", appointmentBuffer);
          }
          existingAppointments = await admin
            .firestore()
            .collection("appointments")
            .where("active", "==", 1)
            .where("start", ">=", new Date(date))
            .orderBy("start", "asc")
            .get()
            .then(async (querySnapshot: any) => {
              const appointments: Array<{
                start: any;
                end: any;
                name: string | null | number;
              }> = [];
              const scheduleClosures = await admin
                .firestore()
                .collection("configuration")
                .doc("closures")
                .get()
                .then((doc: any) => {
                  if (DEBUG)
                    console.log(
                      "configuration/closures => doc.data()",
                      doc.data()
                    );
                  return schedule === "clinic"
                    ? doc.data()?.closureDatesClinic
                    : schedule === "housecall"
                    ? doc.data()?.closureDatesHousecall
                    : doc.data()?.closureDatesVirtual;
                })
                .catch((error: any) => throwError(error));
              if (DEBUG) {
                console.log(
                  "querySnapshot?.docs?.length",
                  querySnapshot?.docs?.length
                );
                console.log("scheduleClosures", scheduleClosures);
              }
              if (querySnapshot?.docs?.length > 0) {
                const reasons = await admin
                  .firestore()
                  .collection("reasons")
                  .where("isVisible", "==", true)
                  .get()
                  .then((querySnapshot: any) => {
                    if (DEBUG)
                      console.log(
                        "querySnapshot?.docs?.length",
                        querySnapshot?.docs?.length
                      );
                    const reasons: Array<string> = [];
                    if (querySnapshot?.docs?.length > 0)
                      querySnapshot.forEach(async (doc: any) => {
                        reasons.push(doc.data()?.id);
                      });
                    return reasons;
                  })
                  .catch((error: any) => throwError(error));
                querySnapshot.forEach(async (doc: any) => {
                  if (
                    doc.data()?.start?.toDate().getDate() === calendarDay &&
                    doc.data()?.start?.toDate().getMonth() === monthNumber &&
                    reasons.includes(getProVetIdFromUrl(doc.data()?.reason))
                  )
                    appointments.push({
                      name: getProVetIdFromUrl(doc.data()?.reason),
                      start: doc
                        .data()
                        ?.start?.toDate()
                        ?.toLocaleString("en-US", {
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
              const lunchStart =
                standardLunchTime?.toString()?.length === 3
                  ? new Date(
                      "February 04, 2022 " +
                        [
                          `0${standardLunchTime}`.slice(0, 2),
                          ":",
                          `0${standardLunchTime}`.slice(2),
                        ].join("") +
                        ":00"
                    ).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                    })
                  : new Date(
                      "February 04, 2022 " +
                        [
                          `${standardLunchTime}`.slice(0, 2),
                          ":",
                          `${standardLunchTime}`.slice(2),
                        ].join("") +
                        ":00"
                    ).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                    });
              const lunchEnd = addMinutes(
                standardLunchDuration,
                standardLunchTime?.toString().length === 3
                  ? new Date(
                      "February 04, 2022 " +
                        [
                          `0${standardLunchTime}`.slice(0, 2),
                          ":",
                          `0${standardLunchTime}`.slice(2),
                        ].join("") +
                        ":00"
                    )
                  : (new Date(
                      "February 04, 2022 " +
                        [
                          `${standardLunchTime}`.slice(0, 2),
                          ":",
                          `${standardLunchTime}`.slice(2),
                        ].join("") +
                        ":00"
                    ) as any)
              ).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: false,
              });
              if (DEBUG) {
                console.log("lunchStart", lunchStart);
                console.log("lunchEnd", lunchEnd);
              }
              appointments.push({
                name: "Lunch",
                start: lunchStart,
                end: lunchEnd,
              });
              scheduleClosures.map((closure: any) => {
                if (
                  closure?.date?.toDate().getDate() === calendarDay &&
                  closure?.date?.toDate().getMonth() === monthNumber
                ) {
                  if (DEBUG) console.log("Schedule Closure Found =>", closure);
                  appointments.push({
                    name: closure?.name,
                    start:
                      closure?.startTime.toString().length === 3
                        ? new Date(
                            "February 04, 2022 " +
                              [
                                `0${closure?.startTime}`.slice(0, 2),
                                ":",
                                `0${closure?.startTime}`.slice(2),
                              ].join("") +
                              ":00"
                          ).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false,
                          })
                        : new Date(
                            "February 04, 2022 " +
                              [
                                `${closure?.startTime}`.slice(0, 2),
                                ":",
                                `${closure?.startTime}`.slice(2),
                              ].join("") +
                              ":00"
                          ).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false,
                          }),
                    end:
                      closure?.endTime.toString().length === 3
                        ? new Date(
                            "February 04, 2022 " +
                              [
                                `0${closure?.endTime}`.slice(0, 2),
                                ":",
                                `0${closure?.endTime}`.slice(2),
                              ].join("") +
                              ":00"
                          ).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false,
                          })
                        : new Date(
                            "February 04, 2022 " +
                              [
                                `${closure?.endTime}`.slice(0, 2),
                                ":",
                                `${closure?.endTime}`.slice(2),
                              ].join("") +
                              ":00"
                          ).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false,
                          }),
                  });
                }
              });
              if (DEBUG) console.log("appointments", appointments);
              return appointments;
            })
            .catch((error: any) => throwError(error));
          const numberOfAppointments = Math.floor(
            differenceInMinutes(
              formatTimeHoursToDate(standardOpenTime),
              formatTimeHoursToDate(standardCloseTime)
            ) / appointmentDuration
          );
          if (DEBUG) {
            console.log("numberOfAppointments", numberOfAppointments);
            console.log("existingAppointments", existingAppointments);
          }
          let availableAppointmentSlots = [];
          let nextAppointmentStartTime = standardOpenTime;
          for (let i = 0; i < numberOfAppointments; i++) {
            if (DEBUG)
              console.log(
                "nextAppointmentStartTime",
                formatTimeHoursToDate(nextAppointmentStartTime)
              );
            if (
              !isAfter(
                formatTimeHoursToDate(standardCloseTime),
                formatTimeHoursToDate(nextAppointmentStartTime)
              ) &&
              !isEqual(
                formatTimeHoursToDate(standardCloseTime),
                formatTimeHoursToDate(nextAppointmentStartTime)
              )
            )
              availableAppointmentSlots.push({
                name: i,
                start: formatTimeHoursToString(nextAppointmentStartTime),
                end: getTimeHoursFromDate(
                  addMinutes(
                    appointmentDuration,
                    formatTimeHoursToDate(nextAppointmentStartTime)
                  )
                ),
              });
            nextAppointmentStartTime = getTimeHoursFromDate(
              addMinutes(
                appointmentBuffer,
                addMinutes(
                  appointmentDuration,
                  formatTimeHoursToDate(nextAppointmentStartTime)
                )
              )
            );
            if (nextAppointmentStartTime.length === 4)
              nextAppointmentStartTime = `0${nextAppointmentStartTime}`;
          }
          if (
            new Date()?.getDate() === calendarDay &&
            new Date()?.getMonth() === monthNumber
          ) {
            if (DEBUG) {
              console.log("REMOVING PAST APPOINTMENTS!");
              console.log(
                "sameDayAppointmentLeadTime",
                sameDayAppointmentLeadTime
              );
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
                .replaceAll(":", "")
            );
            if (DEBUG) {
              console.log("90 MIN FROM NOW", bufferTime);
            }
            availableAppointmentSlots.map((availableAppointmentSlot: any) => {
              if (
                Number(availableAppointmentSlot.start.replaceAll(":", "")) <
                bufferTime
              )
                pastAppointments.push(availableAppointmentSlot);
            });
            if (DEBUG) console.log("pastAppointments", pastAppointments);
            availableAppointmentSlots = availableAppointmentSlots.filter(
              (appointmentSlot: any) =>
                !pastAppointments.includes(appointmentSlot)
            );
          }
          const appointmentSlotsToRemove: any = [];
          availableAppointmentSlots.map((availableAppointmentSlot: any) => {
            existingAppointments.map((existingAppointment: any) => {
              if (
                areIntervalsOverlapping(
                  {
                    start: formatTimeHoursToDate(existingAppointment.start),
                    end: formatTimeHoursToDate(existingAppointment.end),
                  },
                  {
                    start: formatTimeHoursToDate(
                      availableAppointmentSlot.start
                    ),
                    end: formatTimeHoursToDate(availableAppointmentSlot.end),
                  }
                ) &&
                !appointmentSlotsToRemove.includes(availableAppointmentSlot)
              ) {
                if (DEBUG)
                  console.log("INTERVAL NOT OVERLAPPING", {
                    availableAppointmentSlot,
                    existingAppointment,
                  });
                appointmentSlotsToRemove.push(availableAppointmentSlot);
              } else if (DEBUG)
                console.log("INTERVALS ARE OVERLAPPING", {
                  availableAppointmentSlot,
                  existingAppointment,
                });
            });
          });
          if (DEBUG) {
            console.log("availableAppointmentSlots", availableAppointmentSlots);
            console.log("appointmentSlotsToRemove", appointmentSlotsToRemove);
          }
          return availableAppointmentSlots.filter(
            (appointmentSlot: any) =>
              !appointmentSlotsToRemove.includes(appointmentSlot)
          );
        } else return closedReason || "Something Went Wrong...";
      }
      return "Patient(s) Required - Please try again...";
    }
  );

const getConfiguration = async () =>
  await admin
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
  const configuration = await getConfiguration();
  const globalClosures = await admin
    .firestore()
    .collection("configuration")
    .doc("closures")
    .get()
    .then((doc: any) => {
      if (DEBUG)
        console.log("configuration/closures => doc.data()", doc.data());
      return doc.data()?.closureDates;
    })
    .catch((error: any) => throwError(error));
  if (DEBUG) console.log("globalClosures", globalClosures);
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
