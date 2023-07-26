import { faPaw, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition, Dialog } from "@headlessui/react";
import Button from "components/Button";
import { Countdown } from "components/Countdown";
import TextInput from "components/inputs/TextInput";
import { Fragment, useRef } from "react";
import { useForm } from "react-hook-form";

export const SignInModal = ({
  icon = faQuestion,
  title,
  text = "",
  yesButtonText = "OK",
  cancelButtonText = "Cancel",
  modalIsOpen = false,
  setModalIsOpen,
  iconColor = "black",
  yesButtonColor = "black",
  setToken,
}: {
  icon?: any;
  title: string;
  text?: string;
  yesButtonText?: string;
  cancelButtonText?: string;
  modalIsOpen: boolean;
  setModalIsOpen: any;
  iconColor?: "red" | "black" | "green" | "yellow";
  yesButtonColor?: "red" | "black" | "green" | "yellow";
  setToken: any;
}) => {
  const cancelButtonRef = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      code: "",
    } as any,
  });
  const onSubmit = (data: { code: string }) => {
    console.log(data);
    setToken(data.code);
  };
  return (
    <Transition.Root show={modalIsOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => {
          setModalIsOpen(false);
        }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
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
            <form className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div
                  className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-movet-${iconColor}`}
                >
                  <FontAwesomeIcon icon={icon} size="2x" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-xl uppercase leading-6 font-medium text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-lg mb-4">{text}</p>
                    <TextInput
                      type="number"
                      autoFocus={true}
                      label=""
                      name="code"
                      control={control}
                      errors={errors}
                      placeholder="6 Digit Code..."
                      autoComplete="off"
                    />
                    <p className="text-xs italic my-3">
                      Code Expires: <Countdown /> seconds
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  type="submit"
                  text={yesButtonText}
                  disabled={!isDirty}
                  className={`bg-movet-${yesButtonColor} w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleSubmit(onSubmit as any)}
                  icon={faPaw}
                  iconSize={"sm"}
                  color="black"
                />
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setModalIsOpen(false)}
                  ref={cancelButtonRef}
                >
                  {cancelButtonText}
                </button>
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
