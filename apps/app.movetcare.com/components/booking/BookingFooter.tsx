import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition, Dialog } from "@headlessui/react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useRef, Fragment, useState } from "react";
import { firestore } from "services/firebase";
import { Booking } from "types/Booking";
import { Loader } from "ui";
import { Error } from "components/Error";

export const BookingFooter = ({ session }: { session: Booking }) => {
  const cancelButtonRef = useRef(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const restartBooking = async () => {
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      {
        step: "restart",
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() => {
        location.reload();
        return false;
      })
      .catch((error: any) => {
        setIsLoading(false);
        setError(error);
      });
  };
  return (
    <>
      <div
        className="flex flex-row justify-center items-center cursor-pointer text-xs hover:text-movet-red ease-in-out duration-500"
        onClick={() => setShowResetModal(true)}
      >
        <FontAwesomeIcon icon={faRedo} className="mr-2" />
        <p>Restart</p>
      </div>
      <Transition.Root show={showResetModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-50 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => setShowResetModal(false)}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-movet-white bg-opacity-50 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                {isLoading ? (
                  <Loader message="Restarting Appointment Booking..." />
                ) : error ? (
                  <Error error={error} />
                ) : (
                  <>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-movet-red">
                        <FontAwesomeIcon icon={faRedo} size="2x" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h2"
                          className="text-xl uppercase leading-6 font-medium mt-0"
                        >
                          Restart Appointment Booking?
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-lg">
                            Are you sure you want to restart your appointment
                            booking?{" "}
                            <span className="text-lg italic font-bold">
                              This action cannot be undone!
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-movet-black hover:bg-movet-red text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red sm:ml-3 sm:w-auto sm:text-sm ease-in-out duration-500"
                        onClick={async () => await restartBooking()}
                      >
                        YES
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-lg border shadow-sm px-4 py-2 bg-white hover:bg-movet-brown hover:text-white text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-brown sm:mt-0 sm:w-auto sm:text-sm ease-in-out duration-500"
                        onClick={() => setShowResetModal(false)}
                        ref={cancelButtonRef}
                      >
                        CANCEL
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
