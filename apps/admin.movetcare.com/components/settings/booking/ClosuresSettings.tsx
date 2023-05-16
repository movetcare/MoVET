import {
  faCircleCheck,
  faCircleExclamation,
  faTrash,
  faCalendarPlus,
  faPlus,
  faTimes,
  faCalendarTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { Divider } from "components/Divider";
import DateInput from "components/inputs/DateInput";
import { doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { firestore } from "services/firebase";
import { Loader, Button, ErrorMessage } from "ui";
import { TextInput } from "ui/src/components/forms/inputs";
import { classNames } from "utilities";
import Error from "components/Error";
import Link from "next/link";
import { PatternFormat } from "react-number-format";
interface Closure {
  name: string;
  date: any;
  startTime: string;
  endTime: string;
}
export const ClosuresSettings = ({
  schedule,
}: {
  schedule: "clinic" | "housecall" | "virtual";
}) => {
  const [showAddClosureForm, setShowAddClosureForm] = useState<boolean>(false);
  const [closures, setClosures] = useState<Array<Closure> | null>(null);
  const [closuresData, loading, error] = useDocument(
    doc(firestore, "configuration/closures")
  );
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      date: "",
      startTime: "",
      endTime: "",
      name: "",
    },
  });

  const name = watch("name");
  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  useEffect(() => {
    if (closuresData && closuresData.data())
      if (schedule === "clinic") {
        setClosures(
          closuresData.data()?.closureDatesClinic?.map((closure: Closure) => {
            return {
              ...closure,
              startTime:
                closure?.startTime.toString().length === 3
                  ? `0${closure?.startTime}`
                  : `${closure?.startTime}`,
              endTime:
                closure?.endTime.toString().length === 3
                  ? `0${closure?.endTime}`
                  : `${closure?.endTime}`,
            };
          })
        );
      } else if (schedule === "housecall") {
        setClosures(
          closuresData
            .data()
            ?.closureDatesHousecall?.map((closure: Closure) => {
              return {
                ...closure,
                startTime:
                  closure?.startTime.toString().length === 3
                    ? `0${closure?.startTime}`
                    : `${closure?.startTime}`,
                endTime:
                  closure?.endTime.toString().length === 3
                    ? `0${closure?.endTime}`
                    : `${closure?.endTime}`,
              };
            })
        );
      } else if (schedule === "virtual") {
        setClosures(
          closuresData.data()?.closureDatesVirtual?.map((closure: Closure) => {
            return {
              ...closure,
              startTime:
                closure?.startTime.toString().length === 3
                  ? `0${closure?.startTime}`
                  : `${closure?.startTime}`,
              endTime:
                closure?.endTime.toString().length === 3
                  ? `0${closure?.endTime}`
                  : `${closure?.endTime}`,
            };
          })
        );
      }
  }, [closuresData, schedule]);

  const deleteClosureFromFirestore = async (index: number) =>
    await setDoc(
      doc(firestore, "configuration/closures"),
      schedule === "clinic"
        ? {
            closureDatesClinic: closures?.filter((_, i) => i !== index),
            updatedOn: serverTimestamp(),
          }
        : schedule === "housecall"
        ? {
            closureDatesHousecall: closures?.filter((_, i) => i !== index),
            updatedOn: serverTimestamp(),
          }
        : {
            closureDatesVirtual: closures?.filter((_, i) => i !== index),
            updatedOn: serverTimestamp(),
          },
      { merge: true }
    )
      .then(() =>
        toast(
          `Your ${schedule?.toUpperCase()} closure deletion will appear in ~ 5 minutes.`,
          {
            duration: 5000,
            position: "bottom-center",
            icon: (
              <FontAwesomeIcon
                icon={faCircleCheck}
                size="sm"
                className="text-movet-green"
              />
            ),
          }
        )
      )
      .catch((error: any) =>
        toast(
          `${schedule?.toUpperCase()} Closure Deletion FAILED: ${
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

  const onSubmit = async (data: any) =>
    await setDoc(
      doc(firestore, "configuration/closures"),
      schedule === "clinic"
        ? {
            closureDatesClinic: arrayUnion({
              ...data,
              startTime: Number(data.startTime),
              endTime: Number(data.endTime),
            }),
            updatedOn: serverTimestamp(),
          }
        : schedule === "housecall"
        ? {
            closureDatesHousecall: arrayUnion({
              ...data,
              startTime: Number(data.startTime),
              endTime: Number(data.endTime),
            }),
            updatedOn: serverTimestamp(),
          }
        : {
            closureDatesVirtual: arrayUnion({
              ...data,
              startTime: Number(data.startTime),
              endTime: Number(data.endTime),
            }),
            updatedOn: serverTimestamp(),
          },
      { merge: true }
    )
      .then(() =>
        toast(`Your ${schedule?.toUpperCase()} closure has been added!.`, {
          duration: 5000,
          position: "bottom-center",
          icon: (
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="sm"
              className="text-movet-green"
            />
          ),
        })
      )
      .catch((error: any) =>
        toast(
          `${schedule?.toUpperCase()} Closure Update FAILED: ${error?.message}`,
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
        setShowAddClosureForm(false);
        reset();
      });
  return (
    <div>
      <Divider />
      <h3>Closures</h3>
      <p className="text-sm">
        Use this setting to disable certain times on specific days of the week
        on the appointment availability schedule.
      </p>
      <p className="text-xs italic mt-2">
        * If you need to disable entire days, use the &quot;FULL DAY / MULTI-DAY
        CLOSURES &quot; setting on the &quot;
        <Link
          href="/settings/booking/manage-hours/"
          className="text-movet-red hover:underline"
        >
          Manage Hours
        </Link>
        &quot; settings page.
      </p>
      <Divider />
      {loading ? (
        <Loader message="Loading Closures" />
      ) : (
        <div className="flex flex-col mr-4">
          {(closures === undefined ||
            closures === null ||
            closures?.length < 0) &&
            !showAddClosureForm && (
              <h1 className="text-lg my-4 italic">No Closures Found...</h1>
            )}
          {closures && closures?.length > 0 && (
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-movet-black sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-movet-black"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-movet-black"
                    title="Block all Appointments starting at..."
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-movet-black"
                  >
                    End Time
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {closures &&
                  closures.map((closure: Closure, index: number) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-movet-black sm:pl-0">
                        {closure.name}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        <p>
                          {closure?.date &&
                            closure?.date
                              ?.toDate()
                              ?.toLocaleDateString("en-us", {
                                weekday: "short",
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              })}
                        </p>
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        {closure?.startTime && (
                          <p>{`${new Date(
                            "February 04, 2022 " +
                              [
                                closure?.startTime.slice(0, 2),
                                ":",
                                closure?.startTime.slice(2),
                              ].join("") +
                              ":00"
                          ).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}`}</p>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        {closure?.endTime && (
                          <p>{`${new Date(
                            "February 04, 2022 " +
                              [
                                closure?.endTime.slice(0, 2),
                                ":",
                                closure?.endTime.slice(2),
                              ].join("") +
                              ":00"
                          ).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}`}</p>
                        )}
                      </td>
                      <td
                        className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                        onClick={async () =>
                          await deleteClosureFromFirestore(index)
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          <Transition
            show={showAddClosureForm}
            enter="transition ease-in duration-250"
            leave="transition ease-out duration-250"
            leaveTo="opacity-10"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
          >
            <div className="bg-white shadow overflow-hidden rounded-lg my-4">
              <div className="flex flex-row items-center justify-center -mb-4">
                <FontAwesomeIcon
                  icon={faCalendarPlus}
                  className={"text-movet-green"}
                  size="lg"
                />
                <h1 className="ml-2 my-4 text-lg cursor-pointer">
                  Add a Closure
                </h1>
              </div>
              {loading ? (
                <div className="mb-6">
                  <Loader height={200} width={200} />
                </div>
              ) : error ? (
                <div className="px-8 pb-8">
                  <Error error={error} />
                </div>
              ) : (
                <ul
                  role="list"
                  className="divide-y divide-movet-gray border-t border-movet-gray my-4"
                >
                  <li>
                    <div
                      className={
                        "flex flex-col items-center px-4 py-4 sm:px-6 group mx-auto max-w-xl"
                      }
                    >
                      <div className="min-w-0 flex-col w-full justify-center">
                        <div className="text-center text-sm cursor-pointer -mb-2">
                          <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2 pl-2">
                            <span className="font-extrabold sm:mr-2">
                              Name:
                            </span>{" "}
                            <TextInput
                              required
                              className="w-full"
                              name="name"
                              label=""
                              placeholder=""
                              type="text"
                              errors={errors}
                              disabled={loading}
                              control={control}
                            />
                          </div>
                          {errors["name"]?.message && (
                            <ErrorMessage
                              errorMessage={errors["name"].message}
                            />
                          )}
                          <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2 pl-4">
                            <span className="font-extrabold sm:mr-2">
                              Date:
                            </span>{" "}
                            <DateInput
                              required
                              name="date"
                              label=""
                              errors={errors}
                              disabled={loading}
                              control={control}
                              className="w-full"
                            />
                          </div>
                          {errors["date"]?.message && (
                            <ErrorMessage
                              errorMessage={errors["date"].message}
                            />
                          )}
                          <div className="flex flex-row justify-center items-center w-full mx-auto py-2">
                            <div className="flex flex-col mr-2 sm:mr-0 sm:flex-row justify-between items-center">
                              <span className="font-extrabold">
                                Start Time:
                              </span>{" "}
                              <Controller
                                name={"startTime"}
                                control={control}
                                rules={{
                                  required: "Field is required",
                                  minLength: {
                                    value: 4,
                                    message:
                                      "Must be a 4 digit number - 24 Hour Time",
                                  },
                                  maxLength: {
                                    value: 4,
                                    message:
                                      "Must be a 4 digit number - 24 Hour Time",
                                  },
                                }}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
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
                                      "py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth"
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
                                    message:
                                      "Must be a 4 digit number - 24 Hour Time",
                                  },
                                  maxLength: {
                                    value: 4,
                                    message:
                                      "Must be a 4 digit number - 24 Hour Time",
                                  },
                                }}
                                render={({
                                  field: { onChange, onBlur, value },
                                }) => (
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
                                      "py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth"
                                    )}
                                  />
                                )}
                              />
                            </div>
                          </div>
                          {errors["startTime"]?.message && (
                            <ErrorMessage
                              errorMessage={errors["startTime"].message}
                            />
                          )}
                          {errors["endTime"]?.message && (
                            <ErrorMessage
                              errorMessage={errors["endTime"].message}
                            />
                          )}
                          <Button
                            type="submit"
                            onClick={handleSubmit(onSubmit as any)}
                            color="black"
                            disabled={
                              !isDirty ||
                              isSubmitting ||
                              name === "" ||
                              date === "" ||
                              startTime === "" ||
                              endTime === ""
                            }
                            className={classNames(
                              !isDirty || isSubmitting
                                ? "w-full items-center justify-center rounded-full h-10 text-movet-gray focus:outline-none mr-4"
                                : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-4",
                              "mt-8"
                            )}
                            icon={faPlus}
                            text="Add Closure"
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </Transition>
          {showAddClosureForm ? (
            <Button
              onClick={() => setShowAddClosureForm(false)}
              text="Close"
              icon={faTimes}
              color="red"
              className="mt-4 mb-8"
            />
          ) : (
            <Button
              onClick={() => setShowAddClosureForm(true)}
              text="Add Closure"
              icon={faCalendarTimes}
              color="black"
              className="mt-4 mb-8"
            />
          )}
        </div>
      )}
    </div>
  );
};
