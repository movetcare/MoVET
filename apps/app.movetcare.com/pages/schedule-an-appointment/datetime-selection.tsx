import { UAParser } from "ua-parser-js";
import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useRef, useState } from "react";
import { Button, Loader, Modal } from "ui";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import { BookingFooter } from "components/BookingFooter";
import Calendar from "react-calendar";
import {
  faCalendarCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { Transition } from "@headlessui/react";
import getUrlQueryStringFromObject from "utilities/src/getUrlQueryStringFromObject";
import { environment } from "utilities";

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
      ":00",
  ).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export default function DateTime() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [session, setSession] = useState<any>();
  const [selectedResource, setSelectedResource] = useState<number | null>(null);
  const [selectedDate, onDateChange] = useState<Date>(today);
  const [appointmentAvailability, setAppointmentAvailability] =
    useState<Array<any> | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingFull, setIsLoadingFull] = useState<boolean>(false);
  const [error, setError] = useState<null | { message: string }>(null);
  const [retryRequired, setRetryRequired] = useState<boolean>(false);
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router)
      setSession(
        JSON.parse(window.localStorage.getItem("bookingSession") as string),
      );
    else router.push("/schedule-an-appointment");
  }, [router]);
  useEffect(() => {
    const fetchAppointmentAvailability = async () => {
      const { data: result }: any = await httpsCallable(
        functions,
        "getAppointmentAvailability",
      )({
        date: selectedDate,
        schedule:
          session?.location === "Home"
            ? "housecall"
            : session?.location === "Clinic"
            ? "clinic"
            : "virtual",
        patients: session?.selectedPatients,
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
  }, [selectedDate, session]);
  useEffect(() => {
    if (selectedDate) setSelectedTime(null);
  }, [selectedDate]);
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  };
  const onSubmit = async () => {
    setIsLoadingFull(true);
    setLoadingMessage("Saving Date & Time Selection...");
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const session = JSON.parse(
            window.localStorage.getItem("bookingSession") as string,
          );
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment",
          )({
            requestedDateTime: {
              resource: selectedResource,
              date: selectedDate,
              time: selectedTime,
            },
            id: session?.id,
            device: JSON.parse(
              JSON.stringify(UAParser(), function (key: any, value: any) {
                if (value === undefined) return null;
                return value;
              }),
            ),
            token,
          });
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage("Almost finished...");
            if (result?.needsRetry) {
              setRetryRequired(true);
              setIsLoading(false);
              setIsLoadingFull(false);
            } else if (result?.client?.uid && result?.id) {
              window.localStorage.setItem(
                "bookingSession",
                JSON.stringify(result),
              );
              const queryString = getUrlQueryStringFromObject(router.query);
              if (result?.checkoutSession)
                router.push(
                  "/schedule-an-appointment/payment-confirmation" +
                    (queryString ? queryString : ""),
                );
              else if (result.step === "success")
                router.push(
                  "/schedule-an-appointment/success" +
                    (queryString ? queryString : ""),
                );
            } else handleError(result);
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    } else handleError({ message: "FAILED CAPTCHA" });
  };
  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-xl mx-auto${
          !isAppMode ? " p-4 mb-4 sm:p-8" : ""
        }`}
      >
        <div className={isAppMode ? "px-4 mb-8" : ""}>
          <div className="relative mx-auto">
            {isLoadingFull ? (
              <Loader
                message={loadingMessage || "Loading, please wait..."}
                isAppMode={isAppMode}
              />
            ) : (
              <>
                <BookingHeader
                  isAppMode={isAppMode}
                  title="Choose a Day & Time"
                  description={
                    "What day and time would you like to schedule an appointment for?"
                  }
                />
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <Modal
                    showModal={retryRequired}
                    setShowModal={setRetryRequired}
                    cancelButtonRef={cancelButtonRef}
                    isLoading={isLoading}
                    error={error ? <Error message={error} /> : undefined}
                    content={
                      <p>
                        We&apos;re sorry, but there is already an appointment
                        scheduled for this time. Please select a different time
                        slot and try again.
                      </p>
                    }
                    title="Something Went Wrong..."
                    icon={faExclamationTriangle}
                  />
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
                    <Loader
                      message={loadingMessage || "Loading, please wait..."}
                      isAppMode={isAppMode}
                    />
                  ) : error ? (
                    <Error error={error} isAppMode={isAppMode} />
                  ) : (
                    <>
                      <div className="w-full mx-auto">
                        <p className="italic text-center -mt-2 font-extrabold text-lg">
                          {closedReason
                            ? closedReason
                            : appointmentAvailability &&
                              appointmentAvailability?.length > 0
                            ? "Available Appointment Times"
                            : "No Appointments Available - Please Select a Different Day..."}
                        </p>
                        <div className="flex flex-row w-full mx-auto">
                          {appointmentAvailability &&
                          appointmentAvailability.length < 6 ? (
                            <ul className="w-full">
                              {appointmentAvailability?.map(
                                (
                                  appointmentSlot: {
                                    resource: number;
                                    start: string;
                                    end: string;
                                  },
                                  index: number,
                                ) => (
                                  <li
                                    key={index}
                                    className={`flex flex-row items-center justify-center py-4 px-2 my-4 mx-2 rounded-xl cursor-pointer hover:bg-movet-brown hover:text-white duration-300 ease-in-out${
                                      selectedTime ===
                                      `${formatTime(
                                        appointmentSlot.start,
                                      )} - ${formatTime(appointmentSlot.end)}`
                                        ? " bg-movet-red text-white border-movet-white"
                                        : " bg-movet-gray/20"
                                    }`}
                                    onClick={() => {
                                      setSelectedTime(
                                        `${formatTime(
                                          appointmentSlot.start,
                                        )} - ${formatTime(
                                          appointmentSlot.end,
                                        )}`,
                                      );
                                      setSelectedResource(
                                        appointmentSlot?.resource,
                                      );
                                    }}
                                  >
                                    {environment === "production" ? (
                                      <p>{formatTime(appointmentSlot.start)}</p>
                                    ) : (
                                      <p>
                                        {formatTime(appointmentSlot.start)} -{" "}
                                        {formatTime(appointmentSlot.end)}
                                      </p>
                                    )}
                                  </li>
                                ),
                              )}
                            </ul>
                          ) : (
                            <>
                              <ul className="w-1/2">
                                {appointmentAvailability?.map(
                                  (
                                    appointmentSlot: {
                                      resource: number;
                                      start: string;
                                      end: string;
                                    },
                                    index: number,
                                  ) =>
                                    index <
                                    appointmentAvailability.length / 2 ? (
                                      <li
                                        key={index}
                                        className={`flex flex-row items-center justify-center py-4 px-2 my-4 mx-2 rounded-xl cursor-pointer hover:bg-movet-brown hover:text-white duration-300 ease-in-out${
                                          selectedTime ===
                                          `${formatTime(
                                            appointmentSlot.start,
                                          )} - ${formatTime(
                                            appointmentSlot.end,
                                          )}`
                                            ? " bg-movet-red text-white border-movet-white"
                                            : " bg-movet-gray/20"
                                        }`}
                                        onClick={() => {
                                          setSelectedTime(
                                            `${formatTime(
                                              appointmentSlot.start,
                                            )} - ${formatTime(
                                              appointmentSlot.end,
                                            )}`,
                                          );
                                          setSelectedResource(
                                            appointmentSlot?.resource,
                                          );
                                        }}
                                      >
                                        {environment === "production" ? (
                                          <p>
                                            {formatTime(appointmentSlot.start)}
                                          </p>
                                        ) : (
                                          <p>
                                            {formatTime(appointmentSlot.start)}{" "}
                                            - {formatTime(appointmentSlot.end)}
                                          </p>
                                        )}
                                      </li>
                                    ) : null,
                                )}
                              </ul>
                              <ul className="w-1/2">
                                {appointmentAvailability?.map(
                                  (
                                    appointmentSlot: {
                                      resource: number;
                                      start: string;
                                      end: string;
                                    },
                                    index: number,
                                  ) =>
                                    index >=
                                    appointmentAvailability.length / 2 ? (
                                      <li
                                        key={index}
                                        className={`flex flex-row items-center justify-center py-4 px-2 my-4 mx-2 rounded-xl cursor-pointer hover:bg-movet-brown hover:text-white duration-300 ease-in-out${
                                          selectedTime ===
                                          `${formatTime(
                                            appointmentSlot.start,
                                          )} - ${formatTime(
                                            appointmentSlot.end,
                                          )}`
                                            ? " bg-movet-red text-white border-movet-white"
                                            : " bg-movet-gray/20"
                                        }`}
                                        onClick={() => {
                                          setSelectedTime(
                                            `${formatTime(
                                              appointmentSlot.start,
                                            )} - ${formatTime(
                                              appointmentSlot.end,
                                            )}`,
                                          );
                                          setSelectedResource(
                                            appointmentSlot?.resource,
                                          );
                                        }}
                                      >
                                        {environment === "production" ? (
                                          <p>
                                            {formatTime(appointmentSlot.start)}
                                          </p>
                                        ) : (
                                          <p>
                                            {formatTime(appointmentSlot.start)}{" "}
                                            - {formatTime(appointmentSlot.end)}
                                          </p>
                                        )}
                                      </li>
                                    ) : null,
                                )}
                              </ul>
                            </>
                          )}
                        </div>
                        <Transition
                          show={selectedTime === null ? false : true}
                          enter="transition ease-in duration-500"
                          leave="transition ease-out duration-500"
                          leaveTo="opacity-10"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leaveFrom="opacity-100"
                        >
                          <>
                            <p className="mt-6 text-center text-xl italic font-extrabold">
                              Selected Date & Time:
                            </p>
                            <p className="text-center italic -mt-2 text-lg">
                              {selectedDate.toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}{" "}
                              -{" "}
                              {selectedTime &&
                                selectedTime.split("-")[0].trim()}
                            </p>
                          </>
                        </Transition>
                      </div>
                      <Button
                        text="Schedule My Appointment"
                        type="submit"
                        disabled={!selectedTime || !selectedDate}
                        className="mt-8"
                        icon={faCalendarCheck}
                        color="black"
                        onClick={() => onSubmit()}
                      />
                    </>
                  )}
                </div>
                <div className="mt-8">
                  <BookingFooter />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
