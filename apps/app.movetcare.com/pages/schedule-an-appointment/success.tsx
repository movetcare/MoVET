/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { AppLinks, Loader } from "ui";
import { BookingHeader } from "components/BookingHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { AppHeader } from "components/AppHeader";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ServerResponse } from "types";
import { environment } from "utilities";

export default function BookingSuccess() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null,
  );
  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router) {
      setSession(
        JSON.parse(window.localStorage.getItem("bookingSession") as string),
      );
    } else router.push("/schedule-an-appointment");
  }, [router]);
  useEffect(() => {
    if (session?.id) {
      const processAppointmentBooking = async () =>
        (
          await fetch("/api/schedule-an-appointment", {
            method: "POST",
            body: JSON.stringify({ id: session?.id, step: "complete" }),
          })
        ).json();
      processAppointmentBooking()
        .then((response: ServerResponse) => {
          console.log("SUCCESS SENT!");
          if (response.error) {
            handleError({ message: response.error });
          } else {
            if (environment === "production") localStorage.removeItem("email");
            localStorage.removeItem("bookingSession");
            setSubmissionSuccess(true);
            setAppointmentData((response as any).payload);
          }
        })
        .catch((error) => handleError(error))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [session]);
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setSubmissionSuccess(false);
    setIsLoading(false);
  };
  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-lg mx-auto mb-4`}
      >
        <div className={isAppMode ? "px-4 mb-8" : "p-4"}>
          <section className="relative mx-auto">
            {isLoading || submissionSuccess === null ? (
              <Loader message="Loading Confirmation..." isAppMode={isAppMode} />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <div
                className={
                  isAppMode
                    ? "flex flex-col items-center justify-center min-h-screen"
                    : ""
                }
              >
                <div className={isAppMode ? "flex flex-col" : ""}>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="4x"
                    className="text-movet-green mx-auto w-full mb-4"
                  />
                  {isAppMode && (
                    <h2 className="text-3xl font-extrabold tracking-tight text-movet-black text-center">
                      Housecall Request Successful
                    </h2>
                  )}
                  <BookingHeader
                    isAppMode={isAppMode}
                    title="Your Appointment is Scheduled"
                    description={
                      "We can't wait to see you and your fur-family again!"
                    }
                  />
                  {environment === "production" && (
                    <>
                      <h3>Appointment Details: </h3>
                      <pre>{JSON.stringify(appointmentData)}</pre>
                    </>
                  )}
                  <p className="text-xs italic text-center mt-4 px-4 sm:px-8">
                    We will send you an email confirmation shortly. Please{" "}
                    <Link href="/contact">contact us</Link> us if you have any
                    questions or do not receive a confirmation email within the
                    next 24 hours.
                  </p>
                </div>
              </div>
            )}
          </section>
          {!isLoading && !isAppMode && (
            <section>
              <hr className="border-movet-gray w-full sm:w-2/3 mx-auto mt-8" />
              <h2 className="text-center mb-0">Download The App!</h2>
              <div className="flex flex-row justify-center w-full mx-auto mt-4">
                <AppLinks />
              </div>
              <p className="text-center mb-4 italic text-sm w-full sm:w-2/3 mx-auto">
                Download our our mobile app to manage your pets, manage your
                appointments, chat with us, and more!
              </p>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
