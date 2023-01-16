import {
  faCircleCheck,
  faCircleExclamation,
  faSnowman,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Error from "components/Error";
import { useEffect, useState } from "react";
import { auth, firestore } from "services/firebase";
import { Loader } from "ui";
import { Switch } from "@headlessui/react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "utils/classNames";
import toast from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import DateInput from "./inputs/DateInput";
import TextInput from "./inputs/TextInput";

export const WinterModeControls = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [settings, loading, error] = useDocument(
    doc(firestore, "configuration/bookings")
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
      startDate: null,
      endDate: null,
      message: null,
      isActiveOnWebsite: false,
      isActiveOnMobileApp: false,
      isActiveOnWebApp: false,
      enableForNewPatientsOnly: true,
    },
  });
  const isActiveOnWebsite = watch("isActiveOnWebsite");
  const isActiveOnMobileApp = watch("isActiveOnMobileApp");
  const isActiveOnWebApp = watch("isActiveOnWebApp");
  const enableForNewPatientsOnly = watch("enableForNewPatientsOnly");
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

  useEffect(() => {
    if (settings && settings.data())
      reset({
        ...settings.data()?.winterHousecallMode,
        startDate: settings.data()?.winterHousecallMode?.startDate?.toDate(),
        endDate: settings.data()?.winterHousecallMode?.endDate?.toDate(),
      });
  }, [settings, reset]);

  const onSubmit = async (data: any) =>
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        winterHousecallMode: data,
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(`Your updates will appear in 5 minutes (or less).`, {
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
        toast(`Winter Housecall Mode Update FAILED: ${error?.message}`, {
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

  return isAdmin ? (
    <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
      <div className="flex flex-row items-center justify-center -mb-4">
        <FontAwesomeIcon
          icon={faSnowman}
          className={"text-movet-blue"}
          size="lg"
        />
        <h1 className="ml-2 my-4 text-lg cursor-pointer">
          {loading ? "Loading..." : "Winter Housecall Mode"}
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
                  <div className="flex flex-row justify-between items-center w-full mx-auto py-2">
                    <div className="flex flex-col mr-2 sm:mr-0 sm:flex-row justify-between items-center">
                      <span className="font-extrabold">Start Date:</span>{" "}
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
                    <span className="font-extrabold sm:mr-2">Message:</span>{" "}
                    <TextInput
                      required
                      name="message"
                      label=""
                      placeholder=""
                      type="text"
                      errors={errors}
                      disabled={loading}
                      control={control}
                      multiline
                      numberOfLines={3}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center w-full mx-auto py-2">
                    <span className="font-extrabold">Website:</span>{" "}
                    <Controller
                      name="isActiveOnWebsite"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }: any) => (
                        <Switch
                          checked={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          className={classNames(
                            isActiveOnWebsite
                              ? "bg-movet-green"
                              : "bg-movet-red",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              isActiveOnWebsite
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
                    <span className="font-extrabold">Web App:</span>{" "}
                    <Controller
                      name="isActiveOnWebApp"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }: any) => (
                        <Switch
                          checked={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          className={classNames(
                            isActiveOnWebApp
                              ? "bg-movet-green"
                              : "bg-movet-red",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              isActiveOnWebApp
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
                    <span className="font-extrabold">Mobile App:</span>{" "}
                    <Controller
                      name="isActiveOnMobileApp"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }: any) => (
                        <Switch
                          checked={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          className={classNames(
                            isActiveOnMobileApp
                              ? "bg-movet-green"
                              : "bg-movet-red",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              isActiveOnMobileApp
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
                    <span className="font-extrabold">New Patients Only:</span>{" "}
                    <Controller
                      name="enableForNewPatientsOnly"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }: any) => (
                        <Switch
                          checked={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          className={classNames(
                            enableForNewPatientsOnly
                              ? "bg-movet-green"
                              : "bg-movet-red",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              enableForNewPatientsOnly
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
                    <FontAwesomeIcon icon={faWrench} size="lg" />
                    <span className="ml-2">Save</span>
                  </button>
                </form>
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
