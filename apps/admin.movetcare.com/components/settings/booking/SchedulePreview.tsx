import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { functions } from "services/firebase";
import { Button, Loader } from "ui";
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
  const [patientType, setPatientType] = useState<"new" | "returning">("new");
  useEffect(() => {
    const fetchAppointmentAvailability = async () => {
      const { data: result }: any = await httpsCallable(
        functions,
        "getAppointmentAvailability"
      )({
        date: selectedDate,
        schedule,
        patients: patientType === "returning" ? ["6667", "6669"] : ["6668"],
      });
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
  }, [schedule, selectedDate, patientType]);
  return (
    <>
      <h2 className="text-center -mb-4">
        Example Schedule -{" "}
        {patientType === "new" ? "New Patient" : "Existing Patient"}
      </h2>
      <h3 className="text-center -mb-4">
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
          <p>{JSON.stringify(appointmentAvailability)}</p>
        )}
        <div className="flex flex-row mx-auto mb-4 mt-8">
          <Button
            text="New Patient"
            onClick={() => setPatientType("new")}
            color={patientType === "new" ? "red" : "black"}
            className="mr-2"
          />
          <Button
            text="Existing Patient"
            color={patientType === "returning" ? "red" : "black"}
            className="ml-2"
            onClick={() => setPatientType("returning")}
          />
        </div>
      </section>
    </>
  );
};
