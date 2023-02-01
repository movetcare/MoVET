import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@headlessui/react";
import { useRef, useState } from "react";
import { Modal } from "ui";
import { useRouter } from "next/router";
import { ServerResponse } from "types";
import { Error } from "components/Error";

export const BookingFooter = () => {
  const cancelButtonRef = useRef(null);
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const restartBooking = () => {
    setIsLoading(true);
    const processAppointmentBookingRestart = async () =>
      (
        await fetch("/api/schedule-an-appointment", {
          method: "POST",
          body: JSON.stringify({
            id: JSON.parse(
              window.localStorage.getItem("bookingSession") as string
            )?.id,
            step: "restart",
          }),
        })
      ).json();
    processAppointmentBookingRestart()
      .then((response: ServerResponse) => {
        if (response.error) {
          handleError({ message: response.error });
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("bookingSession");
          router.replace("/schedule-an-appointment");
        }
      })
      .catch((error) => handleError(error))
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  };
  return !isAppMode ? (
    <>
      <div
        className="flex flex-row justify-center items-center cursor-pointer text-xs hover:text-movet-red ease-in-out duration-500"
        onClick={() => setShowResetModal(true)}
      >
        <FontAwesomeIcon icon={faRedo} className="mr-2" />
        <p id="restart">Restart</p>
      </div>
      <Modal
        showModal={showResetModal}
        setShowModal={setShowResetModal}
        cancelButtonRef={cancelButtonRef}
        isLoading={isLoading}
        content={
          error ? (
            <Error error={error} />
          ) : (
            <p className="text-lg">
              Are you sure you want to restart your appointment booking?{" "}
              <span className="text-lg italic font-bold">
                This action cannot be undone!
              </span>
            </p>
          )
        }
        title="Restart Appointment Booking?"
        icon={faRedo}
        action={restartBooking}
        yesButtonText="YES"
        noButtonText="CANCEL"
      />
    </>
  ) : (
    <></>
  );
};
