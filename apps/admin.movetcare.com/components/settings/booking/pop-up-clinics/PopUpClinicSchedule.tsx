import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "services/firebase";
import toast from "react-hot-toast";
import { Fragment, useState } from "react";
import { Button, ErrorMessage } from "ui";
import { Listbox, Transition } from "@headlessui/react";
import Error from "../../../Error";
import { classNames } from "utilities";
import { PatternFormat } from "react-number-format";
import { Controller, useForm } from "react-hook-form";
import DateInput from "components/inputs/DateInput";
import type { ClinicConfig } from "types";

const scheduleTypes = [
  { id: "ONCE", name: "Once" },
  { id: "WEEKLY", name: "Weekly" },
  { id: "MONTHLY", name: "Monthly" },
  { id: "YEARLY", name: "Yearly" },
];
const formatTime = (time: string) =>
  time?.toString()?.length === 3 ? `0${time}` : `${time}`;

const PopUpClinicSchedule = ({
  configuration,
  popUpClinics,
}: {
  configuration: ClinicConfig;
  popUpClinics: any;
}) => {
  const [selectedScheduleType, setSelectedScheduleType] = useState<
    string | null
  >(configuration?.scheduleType || null);
  // const [isOpenMonday, setIsOpenMonday] = useState<boolean>(false);
  // const [didTouchIsOpenMonday, setDidTouchIsOpenMonday] =
  //   useState<boolean>(false);
  // const [isOpenTuesday, setIsOpenTuesday] = useState<boolean>(false);
  // const [didTouchIsOpenTuesday, setDidTouchIsOpenTuesday] =
  //   useState<boolean>(false);
  // const [isOpenWednesday, setIsOpenWednesday] = useState<boolean>(false);
  // const [didTouchIsOpenWednesday, setDidTouchIsOpenWednesday] =
  //   useState<boolean>(false);
  // const [isOpenThursday, setIsOpenThursday] = useState<boolean>(false);
  // const [didTouchIsOpenThursday, setDidTouchIsOpenThursday] =
  //   useState<boolean>(false);
  // const [isOpenFriday, setIsOpenFriday] = useState<boolean>(false);
  // const [didTouchIsOpenFriday, setDidTouchIsOpenFriday] =
  //   useState<boolean>(false);
  // const [isOpenSaturday, setIsOpenSaturday] = useState<boolean>(false);
  // const [didTouchIsOpenSaturday, setDidTouchIsOpenSaturday] =
  //   useState<boolean>(false);
  // const [isOpenSunday, setIsOpenSunday] = useState<boolean>(false);
  // const [didTouchIsOpenSunday, setDidTouchIsOpenSunday] =
  //   useState<boolean>(false);
  // const [selectedStartTimeTuesday, setSelectedStartTimeTuesday] = useState<
  //   string | null
  // >(null);
  // const [didTouchStartTimeTuesday, setDidTouchStartTimeTuesday] =
  //   useState<boolean>(false);
  // const [selectedEndTimeTuesday, setSelectedEndTimeTuesday] = useState<
  //   string | null
  // >(null);
  // const [didTouchEndTimeTuesday, setDidTouchEndTimeTuesday] =
  //   useState<boolean>(false);
  // const [selectedStartTimeWednesday, setSelectedStartTimeWednesday] = useState<
  //   string | null
  // >(null);
  // const [didTouchStartTimeWednesday, setDidTouchStartTimeWednesday] =
  //   useState<boolean>(false);
  // const [selectedEndTimeWednesday, setSelectedEndTimeWednesday] = useState<
  //   string | null
  // >(null);
  // const [didTouchEndTimeWednesday, setDidTouchEndTimeWednesday] =
  //   useState<boolean>(false);
  // const [selectedStartTimeThursday, setSelectedStartTimeThursday] = useState<
  //   string | null
  // >(null);
  // const [didTouchStartTimeThursday, setDidTouchStartTimeThursday] =
  //   useState<boolean>(false);
  // const [selectedEndTimeThursday, setSelectedEndTimeThursday] = useState<
  //   string | null
  // >(null);
  // const [didTouchEndTimeThursday, setDidTouchEndTimeThursday] =
  //   useState<boolean>(false);
  // const [selectedStartTimeFriday, setSelectedStartTimeFriday] = useState<
  //   string | null
  // >(null);
  // const [didTouchStartTimeFriday, setDidTouchStartTimeFriday] =
  //   useState<boolean>(false);
  // const [selectedEndTimeFriday, setSelectedEndTimeFriday] = useState<
  //   string | null
  // >(null);
  // const [didTouchEndTimeFriday, setDidTouchEndTimeFriday] =
  //   useState<boolean>(false);
  // const [selectedStartTimeSaturday, setSelectedStartTimeSaturday] = useState<
  //   string | null
  // >(null);
  // const [didTouchStartTimeSaturday, setDidTouchStartTimeSaturday] =
  //   useState<boolean>(false);
  // const [selectedEndTimeSaturday, setSelectedEndTimeSaturday] = useState<
  //   string | null
  // >(null);
  // const [didTouchEndTimeSaturday, setDidTouchEndTimeSaturday] =
  //   useState<boolean>(false);
  // const [selectedStartTimeSunday, setSelectedStartTimeSunday] = useState<
  //   string | null
  // >(null);
  // const [didTouchStartTimeSunday, setDidTouchStartTimeSunday] =
  //   useState<boolean>(false);
  // const [selectedEndTimeSunday, setSelectedEndTimeSunday] = useState<
  //   string | null
  // >(null);
  // const [didTouchEndTimeSunday, setDidTouchEndTimeSunday] =
  //   useState<boolean>(false);
  // const [selectedStartTimeMonday, setSelectedStartTimeMonday] = useState<
  //   string | null
  // >(null);
  // const [didTouchStartTimeMonday, setDidTouchStartTimeMonday] =
  //   useState<boolean>(false);
  // const [selectedEndTimeMonday, setSelectedEndTimeMonday] = useState<
  //   string | null
  // >(null);
  // const [didTouchEndTimeMonday, setDidTouchEndTimeMonday] =
  //   useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      date: configuration?.schedule?.date?.toDate()?.toString() || "",
      startTime:
        formatTime(String(configuration?.schedule?.startTime || "")) || "",
      endTime: formatTime(String(configuration?.schedule?.endTime || "")) || "",
    },
  });

  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // useEffect(() => {
  //   if (configuration?.schedule) {
  //     setIsOpenMonday(configuration?.schedule?.openMonday);
  //     setIsOpenTuesday(configuration?.schedule?.openTuesday);
  //     setIsOpenWednesday(configuration?.schedule?.openWednesday);
  //     setIsOpenThursday(configuration?.schedule?.openThursday);
  //     setIsOpenFriday(configuration?.schedule?.openFriday);
  //     setIsOpenSaturday(configuration?.schedule?.openSaturday);
  //     setIsOpenSunday(configuration?.schedule?.openSunday);
  //     setSelectedEndTimeFriday(
  //       formatTime(String(configuration?.schedule?.closedFridayTime)),
  //     );
  //     setSelectedEndTimeMonday(
  //       formatTime(String(configuration?.schedule?.closedMondayTime)),
  //     );
  //     setSelectedEndTimeSaturday(
  //       formatTime(String(configuration?.schedule?.closedSaturdayTime)),
  //     );
  //     setSelectedEndTimeSunday(
  //       formatTime(String(configuration?.schedule?.closedSundayTime)),
  //     );
  //     setSelectedEndTimeThursday(
  //       formatTime(String(configuration?.schedule?.closedThursdayTime)),
  //     );
  //     setSelectedEndTimeTuesday(
  //       formatTime(String(configuration?.schedule?.closedTuesdayTime)),
  //     );
  //     setSelectedEndTimeWednesday(
  //       formatTime(String(configuration?.schedule?.closedWednesdayTime)),
  //     );
  //     setSelectedStartTimeFriday(
  //       formatTime(String(configuration?.schedule?.openFridayTime)),
  //     );
  //     setSelectedStartTimeMonday(
  //       formatTime(String(configuration?.schedule?.openMondayTime)),
  //     );
  //     setSelectedStartTimeSaturday(
  //       formatTime(String(configuration?.schedule?.openSaturdayTime)),
  //     );
  //     setSelectedStartTimeSunday(
  //       formatTime(String(configuration?.schedule?.openSundayTime)),
  //     );
  //     setSelectedStartTimeThursday(
  //       formatTime(String(configuration?.schedule?.openThursdayTime)),
  //     );
  //     setSelectedStartTimeTuesday(
  //       formatTime(String(configuration?.schedule?.openTuesdayTime)),
  //     );
  //     setSelectedStartTimeWednesday(
  //       formatTime(String(configuration?.schedule?.openWednesdayTime)),
  //     );
  //   }
  // }, [configuration?.schedule]);

  const onSubmit = async (data: any) => {
    const newPopUpClinics = popUpClinics.map((clinic: any) => {
      if (clinic.id === configuration?.id)
        return {
          ...clinic,
          scheduleType: selectedScheduleType,
          schedule: {
            date: new Date(data?.date),
            startTime: Number(data?.startTime),
            endTime: Number(data?.endTime),
          },
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
        toast(`"${configuration?.name}" Days & Hours of Operation Updated!`, {
          position: "top-center",
          icon: (
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="sm"
              className="text-movet-green"
            />
          ),
        }),
      )
      .catch((error: any) => {
        toast(
          `"${configuration?.name}" Days & Hours of Operation Updated FAILED: ${error?.message}`,
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
      .finally(() =>
        reset({
          date: data?.date,
          startTime: formatTime(data?.startTime),
          endTime: formatTime(data?.endTime),
        }),
      );
  };
  // const saveChanges = async () => {
  //   const newPopUpClinics = popUpClinics.map((clinic: any) => {
  //     if (clinic.id === configuration?.id)
  //       return {
  //         ...clinic,
  //         scheduleType: selectedScheduleType,
  //         schedule: {
  //           openMonday: isOpenMonday,
  //           openMondayTime: Number(selectedStartTimeMonday),
  //           closedMondayTime: Number(selectedEndTimeMonday),
  //           openTuesday: isOpenTuesday,
  //           openTuesdayTime: Number(selectedStartTimeTuesday),
  //           closedTuesdayTime: Number(selectedEndTimeTuesday),
  //           openWednesday: isOpenWednesday,
  //           openWednesdayTime: Number(selectedStartTimeWednesday),
  //           closedWednesdayTime: Number(selectedEndTimeWednesday),
  //           openThursday: isOpenThursday,
  //           openThursdayTime: Number(selectedStartTimeThursday),
  //           closedThursdayTime: Number(selectedEndTimeThursday),
  //           openFriday: isOpenFriday,
  //           openFridayTime: Number(selectedStartTimeFriday),
  //           closedFridayTime: Number(selectedEndTimeFriday),
  //           openSaturday: isOpenSaturday,
  //           openSaturdayTime: Number(selectedStartTimeSaturday),
  //           closedSaturdayTime: Number(selectedEndTimeSaturday),
  //           openSunday: isOpenSunday,
  //           openSundayTime: Number(selectedStartTimeSunday),
  //           closedSundayTime: Number(selectedEndTimeSunday),
  //         },
  //       };
  //     else return clinic;
  //   });
  //   await setDoc(
  //     doc(firestore, "configuration/pop_up_clinics"),
  //     {
  //       popUpClinics: newPopUpClinics,
  //       updatedOn: serverTimestamp(),
  //     },
  //     { merge: true },
  //   )
  //     .then(() =>
  //       toast(`"${configuration?.name}" Days & Hours of Operation Updated!`, {
  //         position: "top-center",
  //         icon: (
  //           <FontAwesomeIcon
  //             icon={faCheckCircle}
  //             size="sm"
  //             className="text-movet-green"
  //           />
  //         ),
  //       }),
  //     )
  //     .catch((error: any) => {
  //       toast(
  //         `"${configuration?.name}" Days & Hours of Operation Updated FAILED: ${error?.message}`,
  //         {
  //           duration: 5000,
  //           icon: (
  //             <FontAwesomeIcon
  //               icon={faCircleExclamation}
  //               size="sm"
  //               className="text-movet-red"
  //             />
  //           ),
  //         },
  //       );
  //       setError(error);
  //     })
  //     .finally(() => {
  //       setDidTouchIsOpenMonday(false);
  //       setDidTouchIsOpenTuesday(false);
  //       setDidTouchIsOpenWednesday(false);
  //       setDidTouchIsOpenThursday(false);
  //       setDidTouchIsOpenFriday(false);
  //       setDidTouchIsOpenSaturday(false);
  //       setDidTouchIsOpenSunday(false);
  //       setDidTouchStartTimeMonday(false);
  //       setDidTouchEndTimeMonday(false);
  //       setDidTouchStartTimeTuesday(false);
  //       setDidTouchEndTimeTuesday(false);
  //       setDidTouchStartTimeWednesday(false);
  //       setDidTouchEndTimeWednesday(false);
  //       setDidTouchStartTimeThursday(false);
  //       setDidTouchEndTimeThursday(false);
  //       setDidTouchStartTimeFriday(false);
  //       setDidTouchEndTimeFriday(false);
  //       setDidTouchStartTimeSaturday(false);
  //       setDidTouchEndTimeSaturday(false);
  //       setDidTouchStartTimeSunday(false);
  //       setDidTouchEndTimeSunday(false);
  //     });
  // };

  return error ? (
    <Error error={error} />
  ) : (
    <>
      <section className="px-10 py-4 flex-col sm:flex-row items-center justify-center">
        <div className="flex flex-col mr-4">
          <span className="sm:mr-2 mt-4">
            Schedule <span className="text-sm text-movet-red">*</span>
          </span>
          <p className="text-sm">
            Use these options to control the days and hours of operation for the
            clinic. Hours are in 24 hour format.
          </p>
        </div>{" "}
        <section className="px-10 py-4 flex-col sm:flex-row items-center justify-center hidden">
          <Listbox
            value={selectedScheduleType}
            onChange={setSelectedScheduleType}
            disabled
          >
            {({ open }: any) => (
              <>
                <div
                  className={"relative bg-white w-full sm:w-2/3 mx-auto my-4"}
                >
                  <Listbox.Button
                    className={
                      "border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-md pl-3 pr-10 py-2 text-left cursor-default sm:text-sm"
                    }
                  >
                    {selectedScheduleType && (
                      <span
                        className={
                          "text-movet-black block truncate font-abside-smooth text-base h-7 mt-1 ml-1 text-movet-gray"
                        }
                      >
                        {selectedScheduleType}
                      </span>
                    )}
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      {false && (
                        <FontAwesomeIcon
                          icon={faList}
                          className="h-4 w-4 mr-2"
                          size="sm"
                        />
                      )}
                    </span>
                  </Listbox.Button>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Listbox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-movet-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {scheduleTypes &&
                        scheduleTypes.length > 0 &&
                        scheduleTypes.map((item: any) => (
                          <Listbox.Option
                            key={item?.id}
                            // onClick={() =>
                            //   setDidTouchScheduleType(true)
                            // }
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-movet-white bg-movet-brown"
                                  : "text-movet-black",
                                "text-left cursor-default select-none relative py-2 pl-4 pr-4",
                              )
                            }
                            value={item?.name}
                          >
                            {({ active, selected }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate ml-2",
                                  )}
                                >
                                  {item?.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={classNames(
                                      active
                                        ? "text-white"
                                        : "text-movet-black",
                                      "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                    )}
                                  >
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className="h-4 w-4"
                                      size="sm"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </section>
        {/* {selectedScheduleType?.toLowerCase() === "once" ?  */}
        <>
          <div
            className={
              "flex flex-col items-center px-4 sm:px-6 group mx-auto max-w-xl mb-4"
            }
          >
            {/* <hr className="mb-4 text-movet-gray w-full" /> */}
            <div className="min-w-0 flex-col w-full justify-center mt-4">
              <div className="text-center text-sm cursor-pointer">
                <div className="flex flex-col sm:flex-row items-center w-full mx-auto py-2 pl-4">
                  <span className="font-extrabold sm:mr-2">Date:</span>{" "}
                  <DateInput
                    required
                    name="date"
                    label=""
                    errors={errors}
                    control={control}
                  />
                </div>
                {errors["date"]?.message && (
                  <ErrorMessage errorMessage={errors["date"].message} />
                )}
                <div className="flex flex-row justify-center items-center w-full mx-auto py-2">
                  <div className="flex flex-col mr-2 sm:mr-0 sm:flex-row justify-between items-center">
                    <span className="font-extrabold">Start Time:</span>{" "}
                    <Controller
                      name={"startTime"}
                      control={control}
                      rules={{
                        required: "Field is required",
                        minLength: {
                          value: 4,
                          message: "Must be a 4 digit number - 24 Hour Time",
                        },
                        maxLength: {
                          value: 4,
                          message: "Must be a 4 digit number - 24 Hour Time",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <PatternFormat
                          name={`startTime`}
                          allowEmptyFormatting
                          valueIsNumericString
                          patternChar="#"
                          format="##:##"
                          mask="_"
                          onBlur={onBlur}
                          value={value}
                          onValueChange={(target: any) => {
                            onChange(target.value);
                          }}
                          required={true}
                          className={classNames(
                            "focus:ring-movet-brown focus:border-movet-brown",
                            "py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth",
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col ml-2 sm:ml-0 sm:flex-row justify-between items-center">
                    <span className="font-extrabold">End Time:</span>{" "}
                    <Controller
                      name={"endTime"}
                      control={control}
                      rules={{
                        required: "Field is required",
                        minLength: {
                          value: 4,
                          message: "Must be a 4 digit number - 24 Hour Time",
                        },
                        maxLength: {
                          value: 4,
                          message: "Must be a 4 digit number - 24 Hour Time",
                        },
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <PatternFormat
                          name={`endTime`}
                          allowEmptyFormatting
                          valueIsNumericString
                          patternChar="#"
                          format="##:##"
                          mask="_"
                          onBlur={onBlur}
                          value={value}
                          onValueChange={(target: any) => {
                            onChange(target.value);
                          }}
                          required={true}
                          className={classNames(
                            "focus:ring-movet-brown focus:border-movet-brown",
                            "py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth",
                          )}
                        />
                      )}
                    />
                  </div>
                </div>
                {errors["startTime"]?.message && (
                  <ErrorMessage errorMessage={errors["startTime"].message} />
                )}
                {errors["endTime"]?.message && (
                  <ErrorMessage errorMessage={errors["endTime"].message} />
                )}{" "}
                <Transition
                  show={isDirty}
                  enter="transition ease-in duration-500"
                  leave="transition ease-out duration-64"
                  leaveTo="opacity-10"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leaveFrom="opacity-100"
                >
                  <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    color="red"
                    disabled={
                      !isDirty ||
                      isSubmitting ||
                      date === "" ||
                      startTime === "" ||
                      endTime === ""
                    }
                    className={"mt-8"}
                    icon={faCheck}
                    text="Save"
                  />
                </Transition>
              </div>
            </div>
          </div>
        </>
        {/* : selectedScheduleType === "Weekly" ? <>
          <div className="flex flex-col items-center justify-center">
            <hr className="mb-4 text-movet-gray w-full" />
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
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenMonday ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200",
                    )}
                  />
                </Switch>
              </div>
              {isOpenMonday ? (
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
              ) : (
                <div className="flex justify-center items-center my-4">
                  <div className="flex-col justify-center items-center mx-4">
                    <h1 className="text-center my-2 italic text-lg">CLOSED</h1>
                  </div>
                </div>
              )}
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
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenTuesday ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200",
                    )}
                  />
                </Switch>
              </div>
              {isOpenTuesday ? (
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
              ) : (
                <div className="flex justify-center items-center my-4">
                  <div className="flex-col justify-center items-center mx-4">
                    <h1 className="text-center my-2 italic text-lg">CLOSED</h1>
                  </div>
                </div>
              )}
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
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenWednesday ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200",
                    )}
                  />
                </Switch>
              </div>
              {isOpenWednesday ? (
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
              ) : (
                <div className="flex justify-center items-center my-4">
                  <div className="flex-col justify-center items-center mx-4">
                    <h1 className="text-center my-2 italic text-lg">CLOSED</h1>
                  </div>
                </div>
              )}
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
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenThursday ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200",
                    )}
                  />
                </Switch>
              </div>
              {isOpenThursday ? (
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
              ) : (
                <div className="flex justify-center items-center my-4">
                  <div className="flex-col justify-center items-center mx-4">
                    <h1 className="text-center my-2 italic text-lg">CLOSED</h1>
                  </div>
                </div>
              )}
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
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenFriday ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200",
                    )}
                  />
                </Switch>
              </div>
              {isOpenFriday ? (
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
              ) : (
                <div className="flex justify-center items-center my-4">
                  <div className="flex-col justify-center items-center mx-4">
                    <h1 className="text-center my-2 italic text-lg">CLOSED</h1>
                  </div>
                </div>
              )}
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
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenSaturday ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200",
                    )}
                  />
                </Switch>
              </div>
              {isOpenSaturday ? (
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
              ) : (
                <div className="flex justify-center items-center my-4">
                  <div className="flex-col justify-center items-center mx-4">
                    <h1 className="text-center my-2 italic text-lg">CLOSED</h1>
                  </div>
                </div>
              )}
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
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      isOpenSunday ? "translate-x-5" : "translate-x-0",
                      "inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200",
                    )}
                  />
                </Switch>
              </div>
              {isOpenSunday ? (
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
              ) : (
                <div className="flex justify-center items-center my-4">
                  <div className="flex-col justify-center items-center mx-4">
                    <h1 className="text-center my-2 italic text-lg">CLOSED</h1>
                  </div>
                </div>
              )}
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
          </Transition></> : <></>} */}
      </section>
      <hr className=" text-movet-gray" />
    </>
  );
};

export default PopUpClinicSchedule;
