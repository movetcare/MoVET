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
import type { ServerResponse } from "types";
import { environment } from "utilities";

export default function BookingSuccess() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null,
  );
  useEffect(() => {
    if (window.localStorage.getItem("clinicBookingSession") !== null && router)
      setSession(
        JSON.parse(
          window.localStorage.getItem("clinicBookingSession") as string,
        ),
      );
    else setSubmissionSuccess(false);
  }, [router]);
  useEffect(() => {
    if (session?.id) {
      const processClinicBooking = async () =>
        (
          await fetch("/api/schedule-a-clinic", {
            method: "POST",
            body: JSON.stringify({ id: session?.id, step: "complete" }),
          })
        ).json();
      processClinicBooking()
        .then((response: ServerResponse) => {
          if (response.error) handleError({ message: response.error });
          else {
            if (environment === "production") {
              localStorage.removeItem("clinicEmail");
              localStorage.removeItem("clinicBookingSession");
            }
            setSubmissionSuccess(true);
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
        className={`flex items-center justify-center bg-white rounded-xl max-w-lg mx-auto ${!isAppMode && "mb-8"}`}
      >
        <div className={isAppMode ? "px-4" : "p-4"}>
          <section className="relative mx-auto">
            {isLoading || submissionSuccess === null ? (
              <Loader message="Loading Confirmation..." isAppMode={isAppMode} />
            ) : error ? (
              <Error error={error} type="clinic" />
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
                    className="text-movet-blue mx-auto w-full mb-4 mt-8"
                  />
                  {isAppMode && (
                    <h2
                      className={`text-xl font-extrabold tracking-tight text-movet-black -mb-6 text-center`}
                    >
                      Your Appointment is Scheduled
                    </h2>
                  )}
                  <BookingHeader
                    isAppMode={isAppMode}
                    title="Your Appointment is Scheduled"
                    description={
                      "We can't wait to see you and your fur-family!"
                    }
                  />
                  <div className="w-full flex flex-col my-4 items-center text-center">
                    <h5 className="font-extrabold font-source-sans-pro mb-2 text-xl">
                      {session?.clinic?.name}
                    </h5>
                    <hr className="mb-4 text-movet-gray w-2/3" />
                    <h5 className="font-bold -mb-2">
                      Pet{session?.selectedPatients.length > 1 && "s"}
                    </h5>
                    {session?.selectedPatients?.map((patientId: string) =>
                      session?.patients?.map((patient: any, index: number) => {
                        if (patientId === patient?.id)
                          return (
                            <div key={index + "-" + patient?.name}>
                              <p className="italic font-extrabold">
                                {patient?.name}
                              </p>
                            </div>
                          );
                      }),
                    )}
                    <h5 className="font-bold -mb-2">Date & Time</h5>
                    <p className="italic">
                      {new Date(
                        session?.requestedDateTime?.date,
                      )?.toLocaleDateString("en-us", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      @ {session?.requestedDateTime?.time.split("-")[0].trim()}
                    </p>
                    <h5 className="font-bold -mb-2">Location</h5>
                    <p className="italic font-extrabold">
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
                    </p>
                  </div>
                  {!isAppMode && (
                    <p className="text-xs italic text-center mt-4 px-4 sm:px-8">
                      We will send you an email confirmation shortly. Please{" "}
                      <Link href="/contact">contact us</Link> us if you have any
                      questions or do not receive a confirmation email within
                      the next 24 hours.
                    </p>
                  )}
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
