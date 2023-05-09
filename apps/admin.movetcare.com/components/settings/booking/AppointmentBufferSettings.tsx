import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "services/firebase";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { Button } from "ui";
import { Transition } from "@headlessui/react";
import Error from "../../Error";

const AppointmentBufferSettings = ({
  schedule,
}: {
  schedule: "clinic" | "housecall" | "virtual";
}) => {
  const [selectedBufferTime, setSelectedBufferTime] = useState<string | null>(
    null
  );
  const [didTouchBufferTime, setDidTouchBufferTime] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) =>
        setSelectedBufferTime(
          schedule === "clinic"
            ? doc.data()?.clinicAppointmentBufferTime
            : schedule === "housecall"
            ? doc.data()?.housecallAppointmentBufferTime
            : doc.data()?.virtualAppointmentBufferTime
        ),
      (error: any) => setError(error?.message || error)
    );
    return () => unsubscribe();
  }, [schedule]);

  const saveChanges = async () => {
    if (didTouchBufferTime && selectedBufferTime && selectedBufferTime !== "")
      await setDoc(
        doc(firestore, "configuration/bookings"),
        schedule === "clinic"
          ? {
              clinicAppointmentBufferTime: Number(selectedBufferTime),
              updatedOn: serverTimestamp(),
            }
          : schedule === "housecall"
          ? {
              housecallAppointmentBufferTime: Number(selectedBufferTime),
              updatedOn: serverTimestamp(),
            }
          : {
              virtualAppointmentBufferTime: Number(selectedBufferTime),
              updatedOn: serverTimestamp(),
            },
        { merge: true }
      )
        .then(() =>
          toast(
            `${schedule?.toUpperCase()} Appointment Buffer Time Update to "${selectedBufferTime}"`,
            {
              position: "top-center",
              icon: (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="sm"
                  className="text-movet-green"
                />
              ),
            }
          )
        )
        .catch((error: any) =>
          toast(
            `${schedule?.toUpperCase()} Appointment Buffer Time Update FAILED: ${
              error?.message
            }`,
            {
              duration: 5000,
              position: "bottom-center",
              icon: (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  size="sm"
                  className="text-movet-red"
                />
              ),
            }
          )
        );
    setDidTouchBufferTime(false);
  };

  return error ? (
    <Error error={error} />
  ) : (
    <li className="py-4 flex-col sm:flex-row items-center justify-center">
      <div className="flex flex-col mr-4">
        <h3>Standard Appointment Buffer</h3>
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
            onValueChange={(target: any) => setSelectedBufferTime(target.value)}
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
    </li>
  );
};

export default AppointmentBufferSettings;
