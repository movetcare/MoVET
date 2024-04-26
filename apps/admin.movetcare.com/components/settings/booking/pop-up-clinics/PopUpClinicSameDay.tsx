import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch, Transition } from "@headlessui/react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { firestore } from "services/firebase";
import { Button } from "ui";
import { classNames } from "utilities";
import Error from "../../../Error";
import { NumericFormat } from "react-number-format";

export const PopUpClinicSameDay = ({
  configuration,
  popUpClinics,
}: {
  configuration: {
    name: string;
    description: string;
    id: string;
    isActive?: boolean;
    sameDayAppointmentVcprRequired: boolean;
    sameDayAppointmentLeadTime: number;
  };
  popUpClinics: any;
}) => {
  const [vcprRequired, setVcprRequired] = useState<boolean>(
    configuration?.sameDayAppointmentVcprRequired || false,
  );
  const [selectedLeadTime, setSelectedLeadTime] = useState<string | null>(
    String(configuration?.sameDayAppointmentLeadTime) || null,
  );
  const [didTouchLeadTime, setDidTouchOneLeadTime] = useState<boolean>(false);
  const [didTouchVcprRequired, setDidTouchVcprRequired] =
    useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const saveChanges = async () => {
    const newPopUpClinics = popUpClinics.map((clinic: any) => {
      if (clinic.id === configuration?.id)
        return {
          ...clinic,
          sameDayAppointmentVcprRequired: vcprRequired,
          sameDayAppointmentLeadTime: selectedLeadTime,
        };
      else return clinic;
    });
    await setDoc(
      doc(firestore, "configuration/pop_up_clinics"),
      {
        popUpClinics: newPopUpClinics,
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() =>
        toast(
          `"${configuration?.name}" Same Day Appointment Setting Updated"`,
          {
            position: "top-center",
            icon: (
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="sm"
                className="text-movet-green"
              />
            ),
          },
        ),
      )
      .catch((error: any) => {
        toast(
          `"${configuration?.name}" Same Day Appointment Setting Update FAILED: ${error?.message}`,
          {
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faCircleExclamation}
                size="sm"
                className="text-movet-red"
              />
            ),
          },
        );
        setError(error);
      })
      .finally(() => {
        setDidTouchOneLeadTime(false);
        setDidTouchVcprRequired(false);
      });
  };
  return error ? (
    <Error error={error} />
  ) : (
    <>
      <section className="px-10 py-4 flex-col sm:flex-row items-center justify-center">
        <div className="flex flex-col mr-4">
          <h3 className="m-0">Same Day Appointments</h3>
          <p className="text-sm">
            This controls whether new/existing patients can book same day
            appointments and how many minutes past now (AKA &quot;Lead
            Time&quot;) is required.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="flex justify-center items-center my-4">
            <div className="flex flex-col justify-center items-center mx-4">
              <p className="text-center my-2">VCPR Required</p>
              <Switch
                checked={vcprRequired}
                onChange={() => {
                  setVcprRequired(!vcprRequired);
                  setDidTouchVcprRequired(true);
                }}
                className={classNames(
                  vcprRequired ? "bg-movet-green" : "bg-movet-red",
                  "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    vcprRequired ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                  )}
                />
              </Switch>
            </div>
            <div className="flex-col justify-center items-center mx-4">
              <p className="text-center my-2">Lead Time</p>
              <NumericFormat
                isAllowed={(values: any) => {
                  const { value } = values;
                  return value < 181;
                }}
                allowLeadingZeros={false}
                allowNegative={false}
                name={"one-patient-duration"}
                type="text"
                valueIsNumericString
                value={selectedLeadTime}
                onBlur={() => setDidTouchOneLeadTime(true)}
                onValueChange={(target: any) =>
                  setSelectedLeadTime(target.value)
                }
                className={
                  "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14 mx-auto"
                }
              />
              <p className="text-center mt-2 italic text-xs">Minutes</p>
            </div>
          </div>
        </div>
        <Transition
          show={didTouchVcprRequired || didTouchLeadTime}
          enter="transition ease-in duration-500"
          leave="transition ease-out duration-64"
          leaveTo="opacity-10"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
        >
          <Button
            text="SAVE"
            color="red"
            icon={faCheck}
            onClick={() => saveChanges()}
            className="mb-8"
          />
        </Transition>
      </section>
      <hr className="text-movet-gray" />
    </>
  );
};
