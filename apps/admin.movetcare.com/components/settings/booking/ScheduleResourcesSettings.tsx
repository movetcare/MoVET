import {
  faCheck,
  faCheckCircle,
  faCircleDot,
  faCircleExclamation,
  faEdit,
  faRedo,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onSnapshot, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { firestore, functions } from "services/firebase";
import Error from "../../Error";
import { Switch, Transition } from "@headlessui/react";
import { classNames } from "utilities";
import { Button } from "ui";
import { NumericFormat } from "react-number-format";
import { httpsCallable } from "firebase/functions";

export const ScheduleResourcesSettings = ({
  schedule,
}: {
  schedule: "clinic" | "housecall" | "virtual";
}) => {
  const [resources, setResources] = useState<any>(null);
  const [activeResources, setActiveResources] = useState<any>(null);
  const [activeResourcesStaggerTimes, setActiveResourcesStaggerTimes] =
    useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [showToggles, setShowToggles] = useState<boolean>(false);
  const [didTouchStaggerTime, setDidTouchStaggerTime] =
    useState<boolean>(false);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => {
        setActiveResources(
          schedule === "clinic"
            ? doc.data()?.clinicActiveResources
            : schedule === "housecall"
            ? doc.data()?.housecallActiveResources
            : doc.data()?.virtualActiveResources,
        );
        setActiveResourcesStaggerTimes(
          schedule === "clinic"
            ? doc.data()?.clinicActiveResources
            : schedule === "housecall"
            ? doc.data()?.housecallActiveResources
            : doc.data()?.virtualActiveResources,
        );
      },
      (error: any) => {
        setError(error?.message || error);
      },
    );
    return () => unsubscribe();
  }, [schedule]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "resources"),
      (doc: any) => {
        const resources: any = [];
        doc.data()?.resources.map((resource: any) => {
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

  const saveStaggerChanges = async () =>
    await setDoc(
      doc(firestore, "configuration/bookings"),
      schedule === "clinic"
        ? {
            clinicActiveResources: activeResourcesStaggerTimes,
            updatedOn: serverTimestamp(),
          }
        : schedule === "housecall"
        ? {
            housecallActiveResources: activeResourcesStaggerTimes,
            updatedOn: serverTimestamp(),
          }
        : {
            virtualActiveResources: activeResourcesStaggerTimes,
            updatedOn: serverTimestamp(),
          },
      { merge: true },
    )
      .then(() =>
        toast(`Updated ${schedule?.toUpperCase()} Resources`, {
          position: "top-center",
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
        toast(
          `${schedule?.toUpperCase()} Resources Update FAILED: ${error?.message}`,
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
        ),
      )
      .finally(() => setDidTouchStaggerTime(false));
  const updateActiveResources = async (id: number) => {
    const resources = activeResources;
    let removeIndex = null;
    resources.map(
      (resource: { id: number; staggerTime: number }, index: number) => {
        if (resource.id === id) removeIndex = index;
      },
    );
    if (removeIndex !== null && removeIndex > -1)
      resources.splice(removeIndex, 1);
    else resources.push({ id, staggerTime: 0 });

    await setDoc(
      doc(firestore, "configuration/bookings"),
      schedule === "clinic"
        ? {
            clinicActiveResources: resources,
            updatedOn: serverTimestamp(),
          }
        : schedule === "housecall"
        ? {
            housecallActiveResources: resources,
            updatedOn: serverTimestamp(),
          }
        : {
            virtualActiveResources: resources,
            updatedOn: serverTimestamp(),
          },
      { merge: true },
    )
      .then(() =>
        toast(`Updated ${schedule?.toUpperCase()} Resources`, {
          position: "top-center",
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
        toast(
          `${schedule?.toUpperCase()} Resources Update FAILED: ${error?.message}`,
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
        ),
      );
  };
  return error ? (
    <Error error={error} />
  ) : (
    <li className="py-4 flex-col sm:flex-row items-center justify-center">
      <div className="flex flex-col mr-4">
        <h3>
          Concurrent Schedules -{" "}
          <span className="font-extrabold text-lg">
            {activeResources && activeResources.length}
          </span>
        </h3>
        <p className="text-sm">
          This controls how many concurrent appointments can be booked at the
          same time. The number of resources selected is the number of
          concurrent appointments that can be booked.
        </p>
        <p className="mt-6 mb-3 text-center italic">
          Active Resource Schedules
        </p>
        <ul className="text-center mb-6 text-sm flex flex-row justify-center w-full mx-auto">
          {resources &&
            activeResources &&
            activeResourcesStaggerTimes &&
            resources.map((resource: any) =>
              activeResources.map(
                (
                  activeResource: { id: number; staggerTime: number },
                  index: number,
                ) => {
                  if (activeResource?.id === resource.id)
                    return (
                      <li className="my-4 text-xs px-4" key={index}>
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
                      </li>
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
        <Button
          text="Edit Active Resources"
          color="black"
          onClick={() => setShowToggles(!showToggles)}
          icon={faEdit}
          className="mb-4"
        />
      </div>
      <Transition
        show={showToggles}
        enter="transition ease-in duration-500"
        leave="transition ease-out duration-64"
        leaveTo="opacity-10"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
      >
        <>
          <hr className="my-8" />
          <p className="text-center text-lg font-extrabold">
            Schedule Resources{" "}
            <FontAwesomeIcon
              icon={faRedo}
              className="text-sm ml-2"
              onClick={() => refreshResources()}
            />
          </p>
          {resources &&
            resources.map((resource: any, index: number) => {
              let isActive = false;
              activeResources.map(
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
      </Transition>
    </li>
  );
};
