import {
  faBell,
  faBellSlash,
  faCalendar,
  faCaretDown,
  faCaretUp,
  faCircleCheck,
  faCircleExclamation,
  faClockFour,
  faEdit,
  faFileAlt,
  faSignal,
  faUsers,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition, Switch } from "@headlessui/react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { firestore } from "services/firebase";
import { classNames } from "utils/classNames";
import Error from "components/Error";
import Link from "next/link";
import { Tooltip } from "react-tooltip";

const TelehealthChatStatus = () => {
  const [showTelehealthSettingsMenu, setShowTelehealthSettingsMenu] =
    useState<boolean>(false);
  const [settings, loadingSettings, errorSettings] = useDocument(
    doc(firestore, "alerts/telehealth"),
  );
  const [templates, loadingTemplates, errorTemplates] = useDocument(
    doc(firestore, "configuration/telehealth"),
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      message: null,
      queueSize: 0,
      isOnline: false,
      waitTime: 0,
      onlineAutoReply: "",
      offlineAutoReply: "",
    } as any,
  });

  const isOnline = watch("isOnline");

  useEffect(() => {
    if (settings && settings.data()) reset(settings.data());
  }, [settings, reset]);

  const onSubmit = async (data: {
    message: string;
    queueSize: number;
    isOnline: boolean;
    waitTime: number;
    onlineAutoReply: string;
    offlineAutoReply: string;
  }) =>
    await updateDoc(doc(firestore, "alerts/telehealth"), {
      updatedOn: serverTimestamp(),
      ...data,
    })
      .then(() =>
        toast("Telehealth settings have been updated!", {
          icon: (
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="sm"
              className="text-movet-green"
            />
          ),
        }),
      )
      .catch((error: any) =>
        toast(error?.message, {
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        }),
      );
  return (
    <>
      {(loadingSettings || loadingTemplates) && (
        <div className="text-center text-sm -mt-2 cursor-pointer hover:text-movet-red">
          <h2 className="text-center text-sm -mt-2">
            Loading Telehealth Settings...
          </h2>
        </div>
      )}
      {(errorSettings || errorTemplates) && (
        <div className="text-center text-sm -mt-2 cursor-pointer hover:text-movet-red">
          <Error error={errorSettings} />
        </div>
      )}
      {settings &&
        !loadingSettings &&
        !errorSettings &&
        !loadingTemplates &&
        !errorTemplates && (
          <div
            className="text-center text-sm -mt-2 cursor-pointer hover:text-movet-red"
            onClick={() =>
              setShowTelehealthSettingsMenu(!showTelehealthSettingsMenu)
            }
          >
            <h2 className="text-center text-sm -mt-2">
              <FontAwesomeIcon icon={faEdit} size="xs" />
              <span className="ml-2">Status: </span>
              <span
                className={`mr-2 italic${
                  settings?.data()?.isOnline
                    ? " text-movet-green"
                    : " text-movet-red"
                }`}
              >
                {settings?.data()?.isOnline ? "ONLINE" : "OFFLINE"}
              </span>
              <FontAwesomeIcon
                icon={showTelehealthSettingsMenu ? faCaretDown : faCaretUp}
                size="xs"
              />
            </h2>
            {/* <h3 className="text-center text-xs">
            <FontAwesomeIcon icon={faUsers} />
            <span className="mx-2">{settings?.data()?.queueSize}</span>
            <FontAwesomeIcon icon={faClockFour} />
            <span className="ml-2">{settings?.data()?.waitTime}</span>
          </h3> */}
          </div>
        )}
      <menu className="mt-4">
        <Transition
          show={showTelehealthSettingsMenu}
          enter="transition ease-in duration-250"
          leave="transition ease-out duration-250"
          leaveTo="opacity-10"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
        >
          <form
            onSubmit={handleSubmit(onSubmit as any)}
            className="flex flex-col w-full mx-auto mt-8 px-4 md:px-8"
          >
            <div className="flex flex-col w-full justify-center items-center pt-4 mb-4 border-t border-movet-gray">
              <label className="italic mt-2 mb-2 text-sm">
                <FontAwesomeIcon
                  icon={faSignal}
                  size="sm"
                  color={isOnline ? "#00A36C" : "#E76159"}
                />
                <span className="ml-2">
                  Status:{" "}
                  <span
                    className={`italic${
                      isOnline ? "text-movet-green" : " text-movet-red"
                    }`}
                  >
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </span>
                </span>
              </label>
              <Controller
                name="isOnline"
                control={control}
                render={({ field: { onChange, onBlur, value } }: any) => (
                  <Switch
                    checked={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={classNames(
                      isOnline ? "bg-movet-green" : "bg-movet-red",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        isOnline ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                      )}
                    />
                  </Switch>
                )}
              />
            </div>
            <label className="italic my-2 text-sm">
              <FontAwesomeIcon icon={faBell} size="sm" />
              <span className="ml-2">Online Auto-Reply Message</span>
            </label>
            <textarea
              rows={6}
              placeholder="Write Something..."
              className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-lg"
              {...register("onlineAutoReply")}
            />
            <label className="italic my-2 text-sm">
              <FontAwesomeIcon icon={faFileAlt} size="sm" />
              <span className="ml-2">
                Online Auto-Reply Templates{" "}
                <Link href="/settings/telehealth">
                  <FontAwesomeIcon
                    icon={faEdit}
                    size={"sm"}
                    className="ml-2 hover:text-movet-red"
                  />
                </Link>
              </span>
              <p className="mt-1 italic text-xs -mb-2">
                Click on an option below to prefill the field above. Don&apos;t
                forget to click &apos;Save Changes&apos; once you&apos;re done!
              </p>
            </label>
            <div className="flex flex-col w-full">
              <ul>
                {templates &&
                  (templates as any)
                    ?.data()
                    .onlineTemplates.map(
                      (
                        template: { title: string; message: string },
                        index: number,
                      ) => (
                        <li
                          className="border-movet-gray rounded-lg border-2 p-2 my-4 hover:border-movet-black cursor-pointer"
                          data-tooltip-id={`online-template-${index}`}
                          data-tooltip-content={template?.message}
                          onClick={() =>
                            setValue("onlineAutoReply", template?.message, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            })
                          }
                        >
                          <h4>{template?.title}</h4>
                          <Tooltip id={`template-${index}`} />
                        </li>
                      ),
                    )}
              </ul>
            </div>
            <label className="italic my-2 text-sm">
              <FontAwesomeIcon icon={faBellSlash} size="sm" />
              <span className="ml-2">Offline Auto-Reply Message</span>
            </label>
            <textarea
              rows={6}
              placeholder="Write Something..."
              className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-lg"
              {...register("offlineAutoReply")}
            />
            <label className="italic my-2 text-sm">
              <FontAwesomeIcon icon={faFileAlt} size="sm" />
              <span className="ml-2">
                Offline Auto-Reply Templates{" "}
                <Link href="/settings/telehealth">
                  <FontAwesomeIcon
                    icon={faEdit}
                    size={"sm"}
                    className="ml-2 hover:text-movet-red"
                  />
                </Link>
              </span>
              <p className="mt-1 italic text-xs -mb-2">
                Click on an option below to prefill the field above. Don&apos;t
                forget to click &apos;Save Changes&apos; once you&apos;re done!
              </p>
            </label>
            <div className="flex flex-col w-full">
              <ul>
                {templates &&
                  (templates as any)
                    ?.data()
                    .offlineTemplates.map(
                      (
                        template: { title: string; message: string },
                        index: number,
                      ) => (
                        <li
                          className="border-movet-gray rounded-lg border-2 p-2 my-4 hover:border-movet-black cursor-pointer"
                          data-tooltip-id={`offline-template-${index}`}
                          data-tooltip-content={template?.message}
                          onClick={() =>
                            setValue("offlineAutoReply", template?.message, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            })
                          }
                        >
                          <h4>{template?.title}</h4>
                          <Tooltip id={`template-${index}`} />
                        </li>
                      ),
                    )}
              </ul>
            </div>
            <label className="italic my-2 text-sm">
              <FontAwesomeIcon icon={faCalendar} size="sm" />
              <span className="ml-2">Todays Hours of Operation</span>
            </label>
            <textarea
              rows={3}
              placeholder="Write Something..."
              className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-lg"
              {...register("message")}
            />
            <div className="flex flex-row">
              <div className="mr-2 w-1/2">
                <label className="italic mt-2 mb-4 text-sm">
                  <FontAwesomeIcon icon={faUsers} size="sm" />
                  <span className="ml-2">Queue Size</span>
                </label>
                <input
                  type="text"
                  placeholder="Write Something..."
                  className="mt-2 mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-full"
                  {...register("queueSize")}
                />
              </div>
              <div className="ml-2 w-1/2">
                <label className="italic my-2 text-sm">
                  <FontAwesomeIcon icon={faClockFour} size="sm" />
                  <span className="ml-2">Wait Time</span>{" "}
                  <span className="hidden md:inline"> - Minutes</span>
                </label>
                <input
                  type="text"
                  placeholder="Write Something..."
                  className="mt-2 mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-full"
                  {...register("waitTime")}
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={() =>
                setShowTelehealthSettingsMenu(!showTelehealthSettingsMenu)
              }
              disabled={!isDirty || isSubmitting || !isValid}
              className={
                !isDirty || isSubmitting || !isValid
                  ? "w-full items-center justify-center rounded-full h-10 text-movet-gray focus:outline-none mr-4"
                  : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-4"
              }
            >
              <FontAwesomeIcon icon={faWrench} size="lg" />
              <span className="ml-2">Save Changes</span>
            </button>
          </form>
        </Transition>
      </menu>
    </>
  );
};

export default TelehealthChatStatus;
