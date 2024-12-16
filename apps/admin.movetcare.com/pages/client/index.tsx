import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  faPaw,
  faCreditCard,
  faPhone,
  faEnvelope,
  faUser,
  faRedo,
  faAppleAlt,
  faSms,
  faEnvelopeSquare,
  faCircleExclamation,
  faSpinner,
  faCheckCircle,
  faPaperPlane,
  faTrash,
  faFire,
  faMessage,
  faEnvelopesBulk,
  faCalendarPlus,
  faCircleCheck,
  faMobileAndroid,
  faComments,
  faPlusCircle,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import environment from "utils/environment";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore, functions } from "services/firebase";
import { Loader, Modal } from "ui";
import Error from "components/Error";
import { timeSince } from "utils/timeSince";
import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter";
import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";
import { formatPhoneNumber } from "utils/formatPhoneNumber";
import { ClientSearch } from "components/ClientSearch";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Switch } from "@headlessui/react";
import { classNames } from "utilities";

const Client = () => {
  const router = useRouter();
  const { query } = router;
  const [errors, setErrors] = useState<Array<string> | null>(null);
  const [client, setClient] = useState<any>(null);
  const cancelButtonRef = useRef(null);
  const [showDeleteClientModal, setShowDeleteClientModal] =
    useState<boolean>(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState<boolean>(true);
  const [isLoadingSendPasswordResetLink, setIsLoadingSendPasswordResetLink] =
    useState<boolean>(false);
  const [isLoadingSendPaymentLink, setIsLoadingSendPaymentLink] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clientData, isLoadingClient, errorClient] = useDocument(
    doc(firestore, `clients/${query?.id}`),
  );
  const [smsMessage, setSmsMessage] = useState<string>("");
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);

  const isNumeric = (string: string) => {
    if (typeof string != "string") return false;
    return !isNaN(string as any) && !isNaN(parseFloat(string));
  };

  useEffect(() => {
    if (query.id) {
      const showError = () => {
        setIsLoading(false);
        setIsLoadingAccount(false);
        setErrors(["Invalid Client ID!"]);
        setClient([]);
      };
      if (!isNumeric(query.id as string)) showError();
      else if (query.id.length < 3 || query.id.length > 5) showError();
    }
  }, [query]);

  useEffect(() => {
    if (client) console.log("CLIENT data => ", client);
  }, [client]);

  useEffect(() => {
    if (!isLoadingClient) setIsLoading(false);
    if (clientData) {
      const verifyAccount = httpsCallable(functions, "verifyAccount");
      verifyAccount({
        id: query?.id,
      })
        .then((result: any) => {
          if (
            (result.data?.alerts?.errors &&
              result.data?.alerts?.errors.length > 0) ||
            result.data === false
          ) {
            setErrors(result.data?.alerts?.errors || ["Client Not Found..."]);
          } else setErrors(null);
          setClient({
            ...result.data,
            lastLogin: clientData.data()?.device?.lastLogin,
            createdOn: clientData.data()?.createdOn,
            updatedOn: clientData.data()?.updatedOn,
          });
        })
        .catch((error: any) => {
          toast(error?.message, {
            position: "top-center",
            duration: 3500,
            icon: (
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="text-movet-red"
              />
            ),
          });
          setErrors(["verifyAccount - " + error?.message]);
        })
        .finally(() => setIsLoadingAccount(false));
    }
  }, [isLoadingClient, clientData, query]);

  const sendClientSMS = () => {
    const sendSmsToClient = httpsCallable(functions, "sendSmsToClient");
    sendSmsToClient({
      id: query?.id,
      message: smsMessage,
    })
      .then(() => {
        setShowSmsModal(false);
        setSmsMessage("");
        toast(
          `SENT SMS Message to ${client?.displayName} @ ${
            client?.phoneNumber ? formatPhoneNumber(client?.phoneNumber) : ""
          }`,
          {
            icon: (
              <FontAwesomeIcon
                icon={faCircleCheck}
                size="sm"
                className="text-movet-green"
              />
            ),
          },
        );
      })
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

  const sendClientAppDownloadSMS = () => {
    const sendSmsToClient = httpsCallable(functions, "sendSmsToClient");
    sendSmsToClient({
      id: query?.id,
      message: `Hi ${client?.displayName || "there"}!\n\nHere is the link to download the MoVET app to your phone: https://movetcare.com/get-the-app\n\nOur app enables you to schedule appointments, manage health records, chat with your doctor, and pay for your invoices from the comfort of your home.\n\nPlease reach out and let us know if you have any questions.\n\nThanks!\n- The MoVET Team`,
    })
      .then(() => {
        setShowSmsModal(false);
        setSmsMessage("");
        toast(
          `SENT App Download Link SMS Message to ${client?.displayName} @ ${
            client?.phoneNumber ? formatPhoneNumber(client?.phoneNumber) : ""
          }`,
          {
            icon: (
              <FontAwesomeIcon
                icon={faCircleCheck}
                size="sm"
                className="text-movet-green"
              />
            ),
          },
        );
      })
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

  const sendPaymentLink = (mode: "SMS" | "EMAIL") => {
    setIsLoadingSendPaymentLink(true);
    toast(
      `SENDING PAYMENT LINK ${mode} TO ${
        mode === "SMS"
          ? client?.phone !== undefined
            ? formatPhoneNumber(client?.phone)
            : client?.phoneNumber
          : client?.email
      }`,
      {
        position: "top-center",
        duration: 1500,
        icon: (
          <FontAwesomeIcon
            icon={mode === "SMS" ? faSms : faEnvelopeSquare}
            size="lg"
            className="text-movet-yellow"
          />
        ),
      },
    );
    const sendPaymentLink = httpsCallable(functions, "sendPaymentLink");
    sendPaymentLink({
      id: query?.id,
      mode,
    })
      .then((result: any) => {
        if (result.data)
          toast(
            `SENT PAYMENT LINK ${mode} TO ${
              mode === "SMS"
                ? client?.phone !== undefined
                  ? formatPhoneNumber(client?.phone)
                  : client?.phoneNumber
                : client?.email
            }`,
            {
              position: "top-center",
              duration: 5000,
              icon: (
                <FontAwesomeIcon
                  icon={mode === "SMS" ? faSms : faEnvelopeSquare}
                  size="lg"
                  className="text-movet-green"
                />
              ),
            },
          );
        else
          toast("SOMETHING WENT WRONG SENDING PAYMENT LINK!", {
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
      .catch((error: any) => {
        toast(error?.message, {
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
      .finally(() => setIsLoadingSendPaymentLink(false));
  };

  const reloadPage = () => {
    toast(`RELOADING DATA...`, {
      position: "top-center",
      duration: 3500,
      icon: <FontAwesomeIcon icon={faRedo} size="lg" />,
    });
    router.reload();
  };

  const sendPasswordResetLink = async () => {
    setIsLoadingSendPasswordResetLink(true);
    toast(`SENDING PASSWORD REST LINK TO ${client?.email}`, {
      position: "top-center",
      duration: 1500,
      icon: (
        <FontAwesomeIcon
          icon={faEnvelopeSquare}
          size="lg"
          className="text-movet-yellow"
        />
      ),
    });
    const sendPasswordResetLink = httpsCallable(
      functions,
      "sendPasswordResetLink",
    );
    sendPasswordResetLink({
      email: client?.email,
    })
      .then((result: any) => {
        if (result.data)
          toast(`SENT PASSWORD RESET LINK TO ${client?.email}`, {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faEnvelopeSquare}
                size="lg"
                className="text-movet-green"
              />
            ),
          });
        else
          toast("SOMETHING WENT WRONG SENDING PASSWORD RESET LINK!", {
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
      .catch((error: any) => {
        toast(error?.message, {
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
      .finally(() => setIsLoadingSendPasswordResetLink(false));
  };
  const deleteClient = async () => {
    toast(`DELETING CLIENT #${query?.id}...`, {
      position: "top-center",
      duration: 3000,
      icon: (
        <FontAwesomeIcon
          icon={faTrash}
          size="lg"
          className="text-movet-yellow"
        />
      ),
    });
    const deleteAccount = httpsCallable(functions, "deleteAccount");
    deleteAccount({
      id: query?.id,
    })
      .then((result: any) => {
        if (result.data) {
          toast(`CLIENT #${query?.id} HAS BEEN DELETED!`, {
            position: "top-center",
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faTrash}
                size="lg"
                className="text-movet-green"
              />
            ),
          });
          router.push("/dashboard");
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
  const updateClientNotificationSetting = async (
    settingType: "sms" | "email" | "push",
  ) =>
    await updateDoc(
      doc(firestore, "clients", `${query?.id}`),
      settingType === "sms"
        ? {
            updatedOn: serverTimestamp(),
            sendSms: !client?.sendSms,
          }
        : settingType === "email"
          ? {
              updatedOn: serverTimestamp(),
              sendEmail: !client?.sendEmail,
            }
          : {
              updatedOn: serverTimestamp(),
              sendPush: !client?.sendPush,
            },
    )
      .then(() =>
        toast(settingType?.toUpperCase() + " Notification Setting Updated!", {
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
  const Divider = () => <hr className="my-4 border-movet-brown/50" />;
  return (
    <>
      <ClientSearch />
      <div className="flex flex-col md:flex-row max-w-2xl mx-auto">
        <div
          className={`flex flex-col justify-between bg-white shadow overflow-hidden rounded-lg text-movet-black w-full`}
        >
          {isLoading || client === null ? (
            <Loader message="Loading Client Account..." />
          ) : errorClient ? (
            <Error error={errorClient} />
          ) : (
            <>
              <div className="flex flex-col sm:items-center justify-between border-b border-movet-gray px-8 py-4">
                <div className="flex items-center justify-center space-x-4">
                  {/* <Image
                    src="/images/logo/logo-paw-black.png"
                    alt=""
                    className="hidden md:block w-10 sm:w-16 h-10 sm:h-16 mr-4"
                    priority
                    height={50}
                    width={50}
                  /> */}
                  <div className="flex flex-col justify-center items-center">
                    {client && (
                      <div className="flex flex-col justify-center items-center">
                        <h1 className="mr-3 font-abside text-lg mt-2">
                          {client?.firstName !== undefined
                            ? client?.firstName
                            : ""}{" "}
                          {client?.lastName !== undefined
                            ? client?.lastName
                            : ""}
                          {client?.displayName !== undefined
                            ? client?.displayName
                            : client?.firstName === undefined &&
                                client?.lastName === undefined
                              ? "UNKNOWN CLIENT"
                              : ""}
                        </h1>
                        <div className="flex flex-row items-center justify-center mt-2 mb-1">
                          <FontAwesomeIcon icon={faEnvelope} />
                          {isLoadingAccount ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              size="lg"
                              className="text-movet-brown ml-4"
                            />
                          ) : client?.email === undefined ? (
                            <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              UNKNOWN
                            </span>
                          ) : client?.email ? (
                            <span>
                              <Tooltip id="verifyAccountIndicator" />
                              <p className="group italic flex flex-row ml-2 items-center text-sm">
                                <a
                                  href={`mailto://${client?.email}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:text-movet-red hover:underline ease-in-out duration-300"
                                >
                                  {client?.email}
                                </a>
                                {client?.emailVerified ? (
                                  <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-movet-green ml-2"
                                  />
                                ) : client?.emailVerified === false ? (
                                  <>
                                    <span
                                      data-tooltip-id="verifyAccountIndicator"
                                      data-tooltip-content="This client has not verified their MoVET account or set up an account password!"
                                    >
                                      <FontAwesomeIcon
                                        icon={faCircleExclamation}
                                        className="text-movet-yellow ml-2"
                                      />
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )}
                              </p>
                            </span>
                          ) : (
                            <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              UNKNOWN
                            </span>
                          )}
                        </div>
                        <div className="flex flex-row items-center justify-center my-1">
                          <FontAwesomeIcon icon={faPhone} />
                          {isLoadingAccount ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              size="lg"
                              className="text-movet-brown ml-4"
                            />
                          ) : client?.phoneNumber === undefined ? (
                            <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              UNKNOWN
                            </span>
                          ) : client?.phoneNumber &&
                            !client?.phoneNumber
                              ?.toLowerCase()
                              .includes("missing") ? (
                            <a
                              href={`https://app.goto.com/domain/ed586a2b-6975-4613-8df0-c3de59fefc65/${client?.phoneNumber
                                ?.replaceAll("-", "")
                                ?.replaceAll("(", "")
                                ?.replaceAll(")", "")
                                ?.replaceAll("+1", "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-movet-red hover:underline ease-in-out duration-300 ml-2 text-sm"
                            >
                              <span className="italic">
                                {client?.phoneNumber
                                  ? client?.phoneNumber
                                  : "UNKNOWN"}
                              </span>
                            </a>
                          ) : (
                            <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              UNKNOWN
                            </span>
                          )}
                        </div>
                        <div className="flex flex-row items-center justify-center mb-2">
                          <FontAwesomeIcon icon={faHouse} />
                          {isLoadingAccount ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              size="lg"
                              className="text-movet-brown"
                            />
                          ) : client?.street === undefined ? (
                            <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              UNKNOWN
                            </span>
                          ) : client?.street ? (
                            <a
                              id="viewOnMap"
                              data-tooltip-content="View on Map"
                              href={
                                !client?.street
                                  ?.toLowerCase()
                                  ?.includes("missing") &&
                                client?.street !== undefined
                                  ? `http://maps.google.com/?q=${client?.street} ${client?.city} ${client?.state} ${client?.zipCode}`
                                  : "#"
                              }
                              target={
                                !client?.street
                                  ?.toLowerCase()
                                  ?.includes("missing") &&
                                client?.street !== undefined
                                  ? "_blank"
                                  : undefined
                              }
                              className="hover:underline duration-300 ease-in-out hover:text-movet-red text-sm"
                              rel="noreferrer"
                            >
                              <span className="italic ml-2">
                                {client?.street
                                  ? client?.street
                                  : "STREET UNKNOWN - "}
                              </span>
                              <span className="italic">
                                {" "}
                                {client?.city
                                  ? client?.city
                                  : "CITY UNKNOWN - "}
                              </span>
                              <span className="italic">
                                {" "}
                                {client?.state
                                  ? client?.state
                                  : "STATE UNKNOWN - "}
                              </span>
                              <span className="italic">
                                {" "}
                                {client?.zipCode
                                  ? client?.zipCode
                                  : "ZIPCODE UNKNOWN"}
                              </span>
                            </a>
                          ) : (
                            <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              UNKNOWN
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row text-center text-xs">
                      <div className="mt-2">
                        <b>Joined: </b>
                        <span className="italic mr-4">
                          {client?.createdOn
                            ? timeSince(client?.createdOn?.toDate())
                            : "UNKNOWN"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <b>Last Updated: </b>
                        <span className="italic">
                          {client?.updatedOn
                            ? timeSince(client?.updatedOn?.toDate())
                            : "UNKNOWN"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Tooltip id="resetPassword" />
                <div className="flex flex-row items-center justify-center space-x-2 mt-2">
                  {client?.email !== undefined &&
                    !client?.email?.toLowerCase().includes("missing") && (
                      <div
                        data-tooltip-id="resetPassword"
                        data-tooltip-content="Re-send Account Verification Link (Contains a reset password link)"
                        onClick={() => sendPasswordResetLink()}
                        className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      >
                        {isLoadingSendPasswordResetLink ? (
                          <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            size="sm"
                            className="text-movet-brown"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            size="lg"
                            className={
                              !client?.emailVerified && !isLoadingAccount
                                ? "text-movet-yellow hover:text-movet-green"
                                : ""
                            }
                          />
                        )}
                      </div>
                    )}
                  <Tooltip id="viewInProvet" />
                  <a
                    data-tooltip-id="viewInProvet"
                    data-tooltip-content="View Client in Provet"
                    href={
                      environment === "production"
                        ? `https://us.provetcloud.com/4285/client/${query?.id}/`
                        : `https://us.provetcloud.com/4285/client/${query?.id}/`
                    }
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faPaw} size="lg" />
                  </a>
                  {client && client?.customer?.length > 0 && (
                    <>
                      <Tooltip id="viewInStripe" />
                      <a
                        data-tooltip-id="viewInStripe"
                        data-tooltip-content="View Customer in Stripe"
                        href={
                          environment === "production"
                            ? `https://dashboard.stripe.com/customers/${client?.customer}/`
                            : `https://dashboard.stripe.com/test/customers/${client?.customer}/`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      >
                        <FontAwesomeIcon icon={faCreditCard} size="lg" />
                      </a>
                    </>
                  )}
                  {client && client?.email && (
                    <>
                      <Tooltip id="bookAppointment" />
                      <a
                        data-tooltip-content="Schedule an Appointment for Client"
                        data-tooltip-id="bookAppointment"
                        href={`https://app.movetcare.com/?email=${client?.email}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      >
                        <FontAwesomeIcon icon={faCalendarPlus} size="lg" />
                      </a>
                    </>
                  )}
                  {client &&
                    client?.phoneNumber &&
                    !client?.phoneNumber?.toLowerCase().includes("missing") && (
                      <>
                        <Tooltip id="sendSms" />
                        <div
                          data-tooltip-content="Send Client an SMS"
                          data-tooltip-id="sendSms"
                          onClick={() => setShowSmsModal(true)}
                          className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                        >
                          <FontAwesomeIcon icon={faSms} size="lg" />
                        </div>
                      </>
                    )}
                  {client &&
                    client?.email &&
                    !client?.email?.toLowerCase()?.includes("missing") && (
                      <>
                        <Tooltip id="chatWithClient" />
                        <div
                          data-tooltip-id="chatWithClient"
                          data-tooltip-content="Chat w/ Client"
                          onClick={() =>
                            router.push(`/telehealth/chat/?id=${query?.id}`)
                          }
                          className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                        >
                          <FontAwesomeIcon icon={faMessage} size="lg" />
                        </div>
                      </>
                    )}
                  <Tooltip id="viewInFirestore" />
                  <a
                    data-tooltip-id="viewInFirestore"
                    data-tooltip-content="View Database Record"
                    href={
                      window.location.hostname === "localhost"
                        ? "http://localhost:4000/firestore/data/clients/" +
                          query.id
                        : `https://console.firebase.google.com/u/0/project/movet-care/firestore/data/~2Fclients~2F${query.id}`
                    }
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faFire} size="lg" />
                  </a>
                  {/* <Tooltip id="disableClient" />
                  <a
                    data-tooltip-id="disableClient"
                    data-tooltip-content="Disable Client - COMING SOON!"
                    // href={
                    //   window.location.hostname === "localhost"
                    //     ? "http://localhost:4000/firestore/data/clients/" +
                    //       query.id
                    //     : `https://console.firebase.google.com/u/0/project/movet-care/firestore/data/~2Fclients~2F${query.id}`
                    // }
                    // target="_blank"
                    // className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                    // rel="noreferrer"
                    className="text-movet-gray"
                  >
                    <FontAwesomeIcon icon={faBan} size="lg" />
                  </a> */}
                  <Tooltip id="deleteClient" />
                  {client?.email !== "dev+test@movetcare.com" &&
                    client?.email !==
                      "dev+test_vcpr_not_required@movetcare.com" && (
                      <div
                        data-tooltip-id="deleteClient"
                        data-tooltip-content="Delete Client"
                        onClick={() =>
                          client?.email.includes("+test")
                            ? window.open(
                                `https://us.provetcloud.com/4285/client/${query?.id}/forget`,
                                "_blank",
                              )
                            : setShowDeleteClientModal(true)
                        }
                        className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      >
                        <FontAwesomeIcon icon={faTrash} size="lg" />
                      </div>
                    )}
                  <Tooltip id="reloadData" />
                  <div
                    data-tooltip-id="reloadData"
                    data-tooltip-content="Reload Client Data"
                    onClick={() => reloadPage()}
                    className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                  >
                    <FontAwesomeIcon icon={faRedo} size="lg" />
                  </div>
                </div>
              </div>
              {isLoadingAccount ? (
                <Loader message="Loading Client Account..." />
              ) : (
                <div className="flex-1 px-4 sm:px-8">
                  <div className="flex flex-row items-center w-full pt-4 ml-2">
                    <h3 className="text-lg m-0 font-extrabold flex-wrap">
                      <FontAwesomeIcon icon={faUser} className="mr-4" />
                      ACCOUNT STATUS:
                    </h3>
                    {isLoadingAccount ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="lg"
                        className="text-movet-brown ml-4"
                      />
                    ) : Array.isArray(errors) &&
                      errors[0].includes("verifyAccount") ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        STATUS UNKNOWN
                      </span>
                    ) : errors ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        NEEDS REPAIR
                      </span>
                    ) : (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        READY
                      </span>
                    )}
                  </div>
                  {client && (
                    <div className="ml-4 sm:ml-8">
                      {errors && errors?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-bold italic">ERRORS: </p>
                          <ul>
                            {errors.map((error: string, index: number) => (
                              <li
                                key={index}
                                className="font-bold text-movet-red ml-2 text-xs italic"
                              >
                                - {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {client?.alerts?.warnings &&
                        client?.alerts?.warnings?.length > 0 && (
                          <div className="mt-2">
                            <p className="font-bold italic">WARNINGS: </p>
                            <ul>
                              {client?.alerts?.warnings.map(
                                (warning: string, index: number) => (
                                  <li
                                    key={index}
                                    className="font-bold text-movet-yellow text-xs italic ml-2"
                                  >
                                    - {warning}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}{" "}
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon
                        icon={
                          client?.device?.brand === "Apple"
                            ? faAppleAlt
                            : faMobileAndroid
                        }
                        className="mr-4"
                      />
                      MOBILE APP:
                    </h3>
                    {isLoadingAccount ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="lg"
                        className="text-movet-brown ml-4"
                      />
                    ) : client?.device === undefined ||
                      client?.device === null ? (
                      <>
                        <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                          NO APP INSTALLED
                        </span>
                        <Tooltip id="sendDownloadLink" />
                        <p
                          className={`group italic flex flex-row ml-4 items-center cursor-pointer hover:text-movet-green hover:underline${!client?.sendSms ? " text-movet-gray hover:text-movet-gray hover:cursor-not-allowed hover:no-underline" : ""}`}
                          data-tooltip-id="sendDownloadLink"
                          data-tooltip-content={
                            !client?.sendSms
                              ? "CLIENT HAS SMS DISABLED! YOU MUST ENABLE IT FIRST!"
                              : "NOTE: SMS IS SENT AS SOON AS YOU CLICK THIS BUTTON! ONLY CLICK IT ONCE!"
                          }
                          onClick={() => {
                            if (client?.sendSms) sendClientAppDownloadSMS();
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faSms}
                            className="text-movet-green mr-1"
                            size="lg"
                          />
                          Send Download Link
                        </p>
                      </>
                    ) : client?.device ? (
                      <span>
                        <p className="group italic flex flex-row ml-2 items-center">
                          &quot;{client?.device?.deviceName}&quot; |{" "}
                          {client?.device?.brand}: {client?.device?.osName} -{" "}
                          {client?.device?.osVersion} (
                          {client?.device?.modelName})
                        </p>
                        <p className="group italic flex flex-row ml-2 items-center">
                          Last Login: {timeSince(client?.lastLogin?.toDate())}
                          <span className="text-xs ml-2">
                            {client?.lastLogin?.toDate().toLocaleString()}
                          </span>
                        </p>
                      </span>
                    ) : (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        NO APP INSTALLED
                      </span>
                    )}
                  </div>
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      className="mr-4"
                      size="lg"
                    />
                    <h3 className="text-lg m-0 font-extrabold">
                      PAYMENT METHOD:
                    </h3>
                    {isLoadingAccount ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="lg"
                        className="text-movet-brown ml-4"
                      />
                    ) : client?.paymentMethods === undefined ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        STATUS UNKNOWN
                      </span>
                    ) : client?.paymentMethods?.length === 0 ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        NO PAYMENT METHOD
                      </span>
                    ) : (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        READY
                      </span>
                    )}
                    {isLoadingSendPaymentLink ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="sm"
                        className="text-movet-brown ml-4"
                      />
                    ) : (
                      <>
                        <Tooltip id="sendPaymentLinkSms" />
                        {client?.sendSms && (
                          <div
                            data-tooltip-id="sendPaymentLinkSms"
                            data-tooltip-content="Send Client an SMS with a Link to Setup a Payment Method"
                            onClick={() => sendPaymentLink("SMS")}
                            className="ml-4 cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                          >
                            <FontAwesomeIcon icon={faSms} size="lg" />
                          </div>
                        )}
                        <Tooltip id="sendPaymentLinkEmail" />
                        {client?.sendEmail && (
                          <div
                            data-tooltip-id="sendPaymentLinkEmail"
                            data-tooltip-content="Email Client a Link to Setup a Payment Method"
                            onClick={() => sendPaymentLink("EMAIL")}
                            className="ml-1 cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                          >
                            <FontAwesomeIcon
                              icon={faEnvelopeSquare}
                              size="lg"
                            />
                          </div>
                        )}
                        <Tooltip id="manuallyAddPayment" />
                        <div
                          data-tooltip-id="manuallyAddPayment"
                          data-tooltip-content="Manually attach a Payment Method to this client via Stripe"
                          onClick={() =>
                            window
                              ?.open(
                                "https://app.movetcare.com/update-payment-method?email=" +
                                  client?.email,
                                "_blank",
                              )
                              ?.focus()
                          }
                          className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                        >
                          <FontAwesomeIcon icon={faPlusCircle} size="lg" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="ml-4 sm:ml-8 mb-4">
                    <ul>
                      {client &&
                        client?.paymentMethods &&
                        client?.paymentMethods?.map((paymentMethod: any) => (
                          <li
                            key={paymentMethod?.id}
                            className="list-disc ml-4"
                          >
                            <a
                              href={
                                environment === "production"
                                  ? `https://dashboard.stripe.com/customers/${client?.customer}/`
                                  : `https://dashboard.stripe.com/test/customers/${client?.customer}/`
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <div className="mt-2 flex flex-row items-center">
                                <b>
                                  {capitalizeFirstLetter(
                                    paymentMethod?.card?.funding,
                                  )}{" "}
                                  {capitalizeFirstLetter(paymentMethod?.type)}:
                                </b>
                                <span className="italic ml-2">
                                  {capitalizeFirstLetter(
                                    paymentMethod?.card?.brand,
                                  )}
                                </span>
                                <span className="italic ml-2">
                                  - {paymentMethod?.card?.last4}
                                </span>
                                <span className="italic ml-2">
                                  - {paymentMethod?.card?.exp_month}/
                                  {paymentMethod?.card?.exp_year}
                                  {paymentMethod?.card?.wallet?.apple_pay && (
                                    <FontAwesomeIcon
                                      icon={faAppleAlt}
                                      className="ml-2"
                                      size="xs"
                                    />
                                  )}
                                </span>
                              </div>
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon
                        icon={faEnvelopesBulk}
                        className="mr-4"
                      />
                      EMAIL NOTIFICATIONS:
                    </h3>
                    {isLoadingAccount ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="lg"
                        className="text-movet-brown ml-4"
                      />
                    ) : client?.sendEmail === undefined ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        UNKNOWN
                      </span>
                    ) : client?.sendEmail ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        DISABLED
                      </span>
                    )}
                    <Switch
                      checked={client?.sendEmail}
                      onChange={() => updateClientNotificationSetting("email")}
                      className={classNames(
                        client?.sendEmail ? "bg-movet-green" : "bg-movet-red",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-brown",
                        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ml-4",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          client?.sendEmail ? "translate-x-5" : "translate-x-0",
                          "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                        )}
                      />
                    </Switch>
                  </div>
                  <Divider />
                  <div
                    className={`flex flex-row items-center w-full mt-2 ml-2${client?.device === undefined || client?.device === null ? " mb-6" : ""}`}
                  >
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon icon={faSms} className="mr-4" />
                      SMS NOTIFICATIONS:
                    </h3>
                    {isLoadingAccount ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="lg"
                        className="text-movet-brown ml-4"
                      />
                    ) : client?.sendSms === undefined ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        UNKNOWN
                      </span>
                    ) : client?.sendSms ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        DISABLED
                      </span>
                    )}
                    <Switch
                      checked={client?.sendSms}
                      onChange={() => updateClientNotificationSetting("sms")}
                      className={classNames(
                        client?.sendSms ? "bg-movet-green" : "bg-movet-red",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-brown",
                        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ml-4",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          client?.sendSms ? "translate-x-5" : "translate-x-0",
                          "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                        )}
                      />
                    </Switch>
                  </div>
                  {client?.device !== undefined && client?.device !== null && (
                    <>
                      <Divider />
                      <div className="flex flex-row items-center w-full mt-2 ml-2 mb-6">
                        <h3 className="text-lg m-0 font-extrabold">
                          <FontAwesomeIcon icon={faComments} className="mr-4" />
                          PUSH NOTIFICATIONS:
                        </h3>
                        {isLoadingAccount ? (
                          <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            size="lg"
                            className="text-movet-brown ml-4"
                          />
                        ) : client?.sendPush === undefined ? (
                          <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                            N/A
                          </span>
                        ) : client?.sendPush ? (
                          <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white text-center">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                            DISABLED
                          </span>
                        )}
                        <Switch
                          checked={client?.sendPush}
                          onChange={() =>
                            updateClientNotificationSetting("push")
                          }
                          className={classNames(
                            client?.sendPush
                              ? "bg-movet-green"
                              : "bg-movet-red",
                            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-brown",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ml-4",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              client?.sendPush
                                ? "translate-x-5"
                                : "translate-x-0",
                              "inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
                            )}
                          />
                        </Switch>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Modal
        showModal={showDeleteClientModal}
        setShowModal={setShowDeleteClientModal}
        cancelButtonRef={cancelButtonRef}
        isLoading={isLoading}
        loadingMessage="Deleting Client, Please Wait..."
        content={
          <p className="text-lg">
            Are you sure you want to delete this client?{" "}
            <span className="text-lg italic font-bold">
              This action cannot be undone!
            </span>
          </p>
        }
        icon={faTrash}
        action={deleteClient}
        yesButtonText="YES"
        noButtonText="CANCEL"
      />
      <Modal
        showModal={showSmsModal}
        setShowModal={setShowSmsModal}
        cancelButtonRef={cancelButtonRef}
        isLoading={isLoading}
        loadingMessage="Sending SMS to Client, Please Wait..."
        content={
          <>
            <h2>
              Send SMS to {client?.displayName} - {client?.phoneNumber}
            </h2>
            <textarea
              className={
                "focus:ring-movet-brown focus:border-movet-brown text-movet-black py-3 px-4 block w-full rounded-lg font-abside-smooth"
              }
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
            />
          </>
        }
        icon={faSms}
        action={sendClientSMS}
        yesButtonText="SEND"
        noButtonText="CANCEL"
      />
    </>
  );
};

export default Client;
