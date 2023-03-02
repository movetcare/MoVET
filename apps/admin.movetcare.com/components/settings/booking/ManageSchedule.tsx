import { classNames } from "utils/classNames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumbs from "components/Breadcrumbs";
import { subNavigation } from "./SubNavigation";
import { Button, Loader } from "ui";
import {
  faBan,
  faCalendarPlus,
  faCircleCheck,
  faCircleExclamation,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Switch, Transition } from "@headlessui/react";
import DateInput from "components/inputs/DateInput";
import { doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Error from "components/Error";
import { firestore } from "services/firebase";
import { TextInput } from "ui/src/components/forms/inputs";
const PAGE_NAME = subNavigation[1].name;
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
const ManageSchedule = () => {
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

  useEffect(() => {
    if (closuresData && closuresData.data())
      setClosures(closuresData.data()?.closureDates);
  }, [closuresData]);

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
      );
  const Divider = () => <hr className="my-4 border-movet-brown/50" />;
  return (
    <section className="flex flex-row items-center justify-center bg-white rounded-lg overflow-hidden">
      <div className="bg-white rounded-lg overflow-hidden w-full">
        <div className="px-8 my-4 w-full border-b pb-4 border-movet-gray">
          <Breadcrumbs
            pages={[
              { name: "Settings", href: "/settings/", current: false },
              {
                name: "Manage Booking",
                href: "/settings/booking/",
                current: false,
              },
              {
                name: "Schedule",
                href: "/settings/booking/manage-schedule/",
                current: true,
              },
            ]}
          />
        </div>
        <div className="divide-y divide-movet-gray lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x -mt-4">
          <aside className="lg:col-span-3">
            <nav className="space-y-1">
              {subNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.name === PAGE_NAME
                      ? "bg-movet-red text-movet-white hover:bg-opacity-80 hover:text-movet-white"
                      : "border-transparent text-movet-black hover:bg-movet-white hover:text-movet-black",
                    "group border-l-4 px-3 py-2 flex items-center text-sm font-medium"
                  )}
                  aria-current={item.name === PAGE_NAME ? "page" : undefined}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={classNames(
                      item.name === PAGE_NAME
                        ? "text-movet-white group-hover:text-movet-white"
                        : "text-movet-black group-hover:text-movet-black",
                      "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </nav>
          </aside>
          <form
            className="divide-y divide-movet-gray lg:col-span-9"
            action="#"
            method="POST"
          >
            <div className="divide-y divide-movet-gray">
              <div className="px-4 sm:px-6">
                <h2 className="text-2xl mb-2 leading-6 font-medium text-movet-black">
                  Schedule
                </h2>
                <p className="text-sm text-movet-black -mt-1">
                  Use the options below to manage the appointment booking
                  schedules.
                </p>
              </div>
              <ul className="mt-4 mb-8 divide-y divide-movet-gray px-8">
                <li className="py-4 flex-col sm:flex-row items-center justify-center">
                  {loading ? (
                    <Loader message="Loading Closures" />
                  ) : (
                    <div className="flex flex-col mr-4">
                      <h3>CLOSURES</h3>
                      <p className="text-sm">
                        Use this setting to disable certain days of the week on
                        the appointment availability calendars.
                      </p>
                      <Divider />
                      {(closures === null || closures?.length < 0) &&
                      !showAddClosureForm ? (
                        <h1 className="text-lg my-4 italic">
                          No Closures Found...
                        </h1>
                      ) : (
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                              >
                                Schedules
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Display on Website
                              </th>
                              <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                              >
                                <span className="sr-only">Edit</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {closures &&
                              closures.map(
                                (closure: Closure, index: number) => (
                                  <tr key={index}>
                                    <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                      {closure.name}
                                      <dl className="font-normal lg:hidden">
                                        <dt className="sr-only">Date</dt>
                                        <dd className="mt-1 truncate text-gray-700">
                                          {closure?.startDate
                                            ?.toDate()
                                            ?.toString()}{" "}
                                          -{" "}
                                          {closure?.endDate
                                            ?.toDate()
                                            ?.toString()}
                                        </dd>
                                        <dt className="sr-only sm:hidden">
                                          Name
                                        </dt>
                                        <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                          {closure.name}
                                        </dd>
                                      </dl>
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                                      {closure?.startDate?.toDate()?.toString()}{" "}
                                      - {closure?.endDate?.toDate()?.toString()}
                                    </td>
                                    <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                                      {closure.name}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                      Schedule
                                    </td>
                                    <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                      <a
                                        href="#"
                                        className="text-indigo-600 hover:text-indigo-900"
                                      >
                                        Edit
                                        <span className="sr-only">
                                          , {closure.name}
                                        </span>
                                      </a>
                                    </td>
                                  </tr>
                                )
                              )}
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
                                          <span className="font-extrabold">
                                            End Date:
                                          </span>{" "}
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
                                        <span className="font-extrabold">
                                          Clinic:
                                        </span>{" "}
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
                                        <span className="font-extrabold">
                                          Telehealth:
                                        </span>{" "}
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
                                        <span className="font-extrabold">
                                          Housecalls:
                                        </span>{" "}
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
                                      <button
                                        type="submit"
                                        disabled={!isDirty || isSubmitting}
                                        className={classNames(
                                          !isDirty || isSubmitting
                                            ? "w-full items-center justify-center rounded-full h-10 text-movet-gray focus:outline-none mr-4"
                                            : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-4",
                                          "mt-6"
                                        )}
                                      >
                                        <FontAwesomeIcon
                                          icon={faWrench}
                                          size="lg"
                                        />
                                        <span className="ml-2">Save</span>
                                      </button>
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
                          text="Cancel"
                          icon={faBan}
                          color="red"
                          className="mt-4"
                        />
                      ) : (
                        <Button
                          onClick={() => setShowAddClosureForm(true)}
                          text="Add Closure"
                          icon={faCalendarPlus}
                          color="black"
                          className="mt-4"
                        />
                      )}
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ManageSchedule;
