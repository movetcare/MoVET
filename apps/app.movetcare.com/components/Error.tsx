import { faCircleExclamation, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ServerResponse } from "types";
import { Loader } from "ui";

export const Error = ({ error, type }: any) => {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [restartError, setRestartError] = useState<any>(null);

  const restartBooking = () => {
    setIsLoading(true);
    const processAppointmentBookingRestart = async () =>
      (
        await fetch(
          `/api/schedule-${type === "clinic" ? `a-clinic` : "an-appointment"}`,
          {
            method: "POST",
            body: JSON.stringify({
              id: JSON.parse(
                window.localStorage.getItem(
                  type === "clinic" ? "clinicBookingSession" : "bookingSession",
                ) as string,
              )?.id,
              step: "restart",
            }),
          },
        )
      ).json();
    processAppointmentBookingRestart()
      .then((response: ServerResponse) => {
        if (response.error) {
          handleError({ message: response.error });
        }
        if (type === "clinic") {
          const clinicId = JSON.parse(
            window.localStorage.getItem("clinicBookingSession") as any,
          )?.clinic?.id;
          localStorage.removeItem("clinicEmail");
          localStorage.removeItem("clinicBookingSession");
          router.push("/booking/" + clinicId);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("bookingSession");
          router.push("/schedule-an-appointment");
        }
      })
      .catch((error) => handleError(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleError = (error: any) => {
    console.error(error);
    setRestartError(error);
    setIsLoading(false);
  };
  return (
    <div className="text-center">
      {isLoading ? (
        <Loader message={"Loading, please wait..."} />
      ) : restartError ? (
        <Error error={restartError} />
      ) : (
        <>
          <FontAwesomeIcon
            icon={faCircleExclamation}
            size="3x"
            className="text-movet-red"
          />
          <h2 className="text-2xl font-extrabold tracking-tight text-movet-black sm:text-4xl font-parkinson mb-4">
            Whoops!
          </h2>
          <p className={"mt-4 text-lg leading-6 text-movet-black"}>
            We&apos;re sorry, but something went wrong.
          </p>
          <pre className="my-8 p-4">
            {JSON.stringify({
              error: { message: error?.message, code: error?.code },
            })}
          </pre>
          {!isAppMode ? (
            <p>
              Please try again or{" "}
              <a
                href={"https://app.movetcare.com/contact"}
                target="_blank"
                rel="noreferrer"
              >
                contact support
              </a>{" "}
              for assistance.
            </p>
          ) : (
            <p>Please try again </p>
          )}
          <div
            className="flex flex-row justify-center items-center my-4 cursor-pointer"
            onClick={() => restartBooking()}
          >
            <FontAwesomeIcon icon={faRedo} />
            <p className="ml-2">Try Again</p>
          </div>
        </>
      )}
    </div>
  );
};
