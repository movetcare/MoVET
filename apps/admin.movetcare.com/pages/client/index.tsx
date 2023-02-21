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
  faCheck,
  faEnvelopeSquare,
  faCircleExclamation,
  faSpinner,
  faCheckCircle,
  faPaperPlane,
  faMapLocation,
  faTrash,
  faFire,
  faMessage,
  faIdCard,
  faAddressBook,
  faEnvelopesBulk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GOTO_PHONE_URL } from "constants/urls";
import environment from "utils/environment";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore, functions } from "services/firebase";
import { Button, Loader, Modal } from "ui";
import Error from "components/Error";
import { timeSince } from "utils/timeSince";
import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter";
import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";
import { formatPhoneNumber } from "utils/formatPhoneNumber";
import { Transition } from "@headlessui/react";
import { ClientSearch } from "components/ClientSearch";
import { isNumeric } from "utilities";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Client = () => {
  const router = useRouter();
  const { query } = router;
  const [errors, setErrors] = useState<Array<string> | null>(null);
  const [client, setClient] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const cancelButtonRef = useRef(null);
  const [showDeleteClientModal, setShowDeleteClientModal] =
    useState<boolean>(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState<boolean>(true);
  const [isLoadingSendPasswordResetLink, setIsLoadingSendPasswordResetLink] =
    useState<boolean>(false);
  const [isLoadingSendPaymentLink, setIsLoadingSendPaymentLink] =
    useState<boolean>(false);
  const [isLoadingAddingToWaitlist, setIsAddingToWaitlist] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clientData, isLoadingClient, errorClient] = useDocument(
    doc(firestore, `clients/${query?.id}`)
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          }
          setClient({
            ...result.data,
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
      }
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
            }
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

  const addToWaitlist = async () => {
    setIsAddingToWaitlist(true);
    if (client?.email && !client?.email?.toLowerCase().includes("missing"))
      await setDoc(
        doc(firestore, `waitlist/${client?.email}`),
        {
          id: query?.id,
          email: client?.email,
          firstName: client?.displayName
            ? client?.displayName
            : client?.firstName,
          lastName: client?.displayName ? "" : client?.lastName,
          phone:
            client?.phone !== undefined
              ? formatPhoneNumber(client?.phone)
              : client?.phoneNumber
              ? client?.phoneNumber
              : "UNKNOWN",
          status: "complete",
          isActive: true,
          customerId: JSON.stringify(client?.customer),
          paymentMethod:
            client?.paymentMethods?.length > 0 && client?.paymentMethods[0]
              ? [
                  `${client?.paymentMethods[0]?.card?.brand?.toUpperCase()} - ${
                    client?.paymentMethods[0]?.card?.last4
                  }`,
                ]
              : [],
          updatedOn: serverTimestamp(),
        },
        { merge: true }
      )
        .then(() => {
          toast(`CLIENT ADDED TO WAITLIST`, {
            position: "top-center",
            duration: 3500,
            icon: (
              <FontAwesomeIcon
                icon={faCheck}
                size="lg"
                className="text-movet-green"
              />
            ),
          });
          router.push("/dashboard");
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
          })
        )
        .finally(() => setIsAddingToWaitlist(false));
    else {
      setIsAddingToWaitlist(false);
      toast("FAILED TO CHECK IN CLIENT - MISSING EMAIL ADDRESS!", {
        position: "top-center",
        duration: 5000,
        icon: (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="text-movet-red"
          />
        ),
      });
    }
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
      "sendPasswordResetLink"
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
        })
      );
  };
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
                  <div className="flex flex-col text-center">
                    {client && (
                      <div className="flex justify-center items-center">
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
                {isMounted && <Tooltip id="resetPassword" />}
                <div className="flex flex-row items-center justify-center space-x-2 mt-2">
                  {client?.email !== undefined &&
                    !client?.email?.toLowerCase().includes("missing") && (
                      <div
                        data-tooltip-id="resetPassword"
                        data-tooltip-content="Re-send Account Verification Link (Contains a reset password link)"
                        title="Re-send Account Verification Link (Contains a reset password link)"
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
                  {isMounted && <Tooltip id="viewInProvet" />}
                  <a
                    data-tooltip-id="viewInProvet"
                    data-tooltip-content="View Client in Provet"
                    title="View Client in Provet"
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
                      {isMounted && <Tooltip id="viewInStripe" />}
                      <a
                        data-tooltip-id="viewInStripe"
                        data-tooltip-content="View Customer in Stripe"
                        title="View Customer in Stripe"
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
                  {client &&
                    client?.phoneNumber &&
                    !client?.phoneNumber?.toLowerCase().includes("missing") && (
                      <>
                        {isMounted && <Tooltip id="callPhone" />}
                        <a
                          data-tooltip-content="Call Client"
                          title="Call Client"
                          data-tooltip-id="callPhone"
                          href={`${GOTO_PHONE_URL}/${client?.phoneNumber}`}
                          target="_blank"
                          className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faPhone} size="lg" />
                        </a>
                      </>
                    )}
                  {client &&
                    client?.email &&
                    !client?.email?.toLowerCase()?.includes("missing") && (
                      <>
                        {isMounted && <Tooltip id="sendEmail" />}
                        <a
                          data-tooltip-id="sendEmail"
                          data-tooltip-content="Email Client"
                          title="Email Client"
                          href={`mailto:${client?.email}`}
                          target="_blank"
                          className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faEnvelope} size="lg" />
                        </a>
                      </>
                    )}
                  {client &&
                    client?.email &&
                    !client?.email?.toLowerCase()?.includes("missing") && (
                      <>
                        {isMounted && <Tooltip id="chatWithClient" />}
                        <div
                          data-tooltip-id="chatWithClient"
                          data-tooltip-content="Chat w/ Client"
                          title="Chat w/ Client"
                          onClick={() =>
                            router.push(`/telehealth/chat/?id=${query?.id}`)
                          }
                          className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                        >
                          <FontAwesomeIcon icon={faMessage} size="lg" />
                        </div>
                      </>
                    )}
                  {client &&
                    !client?.street?.toLowerCase()?.includes("missing") &&
                    client?.street !== undefined && (
                      <>
                        {isMounted && <Tooltip id="viewOnMap" />}
                        <a
                          data-tooltip-id="viewOnMap"
                          data-tooltip-content="View on Map"
                          title="View on Map"
                          href={`http://maps.google.com/?q=${client?.street} ${client?.city} ${client?.state} ${client?.zipCode}`}
                          target="_blank"
                          className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faMapLocation} size="lg" />
                        </a>
                      </>
                    )}
                  {isMounted && <Tooltip id="viewInFirestore" />}
                  <a
                    data-tooltip-id="viewInFirestore"
                    data-tooltip-content="View Database Record"
                    title="View Database Record"
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
                  {isMounted && <Tooltip id="deleteClient" />}
                  {client?.email !== "dev+test@movetcare.com" &&
                    client?.email !==
                      "dev+test_vcpr_not_required@movetcare.com" && (
                      <div
                        data-tooltip-id="deleteClient"
                        data-tooltip-content="Delete Client"
                        title="Delete Client"
                        onClick={() =>
                          client?.email.includes("+test")
                            ? window.open(
                                `https://us.provetcloud.com/4285/client/${query?.id}/forget`,
                                "_blank"
                              )
                            : setShowDeleteClientModal(true)
                        }
                        className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      >
                        <FontAwesomeIcon icon={faTrash} size="lg" />
                      </div>
                    )}
                  {isMounted && <Tooltip id="reloadData" />}
                  <div
                    data-tooltip-id="reloadData"
                    data-tooltip-content="Reload Client Data"
                    title="Reload Client Data"
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
                          <b>ERRORS: </b>
                          <ul>
                            {errors.map((error: string, index: number) => (
                              <li
                                key={index}
                                className="font-bold text-movet-red ml-2"
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
                            <b>WARNINGS: </b>
                            <ul>
                              {client?.alerts?.warnings.map(
                                (warning: string, index: number) => (
                                  <li
                                    key={index}
                                    className="font-bold text-movet-yellow text-sm ml-2"
                                  >
                                    - {warning}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon icon={faIdCard} className="mr-4" />
                      ACCOUNT ID:
                    </h3>
                    {isLoadingAccount ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="lg"
                        className="text-movet-brown ml-4"
                      />
                    ) : query?.id === undefined ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        UNKNOWN
                      </span>
                    ) : query?.id ? (
                      <span className="ml-2 italic">{query?.id}</span>
                    ) : (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        ERROR
                      </span>
                    )}
                  </div>
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon icon={faCreditCard} className="mr-4" />
                      CUSTOMER ID:
                    </h3>
                    {isLoadingAccount ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="lg"
                        className="text-movet-brown ml-4"
                      />
                    ) : client?.customer === undefined ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        DOES NOT EXIST
                      </span>
                    ) : client?.customer ? (
                      <span className="ml-4">
                        {client?.customer ? (
                          Array.isArray(client?.customer) &&
                          client?.customer.length > 1 ? (
                            JSON.stringify(client?.customer)
                          ) : Array.isArray(client?.customer) &&
                            client?.customer.length === 1 ? (
                            client?.customer[0]
                          ) : Array.isArray(client?.customer) &&
                            client?.customer.length === 0 ? (
                            <span className="inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              DOES NOT EXIST
                            </span>
                          ) : (
                            client?.customer
                          )
                        ) : client?.customer?.id ? (
                          client?.customer?.id
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                            DOES NOT EXIST
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        DISABLED
                      </span>
                    )}
                  </div>
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon icon={faEnvelope} className="mr-4" />
                      EMAIL ADDRESS:
                    </h3>
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
                        {isMounted && <Tooltip id="verifyAccountIndicator" />}
                        <p className="group italic flex flex-row ml-2 items-center">
                          <a
                            href={`mailto://${client?.email}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-movet-red hover:underline ease-in-out duration-300"
                            title="Send an Email to Client"
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
                                title="This client has not verified their MoVET account or set up an account password! Click on the paper plane icon above to send them a new account verification email."
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
                  </div>
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon icon={faPhone} className="mr-4" />
                      PHONE NUMBER:
                    </h3>
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
                        className="hover:text-movet-red hover:underline ease-in-out duration-300 ml-2"
                        title="Call Client"
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
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
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
                  </div>
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon icon={faAddressBook} className="mr-4" />
                      ADDRESS:
                    </h3>
                    {isLoadingAccount ? (
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        size="lg"
                        className="text-movet-brown ml-4"
                      />
                    ) : client?.street === undefined ? (
                      <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                        UNKNOWN
                      </span>
                    ) : client?.street ? (
                      <a
                        id="viewOnMap"
                        data-tooltip-content="View on Map"
                        title="View Address on Map"
                        href={
                          !client?.street?.toLowerCase()?.includes("missing") &&
                          client?.street !== undefined
                            ? `http://maps.google.com/?q=${client?.street} ${client?.city} ${client?.state} ${client?.zipCode}`
                            : "#"
                        }
                        target={
                          !client?.street?.toLowerCase()?.includes("missing") &&
                          client?.street !== undefined
                            ? "_blank"
                            : undefined
                        }
                        className="hover:underline duration-300 ease-in-out hover:text-movet-red"
                        rel="noreferrer"
                      >
                        <span className="italic ml-2">
                          {client?.street
                            ? client?.street
                            : "STREET UNKNOWN - "}
                        </span>
                        <span className="italic">
                          {" "}
                          {client?.city ? client?.city : "CITY UNKNOWN - "}
                        </span>
                        <span className="italic">
                          {" "}
                          {client?.state ? client?.state : "STATE UNKNOWN - "}
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
                        NEEDS A PAYMENT METHOD
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
                        {client?.sendSms && (
                          <div
                            onClick={() => sendPaymentLink("SMS")}
                            className="ml-4 cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                          >
                            <FontAwesomeIcon icon={faSms} size="lg" />
                          </div>
                        )}
                        {client?.sendEmail && (
                          <div
                            onClick={() => sendPaymentLink("EMAIL")}
                            className="ml-1 cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                          >
                            <FontAwesomeIcon
                              icon={faEnvelopeSquare}
                              size="lg"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="ml-4 sm:ml-8 mb-6">
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
                                    paymentMethod?.card?.funding
                                  )}{" "}
                                  {capitalizeFirstLetter(paymentMethod?.type)}:
                                </b>
                                <span className="italic ml-2">
                                  {capitalizeFirstLetter(
                                    paymentMethod?.card?.brand
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
                  {client?.paymentMethods !== undefined ||
                  (errors !== null && errors[0] !== "Client Not Found...") ? (
                    <Divider />
                  ) : (
                    <div className="mt-6"></div>
                  )}
                </div>
              )}
              <Transition
                show={
                  client?.paymentMethods !== undefined ||
                  (errors !== null &&
                    errors[0] !== "Client Not Found..." &&
                    errors[0] !== "Invalid Client ID!")
                }
                enter="transition ease-in duration-1000"
                leave="transition ease-out duration-1000"
                leaveTo="opacity-10"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
              >
                <Button
                  text="Check In Client"
                  color="black"
                  icon={faCheck}
                  loading={isLoadingAddingToWaitlist}
                  disabled={isLoadingAddingToWaitlist}
                  onClick={() => addToWaitlist()}
                  className="hover:bg-movet-green mt-2 mb-6"
                />
              </Transition>
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
        title={`Delete Client #${query?.id}`}
        icon={faTrash}
        action={deleteClient}
        yesButtonText="YES"
        noButtonText="CANCEL"
      />
    </>
  );
};

export default Client;
