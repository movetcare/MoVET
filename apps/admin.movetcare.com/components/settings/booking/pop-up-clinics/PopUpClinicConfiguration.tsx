import {
  faCircleExclamation,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@headlessui/react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { firestore } from "services/firebase";
import { Modal } from "ui";
import { classNames } from "utilities";
import { Tooltip } from "react-tooltip";
import { PopUpClinicResources } from "./PopUpClinicResources";
import PopUpClinicReasons from "./PopUpClinicReasons";
import { PopUpClinicSameDay } from "./PopUpClinicSameDay";
import { PopUpClinicBuffer } from "./PopUpClinicBuffer";
import { PopUpClinicMultiPatient } from "./PopUpClinicMultiPatient";
import { PopUpClinicDescription } from "./PopUpClinicDescription";
import kebabCase from "lodash.kebabcase";
import PopUpClinicSchedule from "./PopUpClinicSchedule";

export const PopUpClinicConfiguration = ({
  configuration,
  popUpClinics,
}: {
  configuration: {
    name: string;
    description: string;
    id: string;
    isActive: boolean;
    vcprRequiredReason: string;
    noVcprRequiredReason: string;
    standardAppointmentBuffer: number;
    appointmentBufferTime: boolean;
    sameDayAppointmentVcprRequired: boolean;
    sameDayAppointmentLeadTime: number;
    onePatientDuration: number;
    twoPatientDuration: number;
    threePatientDuration: number;
    scheduleType: "ONCE" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";
    schedule: {
      openMonday: boolean;
      openMondayTime: number;
      closedMondayTime: number;
      openTuesday: boolean;
      openTuesdayTime: number;
      closedTuesdayTime: number;
      openWednesday: boolean;
      openWednesdayTime: number;
      closedWednesdayTime: number;
      openThursday: boolean;
      openThursdayTime: number;
      closedThursdayTime: number;
      openFriday: boolean;
      openFridayTime: number;
      closedFridayTime: number;
      openSaturday: boolean;
      openSaturdayTime: number;
      closedSaturdayTime: number;
      openSunday: boolean;
      openSundayTime: number;
      closedSundayTime: number;
    };
    resourceConfiguration?:
      | Array<{
          id: string;
          staggerTime: number;
        }>
      | undefined;
  };
  popUpClinics: any;
}) => {
  const { name, description, id, resourceConfiguration, isActive } =
    configuration || {};
  const [isPopUpActive, setIsPopUpActive] = useState<boolean>(!!isActive);

  const [popUpToDelete, setPopUpToDelete] = useState<any>(null);
  const [showDeletePopUpModal, setShowDeletePopUpModal] =
    useState<boolean>(false);
  const cancelButtonRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [showConfigurationOptions, setShowConfigurationOptions] =
    useState<boolean>(false);

  useEffect(() => {
    if (resourceConfiguration === undefined) {
      if (isConfigured === null) setShowConfigurationOptions(true);
      setIsConfigured(false);
    } else setIsConfigured(true);
  }, [resourceConfiguration, isConfigured]);

  const deletePopUpClinic = async (id: string) =>
    await setDoc(
      doc(firestore, "configuration/pop_up_clinics"),
      {
        popUpClinics: popUpClinics.filter((clinic: any) => {
          if (clinic.id != id) return clinic;
        }),
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() =>
        toast(`POP-UP CLINIC #${id} HAS BEEN DELETED!`, {
          position: "top-center",
          duration: 5000,
          icon: (
            <FontAwesomeIcon
              icon={faTrash}
              size="lg"
              className="text-movet-red"
            />
          ),
        }),
      )
      .catch((error: any) =>
        toast(error?.message, {
          position: "top-center",
          duration: 5000,
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-movet-red"
            />
          ),
        }),
      )
      .finally(() => setShowDeletePopUpModal(false));

  const updateActiveStatus = async () => {
    const newPopUpClinics = popUpClinics.map((clinic: any) => {
      if (clinic.id === configuration?.id)
        return { ...clinic, isActive: !isPopUpActive };
      else return clinic;
    });

    setIsPopUpActive(!isPopUpActive);
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
          `"${name}" Pop-Up Clinic is now ${!isPopUpActive ? "ACTIVE" : "INACTIVE"}!`,
          {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                className={`${!isPopUpActive ? "text-movet-green" : "text-movet-red"}`}
              />
            ),
          },
        ),
      )
      .catch((error: any) =>
        toast(error?.message, {
          position: "top-center",
          duration: 5000,
          icon: (
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-movet-red"
            />
          ),
        }),
      );
  };

  return (
    <div key={id}>
      <hr className="text-movet-gray" />
      <div
        className={`flex flex-row items-center w-full${isConfigured ? " cursor-pointer hover:bg-movet-white" : " opacity-50"}${showConfigurationOptions ? " bg-movet-white" : ""}`}
      >
        <Switch.Group
          as="div"
          className="flex items-center justify-between px-6 sm:px-8 w-full"
          onClick={() => {
            if (isConfigured)
              setShowConfigurationOptions(!showConfigurationOptions);
          }}
        >
          <div className="flex flex-col">
            <Switch.Label
              as="h3"
              className={`text-2xl mt-6 leading-6 font-medium ${isActive ? " text-movet-green" : "text-movet-red"}`}
              passive
            >
              <span>
                {name?.toUpperCase()}
                {!isConfigured && (
                  <>
                    <span> - </span>
                    <span className="text-lg italic text-movet-red font-extrabold">
                      CONFIGURATION REQUIRED!
                    </span>
                  </>
                )}
              </span>
              {isActive && (
                <p className="text-xs text-movet-black/70 italic mt-2">
                  <b>
                    <a
                      href={`https://app.movetcare.com/book-an-appointment/${kebabCase(name)}`}
                      target="_blank"
                      className="hover:text-movet-red hover:underline"
                    >
                      https://app.movetcare.com/book-an-appointment/
                      {kebabCase(name)}
                    </a>
                  </b>
                </p>
              )}
              <p className="text-sm text-movet-black mt-1 mb-3">
                {description}
              </p>
            </Switch.Label>
          </div>
          <div className="flex flex-row justify-right items-center">
            <Switch
              checked={isActive}
              disabled={!isConfigured}
              onChange={() => updateActiveStatus()}
              className={classNames(
                isActive ? "bg-movet-green" : "bg-movet-gray",
                "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-gray",
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
            <Tooltip id="editPopUpClinic" />
            <div
              onClick={() => {
                setShowConfigurationOptions(!showConfigurationOptions);
              }}
              data-tooltip-id="editPopUpClinic"
              data-tooltip-content="Edit Pop-Up Clinic Configuration"
              className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red ml-4"
            >
              <FontAwesomeIcon icon={faEdit} />
            </div>
          </div>
        </Switch.Group>
        <Tooltip id="deletePopUp" />
        <div
          onClick={() => {
            setShowDeletePopUpModal(true);
            setPopUpToDelete(configuration);
          }}
          data-tooltip-id="deletePopUp"
          data-tooltip-content="Delete Pop-Up Clinic"
          className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red -ml-4 mr-4"
        >
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
      {(!isConfigured || showConfigurationOptions) && (
        <>
          <hr className="text-movet-gray" />
          <PopUpClinicDescription
            configuration={configuration}
            popUpClinics={popUpClinics}
          />
          <PopUpClinicSchedule
            configuration={configuration as any}
            popUpClinics={popUpClinics}
          />
          <PopUpClinicReasons
            configuration={configuration}
            popUpClinics={popUpClinics}
          />
          <PopUpClinicBuffer
            configuration={configuration}
            popUpClinics={popUpClinics}
          />
          <PopUpClinicSameDay
            configuration={configuration}
            popUpClinics={popUpClinics}
          />
          <PopUpClinicMultiPatient
            configuration={configuration}
            popUpClinics={popUpClinics}
          />
          <PopUpClinicResources
            configuration={configuration}
            popUpClinics={popUpClinics}
          />
        </>
      )}
      <Modal
        showModal={showDeletePopUpModal}
        setShowModal={setShowDeletePopUpModal}
        cancelButtonRef={cancelButtonRef}
        loadingMessage="Deleting POP-UP CLINIC, Please Wait..."
        content={
          <p className="text-lg">
            Are you sure you want to delete the &quot;
            {popUpToDelete?.name}&quot; Pop-Up Clinic?{" "}
            <span className="text-lg italic font-bold">
              This action cannot be undone!
            </span>
          </p>
        }
        icon={faTrash}
        action={() => deletePopUpClinic(popUpToDelete?.id)}
        yesButtonText="YES"
        noButtonText="CANCEL"
      />
    </div>
  );
};
