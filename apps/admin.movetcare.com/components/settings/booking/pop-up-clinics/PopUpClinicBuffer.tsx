import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "services/firebase";
import toast from "react-hot-toast";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Button } from "ui";
import { Transition } from "@headlessui/react";
import Error from "../../../Error";
import type { ClinicConfig } from "types";

export const PopUpClinicBuffer = ({
  configuration,
  popUpClinics,
}: {
  configuration: ClinicConfig;
  popUpClinics: any;
}) => {
  const [selectedBufferTime, setSelectedBufferTime] = useState<string | null>(
    String(configuration?.appointmentBufferTime) || null,
  );
  const [didTouchBufferTime, setDidTouchBufferTime] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const saveChanges = async () => {
    if (didTouchBufferTime && selectedBufferTime && selectedBufferTime !== "") {
      const newPopUpClinics = popUpClinics.map((clinic: any) => {
        if (clinic.id === configuration?.id)
          return {
            ...clinic,
            appointmentBufferTime: Number(selectedBufferTime),
          };
        else return clinic;
      });
      await setDoc(
        doc(firestore, "configuration/pop_up_clinics"),
        {
          popUpClinics: newPopUpClinics,
          updatedOn: serverTimestamp(),
        },
        { merge: true },
      )
        .then(() =>
          toast(
            `${configuration?.name} Appointment Buffer Time Update to "${selectedBufferTime}"`,
            {
              position: "top-center",
              icon: (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="sm"
                  className="text-movet-green"
                />
              ),
            },
          ),
        )
        .catch((error: any) => {
          toast(
            `${configuration?.name} Appointment Buffer Time Update FAILED: ${error?.message}`,
            {
              duration: 5000,
              icon: (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  size="sm"
                  className="text-movet-red"
                />
              ),
            },
          );
          setError(error);
        })
        .finally(() => setDidTouchBufferTime(false));
    }
  };

  return error ? (
    <Error error={error} />
  ) : (
    <>
      <section className="px-10 py-4 flex-col sm:flex-row items-center justify-center">
        <div className="flex flex-col mr-4">
          <span className="sm:mr-2 mt-4">
            Appointment Buffer <span className="text-sm text-movet-red">*</span>
          </span>
          <p className="text-sm">
            This controls how many minutes of buffer time is added between all
            appointments.
          </p>
        </div>
        <div className="flex justify-center items-center my-4">
          <div className="flex-col justify-center items-center mx-4">
            <p className="text-center my-2">Duration</p>
            <NumericFormat
              isAllowed={(values: any) => {
                const { value } = values;
                return value < 120;
              }}
              allowLeadingZeros={false}
              allowNegative={false}
              name={"bufferTime"}
              type="text"
              valueIsNumericString
              value={selectedBufferTime}
              onBlur={() => setDidTouchBufferTime(true)}
              onValueChange={(target: any) =>
                setSelectedBufferTime(target.value)
              }
              className={
                "focus:ring-movet-brown focus:border-movet-brown py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14"
              }
            />
            <p className="text-center mt-2 italic text-xs">(Minutes)</p>
          </div>
        </div>
        <Transition
          show={didTouchBufferTime}
          enter="transition ease-in duration-500"
          leave="transition ease-out duration-64"
          leaveTo="opacity-10"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
        >
          <Button
            text="SAVE"
            color="red"
            icon={faCheck}
            disabled={selectedBufferTime === null}
            onClick={() => saveChanges()}
            className="mb-8"
          />
        </Transition>
      </section>
      <hr className="mb-4 text-movet-gray" />
    </>
  );
};
