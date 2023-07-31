import {
  faFilePen,
  faPlusCircle,
  faFileCirclePlus,
  faTrash,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { setDoc, doc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { firestore } from "services/firebase";
import { Button, Loader } from "ui";
import { TextInput } from "ui/src/components/forms/inputs";
import { classNames } from "utilities";
import Error from "components/Error";

export const TelehealthChatTemplates = ({
  mode,
  templates,
  loading,
  error,
}: {
  mode: "online" | "offline";
  loading: boolean;
  error: any;
  templates: Array<{ title: string; message: string }> | null;
}) => {
  const [showModal, setShowModal] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      message: "",
    },
  });

  const deleteTemplateFromFirestore = async (index: number) =>
    await setDoc(
      doc(firestore, "configuration/telehealth"),
      mode === "online"
        ? {
            onlineTemplates: templates?.filter((_, i) => i !== index),
            updatedOn: serverTimestamp(),
          }
        : {
            offlineTemplates: templates?.filter((_, i) => i !== index),
            updatedOn: serverTimestamp(),
          },
      { merge: true },
    ).catch((error: any) =>
      toast(`Template Deletion FAILED: ${error?.message}`, {
        duration: 5000,
        position: "bottom-center",
        icon: (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            size="sm"
            className="text-movet-red"
          />
        ),
      }),
    );

  const onSubmit = async (data: any) =>
    await setDoc(
      doc(firestore, "configuration/telehealth"),
      mode === "online"
        ? {
            onlineTemplates: arrayUnion(data),
            updatedOn: serverTimestamp(),
          }
        : {
            offlineTemplates: arrayUnion(data),
            updatedOn: serverTimestamp(),
          },
      { merge: true },
    )
      .catch((error: any) =>
        toast(`Template Creation FAILED: ${error?.message}`, {
          duration: 5000,
          position: "bottom-center",
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        }),
      )
      .finally(() => {
        setShowModal(false);
        reset();
      });
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
      <div className="flex flex-col sm:flex-row items-center justify-center mt-1 px-8">
        <div className="flex flex-row items-center mt-3">
          <FontAwesomeIcon
            icon={faFilePen}
            className={"text-movet-red"}
            size="lg"
          />
          <h1 className="mx-2 text-lg">
            {mode?.toUpperCase()} - Auto-Reply Templates
          </h1>
          <FontAwesomeIcon
            data-tooltip-id="createTemplate"
            data-tooltip-content="Create a New Template"
            icon={faPlusCircle}
            className={"text-movet-green hover:text-movet-black cursor-pointer"}
            size="sm"
            onClick={() => setShowModal(!showModal)}
          />
          <Tooltip id="createTemplate" />
        </div>
      </div>
      <Transition
        show={showModal}
        enter="transition ease-in duration-250"
        leave="transition ease-out duration-250"
        leaveTo="opacity-10"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
      >
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
                    <span className="font-extrabold sm:mr-2">Title:</span>{" "}
                    <TextInput
                      required
                      className="w-full"
                      name="title"
                      label=""
                      placeholder=""
                      type="text"
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                    <span className="font-extrabold sm:mr-2">Message:</span>{" "}
                    <TextInput
                      multiline
                      numberOfLines={3}
                      required
                      className="w-full"
                      name="message"
                      label=""
                      placeholder=""
                      type="text"
                      errors={errors}
                      control={control}
                    />
                  </div>
                  <Button
                    type="submit"
                    color="black"
                    disabled={!isDirty || isSubmitting}
                    className={classNames(
                      !isDirty || isSubmitting
                        ? "w-full items-center justify-center rounded-full h-10 text-movet-gray focus:outline-none mr-4"
                        : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-4",
                      "mt-6",
                    )}
                    icon={faFileCirclePlus}
                    text="Add Template"
                  />
                </form>
              </div>
            </div>
          </li>
        </ul>
      </Transition>
      <ul
        role="list"
        className="divide-y divide-movet-gray border-t border-movet-gray mt-2"
      >
        {loading ? (
          <li>
            <Loader
              message={
                loading
                  ? "Loading Templates..."
                  : "Processing Deletion, Please Wait..."
              }
            />
          </li>
        ) : error ? (
          <Error error={error} />
        ) : templates && templates?.length === 0 ? (
          <li
            className="text-center p-4 mx-auto flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setShowModal(!showModal)}
          >
            <h1 className="text-lg italic">No Templates Found...</h1>
            <div className="flex flex-row items-center">
              <FontAwesomeIcon
                icon={faPlusCircle}
                className={
                  "text-movet-green hover:text-movet-black cursor-pointer mt-1"
                }
                size="lg"
              />
              <h2 className="ml-2">Create a New Template</h2>
            </div>
          </li>
        ) : (
          templates &&
          templates?.length > 0 &&
          templates.map(
            (template: { message: string; title: string }, index: number) => (
              <li
                className="px-8 p-4 flex flex-col sm:flex-row items-center"
                key={index}
              >
                {template?.title && (
                  <h3 className="my-2 sm:my-0 font-extrabold text-lg">
                    {template?.title}
                  </h3>
                )}
                {template?.message && (
                  <h3 className="my-2 sm:my-0 max-w-3xl mx-auto italic">
                    {template?.message}
                  </h3>
                )}
                <div className="flex flex-row justify-end">
                  <div
                    className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
                    data-tooltip-id="deleteTemplate"
                    data-tooltip-content="Delete Template"
                    title="Delete Template"
                    onClick={async () =>
                      await deleteTemplateFromFirestore(index)
                    }
                  >
                    <Tooltip id="deleteTemplate" />
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                </div>
              </li>
            ),
          )
        )}
      </ul>
    </div>
  );
};
