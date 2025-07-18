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
  faArrowLeft,
  faCalendarCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { getUrlQueryStringFromObject } from "utilities";
import { environment } from "utilities";
import { useForm } from "react-hook-form";
import { TextInput } from "ui/src/components/forms/inputs";
import Image from "next/image";

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

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      notes: null,
    },
  });

  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router)
      setSession(
        JSON.parse(window.localStorage.getItem("bookingSession") as string),
      );
    else router.push("/schedule-an-appointment");
  }, [router]);

  useEffect(() => {
    const fetchAppointmentAvailability = async (): Promise<void> => {
      setSelectedTime(null);
      setAppointmentAvailability(null);
      setClosedReason(null);
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
        setSelectedTime(null);
        setAppointmentAvailability(null);
        setClosedReason(result);
      } else setError(result);
      setIsLoading(false);
    };
    if (selectedDate) fetchAppointmentAvailability();
  }, [selectedDate, session]);

  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setSelectedTime(null);
    setIsLoading(false);
    setAppointmentAvailability(null);
  };
  const onSubmit = async (data: any) => {
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
              notes: data.notes,
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
              setSelectedTime(null);
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
              <div
                className={
                  isAppMode
                    ? "flex flex-grow items-center justify-center min-h-screen"
                    : ""
                }
              >
                {selectedTime === null ? (
                  <div className="flex-col">
                    <BookingHeader
                      isAppMode={isAppMode}
                      title="Choose a Day & Time"
                      description={
                        "What day and time would you like to schedule an appointment for?"
                      }
                    />
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
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
                        <div className="w-full mx-auto">
                          <div className="bg-movet-yellow p-2 rounded-xl">
                            <p className="italic text-center mt-0 font-extrabold text-movet-white text-lg">
                              Loading Available Appointments...
                            </p>
                          </div>
                        </div>
                      ) : error ? (
                        <Error error={error} isAppMode={isAppMode} />
                      ) : (
                        <>
                          <div className="w-full mx-auto">
                            {closedReason ? (
                              <div className="bg-movet-red p-2 rounded-xl">
                                <p className="italic text-center text-movet-white font-extrabold m-0 text-lg">
                                  {closedReason}
                                </p>
                              </div>
                            ) : appointmentAvailability &&
                              appointmentAvailability?.length > 0 ? (
                              <div className="bg-movet-blue p-2 rounded-xl">
                                <p className="italic text-center text-movet-white font-extrabold m-0 text-lg">
                                  {appointmentAvailability?.length} Available
                                  Appointment
                                  {appointmentAvailability?.length > 1
                                    ? "s"
                                    : ""}
                                </p>
                              </div>
                            ) : (
                              <div className="bg-movet-yellow p-2 rounded-xl">
                                <p className="italic text-center mt-0 font-extrabold text-movet-white text-lg">
                                  No Appointments Available
                                </p>
                                <p className="italic text-center -mt-2 text-movet-white text-xs mb-0">
                                  Please Select a Different Day
                                </p>
                              </div>
                            )}
                            <div className="flex flex-row w-full mx-auto">
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
                                        window.scrollTo(0, 0);
                                      }}
                                    >
                                      {environment === "production" ? (
                                        <p>
                                          {formatTime(appointmentSlot.start)}
                                        </p>
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
                              {/* {appointmentAvailability &&
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
                                          window.scrollTo(0, 0);
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
                                              window.scrollTo(0, 0);
                                            }}
                                          >
                                            {environment === "production" ? (
                                              <p>
                                                {formatTime(
                                                  appointmentSlot.start,
                                                )}
                                              </p>
                                            ) : (
                                              <p>
                                                {formatTime(
                                                  appointmentSlot.start,
                                                )}{" "}
                                                -{" "}
                                                {formatTime(
                                                  appointmentSlot.end,
                                                )}
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
                                              window.scrollTo(0, 0);
                                            }}
                                          >
                                            {environment === "production" ? (
                                              <p>
                                                {formatTime(
                                                  appointmentSlot.start,
                                                )}
                                              </p>
                                            ) : (
                                              <p>
                                                {formatTime(
                                                  appointmentSlot.start,
                                                )}{" "}
                                                -{" "}
                                                {formatTime(
                                                  appointmentSlot.end,
                                                )}
                                              </p>
                                            )}
                                          </li>
                                        ) : null,
                                    )}
                                  </ul>
                                </>
                              )} */}
                            </div>
                          </div>
                          <Button
                            text="Schedule My Appointment"
                            type="submit"
                            disabled={!selectedTime || !selectedDate}
                            className="mt-8"
                            icon={faCalendarCheck}
                            color="black"
                            onClick={handleSubmit(onSubmit)}
                          />
                        </>
                      )}
                    </div>
                    <div className="mt-8">
                      <BookingFooter />
                    </div>
                  </div>
                ) : (
                  <div className="flex-col w-full mx-auto">
                    <div className="w-full flex flex-col mt-4 items-center text-center">
                      <Image
                        src="/images/logos/logo-paw-black.png"
                        className="mx-auto my-4"
                        width={60}
                        height={60}
                        alt="MoVET Paw Icon"
                        priority
                      />
                      <h3 className="mt-2 text-lg">
                        Ready to Schedule Your Appointment?
                      </h3>
                      <p className="italic mb-6 text-sm">
                        Please confirm your appointment details below
                      </p>
                      <label className="block text-sm font-medium text-movet-black font-abside -mb-2">
                        Date & Time
                      </label>
                      <p className="italic">
                        {selectedDate.toLocaleString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        - {selectedTime && selectedTime.split("-")[0].trim()}
                      </p>
                      <label className="block text-sm font-medium text-movet-black font-abside mt-2 -mb-2">
                        Location
                      </label>
                      <p className="italic font-extrabold">
                        {session?.location === "Home" ? (
                          `Housecall @ ${session?.address?.full}`
                        ) : session?.location === "Clinic" ? (
                          <>
                            <span>MoVET @ Belleview Station</span>
                            <br />
                            <a
                              className=" font-extrabold mb-2 w-full text-movet-black hover:text-movet-red duration-300 ease-in-out"
                              target="_blank"
                              href="https://goo.gl/maps/h8eUvU7nsZTDEwHW9"
                              rel="noopener noreferrer"
                            >
                              4912 S Newport St, Denver, CO 80237
                            </a>
                          </>
                        ) : (
                          <>
                            <span>Virtual Telehealth Consultation</span>
                          </>
                        )}
                      </p>
                      {session?.address?.info && (
                        <p className="-mt-2 italic text-sm">
                          Note: {session?.address?.info}
                        </p>
                      )}
                      <label className="block text-sm font-medium text-movet-black font-abside mt-2 -mb-2">
                        Reason
                      </label>
                      <p className="italic font-extrabold">
                        {session?.reason?.label}
                      </p>
                      <label className="block text-sm font-medium text-movet-black font-abside mt-2 -mb-2">
                        Pet
                        {session?.selectedPatients.length > 1 && "s"}
                      </label>
                      {session?.selectedPatients?.map((patientId: string) =>
                        session?.patients?.map(
                          (patient: any, index: number) => {
                            if (patientId === patient?.id)
                              return (
                                <div key={index + "-" + patient?.name}>
                                  <p className="italic font-extrabold">
                                    {patient?.name}
                                  </p>
                                  {patient?.illnessDetails && (
                                    <>
                                      <p className="italic -mt-2 text-sm">
                                        {patient?.illnessDetails?.symptoms}
                                      </p>
                                      <p className="italic -mt-2 text-sm">
                                        {JSON.stringify(
                                          patient?.illnessDetails?.notes,
                                        )}
                                      </p>
                                    </>
                                  )}
                                </div>
                              );
                          },
                        ),
                      )}
                      <TextInput
                        label="Pet Concerns / Additional Notes /Promo Code"
                        name="notes"
                        control={control}
                        errors={errors}
                        placeholder="Enter any concerns for your pet, additional notes, or a promo code."
                        multiline
                        numberOfLines={2}
                        className="my-4 w-full"
                      />
                    </div>
                    <div className="flex flex-col w-full mx-auto">
                      <Button
                        text="Change Date & Time"
                        color="black"
                        className="w-full mt-8"
                        icon={faArrowLeft}
                        onClick={() => setSelectedTime(null)}
                      />
                      <Button
                        text="Schedule My Appointment"
                        type="submit"
                        disabled={!selectedTime || !selectedDate}
                        className="w-full mt-4"
                        icon={faCalendarCheck}
                        color="red"
                        onClick={handleSubmit(onSubmit)}
                      />
                    </div>
                    <div className="mt-8">
                      <BookingFooter />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        showModal={retryRequired}
        setShowModal={setRetryRequired}
        cancelButtonRef={cancelButtonRef}
        isLoading={isLoading}
        error={error ? <Error message={error} /> : undefined}
        content={
          <p>
            We&apos;re sorry, but there is already an appointment scheduled for
            this time. Please select a different time slot and try again.
          </p>
        }
        title="Something Went Wrong..."
        icon={faExclamationTriangle}
      />
    </section>
  );
}
