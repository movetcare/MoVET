import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
  faHospital,
  faHouseMedical,
  faMagnifyingGlass,
  faPersonWalking,
  faPowerOff,
  faRobot,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "components/Divider";
import { onSnapshot, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "services/firebase";
import { Button, Hours, Loader } from "ui";
import Error from "../../Error";
import { Switch, Transition } from "@headlessui/react";
import { classNames } from "utilities";
import toast from "react-hot-toast";
import { PatternFormat } from "react-number-format";

export const HoursStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [error, setError] = useState<any>(null);
  const [winterMode, setWinterMode] = useState<any>(null);
  const [hours, setHours] = useState<any>(null);
  const [boutiqueStatus, setBoutiqueStatus] = useState<boolean>(false);
  const [clinicStatus, setClinicStatus] = useState<boolean>(false);
  const [housecallStatus, setHousecallStatus] = useState<boolean>(false);
  const [walkinsStatus, setWalkinsStatus] = useState<boolean>(false);
  const [isOpenMondayAutomation, setIsOpenMonday] = useState<boolean>(false);
  const [didTouchIsOpenMonday, setDidTouchIsOpenMonday] =
    useState<boolean>(false);
  const [isOpenTuesdayAutomation, setIsOpenTuesday] = useState<boolean>(false);
  const [didTouchIsOpenTuesday, setDidTouchIsOpenTuesday] =
    useState<boolean>(false);
  const [isOpenWednesdayAutomation, setIsOpenWednesday] =
    useState<boolean>(false);
  const [didTouchIsOpenWednesday, setDidTouchIsOpenWednesday] =
    useState<boolean>(false);
  const [isOpenThursdayAutomation, setIsOpenThursday] =
    useState<boolean>(false);
  const [didTouchIsOpenThursday, setDidTouchIsOpenThursday] =
    useState<boolean>(false);
  const [isOpenFridayAutomation, setIsOpenFriday] = useState<boolean>(false);
  const [didTouchIsOpenFriday, setDidTouchIsOpenFriday] =
    useState<boolean>(false);
  const [isOpenSaturdayAutomation, setIsOpenSaturday] =
    useState<boolean>(false);
  const [didTouchIsOpenSaturday, setDidTouchIsOpenSaturday] =
    useState<boolean>(false);
  const [isOpenSundayAutomation, setIsOpenSunday] = useState<boolean>(false);
  const [didTouchIsOpenSunday, setDidTouchIsOpenSunday] =
    useState<boolean>(false);
  const [selectedStartTimeTuesday, setSelectedStartTimeTuesday] = useState<
    string | null
  >(null);
  const [didTouchStartTimeTuesday, setDidTouchStartTimeTuesday] =
    useState<boolean>(false);
  const [selectedEndTimeTuesday, setSelectedEndTimeTuesday] = useState<
    string | null
  >(null);
  const [didTouchEndTimeTuesday, setDidTouchEndTimeTuesday] =
    useState<boolean>(false);
  const [selectedStartTimeWednesday, setSelectedStartTimeWednesday] = useState<
    string | null
  >(null);
  const [didTouchStartTimeWednesday, setDidTouchStartTimeWednesday] =
    useState<boolean>(false);
  const [selectedEndTimeWednesday, setSelectedEndTimeWednesday] = useState<
    string | null
  >(null);
  const [didTouchEndTimeWednesday, setDidTouchEndTimeWednesday] =
    useState<boolean>(false);
  const [selectedStartTimeThursday, setSelectedStartTimeThursday] = useState<
    string | null
  >(null);
  const [didTouchStartTimeThursday, setDidTouchStartTimeThursday] =
    useState<boolean>(false);
  const [selectedEndTimeThursday, setSelectedEndTimeThursday] = useState<
    string | null
  >(null);
  const [didTouchEndTimeThursday, setDidTouchEndTimeThursday] =
    useState<boolean>(false);
  const [selectedStartTimeFriday, setSelectedStartTimeFriday] = useState<
    string | null
  >(null);
  const [didTouchStartTimeFriday, setDidTouchStartTimeFriday] =
    useState<boolean>(false);
  const [selectedEndTimeFriday, setSelectedEndTimeFriday] = useState<
    string | null
  >(null);
  const [didTouchEndTimeFriday, setDidTouchEndTimeFriday] =
    useState<boolean>(false);
  const [selectedStartTimeSaturday, setSelectedStartTimeSaturday] = useState<
    string | null
  >(null);
  const [didTouchStartTimeSaturday, setDidTouchStartTimeSaturday] =
    useState<boolean>(false);
  const [selectedEndTimeSaturday, setSelectedEndTimeSaturday] = useState<
    string | null
  >(null);
  const [didTouchEndTimeSaturday, setDidTouchEndTimeSaturday] =
    useState<boolean>(false);
  const [selectedStartTimeSunday, setSelectedStartTimeSunday] = useState<
    string | null
  >(null);
  const [didTouchStartTimeSunday, setDidTouchStartTimeSunday] =
    useState<boolean>(false);
  const [selectedEndTimeSunday, setSelectedEndTimeSunday] = useState<
    string | null
  >(null);
  const [didTouchEndTimeSunday, setDidTouchEndTimeSunday] =
    useState<boolean>(false);
  const [selectedStartTimeMonday, setSelectedStartTimeMonday] = useState<
    string | null
  >(null);
  const [didTouchStartTimeMonday, setDidTouchStartTimeMonday] =
    useState<boolean>(false);
  const [selectedEndTimeMonday, setSelectedEndTimeMonday] = useState<
    string | null
  >(null);
  const [didTouchEndTimeMonday, setDidTouchEndTimeMonday] =
    useState<boolean>(false);
  const [didTouchBoutiqueStatus, setDidTouchBoutiqueStatus] =
    useState<boolean>(false);
  const [didTouchClinicStatus, setDidTouchClinicStatus] =
    useState<boolean>(false);
  const [didTouchWalkInsStatus, setDidTouchWalkInsStatus] =
    useState<boolean>(false);
  const [didTouchHousecallStatus, setDidTouchHousecallStatus] =
    useState<boolean>(false);
  const [clinicAutomationStatus, setClinicAutomationStatus] =
    useState<boolean>(false);
  const [housecallAutomationStatus, setHousecallAutomationStatus] =
    useState<boolean>(false);
  const [boutiqueAutomationStatus, setBoutiqueAutomationStatus] =
    useState<boolean>(false);
  const [walkinsAutomationStatus, setWalkinsAutomationStatus] =
    useState<boolean>(false);
  const [didTouchClinicAutomationStatus, setDidTouchClinicAutomationStatus] =
    useState<boolean>(false);
  const [didTouchWalkInsAutomationStatus, setDidTouchWalkInsAutomationStatus] =
    useState<boolean>(false);
  const [
    didTouchHousecallAutomationStatus,
    setDidTouchHousecallAutomationStatus,
  ] = useState<boolean>(false);
  const [
    didTouchBoutiqueAutomationStatus,
    setDidTouchBoutiqueAutomationStatus,
  ] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribeWinterModeConfiguration = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        setWinterMode(doc.data()?.winterMode || null);
        setIsLoadingStatus(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoadingStatus(false);
      }
    );
    const unsubscribeHoursConfiguration = onSnapshot(
      doc(firestore, "configuration", "openings"),
      (doc: any) => {
        setHours(doc.data()?.openingDates || null);
        setIsLoadingStatus(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoadingStatus(false);
      }
    );
    const unsubscribeHoursStatusConfiguration = onSnapshot(
      doc(firestore, "configuration", "hours_status"),
      (doc: any) => {
        setBoutiqueStatus(doc.data()?.boutiqueStatus || false);
        setClinicStatus(doc.data()?.clinicStatus || false);
        setHousecallStatus(doc.data()?.housecallStatus || false);
        setWalkinsStatus(doc.data()?.walkinsStatus || false);
        setIsLoadingStatus(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoadingStatus(false);
      }
    );
    const unsubscribeBookingConfiguration = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        const formatTime = (time: string) =>
          time?.toString()?.length === 3 ? `0${time}` : `${time}`;
        setIsOpenMonday(doc.data()?.isOpenMondayAutomation || false);
        setIsOpenTuesday(doc.data()?.isOpenTuesdayAutomation || false);
        setIsOpenWednesday(doc.data()?.isOpenWednesdayAutomation || false);
        setIsOpenThursday(doc.data()?.isOpenThursdayAutomation || false);
        setIsOpenFriday(doc.data()?.isOpenFridayAutomation || false);
        setIsOpenSaturday(doc.data()?.isOpenSaturdayAutomation || false);
        setIsOpenSunday(doc.data()?.isOpenSundayAutomation || false);
        setClinicAutomationStatus(doc.data()?.clinicAutomationStatus || false);
        setHousecallAutomationStatus(
          doc.data()?.housecallAutomationStatus || false
        );
        setBoutiqueAutomationStatus(
          doc.data()?.boutiqueAutomationStatus || false
        );
        setWalkinsAutomationStatus(
          doc.data()?.walkinsAutomationStatus || false
        );
        setSelectedStartTimeMonday(
          formatTime(doc.data()?.automatedOpenTimeMonday)
        );
        setSelectedEndTimeMonday(
          formatTime(doc.data()?.automatedCloseTimeMonday)
        );
        setSelectedStartTimeTuesday(
          formatTime(doc.data()?.automatedOpenTimeTuesday)
        );
        setSelectedEndTimeTuesday(
          formatTime(doc.data()?.automatedCloseTimeTuesday)
        );
        setSelectedStartTimeWednesday(
          formatTime(doc.data()?.automatedOpenTimeWednesday)
        );
        setSelectedEndTimeWednesday(
          formatTime(doc.data()?.automatedCloseTimeWednesday)
        );
        setSelectedStartTimeThursday(
          formatTime(doc.data()?.automatedOpenTimeThursday)
        );
        setSelectedEndTimeThursday(
          formatTime(doc.data()?.automatedCloseTimeThursday)
        );
        setSelectedStartTimeFriday(
          formatTime(doc.data()?.automatedOpenTimeFriday)
        );
        setSelectedEndTimeFriday(
          formatTime(doc.data()?.automatedCloseTimeFriday)
        );
        setSelectedStartTimeSaturday(
          formatTime(doc.data()?.automatedOpenTimeSaturday)
        );
        setSelectedEndTimeSaturday(
          formatTime(doc.data()?.automatedCloseTimeSaturday)
        );
        setSelectedStartTimeSunday(
          formatTime(doc.data()?.automatedOpenTimeSunday)
        );
        setSelectedEndTimeSunday(
          formatTime(doc.data()?.automatedCloseTimeSunday)
        );
        setIsLoading(false);
      },
      (error: any) => {
        setError(error?.message || error);
        setIsLoading(false);
      }
    );
    return () => {
      unsubscribeBookingConfiguration();
      unsubscribeHoursStatusConfiguration();
      unsubscribeHoursConfiguration();
      unsubscribeWinterModeConfiguration();
    };
  }, []);

  const saveHoursOverrideChanges = async () =>
    await setDoc(
      doc(firestore, "configuration/hours_status"),
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
        toast(`Website Hours Override will Appear in ~ 5 Minutes!`, {
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
        toast(`Website Hours Override Update FAILED: ${error?.message}`, {
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
        setDidTouchClinicStatus(false);
        setDidTouchHousecallStatus(false);
        setDidTouchBoutiqueStatus(false);
        setDidTouchWalkInsStatus(false);
      });
  const saveBookingConfigChanges = async () =>
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        boutiqueStatus,
        clinicStatus,
        housecallStatus,
        walkinsStatus,
        clinicAutomationStatus,
        housecallAutomationStatus,
        boutiqueAutomationStatus,
        walkinsAutomationStatus,
        automatedOpenTimeSunday: Number(selectedStartTimeSunday),
        automatedCloseTimeSunday: Number(selectedEndTimeSunday),
        automatedOpenTimeMonday: Number(selectedStartTimeMonday),
        automatedCloseTimeMonday: Number(selectedEndTimeMonday),
        automatedOpenTimeTuesday: Number(selectedStartTimeTuesday),
        automatedCloseTimeTuesday: Number(selectedEndTimeTuesday),
        automatedOpenTimeWednesday: Number(selectedStartTimeWednesday),
        automatedCloseTimeWednesday: Number(selectedEndTimeWednesday),
        automatedOpenTimeThursday: Number(selectedStartTimeThursday),
        automatedCloseTimeThursday: Number(selectedEndTimeThursday),
        automatedOpenTimeFriday: Number(selectedStartTimeFriday),
        automatedCloseTimeFriday: Number(selectedEndTimeFriday),
        automatedOpenTimeSaturday: Number(selectedStartTimeSaturday),
        automatedCloseTimeSaturday: Number(selectedEndTimeSaturday),
        isOpenMondayAutomation,
        isOpenTuesdayAutomation,
        isOpenWednesdayAutomation,
        isOpenThursdayAutomation,
        isOpenFridayAutomation,
        isOpenSaturdayAutomation,
        isOpenSundayAutomation,
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`Website Hours Status Updated will Appear in ~ 5 Minutes!`, {
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
        setDidTouchBoutiqueAutomationStatus(false);
        setDidTouchClinicAutomationStatus(false);
        setDidTouchHousecallAutomationStatus(false);
        setDidTouchWalkInsAutomationStatus(false);
        setDidTouchIsOpenMonday(false);
        setDidTouchIsOpenTuesday(false);
        setDidTouchIsOpenWednesday(false);
        setDidTouchIsOpenThursday(false);
        setDidTouchIsOpenFriday(false);
        setDidTouchIsOpenSaturday(false);
        setDidTouchIsOpenSunday(false);
        setDidTouchStartTimeMonday(false);
        setDidTouchEndTimeMonday(false);
        setDidTouchStartTimeTuesday(false);
        setDidTouchEndTimeTuesday(false);
        setDidTouchStartTimeWednesday(false);
        setDidTouchEndTimeWednesday(false);
        setDidTouchStartTimeThursday(false);
        setDidTouchEndTimeThursday(false);
        setDidTouchStartTimeFriday(false);
        setDidTouchEndTimeFriday(false);
        setDidTouchStartTimeSaturday(false);
        setDidTouchEndTimeSaturday(false);
        setDidTouchStartTimeSunday(false);
        setDidTouchEndTimeSunday(false);
      });

  return (
    <div className="py-4 flex-col sm:flex-row items-center justify-center">
      <h3 className="text-center -mb-4">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="mr-2 text-movet-green"
        />
        Website Hours Page Preview
      </h3>
      <Hours
        winterMode={winterMode}
        hours={hours}
        hoursStatus={{
          boutiqueStatus,
          clinicStatus,
          housecallStatus,
          walkinsStatus,
        }}
        previewMode
      />
      <h3>HOURS STATUS OVERRIDES & AUTOMATION</h3>
      <p className="text-sm">
        Use these settings to override the automated OPEN/CLOSE status on the{" "}
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
      {isLoading || isLoadingStatus ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        <>
          <h3 className="text-center">
            <FontAwesomeIcon
              icon={faPowerOff}
              className="mr-2 text-movet-green"
            />
            OPEN / CLOSED Hours Overrides
          </h3>
          <div className="flex flex-row justify-center items-center mb-8">
            <div className="flex flex-col w-full mx-auto justify-center items-center">
              <FontAwesomeIcon
                icon={faHospital}
                size="3x"
                className={`w-full mt-4${
                  clinicStatus ? ` text-movet-green` : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Clinic Status:{" "}
                  <span
                    className={`italic${
                      clinicStatus ? " text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {clinicStatus ? "OPEN" : "CLOSED"}
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
                className={`w-full mt-8${
                  boutiqueStatus ? " text-movet-green" : " text-movet-red"
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Boutique Status:{" "}
                  <span
                    className={`italic${
                      boutiqueStatus ? " text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {boutiqueStatus ? "OPEN" : "CLOSED"}
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
                className={`w-full mt-4${
                  walkinsStatus ? ` text-movet-green` : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Walk-Ins Status:{" "}
                  <span
                    className={`italic${
                      walkinsStatus ? " text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {walkinsStatus ? "OPEN" : "CLOSED"}
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
                className={`w-full mt-8${
                  housecallStatus ? ` text-movet-green` : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Housecalls Status:{" "}
                  <span
                    className={`italic${
                      housecallStatus ? " text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {housecallStatus ? "OPEN" : "CLOSED"}
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
          <Transition
            show={
              didTouchClinicStatus ||
              didTouchBoutiqueStatus ||
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
              onClick={() => saveHoursOverrideChanges()}
              className="mt-8"
            />
          </Transition>
          <Divider />
          <h3 className="text-center mt-8">
            <FontAwesomeIcon icon={faRobot} className="mr-2 text-movet-green" />
            Automated OPEN / CLOSED Times
          </h3>
          <p className="text-center text-xs italic mb-4">
            *Be sure to update the &quot;HOURS OF OPERATION DISPLAY&quot;
            section below if you change any of these fields!
          </p>
          <div className="flex flex-row justify-center items-center mb-8">
            <div className="flex flex-col w-full mx-auto justify-center items-center">
              <FontAwesomeIcon
                icon={faHospital}
                size="3x"
                className={`w-full mt-4 ${
                  clinicAutomationStatus
                    ? ` text-movet-green`
                    : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Clinic Automation:{" "}
                  <span
                    className={`italic${
                      clinicAutomationStatus
                        ? " text-movet-green"
                        : " text-movet-red"
                    }`}
                  >
                    {clinicAutomationStatus ? "ON" : "OFF"}
                  </span>
                </span>
              </label>
              <Switch
                checked={clinicAutomationStatus}
                onChange={() => {
                  setClinicAutomationStatus(!clinicAutomationStatus);
                  setDidTouchClinicAutomationStatus(true);
                }}
                className={classNames(
                  clinicAutomationStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    clinicAutomationStatus ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
              <FontAwesomeIcon
                icon={faShop}
                size="3x"
                className={`w-full mt-8${
                  boutiqueAutomationStatus
                    ? " text-movet-green"
                    : " text-movet-red"
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Boutique Automation:{" "}
                  <span
                    className={`italic${
                      boutiqueAutomationStatus
                        ? " text-movet-green"
                        : " text-movet-red"
                    }`}
                  >
                    {boutiqueAutomationStatus ? "ON" : "OFF"}
                  </span>
                </span>
              </label>
              <Switch
                checked={boutiqueAutomationStatus}
                onChange={() => {
                  setBoutiqueAutomationStatus(!boutiqueAutomationStatus);
                  setDidTouchBoutiqueAutomationStatus(true);
                }}
                className={classNames(
                  boutiqueAutomationStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    boutiqueAutomationStatus
                      ? "translate-x-5"
                      : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </div>
            <div className="flex flex-col w-full mx-auto justify-center items-center">
              <FontAwesomeIcon
                icon={faPersonWalking}
                size="3x"
                className={`w-full mt-4 ${
                  walkinsAutomationStatus
                    ? ` text-movet-green`
                    : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Walk-Ins Automation:{" "}
                  <span
                    className={`italic${
                      walkinsAutomationStatus
                        ? " text-movet-green"
                        : " text-movet-red"
                    }`}
                  >
                    {walkinsAutomationStatus ? "ON" : "OFF"}
                  </span>
                </span>
              </label>
              <Switch
                checked={walkinsAutomationStatus}
                onChange={() => {
                  setWalkinsAutomationStatus(!walkinsAutomationStatus);
                  setDidTouchWalkInsAutomationStatus(true);
                }}
                className={classNames(
                  walkinsAutomationStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    walkinsAutomationStatus ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
              <FontAwesomeIcon
                icon={faHouseMedical}
                size="3x"
                className={`w-full mt-8${
                  housecallAutomationStatus
                    ? ` text-movet-green`
                    : ` text-movet-red`
                }`}
              />
              <label className="italic mt-2 mb-2 text-sm flex flex-row justify-center items-center pt-6">
                <span className="ml-2">
                  Housecalls Automation:{" "}
                  <span
                    className={`italic${
                      housecallAutomationStatus
                        ? " text-movet-green"
                        : " text-movet-red"
                    }`}
                  >
                    {housecallAutomationStatus ? "ON" : "OFF"}
                  </span>
                </span>
              </label>
              <Switch
                checked={housecallAutomationStatus}
                onChange={() => {
                  setHousecallAutomationStatus(!housecallAutomationStatus);
                  setDidTouchHousecallAutomationStatus(true);
                }}
                className={classNames(
                  housecallAutomationStatus ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    housecallAutomationStatus
                      ? "translate-x-5"
                      : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex justify-center items-center mb-4">
              <div className="flex flex-col justify-center items-center mx-4">
                <p className="text-center my-2">MONDAY</p>
                <Switch
                  checked={isOpenMondayAutomation}
                  onChange={() => {
                    setIsOpenMonday(!isOpenMondayAutomation);
                    setDidTouchIsOpenMonday(true);
                  }}
                  className={classNames(
                    isOpenMondayAutomation ? "bg-movet-green" : "bg-movet-red",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenMondayAutomation
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
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
                    value={selectedStartTimeMonday}
                    onBlur={() => setDidTouchStartTimeMonday(true)}
                    onValueChange={(target: any) =>
                      setSelectedStartTimeMonday(target.value)
                    }
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
                    value={selectedEndTimeMonday}
                    onBlur={() => setDidTouchEndTimeMonday(true)}
                    onValueChange={(target: any) =>
                      setSelectedEndTimeMonday(target.value)
                    }
                    className={
                      "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                    }
                  />
                  <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-4">
              <div className="flex flex-col justify-center items-center mx-4">
                <p className="text-center my-2">TUESDAY</p>
                <Switch
                  checked={isOpenTuesdayAutomation}
                  onChange={() => {
                    setIsOpenTuesday(!isOpenTuesdayAutomation);
                    setDidTouchIsOpenTuesday(true);
                  }}
                  className={classNames(
                    isOpenTuesdayAutomation ? "bg-movet-green" : "bg-movet-red",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenTuesdayAutomation
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
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
                    value={selectedStartTimeTuesday}
                    onBlur={() => setDidTouchStartTimeTuesday(true)}
                    onValueChange={(target: any) =>
                      setSelectedStartTimeTuesday(target.value)
                    }
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
                    value={selectedEndTimeTuesday}
                    onBlur={() => setDidTouchEndTimeTuesday(true)}
                    onValueChange={(target: any) =>
                      setSelectedEndTimeTuesday(target.value)
                    }
                    className={
                      "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                    }
                  />
                  <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-4">
              <div className="flex flex-col justify-center items-center mx-4">
                <p className="text-center my-2">WEDNESDAY</p>
                <Switch
                  checked={isOpenWednesdayAutomation}
                  onChange={() => {
                    setIsOpenWednesday(!isOpenWednesdayAutomation);
                    setDidTouchIsOpenWednesday(true);
                  }}
                  className={classNames(
                    isOpenWednesdayAutomation
                      ? "bg-movet-green"
                      : "bg-movet-red",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenWednesdayAutomation
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
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
                    value={selectedStartTimeWednesday}
                    onBlur={() => setDidTouchStartTimeWednesday(true)}
                    onValueChange={(target: any) =>
                      setSelectedStartTimeWednesday(target.value)
                    }
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
                    value={selectedEndTimeWednesday}
                    onBlur={() => setDidTouchEndTimeWednesday(true)}
                    onValueChange={(target: any) =>
                      setSelectedEndTimeWednesday(target.value)
                    }
                    className={
                      "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                    }
                  />
                  <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-4">
              <div className="flex flex-col justify-center items-center mx-4">
                <p className="text-center my-2">THURSDAY</p>
                <Switch
                  checked={isOpenThursdayAutomation}
                  onChange={() => {
                    setIsOpenThursday(!isOpenThursdayAutomation);
                    setDidTouchIsOpenThursday(true);
                  }}
                  className={classNames(
                    isOpenThursdayAutomation
                      ? "bg-movet-green"
                      : "bg-movet-red",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenThursdayAutomation
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
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
                    value={selectedStartTimeThursday}
                    onBlur={() => setDidTouchStartTimeThursday(true)}
                    onValueChange={(target: any) =>
                      setSelectedStartTimeThursday(target.value)
                    }
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
                    value={selectedEndTimeThursday}
                    onBlur={() => setDidTouchEndTimeThursday(true)}
                    onValueChange={(target: any) =>
                      setSelectedEndTimeThursday(target.value)
                    }
                    className={
                      "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                    }
                  />
                  <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-4">
              <div className="flex flex-col justify-center items-center mx-4">
                <p className="text-center my-2">FRIDAY</p>
                <Switch
                  checked={isOpenFridayAutomation}
                  onChange={() => {
                    setIsOpenFriday(!isOpenFridayAutomation);
                    setDidTouchIsOpenFriday(true);
                  }}
                  className={classNames(
                    isOpenFridayAutomation ? "bg-movet-green" : "bg-movet-red",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenFridayAutomation
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
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
                    value={selectedStartTimeFriday}
                    onBlur={() => setDidTouchStartTimeFriday(true)}
                    onValueChange={(target: any) =>
                      setSelectedStartTimeFriday(target.value)
                    }
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
                    value={selectedEndTimeFriday}
                    onBlur={() => setDidTouchEndTimeFriday(true)}
                    onValueChange={(target: any) =>
                      setSelectedEndTimeFriday(target.value)
                    }
                    className={
                      "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                    }
                  />
                  <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-4">
              <div className="flex flex-col justify-center items-center mx-4">
                <p className="text-center my-2">SATURDAY</p>
                <Switch
                  checked={isOpenSaturdayAutomation}
                  onChange={() => {
                    setIsOpenSaturday(!isOpenSaturdayAutomation);
                    setDidTouchIsOpenSaturday(true);
                  }}
                  className={classNames(
                    isOpenSaturdayAutomation
                      ? "bg-movet-green"
                      : "bg-movet-red",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenSaturdayAutomation
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
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
                    value={selectedStartTimeSaturday}
                    onBlur={() => setDidTouchStartTimeSaturday(true)}
                    onValueChange={(target: any) =>
                      setSelectedStartTimeSaturday(target.value)
                    }
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
                    value={selectedEndTimeSaturday}
                    onBlur={() => setDidTouchEndTimeSaturday(true)}
                    onValueChange={(target: any) =>
                      setSelectedEndTimeSaturday(target.value)
                    }
                    className={
                      "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                    }
                  />
                  <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-4">
              <div className="flex flex-col justify-center items-center mx-4">
                <p className="text-center my-2">SUNDAY</p>
                <Switch
                  checked={isOpenSundayAutomation}
                  onChange={() => {
                    setIsOpenSunday(!isOpenSundayAutomation);
                    setDidTouchIsOpenSunday(true);
                  }}
                  className={classNames(
                    isOpenSundayAutomation ? "bg-movet-green" : "bg-movet-red",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenSundayAutomation
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  />
                </Switch>
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
                    value={selectedStartTimeSunday}
                    onBlur={() => setDidTouchStartTimeSunday(true)}
                    onValueChange={(target: any) =>
                      setSelectedStartTimeSunday(target.value)
                    }
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
                    value={selectedEndTimeSunday}
                    onBlur={() => setDidTouchEndTimeSunday(true)}
                    onValueChange={(target: any) =>
                      setSelectedEndTimeSunday(target.value)
                    }
                    className={
                      "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-20"
                    }
                  />
                  <p className="text-center mt-2 italic text-xs">(24 Hour)</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Transition
        show={
          didTouchBoutiqueAutomationStatus ||
          didTouchClinicAutomationStatus ||
          didTouchWalkInsAutomationStatus ||
          didTouchHousecallAutomationStatus ||
          didTouchIsOpenMonday ||
          didTouchIsOpenTuesday ||
          didTouchIsOpenWednesday ||
          didTouchIsOpenThursday ||
          didTouchIsOpenFriday ||
          didTouchIsOpenSaturday ||
          didTouchIsOpenSunday ||
          didTouchStartTimeMonday ||
          didTouchStartTimeTuesday ||
          didTouchStartTimeWednesday ||
          didTouchStartTimeThursday ||
          didTouchStartTimeFriday ||
          didTouchStartTimeSaturday ||
          didTouchStartTimeSunday ||
          didTouchEndTimeMonday ||
          didTouchEndTimeTuesday ||
          didTouchEndTimeWednesday ||
          didTouchEndTimeThursday ||
          didTouchEndTimeFriday ||
          didTouchEndTimeSaturday ||
          didTouchEndTimeSunday
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
          onClick={() => saveBookingConfigChanges()}
          className="mt-8"
        />
      </Transition>
    </div>
  );
};
