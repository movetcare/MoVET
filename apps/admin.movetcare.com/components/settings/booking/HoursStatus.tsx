import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
  faHospital,
  faHouseMedical,
  faPersonWalking,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "components/Divider";
import { onSnapshot, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "services/firebase";
import { Button, Loader } from "ui";
import Error from "../../Error";
import { Switch, Transition } from "@headlessui/react";
import { classNames } from "utilities";
import toast from "react-hot-toast";

export const HoursStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [boutiqueStatus, setBoutiqueStatus] = useState<boolean>(false);
  const [clinicStatus, setClinicStatus] = useState<boolean>(false);
  const [housecallStatus, setHousecallStatus] = useState<boolean>(false);
  const [walkinsStatus, setWalkinsStatus] = useState<boolean>(false);
  const [didTouchBoutiqueStatus, setDidTouchBoutiqueStatus] =
    useState<boolean>(false);
  const [didTouchClinicStatus, setDidTouchClinicStatus] =
    useState<boolean>(false);
  const [didTouchWalkInsStatus, setDidTouchWalkInsStatus] =
    useState<boolean>(false);
  const [didTouchHousecallStatus, setDidTouchHousecallStatus] =
    useState<boolean>(false);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        setBoutiqueStatus(doc.data()?.boutiqueStatus || false);
        setClinicStatus(doc.data()?.clinicStatus || false);
        setHousecallStatus(doc.data()?.housecallStatus || false);
        setWalkinsStatus(doc.data()?.walkinsStatus || false);
        setIsLoading(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);
  const saveChanges = async () => {
    console.log({
      boutiqueStatus,
      clinicStatus,
      housecallStatus,
      walkinsStatus,
    });
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        boutiqueStatus,
        clinicStatus,
        housecallStatus,
        walkinsStatus,
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`Website Hours Status Updated!`, {
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
        toast(`Website Hours Status Update FAILED: ${error?.message}`, {
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
      )
      .finally(() => {
        setDidTouchBoutiqueStatus(false);
      });
  };
  return (
    <div className="py-4 flex-col sm:flex-row items-center justify-center">
      <h3>HOURS STATUS</h3>
      <p className="text-sm">
        Use this setting to change the OPEN/CLOSE status on the{" "}
        <a
          href="https://movetcare.com/hours"
          target="_blank"
          className="text-movet-red hover:underline"
        >
          website hours page
        </a>
        .
      </p>
      <Divider />
      {isLoading ? (
        <Loader message="Loading Openings" />
      ) : error ? (
        <Error error={error} />
      ) : (
        <div className="flex flex-row justify-center items-center">
          <div className="flex flex-col w-full mx-auto justify-center items-center">
            <FontAwesomeIcon
              icon={faHospital}
              size="3x"
              className="w-full mt-4 text-movet-red"
            />
            <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
              <span className="ml-2">
                Clinic @ Belleview Station Status:{" "}
                <span
                  className={`italic${
                    clinicStatus ? " text-movet-green" : " text-movet-red"
                  }`}
                >
                  {clinicStatus ? "ONLINE" : "OFFLINE"}
                </span>
              </span>
            </label>
            <Switch
              checked={clinicStatus}
              onChange={() => {
                setClinicStatus(!clinicStatus);
                setDidTouchClinicStatus(true);
              }}
              className={classNames(
                clinicStatus ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  clinicStatus ? "translate-x-5" : "translate-x-0",
                  "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              />
            </Switch>
            <FontAwesomeIcon
              icon={faShop}
              size="3x"
              className="w-full mt-8 text-movet-red"
            />
            <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
              <span className="ml-2">
                Boutique @ Belleview Station Status:{" "}
                <span
                  className={`italic${
                    boutiqueStatus ? " text-movet-green" : " text-movet-red"
                  }`}
                >
                  {boutiqueStatus ? "ONLINE" : "OFFLINE"}
                </span>
              </span>
            </label>
            <Switch
              checked={boutiqueStatus}
              onChange={() => {
                setBoutiqueStatus(!boutiqueStatus);
                setDidTouchBoutiqueStatus(true);
              }}
              className={classNames(
                boutiqueStatus ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  boutiqueStatus ? "translate-x-5" : "translate-x-0",
                  "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              />
            </Switch>
          </div>
          <div className="flex flex-col w-full mx-auto justify-center items-center">
            <FontAwesomeIcon
              icon={faPersonWalking}
              size="3x"
              className="w-full mt-4 text-movet-red"
            />
            <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
              <span className="ml-2">
                Walk-Ins @ Belleview Station Status:{" "}
                <span
                  className={`italic${
                    walkinsStatus ? " text-movet-green" : " text-movet-red"
                  }`}
                >
                  {walkinsStatus ? "ONLINE" : "OFFLINE"}
                </span>
              </span>
            </label>
            <Switch
              checked={walkinsStatus}
              onChange={() => {
                setWalkinsStatus(!walkinsStatus);
                setDidTouchWalkInsStatus(true);
              }}
              className={classNames(
                walkinsStatus ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  walkinsStatus ? "translate-x-5" : "translate-x-0",
                  "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              />
            </Switch>
            <FontAwesomeIcon
              icon={faHouseMedical}
              size="3x"
              className="w-full mt-8 text-movet-red"
            />
            <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
              <span className="ml-2">
                Housecalls Status:{" "}
                <span
                  className={`italic${
                    housecallStatus ? " text-movet-green" : " text-movet-red"
                  }`}
                >
                  {housecallStatus ? "ONLINE" : "OFFLINE"}
                </span>
              </span>
            </label>
            <Switch
              checked={housecallStatus}
              onChange={() => {
                setHousecallStatus(!housecallStatus);
                setDidTouchHousecallStatus(true);
              }}
              className={classNames(
                housecallStatus ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  housecallStatus ? "translate-x-5" : "translate-x-0",
                  "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              />
            </Switch>
          </div>
        </div>
      )}
      <Transition
        show={
          didTouchBoutiqueStatus ||
          didTouchClinicStatus ||
          didTouchWalkInsStatus ||
          didTouchHousecallStatus
        }
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
          className="mt-8"
        />
      </Transition>
    </div>
  );
};
