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
import { PatternFormat, NumericFormat } from "react-number-format";
import { Button } from "ui";
import { Transition } from "@headlessui/react";
import Error from "../../Error";

const LunchSettings = ({
  schedule,
}: {
  schedule: "clinic" | "housecall" | "virtual";
}) => {
  const [selectedLunchTime, setSelectedLunchTime] = useState<string | null>(
    null,
  );
  const [didTouchLunchTime, setDidTouchLunchTime] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [selectedLunchDuration, setSelectedLunchDuration] = useState<
    string | null
  >(null);
  const [didTouchLunchDuration, setDidTouchLunchDuration] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        setSelectedLunchTime(
          schedule === "clinic"
            ? doc.data()?.clinicLunchTime.toString().length === 3
              ? `0${doc.data()?.clinicLunchTime}`
              : `${doc.data()?.clinicLunchTime}`
            : schedule === "housecall"
            ? doc.data()?.housecallLunchTime.toString().length === 3
              ? `0${doc.data()?.housecallLunchTime}`
              : `${doc.data()?.housecallLunchTime}`
            : doc.data()?.virtualLunchTime.toString().length === 3
            ? `0${doc.data()?.virtualLunchTime}`
            : `${doc.data()?.virtualLunchTime}`,
        );
        setSelectedLunchDuration(
          schedule === "clinic"
            ? doc.data()?.clinicLunchDuration
            : schedule === "housecall"
            ? doc.data()?.housecallLunchDuration
            : doc.data()?.virtualLunchDuration,
        );
      },
      (error: any) => {
        setError(error?.message || error);
      },
    );
    return () => unsubscribe();
  }, [schedule]);

  const saveChanges = async () => {
    if (didTouchLunchDuration && selectedLunchDuration)
      await setDoc(
        doc(firestore, "configuration/bookings"),
        schedule === "clinic"
          ? {
              clinicLunchDuration: Number(selectedLunchDuration),
              updatedOn: serverTimestamp(),
            }
          : schedule === "housecall"
          ? {
              housecallLunchDuration: Number(selectedLunchDuration),
              updatedOn: serverTimestamp(),
            }
          : {
              virtualLunchDuration: Number(selectedLunchDuration),
              updatedOn: serverTimestamp(),
            },
        { merge: true },
      )
        .then(() =>
          toast(
            `${schedule?.toUpperCase()} Lunch Duration Updated to "${selectedLunchDuration}"`,
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
        .catch((error: any) =>
          toast(
            `${schedule?.toUpperCase()} Lunch Duration Updated FAILED: ${error?.message}`,
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
          ),
        );
    if (didTouchLunchTime && selectedLunchTime && selectedLunchTime !== "")
      await setDoc(
        doc(firestore, "configuration/bookings"),
        schedule === "clinic"
          ? {
              clinicLunchTime: Number(selectedLunchTime),
              updatedOn: serverTimestamp(),
            }
          : schedule === "housecall"
          ? {
              housecallLunchTime: Number(selectedLunchTime),
              updatedOn: serverTimestamp(),
            }
          : {
              virtualLunchTime: Number(selectedLunchTime),
              updatedOn: serverTimestamp(),
            },
        { merge: true },
      )
        .then(() =>
          toast(
            `${schedule?.toUpperCase()} Lunch Time Updated to "${selectedLunchTime}"`,
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
        .catch((error: any) =>
          toast(
            `${schedule?.toUpperCase()} Lunch Time Updated FAILED: ${error?.message}`,
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
          ),
        );
    setDidTouchLunchDuration(false);
    setDidTouchLunchTime(false);
  };

  return error ? (
    <Error error={error} />
  ) : (
    <li className="py-4 flex-col sm:flex-row items-center justify-center">
      <div className="flex flex-col mr-4">
        <h3>Standard Lunch</h3>
        <p className="text-sm">
          This controls availability of appointments during the standard lunch
          hour. All available appointment slots that overlap with this time and
          duration will be marked as unavailable in the scheduling.
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
            name={"lunch-start-time"}
            type="text"
            valueIsNumericString
            value={selectedLunchTime}
            onBlur={() => setDidTouchLunchTime(true)}
            onValueChange={(target: any) => setSelectedLunchTime(target.value)}
            className={
              "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
            }
          />
          <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
        </div>
        <div className="flex-col justify-center items-center mx-4">
          <p className="text-center my-2">Duration</p>
          <NumericFormat
            isAllowed={(values: any) => {
              const { value } = values;
              return value < 181;
            }}
            allowLeadingZeros={false}
            allowNegative={false}
            name={"lunch-duration"}
            type="text"
            valueIsNumericString
            value={selectedLunchDuration}
            onBlur={() => setDidTouchLunchDuration(true)}
            onValueChange={(target: any) =>
              setSelectedLunchDuration(target.value)
            }
            className={
              "focus:ring-movet-brown focus:border-movet-brown py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14"
            }
          />
          <p className="text-center mt-2 italic text-xs">(Minutes)</p>
        </div>
      </div>
      <Transition
        show={didTouchLunchTime || didTouchLunchDuration}
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
            selectedLunchTime !== null && selectedLunchTime.length !== 4
          }
          onClick={() => saveChanges()}
          className="mb-8"
        />
      </Transition>
    </li>
  );
};

export default LunchSettings;
