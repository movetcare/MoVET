import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  faPaw,
  faCreditCard,
  faPhone,
  faEnvelope,
  faUser,
  faRedo,
  faFlag,
  faAppleAlt,
  faSms,
  faCheck,
  faEnvelopeSquare,
  faCircleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GOTO_PHONE_URL } from "constants/urls";
import environment from "utils/environment";
import { collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { firestore, functions } from "services/firebase";
import { Button, Loader } from "ui";
import Error from "components/Error";
import { timeSince } from "utils/timeSince";
import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter";
import { getMMDDFromDate } from "utils/getMMDDFromDate";
import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";
import { formatPhoneNumber } from "utils/formatPhoneNumber";
const Client = () => {
  const router = useRouter();
  const { query } = router;
  const [account, setAccount] = useState<any>(null);
  const [errors, setErrors] = useState<Array<string> | null>(null);
  const [client, setClient] = useState<any>();
  const [paymentMethods, setPaymentMethods] = useState<any>();
  const [isLoadingAccount, setIsLoadingAccount] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentMethodsData, isLoadingPaymentMethods, errorPaymentMethods] =
    useCollection(
      collection(firestore, `clients/${query?.id}/payment_methods`)
    );
  const [clientData, isLoadingClient, errorClient] = useDocument(
    doc(firestore, `clients/${query?.id}`)
  );

  useEffect(() => {
    if (!isLoadingClient && !isLoadingPaymentMethods) setIsLoading(false);
    if (clientData && paymentMethodsData?.docs) {
      setClient(clientData.data());
      const paymentMethods: any = [];
      paymentMethodsData.docs.map((paymentMethod: any) =>
        paymentMethods.push(paymentMethod.data())
      );
      setPaymentMethods(paymentMethods);
      const verifyAccount = httpsCallable(functions, "verifyAccount");
      verifyAccount({
        id: query?.id,
      })
        .then((result: any) => {
          console.log("result", result.data);
          setClient(result.data);
          // if (result.data?.errors.length > 0) setErrors(result.data.errors);
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
  }, [
    isLoadingPaymentMethods,
    isLoadingClient,
    clientData,
    paymentMethodsData,
    query,
  ]);

  const sendPaymentLink = (mode: "SMS" | "EMAIL") => {
    toast(
      `SENDING PAYMENT LINK ${mode} TO ${
        mode === "SMS" ? formatPhoneNumber(client?.phone) : client?.email
      }`,
      {
        position: "top-center",
        duration: 3500,
        icon: (
          <FontAwesomeIcon
            icon={mode === "SMS" ? faSms : faEnvelopeSquare}
            size="lg"
            className="text-movet-green"
          />
        ),
      }
    );
  };

  const addToWaitlist = () => {
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
  };

  const flagClient = () => {
    toast(`FLAG ACCOUNT FEATURE COMING SOON!`, {
      position: "top-center",
      duration: 3500,
      icon: (
        <FontAwesomeIcon
          icon={faFlag}
          size="lg"
          className="text-movet-yellow"
        />
      ),
    });
  };
  const reloadPage = () => {
    toast(`RELOADING DATA...`, {
      position: "top-center",
      duration: 3500,
      icon: <FontAwesomeIcon icon={faRedo} size="lg" />,
    });
    router.reload();
  };
  const Divider = () => <hr className="my-4 border-movet-brown/50" />;
  return (
    <div className="flex flex-col md:flex-row">
      <div
        className={`flex flex-col lg:pb-8 lg:pt-4 justify-between bg-white shadow overflow-hidden rounded-lg text-movet-black w-full`}
      >
        {isLoading ? (
          <Loader />
        ) : errorClient || errorPaymentMethods ? (
          <Error error={errorClient || errorPaymentMethods} />
        ) : (
          <>
            <div className="flex sm:items-center justify-between md:pb-6 border-b border-movet-gray px-8 py-4">
              <div className="flex items-center space-x-4">
                <Image
                  src="/images/logo/logo-paw-black.png"
                  alt=""
                  className="hidden md:block w-10 sm:w-16 h-10 sm:h-16 mr-4"
                  priority
                  height={50}
                  width={50}
                />
                <div className="flex flex-col leading-tight">
                  {client && (
                    <div className="text-xl mt-1 flex items-center">
                      <h1 className="mr-3 font-abside">
                        {client?.firstName} {client?.lastName}
                      </h1>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-x-2">
                <div
                  onClick={() => flagClient()}
                  className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                >
                  <FontAwesomeIcon icon={faFlag} size="lg" />
                </div>
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
                {client &&
                  paymentMethods &&
                  paymentMethods.map(
                    (paymentMethod: any, index: number) =>
                      paymentMethod?.active &&
                      index === 0 && (
                        <a
                          key={index}
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
                      )
                  )}
                {client && (
                  <a
                    href={`${GOTO_PHONE_URL}/${client?.phone}`}
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faPhone} size="lg" />
                  </a>
                )}
                {client && (
                  <a
                    href={`mailto:${client?.email}`}
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faEnvelope} size="lg" />
                  </a>
                )}
                <div
                  onClick={() => reloadPage()}
                  className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                >
                  <FontAwesomeIcon icon={faRedo} size="lg" />
                </div>
              </div>
            </div>
            <div className="flex-1 px-4">
              <div className="flex flex-row items-center w-full pt-4">
                <h3 className="text-lg m-0 font-extrabold">
                  <FontAwesomeIcon icon={faUser} className="mr-4" />
                  ACCOUNT:
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
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white">
                    STATUS UNKNOWN
                  </span>
                ) : errors ? (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white">
                    NEEDS REPAIR
                  </span>
                ) : (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white">
                    HEALTHY
                  </span>
                )}
              </div>
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
                      ? client?.customer
                      : client?.customer?.id
                      ? client?.customer?.id
                      : "DOES NOT EXIST!"}
                  </span>
                </div>
                <div className="mt-2">
                  <b>Name: </b>
                  <span className="italic">
                    {client?.firstName} {client?.lastName}
                  </span>
                </div>
                <div className="mt-2">
                  <b>Email Address: </b>
                  <span className="italic">{client?.email}</span>
                </div>
                <div className="mt-2">
                  <b>Phone Number: </b>
                  <span className="italic">
                    {formatPhoneNumber(client?.phone)}
                  </span>
                </div>
                <div className="mt-2">
                  <b>Address: </b>
                  <span className="italic">
                    {client?.street ? client?.street : "STREET UNKNOWN!"}
                  </span>
                  <span className="italic">
                    {" "}
                    {client?.city ? client?.city : "CITY UNKNOWN!"}
                  </span>
                  <span className="italic">
                    {" "}
                    {client?.state ? client?.state : "STATE UNKNOWN!"}
                  </span>
                  <span className="italic">
                    {" "}
                    {client?.zipCode ? client?.zipCode : "ZIPCODE UNKNOWN!"}
                  </span>
                </div>
                <div className="mt-2">
                  <b>Joined: </b>
                  <span className="italic">
                    {client?.createdOn
                      ? timeSince(client?.createdOn?.toDate())
                      : "UNKNOWN!"}
                  </span>
                </div>
                <div className="mt-2">
                  <b>Last Updated: </b>
                  <span className="italic">
                    {client?.updatedOn
                      ? timeSince(client?.updatedOn?.toDate())
                      : "UNKNOWN!"}
                  </span>
                </div>
              </div>
              <Divider />
              <div className="flex flex-row items-center w-full mt-2">
                <h3 className="text-lg m-0 font-extrabold">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-4" />
                  EMAIL NOTIFICATIONS:
                </h3>
                {client?.sendEmail ? (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white">
                    ACTIVE
                  </span>
                ) : (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white">
                    DISABLED
                  </span>
                )}
              </div>
              <Divider />
              <div className="flex flex-row items-center w-full mt-2">
                <h3 className="text-lg m-0 font-extrabold">
                  <FontAwesomeIcon icon={faSms} className="mr-4" />
                  SMS NOTIFICATIONS:
                </h3>
                {client?.sendEmail ? (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white">
                    ACTIVE
                  </span>
                ) : (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white">
                    DISABLED
                  </span>
                )}
              </div>
              <Divider />
              <div className="flex flex-row items-center w-full mt-2">
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="mr-4"
                  size="lg"
                />
                <h3 className="text-lg m-0 font-extrabold">PAYMENT METHOD:</h3>
                {isLoadingAccount ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    size="lg"
                    className="text-movet-brown ml-4"
                  />
                ) : errors ? (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white">
                    STATUS UNKNOWN
                  </span>
                ) : paymentMethods.length === 0 ? (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white">
                    NEEDS A PAYMENT METHOD
                  </span>
                ) : (
                  <span className="ml-4 inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white">
                    READY
                  </span>
                )}
              </div>
              <div className="mt-4 ml-4 sm:ml-8 mb-6">
                {client &&
                  paymentMethods &&
                  paymentMethods.map(
                    (paymentMethod: any, index: number) =>
                      paymentMethod?.active &&
                      index === 0 && (
                        <a
                          key={index}
                          href={
                            environment === "production"
                              ? `https://dashboard.stripe.com/customers/${client?.customer}/`
                              : `https://dashboard.stripe.com/test/customers/${client?.customer}/`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className="mt-2 flex flex-row items-center">
                            <span className="text-xs mr-1">
                              {getMMDDFromDate(
                                new Date(paymentMethod?.created)
                              )}
                            </span>
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
                      )
                  )}
              </div>
              <div className="flex flex-row mb-2">
                <Button
                  text="SMS Payment Link"
                  color="black"
                  icon={faSms}
                  disabled={!client?.sendSms}
                  onClick={() => sendPaymentLink("SMS")}
                />
                <Button
                  text="EMAIL Payment Link"
                  color="black"
                  icon={faEnvelope}
                  disabled={!client?.sendEmail}
                  onClick={() => sendPaymentLink("EMAIL")}
                />
              </div>
            </div>
            <Divider />
            <Button
              text="Client Info Verified"
              color="red"
              icon={faCheck}
              disabled={!client?.sendEmail}
              onClick={() => addToWaitlist()}
              className="bg-movet-green mb-8 mt-4"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Client;
