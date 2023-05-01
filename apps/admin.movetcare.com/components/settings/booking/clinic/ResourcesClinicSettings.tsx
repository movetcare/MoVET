import {
  faCheckCircle,
  faCircleDot,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onSnapshot, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { firestore } from "services/firebase";
import Error from "../../../Error";
import { Switch } from "@headlessui/react";
import { classNames } from "utilities";

export const ResourcesClinicSettings = () => {
  const [resources, setResources] = useState<any>(null);
  const [activeResources, setActiveResources] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "configuration", "bookings"),
      (doc: any) => setActiveResources(doc.data()?.clinicActiveResources),
      (error: any) => {
        setError(error?.message || error);
      }
    );
    return () => unsubscribe();
  }, []);

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
      }
    );
    return () => unsubscribe();
  }, []);

  const saveChanges = async (id: number) => {
    const resources = activeResources;
    const removeIndex = resources.indexOf(id);
    if (removeIndex > -1) resources.splice(removeIndex, 1);
    else resources.push(id);
    console.log("RESOURCES", resources);
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        clinicActiveResources: resources,
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast("Updated Clinic Resources", {
          position: "top-center",
          icon: (
            <FontAwesomeIcon
              icon={faCheckCircle}
              size="sm"
              className="text-movet-green"
            />
          ),
        })
      )
      .catch((error: any) =>
        toast(`Clinic Resources Update FAILED: ${error?.message}`, {
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
        <p className="mt-6 mb-3 text-center italic text-sm">
          Active Resource Schedules
        </p>
      </div>
      {resources &&
        resources.map((resource: any, index: number) => {
          let isActive = false;
          activeResources.map((activeResource: number) => {
            if (activeResource === resource.id) isActive = true;
          });
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
                onChange={async () => saveChanges(resource.id)}
                className={classNames(
                  isActive ? "bg-movet-green" : "bg-movet-gray",
                  "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-gray"
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    isActive ? "translate-x-5" : "translate-x-0",
                    "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                  )}
                />
              </Switch>
            </Switch.Group>
          );
        })}
    </li>
  );
};
