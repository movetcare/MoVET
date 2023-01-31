import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GOTO_PHONE_URL } from "constants/urls";
import environment from "utils/environment";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { firestore, functions } from "services/firebase";
import { Button, Loader, Modal } from "ui";
import Error from "components/Error";
import { timeSince } from "utils/timeSince";
import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter";
import { getMMDDFromDate } from "utils/getMMDDFromDate";
import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";
import { formatPhoneNumber } from "utils/formatPhoneNumber";
import { Transition } from "@headlessui/react";
import { ClientSearch } from "components/ClientSearch";

const Client = () => {
  const router = useRouter();
  const { query } = router;
  const [errors, setErrors] = useState<Array<string> | null>(null);
  const [client, setClient] = useState<any>();
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
    if (!isLoadingClient) setIsLoading(false);
    if (clientData) {
      const verifyAccount = httpsCallable(functions, "verifyAccount");
      verifyAccount({
        id: query?.id,
      })
        .then((result: any) => {
          console.log("result", result.data);
          if (
            (result.data?.errors && result.data?.errors.length > 0) ||
            result.data === false
          ) {
            setErrors(result.data?.errors || ["Client Not Found..."]);
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
    if (client?.email)
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
    setIsLoading(true);
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
      .then(() => {
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
      .finally(() => setIsLoading(false));
  };
  const Divider = () => <hr className="my-4 border-movet-brown/50" />;
  return (
    <>
      <ClientSearch />
      <div className="flex flex-col md:flex-row max-w-2xl mx-auto">
        <div
          className={`flex flex-col justify-between bg-white shadow overflow-hidden rounded-lg text-movet-black w-full`}
        >
          {isLoading ? (
            <Loader />
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
                <div className="flex flex-row items-center justify-center space-x-2 mt-2">
                  {client?.email && (
                    <div
                      onClick={() => sendPasswordResetLink()}
                      className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                    >
                      {isLoadingSendPasswordResetLink ? (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          size="sm"
                          className="text-movet-brown ml-4"
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
                  <a
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
                    <a
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
                  )}
                  {client && client?.phone && (
                    <a
                      href={`${GOTO_PHONE_URL}/${client?.phone}`}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faPhone} size="lg" />
                    </a>
                  )}
                  {client && client?.email && (
                    <a
                      href={`mailto:${client?.email}`}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faEnvelope} size="lg" />
                    </a>
                  )}
                  {client &&
                    !client?.street?.toLowerCase()?.includes("missing") && (
                      <a
                        href={`http://maps.google.com/?q=${client?.street} ${client?.city} ${client?.state} ${client?.zipCode}`}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon icon={faMapLocation} size="lg" />
                      </a>
                    )}
                  <div
                    onClick={() => setShowDeleteClientModal(true)}
                    className="cursor-pointer inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </div>
                  <div
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
                        HEALTHY
                      </span>
                    )}
                  </div>
                  {client && (
                    <div className="ml-4 sm:ml-8">
                      {errors && (
                        <div className="mt-2">
                          <b>Errors: </b>
                          <ul>
                            {errors.map((error: string, index: number) => (
                              <li key={index} className="italic text-movet-red">
                                &quot;{error}&quot;
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-2">
                        <b>Account ID: </b>
                        <span className="italic">{query?.id}</span>
                      </div>
                      <div className="mt-2">
                        <b>Customer ID: </b>
                        <span className="italic">
                          {client?.customer
                            ? Array.isArray(client?.customer) &&
                              client?.customer.length > 1
                              ? JSON.stringify(client?.customer)
                              : Array.isArray(client?.customer) &&
                                client?.customer.length === 1
                              ? client?.customer[0]
                              : Array.isArray(client?.customer) &&
                                client?.customer.length === 0
                              ? "DOES NOT EXIST"
                              : client?.customer
                            : client?.customer?.id
                            ? client?.customer?.id
                            : "DOES NOT EXIST"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-row flex-wrap">
                        <b>Email Address: </b>
                        <p className="italic flex flex-row ml-2 items-center">
                          {client?.email}
                          {client?.emailVerified ? (
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-movet-green ml-2"
                            />
                          ) : client?.emailVerified === false ? (
                            <span className="group flex flex-row items-center flex-wrap">
                              <FontAwesomeIcon
                                icon={faCircleExclamation}
                                className="text-movet-yellow ml-2"
                              />
                              <span className="hidden group-hover:flex items-center ml-2 text-xs text-movet-yellow font-extrabold">
                                Client has not set an account password yet
                              </span>
                            </span>
                          ) : (
                            ""
                          )}
                        </p>
                      </div>
                      <div className="mt-2">
                        <b>Phone Number: </b>
                        <span className="italic">
                          {client?.phone !== undefined
                            ? formatPhoneNumber(client?.phone)
                            : client?.phoneNumber
                            ? client?.phoneNumber
                            : "UNKNOWN"}
                        </span>
                      </div>
                      <div className="mt-2">
                        <b>Address: </b>
                        <span className="italic">
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
                      </div>
                    </div>
                  )}
                  <Divider />
                  <div className="flex flex-row items-center w-full mt-2 ml-2">
                    <h3 className="text-lg m-0 font-extrabold">
                      <FontAwesomeIcon icon={faEnvelope} className="mr-4" />
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
                                  ? `https://dashboard.stripe.com/customers/${JSON.stringify(
                                      client?.customer
                                    )}/`
                                  : `https://dashboard.stripe.com/test/customers/${JSON.stringify(
                                      client?.customer
                                    )}/`
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
                  (errors !== null && errors[0] !== "Client Not Found...")
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
        content={
          <p className="text-lg">
            Are you sure you want to delete this client?{" "}
            <span className="text-lg italic font-bold">
              This action cannot be undone!
            </span>
          </p>
        }
        title={`Delete Client ${query?.id}`}
        icon={faRedo}
        action={deleteClient}
        yesButtonText="YES"
        noButtonText="CANCEL"
      />
    </>
  );
};

export default Client;
