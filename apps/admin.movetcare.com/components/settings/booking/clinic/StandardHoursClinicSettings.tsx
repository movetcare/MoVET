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
import { PatternFormat } from "react-number-format";
import { Button } from "ui";
import { Transition } from "@headlessui/react";
import Error from "../../../Error";

const StandardHoursClinicSettings = () => {
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null
  );
  const [didTouchStartTime, setDidTouchStartTime] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [didTouchEndTime, setDidTouchEndTime] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        if (doc.data()?.clinicStartTime)
          setSelectedStartTime(
            doc.data()?.clinicStartTime.toString().length === 3
              ? `0${doc.data()?.clinicStartTime}`
              : `${doc.data()?.clinicStartTime}`
          );
        if (doc.data()?.clinicEndTime)
          setSelectedEndTime(
            doc.data()?.clinicEndTime.toString().length === 3
              ? `0${doc.data()?.clinicEndTime}`
              : `${doc.data()?.clinicEndTime}`
          );
      },
      (error: any) => {
        setError(error?.message || error);
      }
    );
    return () => unsubscribe();
  }, []);

  const saveChanges = async () => {
    if (didTouchEndTime && selectedEndTime)
      await setDoc(
        doc(firestore, "configuration/bookings"),
        {
          clinicEndTime: Number(selectedEndTime),
          updatedOn: serverTimestamp(),
        },
        { merge: true }
      )
        .then(() =>
          toast(`Clinic Lunch Duration Updated to "${selectedEndTime}"`, {
            position: "top-center",
            icon: (
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="sm"
                className="text-movet-green"
              />
            ),
          })
        )
        .catch((error: any) =>
          toast(`Clinic Lunch Duration Updated FAILED: ${error?.message}`, {
            duration: 5000,
            position: "bottom-center",
            icon: (
              <FontAwesomeIcon
                icon={faCircleExclamation}
                size="sm"
                className="text-movet-red"
              />
            ),
          })
        );
    if (didTouchStartTime && selectedStartTime && selectedStartTime !== "")
      await setDoc(
        doc(firestore, "configuration/bookings"),
        {
          clinicStartTime: Number(selectedStartTime),
          updatedOn: serverTimestamp(),
        },
        { merge: true }
      )
        .then(() =>
          toast(`Clinic Lunch Time Updated to "${selectedStartTime}"`, {
            position: "top-center",
            icon: (
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="sm"
                className="text-movet-green"
              />
            ),
          })
        )
        .catch((error: any) =>
          toast(`Clinic Lunch Time Updated FAILED: ${error?.message}`, {
            duration: 5000,
            position: "bottom-center",
            icon: (
              <FontAwesomeIcon
                icon={faCircleExclamation}
                size="sm"
                className="text-movet-red"
              />
            ),
          })
        );
    setDidTouchEndTime(false);
    setDidTouchStartTime(false);
  };

  return error ? (
    <Error error={error} />
  ) : (
    <li className="py-4 flex-col sm:flex-row items-center justify-center">
      <div className="flex flex-col mr-4">
        <h3>Standard Operating Hours</h3>
        <p className="text-sm">
          This controls availability of appointments during each day of the
          week.
        </p>
      </div>
      <div className="flex justify-center items-center my-4">
        <div className="flex-col justify-center items-center mx-4">
          <p className="text-center my-2">Start Time</p>
          <PatternFormat
            isAllowed={(values: any) => {
              const { value } = values;
              return value <= 2400;
            }}
            format={"##:##"}
            mask="_"
            patternChar="#"
            name={"start-time"}
            type="text"
            valueIsNumericString
            value={selectedStartTime}
            onBlur={() => setDidTouchStartTime(true)}
            onValueChange={(target: any) => setSelectedStartTime(target.value)}
            className={
              "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
            }
          />
          <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
        </div>
        <div className="flex-col justify-center items-center mx-4">
          <p className="text-center my-2">End Time</p>
          <PatternFormat
            isAllowed={(values: any) => {
              const { value } = values;
              return value <= 2400;
            }}
            format={"##:##"}
            mask="_"
            patternChar="#"
            name={"end-time"}
            type="text"
            valueIsNumericString
            value={selectedEndTime}
            onBlur={() => setDidTouchEndTime(true)}
            onValueChange={(target: any) => setSelectedEndTime(target.value)}
            className={
              "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
            }
          />
          <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
        </div>
      </div>
      <Transition
        show={didTouchStartTime || didTouchEndTime}
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
          disabled={
            selectedStartTime !== null &&
            selectedStartTime.length !== 4 &&
            selectedEndTime !== null &&
            selectedEndTime.length !== 4
          }
          onClick={() => saveChanges()}
          className="mb-8"
        />
      </Transition>
    </li>
  );
};

export default StandardHoursClinicSettings;
