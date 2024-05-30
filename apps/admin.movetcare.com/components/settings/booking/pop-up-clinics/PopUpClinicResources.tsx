import {
  faCheck,
  faRedo,
  faCircleDot,
  faCheckCircle,
  faCircleExclamation,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition, Switch } from "@headlessui/react";
import { setDoc, doc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import { functions, firestore } from "services/firebase";
import { Button } from "ui";
import { classNames } from "utilities";
import Error from "../../../Error";
import type { ClinicConfig } from "types";

export const PopUpClinicResources = ({
  configuration,
  popUpClinics,
}: {
  configuration: ClinicConfig;
  popUpClinics: any;
}) => {
  const [resources, setResources] = useState<any>(null);
  const [activeResources, setActiveResources] = useState<any>(
    configuration?.resourceConfiguration || null,
  );
  const [didTouchStaggerTime, setDidTouchStaggerTime] =
    useState<boolean>(false);
  const [activeResourcesStaggerTimes, setActiveResourcesStaggerTimes] =
    useState<any>(configuration?.resourceConfiguration || null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "resources"),
      (doc: any) => {
        const resources: any = [];
        doc.data()?.resources?.map((resource: any) => {
          if (resource.isActive) resources.push(resource);
        });
        setResources(resources);
      },
      (error: any) => {
        setError(error?.message || error);
      },
    );
    return () => unsubscribe();
  }, []);

  const refreshResources = async () => {
    toast("Re-Syncing All ProVet Resources...", {
      duration: 1500,
      icon: (
        <FontAwesomeIcon
          icon={faSpinner}
          size="sm"
          className="text-movet-gray"
          spin
        />
      ),
    });
    await httpsCallable(functions, "resyncProVetResources")()
      .then(() =>
        toast("Finished Re-Syncing All ProVet Resources", {
          icon: (
            <FontAwesomeIcon
              icon={faCheckCircle}
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
  };

  const saveStaggerChanges = async () => {
    const resources = activeResources || [];
    const newPopUpClinics = popUpClinics.map((clinic: any) => {
      if (clinic.id === configuration?.id)
        return { ...clinic, resourceConfiguration: resources };
      else return clinic;
    });
    setActiveResources(resources);
    setActiveResourcesStaggerTimes(resources);
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
          `"${configuration?.name}" Pop-Up Clinic Resource has been updated. Please allow ~5 minutes for changes to be reflected.`,
          {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                className="text-movet-green"
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
      .finally(() => setDidTouchStaggerTime(false));
  };

  const updateActiveResources = async (id: number) => {
    const resources = activeResources || [];
    let removeIndex = null;
    resources?.map(
      (resource: { id: number; staggerTime: number }, index: number) => {
        if (resource.id === id) removeIndex = index;
      },
    );
    if (removeIndex !== null && removeIndex > -1)
      resources.splice(removeIndex, 1);
    else resources.push({ id, staggerTime: 0 });
    const newPopUpClinics = popUpClinics.map((clinic: any) => {
      if (clinic.id === configuration?.id)
        return { ...clinic, resourceConfiguration: resources };
      else return clinic;
    });
    setActiveResources(resources);
    setActiveResourcesStaggerTimes(resources);
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
          `"${configuration.name}" Pop-Up Clinic Resource has been updated. Please allow ~5 minutes for changes to be reflected.`,
          {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                className="text-movet-green"
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
  return error ? (
    <Error error={error} />
  ) : (
    <div className="flex-col justify-center items-center mx-4 w-full mt-4 px-6">
      <div className="flex flex-col mr-4">
        <span className="sm:mr-2">
          Assigned Resources <span className="text-sm text-movet-red">*</span> -{" "}
          <span className="text-sm">
            {activeResources && activeResources?.length}
          </span>
        </span>
        <p className="text-sm">
          This assigns resources in ProVet to control how many concurrent
          appointments can be booked at the same time. The number of resources
          selected is the number of concurrent appointments that can be booked.
        </p>
        <ul className="text-center mb-3 text-sm flex flex-row justify-center w-full mx-auto">
          {resources &&
            activeResources &&
            activeResourcesStaggerTimes &&
            resources?.map((resource: any) =>
              activeResources?.map(
                (
                  activeResource: { id: number; staggerTime: number },
                  index: number,
                ) => {
                  if (activeResource?.id === resource.id)
                    return (
                      <div className="my-4 text-xs px-4" key={index}>
                        <p className="text-sm">{resource.name}</p>
                        <p className="text-center my-2">Stagger Time</p>
                        <NumericFormat
                          isAllowed={(values: any) => {
                            const { value } = values;
                            return value < 120;
                          }}
                          allowLeadingZeros={false}
                          allowNegative={false}
                          name={`stagger-time-${index}`}
                          type="text"
                          valueIsNumericString
                          value={activeResourcesStaggerTimes[index].staggerTime}
                          onBlur={() => setDidTouchStaggerTime(true)}
                          onValueChange={(target: any) => {
                            const newStaggerTimes = activeResourcesStaggerTimes;
                            newStaggerTimes[index] = {
                              staggerTime: Number(target.value),
                              id: resource.id,
                            };
                            setActiveResourcesStaggerTimes(newStaggerTimes);
                          }}
                          className={
                            "focus:ring-movet-brown focus:border-movet-brown py-3 px-4 block w-full rounded-lg placeholder-movet-gray font-abside-smooth sm:w-14 mx-auto"
                          }
                        />
                        <p className="text-center mt-2 italic text-xs">
                          (Minutes)
                        </p>
                      </div>
                    );
                },
              ),
            )}
        </ul>
        <Transition
          show={didTouchStaggerTime}
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
            onClick={() => saveStaggerChanges()}
            className="mb-8"
          />
        </Transition>
      </div>
      <>
        <hr className="mb-8 text-movet-gray" />
        <p className="text-center text-lg font-extrabold">
          Schedule Resources{" "}
          <FontAwesomeIcon
            icon={faRedo}
            className="text-sm ml-2"
            onClick={() => refreshResources()}
          />
        </p>
        {resources &&
          resources?.map((resource: any, index: number) => {
            let isActive = false;
            activeResources?.map(
              (activeResource: { id: number; staggerTime: number }) => {
                if (activeResource?.id === resource.id) isActive = true;
              },
            );
            return (
              <Switch.Group
                key={index}
                as="div"
                className="py-2 flex items-center justify-between px-6 sm:px-8"
              >
                <div className="flex flex-col">
                  {resource?.name && (
                    <Switch.Label
                      as="h3"
                      className="text-xs font-medium text-movet-black italic"
                      passive
                    >
                      <FontAwesomeIcon
                        icon={faCircleDot}
                        size="2xs"
                        className={`${
                          isActive ? "text-movet-green" : "text-movet-red"
                        } mr-4`}
                      />
                      {resource?.name}
                    </Switch.Label>
                  )}
                </div>
                <Switch
                  checked={isActive}
                  onChange={async () => updateActiveResources(resource.id)}
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
              </Switch.Group>
            );
          })}
      </>
      <hr className="mt-8 text-movet-gray" />
    </div>
  );
};
