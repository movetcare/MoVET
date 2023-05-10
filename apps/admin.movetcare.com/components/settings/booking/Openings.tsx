import {
  faCircleCheck,
  faCircleExclamation,
  faTrash,
  faCalendarPlus,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { Divider } from "components/Divider";
import { doc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { firestore } from "services/firebase";
import { Loader, Button } from "ui";
import { SelectInput, TextInput } from "ui/src/components/forms/inputs";
import { classNames } from "utilities";
import Error from "components/Error";
interface Opening {
  type:
    | "Clinic @ Belleview Station"
    | "Boutique @ Belleview Station"
    | "Clinic Walk-In Hours"
    | "Housecalls";
  days: string;
  times: string;
}
export const Openings = () => {
  const [showAddOpeningForm, setShowAddOpeningForm] = useState<boolean>(false);
  const [Openings, setOpenings] = useState<Array<Opening> | null>(null);
  const [openingsData, loading, error] = useDocument(
    doc(firestore, "configuration/openings")
  );
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      type: "",
      days: "",
      times: "",
    },
  });
  const type = watch("type");
  const days = watch("days");
  const times = watch("times");

  useEffect(() => {
    if (openingsData && openingsData.data())
      setOpenings(openingsData.data()?.openingDates);
  }, [openingsData]);

  const deleteOpeningFromFirestore = async (index: number) =>
    await setDoc(
      doc(firestore, "configuration/openings"),
      {
        openingDates: Openings?.filter((_, i) => i !== index),
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`Your opening deletion will appear in 5 minutes (or less).`, {
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
        toast(`opening Deletion FAILED: ${error?.message}`, {
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
      doc(firestore, "configuration/openings"),
      {
        openingDates: arrayUnion({ ...data, type: data.type.id }),
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`Your opening update will appear in 5 minutes (or less).`, {
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
        toast(`opening Update FAILED: ${error?.message}`, {
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
      .finally(() => setShowAddOpeningForm(false));
  return (
    <div className="py-4 flex-col sm:flex-row items-center justify-center">
      <h3>HOURS OF OPERATION DISPLAY</h3>
      <p className="text-sm">
        Use this setting to change the days of the week shown on the{" "}
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
        <Loader message="Loading Openings" />
      ) : (
        <div className="flex flex-col mr-4">
          {(Openings === null || Openings?.length < 0) &&
            !showAddOpeningForm && (
              <h1 className="text-lg my-4 italic">No Openings Found...</h1>
            )}
          {Openings && Openings?.length > 0 && (
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-movet-black sm:pl-0"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-movet-black"
                  >
                    Day(s)
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-movet-black"
                    data-tooltip-id="schedules"
                    data-tooltip-content="Impacted Schedule(s)"
                    title="Impacted Schedule(s)"
                  >
                    <Tooltip id="schedules" />
                    Hours
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Openings &&
                  Openings.map((opening: Opening, index: number) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-movet-black sm:pl-0">
                        {opening?.type}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        {opening?.days}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm">
                        {opening?.times}
                      </td>
                      <td
                        className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                        onClick={async () =>
                          await deleteOpeningFromFirestore(index)
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
            show={showAddOpeningForm}
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
                  Add an Opening
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
                          <div className="flex flex-col sm:flex-row items-center w-full mx-auto py-2">
                            <span className="font-extrabold sm:mr-2">
                              Type:
                            </span>{" "}
                            <SelectInput
                              label=""
                              name="type"
                              required
                              values={[
                                {
                                  id: "Clinic @ Belleview Station",
                                  name: "Clinic @ Belleview Station",
                                },
                                {
                                  id: "Boutique @ Belleview Station",
                                  name: "Boutique @ Belleview Station",
                                },
                                {
                                  id: "Clinic Walk-In Hours",
                                  name: "Clinic Walk-In Hours",
                                },
                                { id: "Housecalls", name: "Housecalls" },
                              ]}
                              errors={errors}
                              control={control}
                            />
                          </div>
                          <div className="flex flex-row justify-center items-center w-full mx-auto py-2">
                            <div className="flex flex-col mr-2 sm:mr-0 sm:flex-row justify-between items-center">
                              <span className="font-extrabold sm:mx-2">
                                Day(s):
                              </span>{" "}
                              <TextInput
                                required
                                className="w-full"
                                name="days"
                                label=""
                                placeholder=""
                                type="text"
                                errors={errors}
                                disabled={loading}
                                control={control}
                              />
                            </div>
                            <div className="flex flex-col ml-2 sm:ml-0 sm:flex-row justify-between items-center">
                              <span className="font-extrabold sm:mx-2">
                                Times:
                              </span>{" "}
                              <TextInput
                                required
                                className="w-full"
                                name="times"
                                label=""
                                placeholder=""
                                type="text"
                                errors={errors}
                                disabled={loading}
                                control={control}
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            color="black"
                            disabled={
                              !isDirty ||
                              isSubmitting ||
                              type === "" ||
                              days === "" ||
                              times === ""
                            }
                            className={classNames(
                              !isDirty || isSubmitting
                                ? "w-full items-center justify-center rounded-full h-10 text-movet-gray focus:outline-none mr-4"
                                : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-4",
                              "mt-6"
                            )}
                            icon={faPlus}
                            text="Add Opening"
                          />
                        </form>
                      </div>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </Transition>
          {showAddOpeningForm ? (
            <Button
              onClick={() => setShowAddOpeningForm(false)}
              text="Close"
              icon={faTimes}
              color="red"
              className="mt-4"
            />
          ) : (
            <Button
              onClick={() => setShowAddOpeningForm(true)}
              text="Add Opening"
              icon={faCalendarPlus}
              color="black"
              className="mt-4"
            />
          )}
        </div>
      )}
    </div>
  );
};
