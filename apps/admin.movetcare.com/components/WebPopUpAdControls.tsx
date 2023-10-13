import {
  faBell,
  faBoxOpen,
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
  faMessage,
  faStar,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Error from "components/Error";
import { useEffect, useState } from "react";
import { auth, firestore } from "services/firebase";
import { Loader } from "ui";
import { Transition, Switch } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "utils/classNames";
import toast from "react-hot-toast";
import SelectInput from "./inputs/SelectInput";
import { onAuthStateChanged } from "firebase/auth";
import { useDocument } from "react-firebase-hooks/firestore";

export const WebPopUpAdControls = () => {
  const [announcement, loading, error] = useDocument(
    doc(firestore, "alerts/pop_up_ad"),
  );
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
      description: null,
      link: null,
      isActive: false,
      autoOpen: false,
      urlRedirect: null,
      ignoreUrlPaths: null,
      imagePath: null,
      height: null,
      width: null,
    } as any,
  });
  const isActive = watch("isActive");
  const autoOpen = watch("autoOpen");
  const icon = watch("icon");
  const color = watch("color");

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
        ...announcement.data(),
        color: announcement.data()?.color
          ? {
              name:
                announcement.data()?.color === "#DAAA00"
                  ? "Yellow"
                  : announcement.data()?.color === "#2C3C72"
                  ? "Blue"
                  : announcement.data()?.color === "#E76159"
                  ? "Red"
                  : announcement.data()?.color === "#232127"
                  ? "Black"
                  : announcement.data()?.color === "#00A36C"
                  ? "Green"
                  : announcement.data()?.color === "#A15643"
                  ? "Brown"
                  : "Black",
              id: announcement.data()?.color,
            }
          : { name: "Blue", id: "#2C3C72" },
        icon: announcement.data()?.icon
          ? {
              name:
                announcement.data()?.icon === "bullhorn"
                  ? "Bullhorn"
                  : announcement.data()?.icon === "exclamation-circle"
                  ? "Exclamation"
                  : announcement.data()?.icon === "bell"
                  ? "Bell"
                  : announcement.data()?.icon === "star"
                  ? "Star"
                  : announcement.data()?.icon === "info-circle"
                  ? "Info"
                  : "Bullhorn",
              id: announcement.data()?.icon,
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

  const onSubmit = async (data: any) =>
    await setDoc(
      doc(firestore, "alerts/pop_up_ad"),
      {
        ...data,
        ignoreUrlPath: data.link,
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
        toast(`Pop Up Ad update FAILED: ${error?.message}`, {
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
        data-tip="Click to Preview Pop Up Ad"
        data-for="preview-pop-up-ad"
      >
        <FontAwesomeIcon
          icon={selectedIcon}
          className={colorClasses}
          size="lg"
        />
        <h1 className="ml-2 my-4 text-lg cursor-pointer">
          {loading ? "Loading..." : "Web Pop Up Ad"}
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
          <li data-tip="Click to Edit Pop Up Ad" data-for="edit-pop-up-ad">
            <div
              className={
                "flex flex-col items-center px-4 py-4 sm:px-6 group mx-auto max-w-xl"
              }
            >
              <div className="min-w-0 flex-col w-full justify-center">
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
                      </div>
                      {isActive && (
                        <section>
                          <div className="flex flex-row">
                            <div className="mr-2 w-1/2">
                              <label className="italic mt-2 mb-4 text-sm">
                                {icon && (
                                  <FontAwesomeIcon
                                    icon={selectedIcon}
                                    size="sm"
                                  />
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
                                    "ml-2 text-movet-black",
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
                            <span className="ml-2">SEO Title</span>
                          </label>
                          <textarea
                            min={4}
                            placeholder="Write Something..."
                            className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-lg"
                            {...register("title")}
                          />
                          <label className="italic my-2 text-sm">
                            <FontAwesomeIcon icon={faMessage} size="sm" />
                            <span className="ml-2">SEO Description</span>
                          </label>
                          <textarea
                            min={4}
                            placeholder="Write Something..."
                            className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-lg"
                            {...register("description")}
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
                          <label className="italic my-2 text-sm">
                            <FontAwesomeIcon icon={faLink} size="sm" />
                            <span className="ml-2">Image Path</span>
                          </label>
                          <input
                            type="text"
                            placeholder="/path-to-image.jpg"
                            className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-full"
                            {...register("imagePath")}
                          />
                          <p className="text-xs italic text-movet-black/75 text-center">
                            * NOTE - A Developer MUST manually upload all Pop Up
                            Ad images to movetcare.com/public/ before they can
                            be used here
                          </p>
                          <div className="flex flex-row w-full justify-center items-center pt-4 mb-4 -mt-2">
                            <label className="italic my-2 text-sm">
                              <span className="mr-2">Image Height</span>
                            </label>
                            <input
                              type="number"
                              placeholder="400"
                              className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-full"
                              {...register("height")}
                            />
                            <label className="italic my-2 text-sm ml-2">
                              <span className="mr-2">Image Width</span>
                            </label>
                            <input
                              type="number"
                              placeholder="400"
                              className="mb-4 w-full border-movet-gray focus:border-movet-gray focus:ring-0 focus:placeholder-movet-gray text-movet-black placeholder-movet-black placeholder:opacity-50 bg-white rounded-full"
                              {...register("width")}
                            />
                          </div>
                          <div className="flex flex-row w-full justify-center items-center pt-4 mb-4 -mt-2">
                            <label className="italic mt-2 mb-2 text-sm mx-2">
                              <FontAwesomeIcon
                                icon={faBoxOpen}
                                size="sm"
                                className={`${
                                  autoOpen
                                    ? " text-movet-green"
                                    : " text-movet-red"
                                }`}
                              />
                              <span className="ml-2">
                                Auto Open:{" "}
                                <span
                                  className={`italic${
                                    autoOpen
                                      ? "text-movet-green"
                                      : " text-movet-red"
                                  }`}
                                >
                                  {autoOpen ? "YES" : "NO"}
                                </span>
                              </span>
                            </label>
                            <Controller
                              name="autoOpen"
                              control={control}
                              render={({
                                field: { onChange, onBlur, value },
                              }: any) => (
                                <Switch
                                  checked={value}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  className={classNames(
                                    autoOpen
                                      ? "bg-movet-green"
                                      : "bg-movet-red",
                                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      autoOpen
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                      "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                                    )}
                                  />
                                </Switch>
                              )}
                            />
                          </div>
                        </section>
                      )}
                      <div className="flex flex-row mt-4">
                        <button
                          type="submit"
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
