import {
  faBell,
  faBullhorn,
  faCircleCheck,
  faCircleExclamation,
  faDroplet,
  faExclamationCircle,
  faFlag,
  faHeading,
  faIcons,
  faInfoCircle,
  faLink,
  faMagnifyingGlass,
  faMessage,
  faStar,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Error from "components/Error";
import { useContext, useEffect, useState } from "react";
import { auth, firestore } from "services/firebase";
import { Loader } from "ui";
import { Transition, Switch } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "utils/classNames";
import toast from "react-hot-toast";
import SelectInput from "./inputs/SelectInput";
import {
  AnnouncementBanner,
  AnnouncementBannerPreview,
} from "types/AnnouncementBanner";
import { AnnouncementBannerContext } from "contexts/AnnouncementBannerContext";
import { onAuthStateChanged } from "firebase/auth";

export const AnnouncementBannerControls = () => {
  const {
    announcement,
    setAnnouncementPreview,
    setShowAnnouncementPreview,
    loading,
    error,
  }: any = useContext(AnnouncementBannerContext);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isValid, isSubmitting, isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      color: { name: "Blue", id: "#2C3C72" },
      icon: { name: "Bullhorn", id: "bullhorn" },
      title: null,
      message: null,
      link: null,
      isActive: false,
      isActiveMobile: false,
    } as any,
  });
  const isActiveMobile = watch("isActiveMobile");
  const isActive = watch("isActive");
  const icon = watch("icon");
  const color = watch("color");
  const title = watch("title");
  const message = watch("message");
  const link = watch("link");

  const colorClasses =
    color?.id === "#DAAA00"
      ? "text-movet-yellow"
      : color?.id === "#2C3C72"
      ? "text-movet-dark-blue"
      : color?.id === "#E76159"
      ? "text-movet-red"
      : color?.id === "#232127"
      ? "text-movet-black"
      : color?.id === "#00A36C"
      ? "text-movet-green"
      : color?.id === "#A15643"
      ? "text-movet-brown"
      : "text-movet-black";

  const selectedIcon =
    icon?.id === "bullhorn"
      ? faBullhorn
      : icon?.id === "exclamation-circle"
      ? faExclamationCircle
      : icon?.id === "bell"
      ? faBell
      : icon?.id === "star"
      ? faStar
      : icon?.id === "info-circle"
      ? faInfoCircle
      : faIcons;

  useEffect(() => {
    if (announcement !== null && announcement !== undefined)
      reset({
        ...announcement,
        color: announcement?.color
          ? {
              name:
                announcement?.color === "#DAAA00"
                  ? "Yellow"
                  : announcement?.color === "#2C3C72"
                  ? "Blue"
                  : announcement?.color === "#E76159"
                  ? "Red"
                  : announcement?.color === "#232127"
                  ? "Black"
                  : announcement?.color === "#00A36C"
                  ? "Green"
                  : announcement?.color === "#A15643"
                  ? "Brown"
                  : "Black",
              id: announcement?.color,
            }
          : { name: "Blue", id: "#2C3C72" },
        icon: announcement?.icon
          ? {
              name:
                announcement?.icon === "bullhorn"
                  ? "Bullhorn"
                  : announcement?.icon === "exclamation-circle"
                  ? "Exclamation"
                  : announcement?.icon === "bell"
                  ? "Bell"
                  : announcement?.icon === "star"
                  ? "Star"
                  : announcement?.icon === "info-circle"
                  ? "Info"
                  : "Bullhorn",
              id: announcement?.icon,
            }
          : { name: "Bullhorn", id: "bullhorn" },
      });
  }, [announcement, reset]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const claimsString = (user as any)?.reloadUserInfo?.customAttributes;
        if (claimsString) {
          const claims = JSON.parse(claimsString);
          if (claims?.isSuperAdmin || claims?.isAdmin) setIsAdmin(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: AnnouncementBanner) =>
    await setDoc(
      doc(firestore, "alerts/banner"),
      {
        ...data,
        color: (data.color as any)?.id,
        icon: (data.icon as any)?.id,
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() =>
        toast(`Your updates will appear in ~ 5 minutes.`, {
          duration: 5000,

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
        toast(`Announcement banner update FAILED: ${error?.message}`, {
          duration: 5000,

          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              size="sm"
              className="text-movet-red"
            />
          ),
        }),
      );

  return isAdmin ? (
    <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
      <div
        className="flex flex-row items-center justify-center -mb-4"
        data-tip="Click to Preview Announcement Banner"
        data-for="preview-announcement-banner"
      >
        <FontAwesomeIcon icon={faFlag} className={colorClasses} size="lg" />
        <h1
          className="ml-2 my-4 text-lg cursor-pointer"
          onClick={() => {
            if (!loading) {
              setAnnouncementPreview({
                color: color as any,
                icon: icon as any,
                title,
                message,
                link,
                isActive,
              } as AnnouncementBannerPreview);
              setShowAnnouncementPreview(true);
            }
          }}
        >
          {loading ? "Loading..." : "Announcement Banner"}
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
          className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
        >
          <li
            data-tip="Click to Edit Announcement Banner"
            data-for="edit-announcement-banner"
          >
            <div
              className={
                "flex flex-col items-center px-4 py-4 sm:px-6 group mx-auto max-w-xl"
              }
            >
              <div className="min-w-0 flex-col w-full justify-center">
                {/* <div
                  className="text-center text-sm cursor-pointer -mb-2"
                  // onClick={() =>
                  //   setShowAnnouncementSettingsMenu(
                  //     !showAnnouncementSettingsMenu
                  //   )
                  // }
                >
                  {icon && (
                    <FontAwesomeIcon
                      icon={selectedIcon}
                      className={colorClasses}
                      size="lg"
                    />
                  )}
                  {announcement && announcement?.title && (
                    <p className="font-extrabold text-base mt-2">
                      {announcement?.title}
                    </p>
                  )}
                  {announcement && announcement?.message && (
                    <p className="italic">{announcement?.message}</p>
                  )}
                  <h2 className="text-center text-sm mt-4">
                    <FontAwesomeIcon
                      icon={faEdit}
                      size="xs"
                      className="invisible group-hover:visible"
                    />
                    <span className="ml-2">BANNER IS: </span>
                    <span
                      className={`mr-2 italic${
                        announcement?.isActive
                          ? " text-movet-green"
                          : " text-movet-red"
                      }`}
                    >
                      {announcement?.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <FontAwesomeIcon
                      icon={
                        showAnnouncementSettingsMenu ? faCaretDown : faCaretUp
                      }
                      size="xs"
                      className="invisible group-hover:visible"
                    />
                  </h2>
                </div> */}
                <menu>
                  <Transition
                    show={true}
                    enter="transition ease-in duration-250"
                    leave="transition ease-out duration-250"
                    leaveTo="opacity-10"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leaveFrom="opacity-100"
                  >
                    <form
                      onSubmit={handleSubmit(onSubmit as any)}
                      className="flex flex-col w-full mx-auto px-4 md:px-8"
                    >
                      <div className="flex flex-row w-full justify-center items-center pt-4 mb-4 -mt-2">
                        <label className="italic mt-2 mb-2 text-sm mr-2">
                          <FontAwesomeIcon
                            icon={faFlag}
                            size="sm"
                            className={`${
                              isActive ? " text-movet-green" : " text-movet-red"
                            }`}
                          />
                          <span className="ml-2">
                            Status:{" "}
                            <span
                              className={`italic${
                                isActive
                                  ? "text-movet-green"
                                  : " text-movet-red"
                              }`}
                            >
                              {isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </span>
                        </label>
                        <Controller
                          name="isActive"
                          control={control}
                          render={({
                            field: { onChange, onBlur, value },
                          }: any) => (
                            <Switch
                              checked={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              className={classNames(
                                isActive ? "bg-movet-green" : "bg-movet-red",
                                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  isActive ? "translate-x-5" : "translate-x-0",
                                  "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                                )}
                              />
                            </Switch>
                          )}
                        />
                        <label className="italic mt-2 mb-2 text-sm ml-4">
                          <FontAwesomeIcon
                            icon={faFlag}
                            size="sm"
                            className={`${
                              isActiveMobile
                                ? " text-movet-green"
                                : " text-movet-red"
                            }`}
                          />
                          <span className="mx-2">
                            Show on Mobile:{" "}
                            <span
                              className={`italic${
                                isActive
                                  ? "text-movet-green"
                                  : " text-movet-red"
                              }`}
                            >
                              {isActiveMobile ? "YES" : "NO"}
                            </span>
                          </span>
                        </label>
                        <Controller
                          name="isActiveMobile"
                          control={control}
                          render={({
                            field: { onChange, onBlur, value },
                          }: any) => (
                            <Switch
                              checked={value}
                              onChange={onChange}
                              onBlur={onBlur}
                              className={classNames(
                                isActiveMobile
                                  ? "bg-movet-green"
                                  : "bg-movet-red",
                                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  isActiveMobile
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                                )}
                              />
                            </Switch>
                          )}
                        />
                      </div>
                      <div className="flex flex-row">
                        <div className="mr-2 w-1/2">
                          <label className="italic mt-2 mb-4 text-sm">
                            {icon && (
                              <FontAwesomeIcon icon={selectedIcon} size="sm" />
                            )}
                            <span className="ml-2">Icon</span>
                          </label>
                          {icon && (
                            <SelectInput
                              label=""
                              name="icon"
                              required
                              values={[
                                {
                                  id: "exclamation-circle",
                                  name: "Exclamation",
                                },
                                {
                                  id: "bullhorn",
                                  name: "Bullhorn",
                                },
                                { id: "bell", name: "Bell" },
                                { id: "star", name: "Star" },
                                { id: "info-circle", name: "Info" },
                              ]}
                              errors={errors}
                              control={control}
                            />
                          )}
                        </div>
                        <div className="ml-2 w-1/2 mb-4">
                          <label className="italic my-2 text-sm">
                            <FontAwesomeIcon
                              icon={faDroplet}
                              size="sm"
                              className={colorClasses}
                            />
                            <span
                              className={classNames(
                                "ml-2 text-movet-white",
                                colorClasses,
                              )}
                            >
                              Color
                            </span>
                          </label>
                          {color && (
                            <SelectInput
                              label=""
                              name="color"
                              required
                              values={[
                                { id: "#DAAA00", name: "Yellow" },
                                {
                                  id: "#2C3C72",
                                  name: "Blue",
                                },
                                { id: "#E76159", name: "Red" },
                                { id: "#232127", name: "Black" },
                                { id: "#A15643", name: "Brown" },
                              ]}
                              errors={errors}
                              control={control}
                            />
                          )}
                        </div>
                      </div>
                      <label className="italic my-2 text-sm">
                        <FontAwesomeIcon icon={faHeading} size="sm" />
                        <span className="ml-2">Title</span>
                      </label>
                      <textarea
                        min={4}
                        placeholder="Write Something..."
                        className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-lg"
                        {...register("title")}
                      />
                      <label className="italic my-2 text-sm">
                        <FontAwesomeIcon icon={faMessage} size="sm" />
                        <span className="ml-2">Message</span>
                      </label>
                      <textarea
                        min={4}
                        placeholder="Write Something..."
                        className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-lg"
                        {...register("message")}
                      />
                      <label className="italic my-2 text-sm">
                        <FontAwesomeIcon icon={faLink} size="sm" />
                        <span className="ml-2">Link</span>
                      </label>
                      <input
                        type="text"
                        placeholder="/path-to-page/on-movet-website/"
                        className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-full"
                        {...register("link")}
                      />
                      <div className="flex flex-row mt-4">
                        <button
                          type="button"
                          disabled={!isActive}
                          onClick={() => {
                            setAnnouncementPreview({
                              color: color as any,
                              icon: icon as any,
                              title,
                              message,
                              link,
                              isActive,
                            } as AnnouncementBannerPreview);
                            setShowAnnouncementPreview(true);
                          }}
                          className={
                            !isActive
                              ? "w-full items-center justify-center rounded-full h-10 text-movet-gray focus:outline-none mr-4"
                              : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-4"
                          }
                        >
                          <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                          <span className="ml-2">Preview</span>
                        </button>
                        <button
                          type="submit"
                          onClick={() => {
                            // setShowAnnouncementSettingsMenu(
                            //   !showAnnouncementSettingsMenu
                            // );
                            setAnnouncementPreview({
                              color: color as any,
                              icon: icon as any,
                              title,
                              message,
                              link,
                              isActive,
                            } as AnnouncementBannerPreview);
                            setShowAnnouncementPreview(true);
                          }}
                          disabled={!isDirty || isSubmitting}
                          className={
                            !isDirty || isSubmitting || !isValid
                              ? "w-full items-center justify-center rounded-full h-10 text-movet-gray focus:outline-none mr-4"
                              : "w-full cursor-pointer items-center justify-center rounded-full h-10 transition duration-500 ease-in-out text-movet-black hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none mr-4"
                          }
                        >
                          <FontAwesomeIcon icon={faWrench} size="lg" />
                          <span className="ml-2">Save</span>
                        </button>
                      </div>
                    </form>
                  </Transition>
                </menu>
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  ) : (
    <></>
  );
};
