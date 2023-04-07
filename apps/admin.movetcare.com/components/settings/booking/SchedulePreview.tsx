import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { functions } from "services/firebase";
import { Loader } from "ui";
import Error from "components/Error";

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
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | { message: string }>(null);
  useEffect(() => {
    const fetchAppointmentAvailability = async () => {
      const { data: result }: any = await httpsCallable(
        functions,
        "getAppointmentAvailability"
      )({ date: selectedDate, schedule });
      console.log("result", result);
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
  }, [schedule, selectedDate]);
  return (
    <>
      <h2 className="text-center -mb-4">
        Example Schedule -{" "}
        <span className="">
          {selectedDate &&
            selectedDate?.toLocaleDateString("en-us", {
              weekday: "short",
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
        </span>
      </h2>
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
          <p>{closedReason}</p>
        ) : (
          <p>{JSON.stringify(appointmentAvailability)}</p>
        )}
      </section>
    </>
  );
};
