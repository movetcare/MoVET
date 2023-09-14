import {
  faArrowRightToBracket,
  faCircleCheck,
  faCircleExclamation,
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

export const RequestAnAppointmentControls = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [settings, loading, error] = useDocument(
    doc(firestore, "configuration/bookings"),
  );
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      requirePaymentMethodToRequestAnAppointment: false,
    } as any,
  });
  const requirePaymentMethodToRequestAnAppointment = watch(
    "requirePaymentMethodToRequestAnAppointment",
  );
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
    console.log(
      "settings.data()",
      settings?.data()?.requirePaymentMethodToRequestAnAppointment,
    );
    if (settings && settings.data())
      reset({
        requirePaymentMethodToRequestAnAppointment:
          settings.data()?.requirePaymentMethodToRequestAnAppointment,
      });
  }, [settings, reset]);

  const onSubmit = async (data: any) =>
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        requirePaymentMethodToRequestAnAppointment:
          data.requirePaymentMethodToRequestAnAppointment,
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() =>
        toast(`Update Successful!`, {
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
        toast(`Payment Method Required Update FAILED: ${error?.message}`, {
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
      <div className="flex flex-row items-center justify-center -mb-4">
        <FontAwesomeIcon
          icon={faArrowRightToBracket}
          className={"text-movet-red"}
          size="lg"
        />
        <h1 className="ml-2 my-4 text-lg cursor-pointer">
          {loading ? "Loading..." : "Request an Appointment Settings"}
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
                    <span className="font-extrabold mb-4">
                      Require a Valid Payment Method:
                    </span>
                    <Controller
                      name="requirePaymentMethodToRequestAnAppointment"
                      control={control}
                      render={({ field: { onChange, onBlur, value } }: any) => (
                        <Switch
                          checked={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          className={classNames(
                            requirePaymentMethodToRequestAnAppointment
                              ? "bg-movet-green"
                              : "bg-movet-red",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              requirePaymentMethodToRequestAnAppointment
                                ? "translate-x-5"
                                : "translate-x-0",
                              "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
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
                      "mt-6",
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
