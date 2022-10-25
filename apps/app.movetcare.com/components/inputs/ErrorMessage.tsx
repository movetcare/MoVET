import { Transition } from "@headlessui/react";
import { capitalizeFirstLetter } from "utilities";

const ErrorMessage = ({ errorMessage }: { errorMessage: string }) => (
  <Transition
    show={Boolean(errorMessage)}
    enter="transition ease-in duration-500"
    leave="transition ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    {errorMessage && (
      <div className="flex-row justify-center items-center bg-transparent mt-2 -mb-6">
        <p className="p-2 text-movet-red font-bold text-sm italic text-center font-source-sans-pro">
          * {capitalizeFirstLetter(errorMessage)}
        </p>
      </div>
    )}
  </Transition>
);

export default ErrorMessage;
