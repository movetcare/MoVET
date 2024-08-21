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
import { classNames, environment } from "utilities";
import { Tooltip } from "react-tooltip";
import { PopUpClinicResources } from "./PopUpClinicResources";
import PopUpClinicReasons from "./PopUpClinicReasons";
import { PopUpClinicSameDay } from "./PopUpClinicSameDay";
import { PopUpClinicBuffer } from "./PopUpClinicBuffer";
import { PopUpClinicMultiPatient } from "./PopUpClinicMultiPatient";
import { PopUpClinicDescription } from "./PopUpClinicDescription";
import PopUpClinicSchedule from "./PopUpClinicSchedule";
import type { ClinicConfig } from "types";

export const PopUpClinicConfiguration = ({
  configuration,
  popUpClinics,
}: {
  configuration: ClinicConfig;
  popUpClinics: any;
}) => {
  const {
    name,
    description,
    id,
    resourceConfiguration,
    isActive,
    appointmentDuration,
    appointmentBufferTime,
    reason,
    vcprRequired,
    schedule,
    scheduleType,
    isTestClinic,
  } = configuration || {};
  const [isPopUpActive, setIsPopUpActive] = useState<boolean>(!!isActive);
  const [popUpToDelete, setPopUpToDelete] = useState<any>(null);
  const [showDeletePopUpModal, setShowDeletePopUpModal] =
    useState<boolean>(false);
  const cancelButtonRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [showConfigurationOptions, setShowConfigurationOptions] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      name === undefined ||
      description === undefined ||
      id === undefined ||
      reason === undefined ||
      resourceConfiguration === undefined ||
      appointmentDuration === undefined ||
      appointmentBufferTime === undefined ||
      vcprRequired === undefined ||
      schedule === undefined ||
      scheduleType === undefined
    ) {
      if (isConfigured === null) setShowConfigurationOptions(true);
      setIsConfigured(false);
    } else setIsConfigured(true);
  }, [
    resourceConfiguration,
    isConfigured,
    appointmentDuration,
    appointmentBufferTime,
    vcprRequired,
    reason,
    schedule,
    scheduleType,
    name,
    description,
    id,
  ]);

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
        toast(
          `POP-UP CLINIC #${id} HAS BEEN DELETED! Please allow ~5 minutes for changes to be reflected.`,
          {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                className="text-movet-red"
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
          `"${name}" Pop-Up Clinic is now ${!isPopUpActive ? "ACTIVE" : "INACTIVE"}! Please allow ~5 minutes for changes to be reflected.`,
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

  const formatTime = (time: string) =>
    time?.toString()?.length === 3 ? `0${time}` : `${time}`;

  return (
    <div key={id}>
      <hr className="text-movet-gray" />
      <div
        className={`flex flex-row items-center w-full${isTestClinic ? " cursor-default" : isConfigured ? " cursor-pointer hover:bg-movet-white" : " opacity-50"}${showConfigurationOptions ? " bg-movet-white" : ""}`}
      >
        <Switch.Group
          as="div"
          className="flex items-center justify-between px-6 sm:px-8 w-full"
          onClick={() => {
            if (isConfigured && isTestClinic !== true)
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
              {isTestClinic && (
                <p className="text-xs text-movet-red italic mt-1">
                  * This clinic is required for automated testing. It can not be
                  disabled or deleted.
                </p>
              )}
              {schedule?.date && schedule?.startTime && schedule?.endTime && (
                <p className="text-sm text-movet-black mt-1">
                  {schedule.date?.toDate()?.toLocaleDateString("en-us", {
                    weekday: "long",
                    year: "2-digit",
                    month: "numeric",
                    day: "numeric",
                  })}{" "}
                  @{" "}
                  <span>
                    {new Date(
                      "1970-01-01T" +
                        formatTime(String(schedule?.startTime)).slice(0, 2) +
                        ":" +
                        formatTime(String(schedule?.startTime)).slice(2) +
                        ":00Z",
                    ).toLocaleTimeString("en-US", {
                      timeZone: "UTC",
                      hour12: true,
                      hour: "numeric",
                      minute: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(
                      "1970-01-01T" +
                        formatTime(String(schedule?.endTime)).slice(0, 2) +
                        ":" +
                        formatTime(String(schedule?.endTime)).slice(2) +
                        ":00Z",
                    ).toLocaleTimeString("en-US", {
                      timeZone: "UTC",
                      hour12: true,
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </span>
                </p>
              )}
              {isActive && (
                <p className="text-xs text-movet-black/70 italic mt-1 mb-2">
                  <b>
                    <a
                      href={`${environment === "development" ? "http://localhost:3001" : "https://app.movetcare.com"}/booking/${id}`}
                      target="_blank"
                      className="hover:text-movet-red hover:underline"
                    >
                      {environment === "development"
                        ? "http://localhost:3001"
                        : "https://app.movetcare.com"}
                      /booking/
                      {id}
                    </a>
                  </b>
                </p>
              )}
              <div
                className="text-sm text-movet-black mt-1 mb-3"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </Switch.Label>
          </div>
          <div className="flex flex-row justify-right items-center">
            <Switch
              checked={isActive || isTestClinic}
              disabled={!isConfigured || isTestClinic}
              onChange={() => updateActiveStatus()}
              className={classNames(
                isTestClinic
                  ? "bg-movet-green/50"
                  : isActive
                    ? "bg-movet-green"
                    : "bg-movet-gray",
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
                if (isTestClinic) console.log("CAN NOT EDIT TEST CLINICS!");
                else setShowConfigurationOptions(!showConfigurationOptions);
              }}
              data-tooltip-id="editPopUpClinic"
              data-tooltip-content="Edit Pop-Up Clinic Configuration"
              className={`cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red ml-4 ${isTestClinic ? "text-movet-gray" : ""}`}
            >
              <FontAwesomeIcon icon={faEdit} />
            </div>
          </div>
        </Switch.Group>
        <Tooltip id="deletePopUp" />
        <div
          onClick={() => {
            if (isTestClinic) console.log("CAN NOT DELETE TEST CLINICS!");
            else {
              setShowDeletePopUpModal(true);
              setPopUpToDelete(configuration);
            }
          }}
          data-tooltip-id="deletePopUp"
          data-tooltip-content="Delete Pop-Up Clinic"
          className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red -ml-4 mr-4"
        >
          <FontAwesomeIcon
            icon={faTrash}
            className={`${isTestClinic ? "text-movet-gray" : ""}`}
          />
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
