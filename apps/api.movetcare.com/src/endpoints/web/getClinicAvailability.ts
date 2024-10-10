import {
  differenceInMinutes,
  addMinutes,
  isAfter,
  isEqual,
  areIntervalsOverlapping,
} from "date-fns/fp";
import {
  functions,
  defaultRuntimeOptions,
  admin,
  throwError,
} from "../../config/config";
import type { ClinicConfig } from "../../types/clinicConfig";
import { formatTimeHoursToDate } from "../../utils/formatTimeHoursToDate";
import { formatTimeHoursToString } from "../../utils/formatTimeHoursToString";
import { getTimeHoursFromDate } from "../../utils/getTimeHoursFromDate";

const DEBUG = false;

interface Appointment {
  start: any;
  end: any;
  id: null | number;
  resources: null | Array<ActiveResource["id"]>;
}

interface ActiveResource {
  id: number;
  staggerTime: number;
}
export const getClinicAvailability = functions
  .runWith({ ...defaultRuntimeOptions, memory: "4GB", minInstances: 1 })
  .https.onCall(async ({ id }: { id: string }): Promise<any> => {
    if (DEBUG)
      console.log("---------- getClinicAvailability ----------\n\nID => ", id);
    const { popUpClinics } = await admin
      .firestore()
      .collection("configuration")
      .doc("pop_up_clinics")
      .get()
      .then((doc: any) => doc.data())
      .catch((error: any) => throwError(error));
    let configuration: any = null;
    popUpClinics.forEach((clinic: ClinicConfig) => {
      if (clinic?.id === id) configuration = clinic;
    });
    if (configuration && (configuration as any)?.isActive) {
      const {
        appointmentBufferTime,
        appointmentDuration,
        resourceConfiguration,
        schedule,
      } = configuration as ClinicConfig;
      const { date, startTime, endTime } = schedule;
      const dateObject = new Date(
        date?.toDate()?.toString().slice(0, -13) + "24:00:00.000Z",
      );
      if (DEBUG)
        console.log("\nCONFIGURATION => ", {
          appointmentBufferTime,
          appointmentDuration,
          resourceConfiguration,
          date: dateObject,
          startTime,
          endTime,
        });
      const allAvailableAppointmentTimes: any = [];
      await Promise.all(
        resourceConfiguration.map(async (resource: ActiveResource) => {
          let existingAppointmentsForResource: Array<{
            start: any;
            end: any;
          }> = [];
          existingAppointmentsForResource = await getExistingAppointments({
            date: dateObject,
            resource,
          });
          if (DEBUG)
            console.log(
              "\nexistingAppointmentsForResource => ",
              existingAppointmentsForResource,
            );
          allAvailableAppointmentTimes.push(
            await calculateAvailableAppointments({
              existingAppointmentsForResource,
              date,
              resource,
              startTime,
              endTime,
              appointmentDuration,
              appointmentBufferTime,
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
    } else return "Clinic Not Found";
  });

const getExistingAppointments = async ({
  date,
  resource,
}: {
  date: Date;
  resource: ActiveResource;
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
      if (DEBUG) {
        console.log("\n---------- getExistingAppointments ----------\n\n");
        console.log("date              => ", date);
        console.log("queryDate         => ", updatedDate);
        console.log("appointmentsCount => ", querySnapshot?.docs?.length);
        console.log("calendarDay       =>", calendarDay);
        console.log("monthNumber       =>", monthNumber);
        console.log("\n------------------------------------------\n");
      }
      if (querySnapshot?.docs?.length > 0) {
        querySnapshot.forEach(async (doc: any) => {
          if (
            DEBUG &&
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
            doc.data()?.resources.includes(resource.id)
          )
            existingAppointments.push({
              id: Number(doc.id),
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
      if (DEBUG) console.log("existingAppointments => ", existingAppointments);
      return existingAppointments;
    })
    .catch((error: any) => throwError(error));
};
const calculateAvailableAppointments = async ({
  existingAppointmentsForResource,
  date,
  startTime,
  endTime,
  appointmentDuration,
  appointmentBufferTime,
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
      formatTimeHoursToDate(startTime),
      formatTimeHoursToDate(endTime),
    ) / appointmentDuration,
  );
  if (DEBUG) {
    console.log("---------- calculateAvailableAppointments ----------");
    console.log("calendarDay                     => ", calendarDay);
    console.log("monthNumber                     => ", monthNumber);
    console.log("yearNumber                      => ", yearNumber);
    console.log("startTime                => ", startTime);
    console.log("endTime               => ", endTime);
    console.log("numberOfAppointments            => ", numberOfAppointments);
    console.log(
      "existingAppointmentsForResource => ",
      existingAppointmentsForResource,
    );
  }
  if (resource.staggerTime !== 0) {
    staggeredOpenTime = Number(
      addMinutes(resource.staggerTime, formatTimeHoursToDate(startTime))
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
    resource.staggerTime === 0 ? startTime : staggeredOpenTime;
  for (let i = 0; i < numberOfAppointments; i++) {
    if (
      !isAfter(
        formatTimeHoursToDate(endTime),
        formatTimeHoursToDate(nextAppointmentStartTime),
      ) &&
      !isEqual(
        formatTimeHoursToDate(endTime),
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
        appointmentBufferTime,
        addMinutes(
          appointmentDuration,
          formatTimeHoursToDate(nextAppointmentStartTime),
        ),
      ),
    );
    if (nextAppointmentStartTime.length === 4)
      nextAppointmentStartTime = `0${nextAppointmentStartTime}`;
    if (DEBUG) {
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
    if (DEBUG) {
      console.log("sameDayAppointmentLeadTime => ", sameDayAppointmentLeadTime);
      console.log("bufferTime                 => ", bufferTime);
    }
    availableAppointmentSlots.map((availableAppointmentSlot: any) => {
      if (
        Number(availableAppointmentSlot.start.replaceAll(":", "")) < bufferTime
      )
        pastAppointments.push(availableAppointmentSlot);
    });
    if (DEBUG) console.log("pastAppointments       => ", pastAppointments);
    availableAppointmentSlots = availableAppointmentSlots.filter(
      (appointmentSlot: any) => !pastAppointments.includes(appointmentSlot),
    );
  }
  //const forcedOpenings = await getForcedOpenings(schedule);
  if (DEBUG) {
    console.log("availableAppointmentSlots => ", availableAppointmentSlots);
    //console.log("forcedOpenings            => ", forcedOpenings);
  }
  availableAppointmentSlots.map((availableAppointmentSlot: any) => {
    existingAppointmentsForResource.map((existingAppointment: any) => {
      if (DEBUG) {
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
    console.log("availableAppointmentSlots => ", availableAppointmentSlots);
    console.log("appointmentSlotsToRemove  => ", appointmentSlotsToRemove);
  }
  return availableAppointmentSlots.filter(
    (appointmentSlot: any) =>
      !appointmentSlotsToRemove.includes(appointmentSlot),
  );
};
