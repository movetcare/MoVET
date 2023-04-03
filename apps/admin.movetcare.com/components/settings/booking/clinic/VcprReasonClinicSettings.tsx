import {
  faCheck,
  faCheckCircle,
  faCircleExclamation,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "services/firebase";
import toast from "react-hot-toast";
import { Fragment, useEffect, useState } from "react";
import { Button, Loader } from "ui";
import { Listbox, Transition } from "@headlessui/react";
import Error from "../../../Error";
import { useCollection } from "react-firebase-hooks/firestore";
import { classNames } from "utilities";

const VcprReasonClinicSettings = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [selectedStandardVcprReason, setSelectedStandardVcprReason] =
    useState<string>("Select a Reason...");
  const [didTouchStandardVcprReason, setDidTouchStandardVcprReason] =
    useState<boolean>(false);

  const [reasons, loadingReasons, errorReasons] = useCollection(
    query(collection(firestore, "reasons"), orderBy("name", "asc"))
  );
  useEffect(() => {
    if (reasons) {
      const unsubscribe = onSnapshot(
        doc(firestore, "configuration", "bookings"),
        (doc: any) => {
          reasons.docs.forEach((reason: any) => {
            if (
              reason.data()?.id === doc.data()?.clinicStandardVcprReason?.value
            )
              setSelectedStandardVcprReason(reason.data()?.name);
          });
          setIsLoading(false);
        },
        (error: any) => {
          setError(error?.message || error);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else return;
  }, [reasons]);

  const saveChanges = async () => {
    let reasonId: number | null = null;
    if (reasons)
      reasons.docs.forEach((reason: any) =>
        reason.data()?.name === selectedStandardVcprReason
          ? (reasonId = reason.data()?.id)
          : null
      );
    await setDoc(
      doc(firestore, "configuration/bookings"),
      {
        clinicStandardVcprReason: {
          label: selectedStandardVcprReason,
          value: reasonId,
        },
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() =>
        toast(
          `Standard VCPR Reason for Clinic Updated to "${selectedStandardVcprReason}"`,
          {
            position: "top-center",
            icon: (
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="sm"
                className="text-movet-green"
              />
            ),
          }
        )
      )
      .catch((error: any) =>
        toast(`Standard VCPR Reason Update FAILED: ${error?.message}`, {
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
      )
      .finally(() => {
        setDidTouchStandardVcprReason(false);
      });
  };
  return (
    <>
      {loadingReasons || isLoading ? (
        <Loader />
      ) : errorReasons || error ? (
        <div className="my-4">
          <Error error={errorReasons || error} />
        </div>
      ) : (
        reasons &&
        reasons.docs.length > 0 && (
          <li className="py-4 flex-col sm:flex-row items-center justify-center">
            <div className="flex flex-col mr-4">
              <h3>
                VCPR Reason - <b>Standard</b>
              </h3>
              <p className="text-sm">
                This is the reason assigned to appointments when a 1st time
                client (or existing client with a new pet) books an appointment
                and does not indicate their pet(s) have a minor illness.
              </p>
            </div>
            <Listbox
              value={selectedStandardVcprReason}
              onChange={setSelectedStandardVcprReason}
            >
              {({ open }) => (
                <>
                  <div
                    className={"relative bg-white w-full sm:w-2/3 mx-auto my-4"}
                  >
                    <Listbox.Button
                      className={
                        "border-movet-black focus:outline-none focus:ring-1 focus:ring-movet-brown focus:border-movet-brown relative border w-full bg-white rounded-md pl-3 pr-10 py-2 text-left cursor-default sm:text-sm"
                      }
                    >
                      {selectedStandardVcprReason && (
                        <span
                          className={
                            "text-movet-black block truncate font-abside-smooth text-base h-7 mt-1 ml-1"
                          }
                        >
                          {selectedStandardVcprReason}
                        </span>
                      )}
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        {false && (
                          <FontAwesomeIcon
                            icon={faList}
                            className="h-4 w-4 mr-2"
                            size="sm"
                          />
                        )}
                      </span>
                    </Listbox.Button>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-movet-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {reasons &&
                          reasons.docs.length > 0 &&
                          reasons.docs.map((item: any) => (
                            <Listbox.Option
                              key={item.data()?.id}
                              onClick={() =>
                                setDidTouchStandardVcprReason(true)
                              }
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "text-movet-white bg-movet-brown"
                                    : "text-movet-black",
                                  "text-left cursor-default select-none relative py-2 pl-4 pr-4"
                                )
                              }
                              value={item.data()?.name}
                            >
                              {({ active, selected }) => (
                                <>
                                  <span
                                    className={classNames(
                                      selected
                                        ? "font-semibold"
                                        : "font-normal",
                                      "block truncate ml-2"
                                    )}
                                  >
                                    #{item.data()?.id}- {item.data()?.name}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-movet-black",
                                        "absolute inset-y-0 left-0 flex items-center pl-1.5"
                                      )}
                                    >
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="h-4 w-4"
                                        size="sm"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
            <Transition
              show={didTouchStandardVcprReason}
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
          </li>
        )
      )}
    </>
  );
};

export default VcprReasonClinicSettings;
