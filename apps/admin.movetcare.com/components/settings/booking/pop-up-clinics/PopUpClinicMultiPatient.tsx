import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore } from "services/firebase";
import toast from "react-hot-toast";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Button } from "ui";
import { Transition } from "@headlessui/react";
import Error from "../../../Error";

export const PopUpClinicMultiPatient = ({
  configuration,
  popUpClinics,
}: {
  configuration: {
    name: string;
    description: string;
    id: string;
    isActive?: boolean;
    onePatientDuration: number;
    twoPatientDuration: number;
    threePatientDuration: number;
  };
  popUpClinics: any;
}) => {
  const [selectedOnePatientDuration, setSelectedOnePatientDuration] = useState<
    string | null
  >(String(configuration?.onePatientDuration) || null);
  const [didTouchOnePatientDuration, setDidTouchOnePatientDuration] =
    useState<boolean>(false);
  const [selectedTwoPatientDuration, setSelectedTwoPatientDuration] = useState<
    string | null
  >(String(configuration?.twoPatientDuration) || null);
  const [didTouchTwoPatientDuration, setDidTouchTwoPatientDuration] =
    useState<boolean>(false);
  const [selectedThreePatientDuration, setSelectedThreePatientDuration] =
    useState<string | null>(
      String(configuration?.threePatientDuration) || null,
    );
  const [didTouchThreePatientDuration, setDidTouchThreePatientDuration] =
    useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const saveChanges = async () => {
    const newPopUpClinics = popUpClinics.map((clinic: any) => {
      if (clinic.id === configuration?.id)
        return {
          ...clinic,
          onePatientDuration: Number(selectedOnePatientDuration),
          twoPatientDuration: Number(selectedTwoPatientDuration),
          threePatientDuration:Number( selectedThreePatientDuration),
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
          `Updated ${configuration?.name} Multi-Patient Appointment Duration`,
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
          `${configuration?.name} Multi-Patient Appointment Duration Updated FAILED: ${error?.message}`,
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
        setDidTouchOnePatientDuration(false);
        setDidTouchTwoPatientDuration(false);
        setDidTouchThreePatientDuration(false);
      });
  };

  return error ? (
    <Error error={error} />
  ) : (
    <>
      <section className="px-10 py-4 flex-col sm:flex-row items-center justify-center">
        <div className="flex flex-col mr-4">
          <h3>Multi-Patient Appointment Durations</h3>
          <p className="text-sm">
            This controls the duration of appointments depending on the number
            of patients selected.
          </p>
        </div>
        <div className="flex justify-center items-center my-4">
          <div className="flex-col justify-center items-center mx-4">
            <p className="text-center my-2">1 Patient</p>
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
              value={selectedOnePatientDuration}
              onBlur={() => setDidTouchOnePatientDuration(true)}
              onValueChange={(target: any) =>
                setSelectedOnePatientDuration(target.value)
              }
              className={
                "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14"
              }
            />
            <p className="text-center mt-2 italic text-xs">Minutes</p>
          </div>
          <div className="flex-col justify-center items-center mx-4">
            <p className="text-center my-2">2 Patients</p>
            <NumericFormat
              isAllowed={(values: any) => {
                const { value } = values;
                return value < 181;
              }}
              allowLeadingZeros={false}
              allowNegative={false}
              name={"two-patient-duration"}
              type="text"
              valueIsNumericString
              value={selectedTwoPatientDuration}
              onBlur={() => setDidTouchTwoPatientDuration(true)}
              onValueChange={(target: any) =>
                setSelectedTwoPatientDuration(target.value)
              }
              className={
                "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14"
              }
            />
            <p className="text-center mt-2 italic text-xs">Minutes</p>
          </div>
          <div className="flex-col justify-center items-center mx-4">
            <p className="text-center my-2">3 Patients</p>
            <NumericFormat
              isAllowed={(values: any) => {
                const { value } = values;
                return value < 181;
              }}
              allowLeadingZeros={false}
              allowNegative={false}
              name={"three-patient-duration"}
              type="text"
              valueIsNumericString
              value={selectedThreePatientDuration}
              onBlur={() => setDidTouchThreePatientDuration(true)}
              onValueChange={(target: any) =>
                setSelectedThreePatientDuration(target.value)
              }
              className={
                "focus:ring-movet-brown focus:border-movet-brown py-3 px-3.5 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14"
              }
            />
            <p className="text-center mt-2 italic text-xs">Minutes</p>
          </div>
        </div>
        <Transition
          show={
            didTouchOnePatientDuration ||
            didTouchTwoPatientDuration ||
            didTouchThreePatientDuration
          }
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
            className="mb-"
          />
        </Transition>
      </section>
      <hr className="text-movet-gray" />
    </>
  );
};
