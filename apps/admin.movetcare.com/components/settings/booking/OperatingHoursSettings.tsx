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
import Error from "../../Error";
import { classNames } from "utilities";
import { PatternFormat } from "react-number-format";
import Link from "next/link";

const OperatingHoursSettings = ({
  schedule,
}: {
  schedule: "clinic" | "housecall" | "virtual";
}) => {
  const [isOpenMonday, setIsOpenMonday] = useState<boolean>(false);
  const [didTouchIsOpenMonday, setDidTouchIsOpenMonday] =
    useState<boolean>(false);
  const [isOpenTuesday, setIsOpenTuesday] = useState<boolean>(false);
  const [didTouchIsOpenTuesday, setDidTouchIsOpenTuesday] =
    useState<boolean>(false);
  const [isOpenWednesday, setIsOpenWednesday] = useState<boolean>(false);
  const [didTouchIsOpenWednesday, setDidTouchIsOpenWednesday] =
    useState<boolean>(false);
  const [isOpenThursday, setIsOpenThursday] = useState<boolean>(false);
  const [didTouchIsOpenThursday, setDidTouchIsOpenThursday] =
    useState<boolean>(false);
  const [isOpenFriday, setIsOpenFriday] = useState<boolean>(false);
  const [didTouchIsOpenFriday, setDidTouchIsOpenFriday] =
    useState<boolean>(false);
  const [isOpenSaturday, setIsOpenSaturday] = useState<boolean>(false);
  const [didTouchIsOpenSaturday, setDidTouchIsOpenSaturday] =
    useState<boolean>(false);
  const [isOpenSunday, setIsOpenSunday] = useState<boolean>(false);
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
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        const formatTime = (time: string) =>
          time?.toString()?.length === 3 ? `0${time}` : `${time}`;
        setIsOpenMonday(
          schedule === "clinic"
            ? doc.data()?.clinicOpenMonday
            : schedule === "housecall"
            ? doc.data()?.housecallOpenMonday
            : doc.data()?.virtualOpenMonday
        );
        setIsOpenTuesday(
          schedule === "clinic"
            ? doc.data()?.clinicOpenTuesday
            : schedule === "housecall"
            ? doc.data()?.housecallOpenTuesday
            : doc.data()?.virtualOpenTuesday
        );
        setIsOpenWednesday(
          schedule === "clinic"
            ? doc.data()?.clinicOpenWednesday
            : schedule === "housecall"
            ? doc.data()?.housecallOpenWednesday
            : doc.data()?.virtualOpenWednesday
        );
        setIsOpenThursday(
          schedule === "clinic"
            ? doc.data()?.clinicOpenThursday
            : schedule === "housecall"
            ? doc.data()?.housecallOpenThursday
            : doc.data()?.virtualOpenThursday
        );
        setIsOpenFriday(
          schedule === "clinic"
            ? doc.data()?.clinicOpenFriday
            : schedule === "housecall"
            ? doc.data()?.housecallOpenFriday
            : doc.data()?.virtualOpenFriday
        );
        setIsOpenSaturday(
          schedule === "clinic"
            ? doc.data()?.clinicOpenSaturday
            : schedule === "housecall"
            ? doc.data()?.housecallOpenSaturday
            : doc.data()?.virtualOpenSaturday
        );
        setIsOpenSunday(
          schedule === "clinic"
            ? doc.data()?.clinicOpenSunday
            : schedule === "housecall"
            ? doc.data()?.housecallOpenSunday
            : doc.data()?.virtualOpenSunday
        );
        setSelectedStartTimeSunday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicOpenSundayTime
              : schedule === "housecall"
              ? doc.data()?.housecallOpenSundayTime
              : doc.data()?.virtualOpenSundayTime
          )
        );
        setSelectedEndTimeSunday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicClosedSundayTime
              : schedule === "housecall"
              ? doc.data()?.housecallClosedSundayTime
              : doc.data()?.virtualClosedSundayTime
          )
        );
        setSelectedStartTimeMonday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicOpenMondayTime
              : schedule === "housecall"
              ? doc.data()?.housecallOpenMondayTime
              : doc.data()?.virtualOpenMondayTime
          )
        );
        setSelectedEndTimeMonday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicClosedMondayTime
              : schedule === "housecall"
              ? doc.data()?.housecallClosedMondayTime
              : doc.data()?.virtualClosedMondayTime
          )
        );
        setSelectedStartTimeTuesday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicOpenTuesdayTime
              : schedule === "housecall"
              ? doc.data()?.housecallOpenTuesdayTime
              : doc.data()?.virtualOpenTuesdayTime
          )
        );
        setSelectedEndTimeTuesday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicClosedTuesdayTime
              : schedule === "housecall"
              ? doc.data()?.housecallClosedTuesdayTime
              : doc.data()?.virtualClosedTuesdayTime
          )
        );
        setSelectedStartTimeWednesday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicOpenWednesdayTime
              : schedule === "housecall"
              ? doc.data()?.housecallOpenWednesdayTime
              : doc.data()?.virtualOpenWednesdayTime
          )
        );
        setSelectedEndTimeWednesday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicClosedWednesdayTime
              : schedule === "housecall"
              ? doc.data()?.housecallClosedWednesdayTime
              : doc.data()?.virtualClosedWednesdayTime
          )
        );
        setSelectedStartTimeThursday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicOpenThursdayTime
              : schedule === "housecall"
              ? doc.data()?.housecallOpenThursdayTime
              : doc.data()?.virtualOpenThursdayTime
          )
        );
        setSelectedEndTimeThursday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicClosedThursdayTime
              : schedule === "housecall"
              ? doc.data()?.housecallClosedThursdayTime
              : doc.data()?.virtualClosedThursdayTime
          )
        );
        setSelectedStartTimeFriday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicOpenFridayTime
              : schedule === "housecall"
              ? doc.data()?.housecallOpenFridayTime
              : doc.data()?.virtualOpenFridayTime
          )
        );
        setSelectedEndTimeFriday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicClosedFridayTime
              : schedule === "housecall"
              ? doc.data()?.housecallClosedFridayTime
              : doc.data()?.virtualClosedFridayTime
          )
        );
        setSelectedStartTimeSaturday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicOpenSaturdayTime
              : schedule === "housecall"
              ? doc.data()?.housecallOpenSaturdayTime
              : doc.data()?.virtualOpenSaturdayTime
          )
        );
        setSelectedEndTimeSaturday(
          formatTime(
            schedule === "clinic"
              ? doc.data()?.clinicClosedSaturdayTime
              : schedule === "housecall"
              ? doc.data()?.housecallClosedSaturdayTime
              : doc.data()?.virtualClosedSaturdayTime
          )
        );
      },
      (error: any) => {
        setError(error?.message || error);
      }
    );
    return () => unsubscribe();
  }, []);

  const saveChanges = async () =>
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        clinicOpenMonday: isOpenMonday,
        clinicOpenMondayTime: Number(selectedStartTimeMonday),
        clinicClosedMondayTime: Number(selectedEndTimeMonday),
        clinicOpenTuesday: isOpenTuesday,
        clinicOpenTuesdayTime: Number(selectedStartTimeTuesday),
        clinicClosedTuesdayTime: Number(selectedEndTimeTuesday),
        clinicOpenWednesday: isOpenWednesday,
        clinicOpenWednesdayTime: Number(selectedStartTimeWednesday),
        clinicClosedWednesdayTime: Number(selectedEndTimeWednesday),
        clinicOpenThursday: isOpenThursday,
        clinicOpenThursdayTime: Number(selectedStartTimeThursday),
        clinicClosedThursdayTime: Number(selectedEndTimeThursday),
        clinicOpenFriday: isOpenFriday,
        clinicOpenFridayTime: Number(selectedStartTimeFriday),
        clinicClosedFridayTime: Number(selectedEndTimeFriday),
        clinicOpenSaturday: isOpenSaturday,
        clinicOpenSaturdayTime: Number(selectedStartTimeSaturday),
        clinicClosedSaturdayTime: Number(selectedEndTimeSaturday),
        clinicOpenSunday: isOpenSunday,
        clinicOpenSundayTime: Number(selectedStartTimeSunday),
        clinicClosedSundayTime: Number(selectedEndTimeSunday),
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`${schedule?.toUpperCase()} Days & Hours of Operation Updated!`, {
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
        toast(
          `${schedule?.toUpperCase()} Days & Hours of Operation Updated FAILED: ${
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
      )
      .finally(() => {
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

  return error ? (
    <Error error={error} />
  ) : (
    <li className="py-4 flex-col sm:flex-row items-center justify-center">
      <div className="flex flex-col mr-4">
        <h3>Standard Operating Days & Times</h3>
        <p className="text-sm">
          This controls availability of appointments during each day of the
          week.{" "}
          <span className="italic font-extrabold">
            Don&apos;t forget to update the{" "}
            <Link
              href="/settings/booking/manage-hours/"
              className="text-movet-red hover:underline"
            >
              hours listing on the website
            </Link>{" "}
            whenever you make changes below!
          </span>
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-center items-center my-4">
          <div className="flex flex-col justify-center items-center mx-4">
            <p className="text-center my-2">MONDAY</p>
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
              checked={isOpenTuesday}
              onChange={() => {
                setIsOpenTuesday(!isOpenTuesday);
                setDidTouchIsOpenTuesday(true);
              }}
              className={classNames(
                isOpenTuesday ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isOpenTuesday ? "translate-x-5" : "translate-x-0",
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
              checked={isOpenWednesday}
              onChange={() => {
                setIsOpenWednesday(!isOpenWednesday);
                setDidTouchIsOpenWednesday(true);
              }}
              className={classNames(
                isOpenWednesday ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isOpenWednesday ? "translate-x-5" : "translate-x-0",
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
              checked={isOpenThursday}
              onChange={() => {
                setIsOpenThursday(!isOpenThursday);
                setDidTouchIsOpenThursday(true);
              }}
              className={classNames(
                isOpenThursday ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isOpenThursday ? "translate-x-5" : "translate-x-0",
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
              checked={isOpenFriday}
              onChange={() => {
                setIsOpenFriday(!isOpenFriday);
                setDidTouchIsOpenFriday(true);
              }}
              className={classNames(
                isOpenFriday ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isOpenFriday ? "translate-x-5" : "translate-x-0",
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
              checked={isOpenSaturday}
              onChange={() => {
                setIsOpenSaturday(!isOpenSaturday);
                setDidTouchIsOpenSaturday(true);
              }}
              className={classNames(
                isOpenSaturday ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isOpenSaturday ? "translate-x-5" : "translate-x-0",
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
              checked={isOpenSunday}
              onChange={() => {
                setIsOpenSunday(!isOpenSunday);
                setDidTouchIsOpenSunday(true);
              }}
              className={classNames(
                isOpenSunday ? "bg-movet-green" : "bg-movet-red",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isOpenSunday ? "translate-x-5" : "translate-x-0",
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
      <Transition
        show={
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
          onClick={() => saveChanges()}
          className="mb-8"
        />
      </Transition>
    </li>
  );
};

export default OperatingHoursSettings;
