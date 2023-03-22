import {
  faCircleCheck,
  faCircleExclamation,
  faGlobe,
  faHospital,
  faHouseMedical,
  faHeadset,
  faCheck,
  faBan,
  faTrash,
  faCalendarPlus,
  faPlus,
  faTimes,
  faCalendarTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition, Switch } from "@headlessui/react";
import { Divider } from "components/Divider";
import DateInput from "components/inputs/DateInput";
import { doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { firestore } from "services/firebase";
import { Loader, Button } from "ui";
import { TextInput } from "ui/src/components/forms/inputs";
import { classNames } from "utilities";
import Error from "components/Error";
interface Closure {
  name: string;
  startDate: any;
  endDate: any;
  isActiveForClinic: boolean;
  isActiveForHousecalls: boolean;
  isActiveForTelehealth: boolean;
  showOnWebsite: boolean;
  isAllDay: boolean;
}
export const Closures = () => {
  const [showAddClosureForm, setShowAddClosureForm] = useState<boolean>(false);
  const [closures, setClosures] = useState<Array<Closure> | null>(null);
  const [closuresData, loading, error] = useDocument(
    doc(firestore, "configuration/closures")
  );
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      startDate: null,
      endDate: null,
      name: null,
      isActiveForClinic: false,
      isActiveForHousecalls: false,
      isActiveForTelehealth: false,
      showOnWebsite: true,
    },
  });
  const isActiveForClinic = watch("isActiveForClinic");
  const isActiveForHousecalls = watch("isActiveForHousecalls");
  const isActiveForTelehealth = watch("isActiveForTelehealth");
  const showOnWebsite = watch("showOnWebsite");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (closuresData && closuresData.data())
      setClosures(closuresData.data()?.closureDates);
  }, [closuresData]);

  const deleteClosureFromFirestore = async (index: number) =>
    await setDoc(
      doc(firestore, "configuration/closures"),
      {
        closureDates: closures?.filter((_, i) => i !== index),
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`Your closure deletion will appear in 5 minutes (or less).`, {
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
        toast(`Closure Deletion FAILED: ${error?.message}`, {
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

  const onSubmit = async (data: any) =>
    await setDoc(
      doc(firestore, "configuration/closures"),
      {
        closureDates: arrayUnion(data),
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`Your closure update will appear in 5 minutes (or less).`, {
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
        toast(`Closure Update FAILED: ${error?.message}`, {
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
      .finally(() => setShowAddClosureForm(false));
  return (
    <>
      <h3>CLOSURES</h3>
      <p className="text-sm">
        Use this setting to disable certain days of the week on the appointment
        availability schedules and show them on the{" "}
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
      {loading ? (
        <Loader message="Loading Closures" />
      ) : (
        <div className="flex flex-col mr-4">
          {(closures === null || closures?.length < 0) &&
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
                    data-tooltip-id="schedules"
                    data-tooltip-content="Impacted Schedule(s)"
                    title="Impacted Schedule(s)"
                  >
                    <Tooltip id="schedules" />
                    Schedules
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-movet-black"
                  >
                    <Tooltip id="showOnWebsite" />
                    <FontAwesomeIcon
                      data-tooltip-id="showOnWebsite"
                      data-tooltip-content="Display Closure on movetcare.com"
                      title="Display Closure on movetcare.com"
                      icon={faGlobe}
                    />
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
                        {closure?.startDate
                          ?.toDate()
                          ?.toLocaleDateString("en-us", {
                            weekday: "short",
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          }) !==
                        closure?.endDate
                          ?.toDate()
                          ?.toLocaleDateString("en-us", {
                            weekday: "short",
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                          }) ? (
                          <p>
                            {closure?.startDate
                              ?.toDate()
                              ?.toLocaleDateString("en-us", {
                                weekday: "short",
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              })}{" "}
                            -{" "}
                            {closure?.endDate
                              ?.toDate()
                              ?.toLocaleDateString("en-us", {
                                weekday: "short",
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              })}
                          </p>
                        ) : (
                          <p>
                            {closure?.startDate
                              ?.toDate()
                              ?.toLocaleDateString("en-us", {
                                weekday: "short",
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              })}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        <Tooltip id="telehealthClosed" />
                        <Tooltip id="housecallsClosed" />
                        <Tooltip id="clinicClosed" />
                        {closure?.isActiveForClinic && (
                          <FontAwesomeIcon
                            data-tooltip-id="clinicClosed"
                            data-tooltip-content="Clinic Closed"
                            title="Clinic Closed"
                            size="lg"
                            icon={faHospital}
                            className="mr-2"
                          />
                        )}
                        {closure?.isActiveForHousecalls && (
                          <FontAwesomeIcon
                            data-tooltip-id="housecallsClosed"
                            data-tooltip-content="Housecalls Closed"
                            title="Housecalls Closed"
                            size="lg"
                            icon={faHouseMedical}
                          />
                        )}
                        {closure?.isActiveForTelehealth && (
                          <FontAwesomeIcon
                            data-tooltip-id="telehealthClosed"
                            data-tooltip-content="Telehealth Closed"
                            title="Telehealth Closed"
                            size="lg"
                            icon={faHeadset}
                            className="ml-2"
                          />
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        {closure?.showOnWebsite ? (
                          <FontAwesomeIcon
                            size="lg"
                            icon={faCheck}
                            className="text-movet-green"
                          />
                        ) : (
                          <FontAwesomeIcon
                            size="lg"
                            icon={faBan}
                            className="text-movet-red"
                          />
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
            <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
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
                        <form
                          onSubmit={handleSubmit(onSubmit as any)}
                          className="text-center text-sm cursor-pointer -mb-2"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
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
                          <div className="flex flex-row justify-center items-center w-full mx-auto py-2">
                            <div className="flex flex-col mr-2 sm:mr-0 sm:flex-row justify-between items-center">
                              <span className="font-extrabold">
                                Start Date:
                              </span>{" "}
                              <DateInput
                                required
                                name="startDate"
                                label=""
                                errors={errors}
                                disabled={loading}
                                control={control}
                              />
                            </div>
                            <div className="flex flex-col ml-2 sm:ml-0 sm:flex-row justify-between items-center">
                              <span className="font-extrabold">End Date:</span>{" "}
                              <DateInput
                                required
                                name="endDate"
                                label=""
                                errors={errors}
                                disabled={loading}
                                control={control}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                            <span className="font-extrabold">Clinic:</span>{" "}
                            <Controller
                              name="isActiveForClinic"
                              control={control}
                              render={({
                                field: { onChange, onBlur, value },
                              }: any) => (
                                <Switch
                                  checked={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  className={classNames(
                                    isActiveForClinic
                                      ? "bg-movet-green"
                                      : "bg-movet-red",
                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      isActiveForClinic
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                    )}
                                  />
                                </Switch>
                              )}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                            <span className="font-extrabold">Telehealth:</span>{" "}
                            <Controller
                              name="isActiveForTelehealth"
                              control={control}
                              render={({
                                field: { onChange, onBlur, value },
                              }: any) => (
                                <Switch
                                  checked={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  className={classNames(
                                    isActiveForTelehealth
                                      ? "bg-movet-green"
                                      : "bg-movet-red",
                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      isActiveForTelehealth
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                    )}
                                  />
                                </Switch>
                              )}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                            <span className="font-extrabold">Housecalls:</span>{" "}
                            <Controller
                              name="isActiveForHousecalls"
                              control={control}
                              render={({
                                field: { onChange, onBlur, value },
                              }: any) => (
                                <Switch
                                  checked={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  className={classNames(
                                    isActiveForHousecalls
                                      ? "bg-movet-green"
                                      : "bg-movet-red",
                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      isActiveForHousecalls
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                    )}
                                  />
                                </Switch>
                              )}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                            <span className="font-extrabold">
                              Display on Website:
                            </span>{" "}
                            <Controller
                              name="showOnWebsite"
                              control={control}
                              render={({
                                field: { onChange, onBlur, value },
                              }: any) => (
                                <Switch
                                  checked={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  className={classNames(
                                    showOnWebsite
                                      ? "bg-movet-green"
                                      : "bg-movet-red",
                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      showOnWebsite
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                    )}
                                  />
                                </Switch>
                              )}
                            />
                          </div>
                          <Button
                            type="submit"
                            color="black"
                            disabled={
                              !isDirty ||
                              isSubmitting ||
                              startDate === null ||
                              endDate === null
                            }
                            className={classNames(
                              !isDirty || isSubmitting
                                ? "w-full items-center justify-center rounded-full h-10 text-movet-gray focus:outline-none mr-4"
                                : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-4",
                              "mt-6"
                            )}
                            icon={faPlus}
                            text="Add Closure"
                          />
                        </form>
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
              className="mt-4"
            />
          ) : (
            <Button
              onClick={() => setShowAddClosureForm(true)}
              text="Add Closure"
              icon={faCalendarTimes}
              color="black"
              className="mt-4"
            />
          )}
        </div>
      )}
    </>
  );
};
