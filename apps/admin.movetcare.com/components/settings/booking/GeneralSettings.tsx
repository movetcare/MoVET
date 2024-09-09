import { Switch } from "@headlessui/react";
import {
  faCalendarMinus,
  faCalendarPlus,
  faCheckCircle,
  faCircleDot,
  faCircleExclamation,
  faPencil,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { classNames } from "utils/classNames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../Button";
import Error from "../../Error";
import { Loader } from "ui";
import {
  query,
  collection,
  orderBy,
  doc,
  serverTimestamp,
  setDoc,
  //where,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore, functions } from "services/firebase";
import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";

const GeneralSettings = () => {
  // const [reasonGroups, loadingReasonGroups, errorReasonGroups] = useCollection(
  //   query(
  //     collection(firestore, "reason_groups"),
  //     where("isVisible", "==", true),
  //     orderBy("name", "asc"),
  //   ),
  // );
  const [reasonGroups, loadingReasonGroups, errorReasonGroups] = useCollection(
    query(collection(firestore, "reason_groups"), orderBy("isVisible", "desc")),
  );
  const [reasons, loadingReasons, errorReasons] = useCollection(
    query(collection(firestore, "reasons"), orderBy("name", "asc")),
  );
  const toggleReasonVisibility = async ({
    id,
    name,
    isVisible,
    isGroup = false,
  }: {
    id: number;
    name: string;
    isVisible: boolean;
    isGroup?: boolean;
  }) => {
    await setDoc(
      doc(firestore, isGroup ? "reason_groups" : "reasons", `${id}`),
      {
        isVisible: isVisible !== undefined ? !isVisible : false,
        updatedOn: serverTimestamp(),
      },
      { merge: true },
    )
      .then(() =>
        toast(
          `"${name}" ${isGroup ? "services are" : "service is"} now ${
            isVisible ? "DISABLED" : "ACTIVE"
          }`,
          {
            position: "top-center",
            icon: (
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="sm"
                className={`${
                  isVisible ? "text-movet-red" : "text-movet-green"
                }`}
              />
            ),
          },
        ),
      )
      .catch((error: any) =>
        toast(`Service "${name}" Update FAILED: ${error?.message}`, {
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
  };

  const resyncReasons = () => {
    toast(`RE-SYNCING PROVET REASONS...`, {
      position: "top-center",
      duration: 3000,
      icon: (
        <FontAwesomeIcon
          icon={faRedo}
          size="lg"
          className="text-movet-yellow"
        />
      ),
    });
    const deleteAccount = httpsCallable(functions, "resyncReasons");
    deleteAccount()
      .then((result: any) => {
        if (result.data) {
          toast(`REASON RE-SYNC COMPLETE`, {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faRedo}
                size="lg"
                className="text-movet-green"
              />
            ),
          });
        } else
          toast("SOMETHING WENT WRONG!", {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="text-movet-red"
              />
            ),
          });
      })
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
    <form
      className="divide-y divide-movet-gray lg:col-span-9"
      action="#"
      method="POST"
    >
      <div className="divide-y divide-movet-gray">
        <>
          {(loadingReasonGroups || loadingReasons) && <Loader />}
          {errorReasonGroups ||
            (errorReasons && (
              <div className="my-4">
                <Error error={errorReasonGroups || errorReasons} />
              </div>
            ))}
          {reasonGroups && (
            <>
              <div className="px-4 sm:px-6">
                <div>
                  <h2 className="text-2xl mb-2 leading-6 font-medium text-movet-black">
                    Service Options
                  </h2>
                  <p className="text-sm text-movet-black -mt-1">
                    Use the toggles below to control which ProVet Reason Groups
                    and Reasons appear in the service options list when a client
                    is booking an appointment.
                  </p>
                </div>
                <ul role="list" className="mt-4 divide-y divide-movet-gray">
                  {reasonGroups &&
                    reasonGroups.docs.length > 0 &&
                    reasonGroups.docs.map((group: any, index: number) => {
                      return (
                        <>
                          <Switch.Group
                            key={index}
                            as="li"
                            className="py-4 flex items-center justify-between"
                          >
                            <div className="flex flex-col">
                              {group.data()?.name && (
                                <Switch.Label
                                  as="h3"
                                  className="text-sm font-medium text-movet-black"
                                  passive
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      group.data()?.isVisible
                                        ? faCalendarPlus
                                        : faCalendarMinus
                                    }
                                    size="lg"
                                    className={`${
                                      group.data()?.isVisible
                                        ? "text-movet-green"
                                        : "text-movet-red"
                                    } mr-4`}
                                  />
                                  {group.data()?.name}
                                </Switch.Label>
                              )}
                            </div>
                            <Switch
                              checked={group.data()?.isVisible}
                              onChange={async () =>
                                await toggleReasonVisibility({
                                  ...group.data(),
                                  isGroup: true,
                                })
                              }
                              className={classNames(
                                group.data()?.isVisible
                                  ? "bg-movet-green"
                                  : "bg-movet-gray",
                                "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-gray",
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  group.data()?.isVisible
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                                )}
                              />
                            </Switch>
                          </Switch.Group>
                          {reasons &&
                            reasons.docs.length > 0 &&
                            reasons.docs.map((reason: any, index: number) => {
                              return group.data()?.id ===
                                reason.data()?.group &&
                                group.data()?.isVisible ? (
                                <Switch.Group
                                  key={index}
                                  as="li"
                                  className="py-2 flex items-center justify-between px-6 sm:px-8"
                                >
                                  <div className="flex flex-col">
                                    {reason.data()?.name && (
                                      <Switch.Label
                                        as="h3"
                                        className={`text-xs font-medium text-movet-black italic${reason.data()?.name?.toLowerCase()?.includes("office use only") || reason.data()?.name?.toLowerCase()?.includes("lunch") ? " text-movet-gray" : ""}`}
                                        passive
                                      >
                                        <FontAwesomeIcon
                                          icon={faCircleDot}
                                          size="2xs"
                                          className={`${
                                            reason.data()?.isVisible
                                              ? "text-movet-green"
                                              : "text-movet-red"
                                          } mr-4`}
                                        />
                                        {reason.data()?.name}
                                      </Switch.Label>
                                    )}
                                  </div>
                                  <Switch
                                    checked={reason.data()?.isVisible}
                                    disabled={
                                      reason
                                        .data()
                                        ?.name?.toLowerCase()
                                        ?.includes("office use only") ||
                                      reason
                                        .data()
                                        ?.name?.toLowerCase()
                                        ?.includes("lunch")
                                    }
                                    onChange={async () =>
                                      await toggleReasonVisibility(
                                        reason.data(),
                                      )
                                    }
                                    className={classNames(
                                      "ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-gray",
                                      reason.data()?.isVisible
                                        ? reason
                                            .data()
                                            ?.name?.toLowerCase()
                                            ?.includes("office use only") ||
                                          reason
                                            .data()
                                            ?.name?.toLowerCase()
                                            ?.includes("lunch")
                                          ? "bg-movet-green/50"
                                          : "bg-movet-green"
                                        : "bg-movet-gray",
                                    )}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={classNames(
                                        reason.data()?.isVisible
                                          ? "translate-x-5"
                                          : "translate-x-0",
                                        "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                                      )}
                                    />
                                  </Switch>
                                </Switch.Group>
                              ) : (
                                <></>
                              );
                            })}
                        </>
                      );
                    })}
                </ul>
              </div>
              <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                <Button
                  color="black"
                  onClick={() =>
                    window.open(
                      "https://us.provetcloud.com/4285/organization/administration/reasons/",
                      "_blank",
                    )
                  }
                >
                  <span className="flex-shrink-0 cursor-pointer mr-2">
                    <FontAwesomeIcon
                      icon={faPencil}
                      className="text-movet-white"
                    />
                  </span>
                  Edit Reasons
                </Button>
                <Button
                  className="ml-4"
                  color="red"
                  onClick={() => resyncReasons()}
                >
                  <span className="flex-shrink-0 cursor-pointer mr-2">
                    <FontAwesomeIcon
                      icon={faRedo}
                      className="text-movet-white"
                    />
                  </span>
                  Re-Sync Reasons
                </Button>
              </div>
            </>
          )}
        </>
      </div>
    </form>
  );
};

export default GeneralSettings;
