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
import { Button } from "ui";
import { Switch, Transition } from "@headlessui/react";
import Error from "../../../Error";
import { classNames } from "utilities";

const StandardDaysClinicSettings = () => {
  const [isOpenMonday, setIsOpenMonday] = useState<boolean>(false);
  const [didTouchIsOpenMonday, setDidTouchIsOpenMonday] =
    useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        setIsOpenMonday(doc.data()?.clinicOpenMonday);
      },
      (error: any) => {
        setError(error?.message || error);
      }
    );
    return () => unsubscribe();
  }, []);

  const saveChanges = async () => {
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        clinicOpenMonday: isOpenMonday,
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`Clinic Days of Operation Updated!`, {
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
        toast(`Clinic Days of Operation Updated FAILED: ${error?.message}`, {
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
    setDidTouchIsOpenMonday(false);
  };

  return error ? (
    <Error error={error} />
  ) : (
    <li className="py-4 flex-col sm:flex-row items-center justify-center">
      <div className="flex flex-col mr-4">
        <h3>Standard Operating Days</h3>
        <p className="text-sm">
          This controls availability of appointments during each day of the
          week.
        </p>
      </div>
      <div className="flex justify-center items-center my-4">
        <div className="flex-col justify-center items-center mx-4">
          <p className="text-center my-2">Monday</p>
          <Switch
            checked={isOpenMonday}
            onChange={() => {
              setIsOpenMonday(!isOpenMonday);
              setDidTouchIsOpenMonday(true);
            }}
            className={classNames(
              isOpenMonday ? "bg-movet-green" : "bg-movet-red",
              "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                isOpenMonday ? "translate-x-5" : "translate-x-0",
                "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
              )}
            />
          </Switch>
        </div>
      </div>
      <Transition
        show={didTouchIsOpenMonday}
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
          onClick={() => saveChanges()}
          className="mb-8"
        />
      </Transition>
    </li>
  );
};

export default StandardDaysClinicSettings;
