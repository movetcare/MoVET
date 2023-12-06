/* eslint-disable react-hooks/exhaustive-deps */
import { BookingHeader } from "components/BookingHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { AppHeader } from "components/AppHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function RequestSuccess() {
  const router = useRouter();
  const { mode }: any = router.query || {};
  const isAppMode = mode === "app";
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null,
  );
  useEffect(() => {
    localStorage.removeItem("email");
    localStorage.removeItem("bookingSession");
    setSubmissionSuccess(true);
    console.log(submissionSuccess);
  }, []);

  return (
    <section
      className={
        isAppMode
          ? "h-screen flex items-center justify-center"
          : "w-full flex-1"
      }
    >
      <AppHeader />
      <div
        className={`flex-col items-center justify-center bg-white rounded-xl max-w-lg mx-auto mb-4`}
      >
        <div className={"p-4"}>
          <section className="relative mx-auto">
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="4x"
              className="text-movet-green mx-auto w-full mb-4"
            />
            <BookingHeader
              isAppMode={false}
              title="Appointment Request Successful"
              description={
                "We will get contact to you as soon as we can to confirm the exact day and time of your appointment!"
              }
            />
            <p className="text-xs italic text-center mt-4 sm:px-8 mb-8">
              Please allow 1 business day for a response. All appointment
              requests are responded to in the order they are received.
            </p>
          </section>
          {/* {!isAppMode && submissionSuccess && (
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
          )} */}
        </div>
      </div>
    </section>
  );
}
