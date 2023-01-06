import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { Button, Loader } from "ui";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import { Transition } from "@headlessui/react";
import { BookingFooter } from "components/BookingFooter";
import { TimeInput } from "components/inputs/TimeInput";
import Calendar from "react-calendar";
import { formatDateObjectPlusTimeStringIntoString } from "utilities";

export default function DateTime() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [selectedTime, onTimeChange] = useState<string | null>(null);
  const [selectedDate, onDateChange] = useState<Date>(today);
  const { executeRecaptcha } = useGoogleReCaptcha();
  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router) {
      setIsLoading(false);
    } else router.push("/schedule-an-appointment");
  }, [router]);
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  };
  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    setLoadingMessage("Saving Date & Time...");
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const session = JSON.parse(
            window.localStorage.getItem("bookingSession") as string
          );
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment"
          )({
            requestedDateTime: {
              date: selectedDate,
              time: selectedTime,
            },
            id: session?.id,
            device: navigator.userAgent,
            token,
          });
          console.log("result", result);
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage("Almost finished...");
            if (result?.client?.uid && result?.id) {
              window.localStorage.setItem(
                "bookingSession",
                JSON.stringify(result)
              );
              if (result?.checkoutSession)
                router.push("/schedule-an-appointment/payment-confirmation");
              else if (result.step === "success")
                router.push("/schedule-an-appointment/success");
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
          <section className="relative mx-auto">
            {isLoading ? (
              <Loader message={loadingMessage || "Loading, please wait..."} />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                <BookingHeader
                  isAppMode={isAppMode}
                  title="Request a Time"
                  description={
                    "What day and time would you like to request an appointment for?"
                  }
                />
                <form onSubmit={onSubmit}>
                  <Calendar
                    onChange={(value: any) => onDateChange(value)}
                    value={selectedDate}
                    minDate={today}
                    minDetail="month"
                    className="flex-1 justify-center items-center my-8 w-full mx-auto"
                  />
                  {JSON.parse(
                    window.localStorage.getItem("bookingSession") as string
                  )?.location === "Home" ? (
                    <>
                      <h2 className="text-center text-base mb-0">
                        General Hours of Operation
                      </h2>
                      <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside mb-4 whitespace-nowrap font-normal text-sm">
                        <div className="w-full">
                          <div className="flex w-full">
                            <span className="whitespace-nowrap">MON - FRI</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                          <div className="flex w-full">
                            <span className="whitespace-nowrap">SAT & SUN</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                        </div>
                        <div className="w-max whitespace-nowrap">
                          <div>9 AM TO 5 PM</div>
                          <div>CLOSED</div>
                        </div>
                      </div>
                      <h2 className="text-center text-base mb-0">
                        Housecall Appointments
                      </h2>
                      <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside mb-4 whitespace-nowrap font-normal text-sm">
                        <div className="w-full">
                          <div className="flex w-full">
                            <span className="whitespace-nowrap">MONDAY</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                          <div className="flex w-full">
                            <span className="whitespace-nowrap">WEDNESDAY</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                          <div className="flex w-full">
                            <span className="whitespace-nowrap">FRIDAY</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                        </div>
                        <div className="w-max whitespace-nowrap">
                          <div>MORNINGS</div>
                          <div>AFTERNOONS</div>
                          <div>MORNINGS</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-center text-base mb-0">
                        Hours of Operation
                      </h2>
                      <div className="flex py-4 px-2 sm:px-4 leading-6 font-abside mb-4 whitespace-nowrap font-normal text-sm">
                        <div className="w-full">
                          <div className="flex w-full">
                            <span className="whitespace-nowrap">MON - FRI</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                          <div className="flex w-full">
                            <span className="whitespace-nowrap">SAT & SUN</span>
                            <div className="w-full border-b mb-2 mx-4"></div>
                          </div>
                        </div>
                        <div className="w-max whitespace-nowrap">
                          <div>9 AM TO 5 PM</div>
                          <div>CLOSED</div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* <TimePicker
              onChange={(value: any) => onTimeChange(value)}
              value={selectedTime}
              maxTime="16:00"
              minTime="09:00"
              disableClock
              className="border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-xl pl-3 pr-3 py-3 text-left cursor-pointer sm:text-sm placeholder:text-gray font-abside-smooth"
            /> */}
                  <TimeInput
                    onChange={onTimeChange}
                    value={selectedTime}
                    label="Enter a Time"
                  />
                  <p className="text-movet-black italic text-xs text-center">
                    *Must be between 09:00 - 16:30
                  </p>
                  <Transition
                    show={
                      selectedDate !== null &&
                      selectedTime !== null &&
                      !selectedTime.includes("H") &&
                      !selectedTime.includes("M")
                    }
                    enter="transition ease-in duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                  >
                    <>
                      <h2 className="text-base mt-8 text-center">
                        REQUEST AN APPOINTMENT FOR
                      </h2>
                      {selectedDate && selectedTime && (
                        <p className="text-center italic">
                          {formatDateObjectPlusTimeStringIntoString(
                            selectedDate,
                            selectedTime
                          )}
                        </p>
                      )}
                    </>
                  </Transition>
                  <Button
                    type="submit"
                    icon={faArrowRight}
                    disabled={
                      selectedDate === null ||
                      selectedTime === null ||
                      selectedTime.includes("H") ||
                      selectedTime.includes("M")
                    }
                    iconSize={"sm"}
                    color="black"
                    text="Continue"
                    className="mt-8"
                  />
                </form>
                <div className="mt-8">
                  <BookingFooter />
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
