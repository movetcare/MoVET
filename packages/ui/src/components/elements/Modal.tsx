import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "./Button";
import { Loader } from "./Loader";

export const Modal = ({
  title,
  content,
  icon,
  showModal,
  setShowModal,
  cancelButtonRef,
  isLoading,
  loadingMessage = "Loading, Please Wait...",
  error,
  action,
  yesButtonText = "OK",
  noButtonText = "CLOSE",
}: any) => {
  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => setShowModal(false)}
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
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              {isLoading ? (
                <Loader message={loadingMessage} />
              ) : error ? (
                error
              ) : (
                <>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-movet-red">
                      <FontAwesomeIcon icon={icon} size="2x" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h2"
                        className="text-xl uppercase leading-6 font-medium mt-0"
                      >
                        {title}
                      </Dialog.Title>
                      <div className="mt-6 text-left">{content}</div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    {action && (
                      <Button
                        color="black"
                        onClick={() => action()}
                        className="w-full mb-4 sm:mb-0 sm:ml-2"
                      >
                        {yesButtonText}
                      </Button>
                    )}
                    <Button
                      color="red"
                      className="w-full sm:mr-2"
                      onClick={() => setShowModal(false)}
                      buttonRef={cancelButtonRef}
                    >
                      {noButtonText}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
