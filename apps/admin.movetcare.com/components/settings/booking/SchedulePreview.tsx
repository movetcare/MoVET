import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { functions } from "services/firebase";
import { Button, Loader } from "ui";
import Error from "components/Error";

const formatTime = (time: string): string => {
  const hours =
    time.toString().length === 3
      ? `0${time}`.slice(0, 2)
      : `${time}`.slice(0, 2);
  const minutes =
    time.toString().length === 3
      ? `0${time}`.slice(2)
      : `${time}`.slice(3)?.length === 1
      ? "0" + `${time}`.slice(3)
      : `${time}`.slice(3);
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Denver",
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
      " " +
      [hours, ":", minutes].join("") +
      ":00"
  ).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const SchedulePreview = ({
  schedule,
}: {
  schedule: "clinic" | "housecall" | "virtual";
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDate, onDateChange] = useState<Date>(today);
  const [appointmentAvailability, setAppointmentAvailability] =
    useState<Array<any> | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | { message: string }>(null);
  const [patientType, setPatientType] = useState<
    "new" | "returning-one" | "returning-two"
  >("new");
  useEffect(() => {
    const fetchAppointmentAvailability = async () => {
      const { data: result }: any = await httpsCallable(
        functions,
        "getAppointmentAvailability"
      )({
        date: selectedDate,
        schedule,
        patients:
          patientType === "returning-two"
            ? ["6667", "6669"]
            : patientType === "returning-one"
            ? ["6667"]
            : ["6668"],
      });
      if (Array.isArray(result)) {
        setAppointmentAvailability(result);
        setClosedReason(null);
      } else if (typeof result === "string") {
        setAppointmentAvailability(null);
        setClosedReason(result);
      } else setError(result);
      setIsLoading(false);
    };
    fetchAppointmentAvailability();
  }, [schedule, selectedDate, patientType]);
  useEffect(() => {
    if (selectedDate && patientType) setSelectedTime(null);
  }, [selectedDate, patientType]);
  return (
    <>
      <h2 className="text-center -mb-4 text-xl">
        Example Schedule -{" "}
        {patientType === "new" ? "New Patient" : "Existing Patient"}
      </h2>
      <h3 className="text-center -mb-2">
        {selectedDate &&
          selectedDate?.toLocaleDateString("en-us", {
            weekday: "short",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
      </h3>
      <section className="flex flex-col items-center justify-center max-w-sm mx-auto">
        <Calendar
          onChange={(value: any) => {
            setIsLoading(true);
            onDateChange(value);
          }}
          value={selectedDate}
          minDate={today}
          minDetail="month"
          className="flex-1 justify-center items-center my-8 w-full mx-auto"
        />
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Error error={error} />
        ) : closedReason ? (
          <p className="text-center italic font-bold">{closedReason}</p>
        ) : (
          <div className="w-full mx-auto">
            <h4 className="italic text-center -mt-2">Available Appointments</h4>
            <ul>
              {appointmentAvailability?.map(
                (appointmentSlot: { start: string; end: string }) => (
                  <li
                    className={`flex flex-row items-center justify-center py-4 px-2 my-4 rounded-xl cursor-pointer hover:bg-movet-brown hover:text-white duration-300 ease-in-out${
                      selectedTime ===
                      `${formatTime(appointmentSlot.start)} - ${formatTime(
                        appointmentSlot.end
                      )}`
                        ? " bg-movet-red text-white border-movet-white"
                        : " bg-movet-gray/20"
                    }`}
                    onClick={() =>
                      setSelectedTime(
                        `${formatTime(appointmentSlot.start)} - ${formatTime(
                          appointmentSlot.end
                        )}`
                      )
                    }
                  >
                    <p>
                      {formatTime(appointmentSlot.start)} -{" "}
                      {formatTime(appointmentSlot.end)}
                    </p>
                  </li>
                )
              )}
            </ul>
            {selectedTime && (
              <div className="mt-8">
                <hr />
                <h4 className="mt-4 text-center">Selected Date:</h4>
                <p className="text-center italic">
                  {selectedDate.toLocaleString("en-US", {
                    timeZone: "America/Denver",
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}{" "}
                  - {selectedTime}
                </p>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-row mx-auto mb-4 mt-8">
          <Button
            text="New - 1 Pet"
            onClick={() => setPatientType("new")}
            color={patientType === "new" ? "red" : "black"}
            className="mr-2"
          />
          <Button
            text="Existing - 1 Pet"
            color={patientType === "returning-one" ? "red" : "black"}
            className="ml-2"
            onClick={() => setPatientType("returning-one")}
          />
          <Button
            text="Existing - 2 Pets"
            color={patientType === "returning-two" ? "red" : "black"}
            className="ml-2"
            onClick={() => setPatientType("returning-two")}
          />
        </div>
      </section>
    </>
  );
};
