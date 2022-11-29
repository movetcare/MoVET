/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppLinks, Button, Loader } from "ui";
import { Error } from "components/Error";
import { BookingHeader } from "components/booking/BookingHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faPaw } from "@fortawesome/free-solid-svg-icons";
import { ServerResponse } from "types";
import { AppHeader } from "components/AppHeader";
export default function CancelAppointmentBookingRequest() {
  const router = useRouter();
  const { id, mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null
  );
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    if (id) {
      const processAppointmentBookingCancellation = async () =>
        (
          await fetch("/api/request-an-appointment", {
            method: "POST",
            body: JSON.stringify({ id, step: "cancelled-client" }),
          })
        ).json();
      processAppointmentBookingCancellation()
        .then((response: ServerResponse) => {
          if (response.error) {
            setError(response.error);
          } else setSubmissionSuccess(true);
        })
        .catch((error) => handleError(error))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);
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
        className={`flex items-center justify-center bg-white rounded-xl max-w-lg mx-auto mb-8`}
      >
        <div className={isAppMode ? "px-4 mb-8" : "p-8"}>
          <section className="relative mx-auto">
            {isLoading || submissionSuccess === null ? (
              <Loader message="Loading Confirmation..." />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faBan}
                  size="4x"
                  className="text-movet-red mx-auto w-full mb-4"
                />
                <BookingHeader
                  isAppMode={isAppMode}
                  title="Booking Request Cancelled"
                  description={
                    "Your appointment booking request has been cancelled."
                  }
                />
                <Button
                  text="Start New Booking"
                  icon={faPaw}
                  color="black"
                  onClick={() => router.replace("/request-an-appointment")}
                  className="mt-4"
                />
              </>
            )}
          </section>
          {!isAppMode && !isLoading && (
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
