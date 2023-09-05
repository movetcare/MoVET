import {
  faCircleUser,
  faClockFour,
  faHospitalUser,
  faCheck,
  faCartShopping,
  faFlagCheckered,
  faUserCog,
  faUser,
  faPaw,
  faCreditCard,
  faEnvelope,
  faPhone,
  faTimesCircle,
  faCommentSms,
  faQuestion,
  faCircleCheck,
  faCircleExclamation,
  faPaperPlane,
  faCheckToSlot,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  query,
  collection,
  where,
  doc,
  serverTimestamp,
  updateDoc,
  limit,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore, functions } from "services/firebase";
import { timeSince } from "utils/timeSince";
import { Loader } from "ui";
import Error from "components/Error";
import environment from "utils/environment";
import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";
import { formatPhoneNumber } from "utils/formatPhoneNumber";
import { useState } from "react";
import { GOTO_PHONE_URL } from "constants/urls";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export const Waitlist = () => {
  const [showArchive, setShowArchive] = useState<boolean>(false);
  const [clients, loading, error] = useCollection(
    query(collection(firestore, "waitlist"), where("isActive", "==", true)),
  );

  const [previousCheckIns, loadingPreviousCheckIns, errorPreviousCheckIns] =
    useCollection(
      query(
        collection(firestore, "waitlist"),
        where("isActive", "==", false),
        limit(50),
      ),
    );

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
      <div className="flex flex-row items-center justify-center -mb-4">
        <FontAwesomeIcon
          icon={faHospitalUser}
          className="text-movet-red"
          size="lg"
        />
        <h1 className="ml-2 my-4 text-lg">
          {loading ? "Loading..." : "Client Check Ins"}
        </h1>
      </div>
      {loading ? (
        <div className="mb-6">
          <Loader height={200} width={200} />
        </div>
      ) : error ? (
        <div className="px-8 pb-8">
          <Error error={error} />
        </div>
      ) : (
        <ul
          role="list"
          className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
        >
          {clients && clients.docs.length < 1 && (
            <p className="text-lg italic text-movet-red opacity-50 text-center mx-8 mt-4 mb-4">
              There are no clients checking in...
            </p>
          )}
          {clients &&
            clients.docs.map((client: any, index: number) => (
              <li key={index}>
                <div
                  className={`flex flex-col items-center px-4 py-4 sm:px-6${
                    client?.data()?.status === "complete"
                      ? " bg-movet-green text-movet-white font-bold"
                      : client?.data()?.status === "error"
                      ? " bg-movet-red text-movet-white"
                      : ""
                  }`}
                >
                  <div className="min-w-0 flex w-full">
                    <div className="flex-shrink-0 cursor-pointer md:mr-4">
                      <a
                        href={
                          environment === "production"
                            ? `https://us.provetcloud.com/4285/client/${client?.data()
                                ?.id}/`
                            : `https://us.provetcloud.com/4285/client/${client?.data()
                                ?.id}/`
                        }
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon icon={faCircleUser} size="2x" />
                      </a>
                    </div>
                    <div className="min-w-0 flex flex-row justify-center md:justify-between w-full">
                      <div className="flex flex-row items-center">
                        <Tooltip id="viewProVet" />
                        <a
                          data-tooltip-id="viewProVet"
                          data-tooltip-content="View in ProVet"
                          title="View in ProVet"
                          href={
                            environment === "production"
                              ? `https://us.provetcloud.com/4285/client/${client?.data()
                                  ?.id}/`
                              : `https://us.provetcloud.com/4285/client/${client?.data()
                                  ?.id}/`
                          }
                          target="_blank"
                          className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                          rel="noreferrer"
                        >
                          {client?.data()?.firstName && client?.data()?.lastName
                            ? `${client?.data()?.firstName} ${client?.data()
                                ?.lastName}`
                            : client?.data()?.email}
                        </a>
                      </div>
                      <div className="hidden md:flex justify-end">
                        {client?.data()?.customerId && (
                          <>
                            <Tooltip id="ViewInStripe" />
                            <a
                              data-tooltip-id="ViewInStripe"
                              data-tooltip-content="View Customer in Stripe"
                              title="View Customer in Stripe"
                              href={
                                environment === "production"
                                  ? `https://dashboard.stripe.com/customers/` +
                                    client?.data()?.customerId?.toString()
                                  : `https://dashboard.stripe.com/test/customers/` +
                                    client?.data()?.customerId?.toString()
                              }
                              target="_blank"
                              className="mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black text-sm"
                              rel="noreferrer"
                            >
                              <FontAwesomeIcon icon={faCreditCard} size="lg" />
                              {client?.data()?.paymentMethod?.card ? (
                                <span className="ml-2">
                                  {client
                                    ?.data()
                                    ?.paymentMethod?.card?.brand?.toUpperCase()}{" "}
                                  {client
                                    ?.data()
                                    ?.paymentMethod?.card?.last4?.toUpperCase()}
                                </span>
                              ) : (
                                ""
                              )}
                            </a>
                          </>
                        )}
                        <div className="flex h-full items-center">
                          {!client?.data()?.status && (
                            <>
                              <span className="flex-shrink-0 mr-2 text-movet-red">
                                <FontAwesomeIcon icon={faQuestion} size="sm" />
                              </span>
                              <p className="mr-2 font-extrabold text-lg text-movet-red">
                                UNKNOWN STATUS
                              </p>
                            </>
                          )}
                          {client?.data()?.status === "started" && (
                            <>
                              <span className="flex-shrink-0 mr-2">
                                <FontAwesomeIcon
                                  icon={faFlagCheckered}
                                  size="sm"
                                />
                              </span>
                              <p className="mr-2 text-sm">STARTED</p>
                            </>
                          )}
                          {client?.data()?.status === "creating-client" && (
                            <>
                              <span className="flex-shrink-0 mr-2 text-movet-green">
                                <FontAwesomeIcon icon={faUserCog} />
                              </span>
                              <p className="mr-2 text-sm">CREATING CLIENT</p>
                            </>
                          )}
                          {client?.data()?.status === "processing-client" && (
                            <>
                              <span className="flex-shrink-0 mr-2 text-movet-green">
                                <FontAwesomeIcon icon={faUser} />
                              </span>
                              <p className="mr-2 text-sm">PROCESSING</p>
                            </>
                          )}
                          {client?.data()?.status === "checkout" && (
                            <>
                              <span className="flex-shrink-0 mr-2">
                                <FontAwesomeIcon
                                  icon={faCartShopping}
                                  size="sm"
                                />
                              </span>
                              <p className="mr-2 text-sm">CHECKING OUT</p>
                            </>
                          )}
                          {client?.data()?.status === "complete" && (
                            <>
                              <span className="flex-shrink-0 mr-2">
                                <FontAwesomeIcon icon={faCheck} size="lg" />
                              </span>
                              <span className="mr-2 text-sm">
                                CHECK IN COMPLETE
                              </span>
                            </>
                          )}
                          <div>
                            <span className="flex-shrink-0 mr-2 ml-4">
                              <FontAwesomeIcon icon={faClockFour} />
                            </span>
                            <time
                              className="text-sm"
                              dateTime={client
                                ?.data()
                                ?.updatedOn?.toDate()
                                .toString()}
                            >
                              {timeSince(client?.data()?.updatedOn?.toDate())}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Tooltip id="remove" />
                    <button
                      data-tooltip-id="remove"
                      data-tooltip-content="Remove from Waitlist"
                      title="Remove from Waitlist"
                      className="md:ml-6 md:mr-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                      onClick={async () => {
                        await updateDoc(
                          doc(firestore, `waitlist/${client?.data()?.email}`),
                          {
                            updatedOn: serverTimestamp(),
                            isActive: false,
                          },
                        )
                          .then(() =>
                            toast(
                              `${
                                client?.data()?.firstName &&
                                client?.data()?.lastName
                                  ? `${client?.data()
                                      ?.firstName} ${client?.data()?.lastName}`
                                  : client?.data()?.email
                              } has been removed from the waitlist`,
                              {
                                icon: (
                                  <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    size="sm"
                                  />
                                ),
                              },
                            ),
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
                      }}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                    </button>
                  </div>
                  {client?.data()?.customerId && (
                    <>
                      <Tooltip id="viewStripe" />
                      <a
                        data-tooltip-id="viewStripe"
                        data-tooltip-content="View Customer in Stripe"
                        title="View Customer in Stripe"
                        href={
                          environment === "production"
                            ? `https://dashboard.stripe.com/customers/` +
                              client?.data()?.customerId?.toString()
                            : `https://dashboard.stripe.com/test/customers/` +
                              client?.data()?.customerId?.toString()
                        }
                        target="_blank"
                        className="md:hidden mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                        rel="noreferrer"
                      >
                        <FontAwesomeIcon icon={faCreditCard} size="lg" />
                        {client?.data()?.paymentMethod?.card ? (
                          <span className="ml-2">
                            {client
                              ?.data()
                              ?.paymentMethod?.card?.brand?.toUpperCase()}{" "}
                            {client
                              ?.data()
                              ?.paymentMethod?.card?.last4?.toUpperCase()}
                          </span>
                        ) : (
                          ""
                        )}
                      </a>
                    </>
                  )}
                  <div className="flex justify-center items-center mt-3 w-full">
                    {client?.data()?.id && (
                      <>
                        <Tooltip id="viewProvet" />
                        <a
                          data-tooltip-id="viewProvet"
                          data-tooltip-content="View in ProVet"
                          title="View in ProVet"
                          href={
                            environment === "production"
                              ? `https://us.provetcloud.com/4285/client/${client?.data()
                                  ?.id}/`
                              : `https://us.provetcloud.com/4285/client/${client?.data()
                                  ?.id}/`
                          }
                          target="_blank"
                          className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faPaw} size="lg" />
                        </a>
                      </>
                    )}
                    {client?.data()?.email && (
                      <>
                        <Tooltip id="sendEmail" />
                        <a
                          data-tooltip-id="sendEmail"
                          data-tooltip-content="Email Client"
                          title="Email Client"
                          href={`mailto://${client?.data()?.email}`}
                          target="_blank"
                          className="mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faEnvelope} size="lg" />
                        </a>
                      </>
                    )}
                    {client?.data()?.phone && (
                      <>
                        <Tooltip id="callClient" />
                        <a
                          data-tooltip-id="callClient"
                          data-tooltip-content="Call Client"
                          title="Call Client"
                          href={`${GOTO_PHONE_URL}/${client?.data()?.phone}`}
                          target="_blank"
                          className="mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                          rel="noreferrer"
                        >
                          <FontAwesomeIcon icon={faPhone} size="lg" />
                        </a>
                      </>
                    )}
                    {client?.data()?.phone &&
                      client?.data()?.status === "complete" && (
                        <>
                          <Tooltip id="textClient" />
                          <button
                            data-tooltip-id="textClient"
                            data-tooltip-content="Send  `Ready for Appointment` to Client"
                            title="Send  `Ready for Appointment` to Client"
                            onClick={() => {
                              toast(
                                `SENDING "Ready for Appointment" message to ${
                                  client?.data()?.firstName
                                    ? client?.data()?.firstName
                                    : ""
                                } @ ${
                                  client?.data()?.phone
                                    ? formatPhoneNumber(client?.data()?.phone)
                                    : ""
                                }`,
                                {
                                  icon: (
                                    <FontAwesomeIcon
                                      icon={faPaperPlane}
                                      size="sm"
                                      className="text-movet-yellow"
                                    />
                                  ),
                                },
                              );
                              const checkInText = httpsCallable(
                                functions,
                                "checkInText",
                              );
                              checkInText({
                                id: client?.data()?.id,
                              })
                                .then(() =>
                                  toast(
                                    `SENT "Ready for Appointment" message to ${
                                      client?.data()?.firstName
                                        ? client?.data()?.firstName
                                        : ""
                                    } @ ${
                                      client?.data()?.phone
                                        ? formatPhoneNumber(
                                            client?.data()?.phone,
                                          )
                                        : ""
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
                                  ),
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
                            }}
                            className="mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                          >
                            <FontAwesomeIcon icon={faCommentSms} size="lg" />
                          </button>
                        </>
                      )}
                  </div>
                  <div className="md:hidden lg:hidden flex flex-row items-center text-sm mt-4">
                    {!client?.data()?.status && (
                      <p className="mr-2 font-extrabold text-lg text-movet-red">
                        UNKNOWN STATUS
                      </p>
                    )}
                    {client?.data()?.status === "started" && (
                      <>
                        <span className="flex-shrink-0 cursor-pointer mr-2">
                          <FontAwesomeIcon icon={faFlagCheckered} size="sm" />
                        </span>
                        <p className="mr-2 text-xs">STARTED</p>
                      </>
                    )}
                    {client?.data()?.status === "creating-client" && (
                      <>
                        <span className="flex-shrink-0 cursor-pointer mr-2 text-movet-green">
                          <FontAwesomeIcon icon={faUserCog} />
                        </span>
                        <p className="mr-2 text-xs">CREATING CLIENT</p>
                      </>
                    )}
                    {client?.data()?.status === "processing-client" && (
                      <>
                        <span className="flex-shrink-0 cursor-pointer mr-2 text-movet-green">
                          <FontAwesomeIcon icon={faUser} />
                        </span>
                        <p className="mr-2 text-xs">PROCESSING</p>
                      </>
                    )}
                    {client?.data()?.status === "checkout" && (
                      <>
                        <span className="flex-shrink-0 cursor-pointer mr-2">
                          <FontAwesomeIcon icon={faCartShopping} size="sm" />
                        </span>
                        <p className="mr-2 text-xs">CHECKING OUT</p>
                      </>
                    )}
                    {client?.data()?.status === "complete" && (
                      <>
                        <span className="flex-shrink-0 cursor-pointer mr-2 text-movet-white">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span className="mr-2 text-xs">CHECK IN COMPLETE</span>
                      </>
                    )}
                    <span className="flex-shrink-0 cursor-pointer mr-2">
                      <FontAwesomeIcon icon={faClockFour} />
                    </span>
                    <time
                      className="text-xs"
                      dateTime={client?.data()?.updatedOn?.toDate().toString()}
                    >
                      {timeSince(client?.data()?.updatedOn?.toDate())}
                    </time>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}
      {previousCheckIns && previousCheckIns.docs.length > 0 && (
        <>
          <div
            className={
              "group w-full flex flex-row items-center justify-center -mb-4 hover:text-movet-white hover:bg-movet-black hover:cursor-pointer border-t-movet-gray border-t"
            }
            onClick={() => setShowArchive(!showArchive)}
          >
            <div className="hidden group-hover:block">
              <FontAwesomeIcon icon={faCheckToSlot} size={"sm"} />
            </div>
            <h2 className={"ml-2 text-sm my-3 font-bold"}>
              {loading ? "Loading Previous Check Ins..." : "Previous Check Ins"}
            </h2>
            <div className="hidden group-hover:block ml-2 text-movet-black group-hover:text-movet-white">
              {showArchive ? (
                <FontAwesomeIcon icon={faCaretDown} size="xs" />
              ) : (
                <FontAwesomeIcon icon={faCaretUp} size="xs" />
              )}
            </div>
          </div>
          {loadingPreviousCheckIns ? (
            <div className="mb-6">
              <Loader height={200} width={200} />
            </div>
          ) : errorPreviousCheckIns ? (
            <div className="px-8 pb-8">
              <Error error={errorPreviousCheckIns} />
            </div>
          ) : (
            <ul
              role="list"
              className="divide-y divide-movet-gray border-t border-movet-gray mt-4"
            >
              {showArchive &&
                previousCheckIns &&
                previousCheckIns.docs.map((client: any, index: number) =>
                  client?.data()?.status ? (
                    <li key={index}>
                      <div
                        className={`flex flex-col items-center px-4 py-4 sm:px-6${
                          client?.data()?.status === "complete"
                            ? " bg-movet-green text-movet-white font-bold"
                            : client?.data()?.status === "error"
                            ? " bg-movet-red text-movet-white"
                            : ""
                        }`}
                      >
                        <div className="min-w-0 flex w-full">
                          <div className="flex-shrink-0 cursor-pointer md:mr-4">
                            <a
                              href={
                                environment === "production"
                                  ? `https://us.provetcloud.com/4285/client/${client?.data()
                                      ?.id}/`
                                  : `https://us.provetcloud.com/4285/client/${client?.data()
                                      ?.id}/`
                              }
                              target="_blank"
                              className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                              rel="noreferrer"
                            >
                              <FontAwesomeIcon icon={faCircleUser} size="2x" />
                            </a>
                          </div>
                          <div className="min-w-0 flex flex-row justify-center md:justify-between w-full">
                            <div className="flex flex-row items-center">
                              <a
                                href={
                                  environment === "production"
                                    ? `https://us.provetcloud.com/4285/client/${client?.data()
                                        ?.id}/`
                                    : `https://us.provetcloud.com/4285/client/${client?.data()
                                        ?.id}/`
                                }
                                target="_blank"
                                className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                                rel="noreferrer"
                              >
                                {client?.data()?.firstName &&
                                client?.data()?.lastName
                                  ? `${client?.data()
                                      ?.firstName} ${client?.data()?.lastName}`
                                  : client?.data()?.email}
                              </a>
                            </div>
                            <div className="hidden md:flex justify-end">
                              {client?.data()?.customerId && (
                                <>
                                  <a
                                    href={
                                      environment === "production"
                                        ? `https://dashboard.stripe.com/customers/` +
                                          client?.data()?.customerId?.toString()
                                        : `https://dashboard.stripe.com/test/customers/` +
                                          client?.data()?.customerId?.toString()
                                    }
                                    target="_blank"
                                    className="mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black text-sm"
                                    rel="noreferrer"
                                  >
                                    <FontAwesomeIcon
                                      icon={faCreditCard}
                                      size="lg"
                                    />
                                    {client?.data()?.paymentMethod?.card ? (
                                      <span className="ml-2">
                                        {client
                                          ?.data()
                                          ?.paymentMethod?.card?.brand?.toUpperCase()}{" "}
                                        {client
                                          ?.data()
                                          ?.paymentMethod?.card?.last4?.toUpperCase()}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </a>
                                </>
                              )}
                              <div className="flex h-full items-center">
                                {!client?.data()?.status && (
                                  <>
                                    <span className="flex-shrink-0 mr-2 text-movet-red">
                                      <FontAwesomeIcon
                                        icon={faQuestion}
                                        size="sm"
                                      />
                                    </span>
                                    <p className="mr-2 font-extrabold text-lg text-movet-red">
                                      UNKNOWN STATUS
                                    </p>
                                  </>
                                )}
                                {client?.data()?.status === "started" && (
                                  <>
                                    <span className="flex-shrink-0 mr-2">
                                      <FontAwesomeIcon
                                        icon={faFlagCheckered}
                                        size="sm"
                                      />
                                    </span>
                                    <p className="mr-2 text-sm">STARTED</p>
                                  </>
                                )}
                                {client?.data()?.status ===
                                  "creating-client" && (
                                  <>
                                    <span className="flex-shrink-0 mr-2 text-movet-green">
                                      <FontAwesomeIcon icon={faUserCog} />
                                    </span>
                                    <p className="mr-2 text-sm">
                                      CREATING CLIENT
                                    </p>
                                  </>
                                )}
                                {client?.data()?.status ===
                                  "processing-client" && (
                                  <>
                                    <span className="flex-shrink-0 mr-2 text-movet-green">
                                      <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <p className="mr-2 text-sm">PROCESSING</p>
                                  </>
                                )}
                                {client?.data()?.status === "checkout" && (
                                  <>
                                    <span className="flex-shrink-0 mr-2">
                                      <FontAwesomeIcon
                                        icon={faCartShopping}
                                        size="sm"
                                      />
                                    </span>
                                    <p className="mr-2 text-sm">CHECKING OUT</p>
                                  </>
                                )}
                                {client?.data()?.status === "complete" && (
                                  <>
                                    <span className="flex-shrink-0 mr-2">
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        size="lg"
                                      />
                                    </span>
                                    <span className="mr-2 text-sm">
                                      CHECK IN COMPLETE
                                    </span>
                                  </>
                                )}

                                <div>
                                  <span className="flex-shrink-0 mr-2 ml-4">
                                    <FontAwesomeIcon icon={faClockFour} />
                                  </span>
                                  <time
                                    className="text-sm"
                                    dateTime={client
                                      ?.data()
                                      ?.updatedOn?.toDate()
                                      .toString()}
                                  >
                                    {timeSince(
                                      client?.data()?.updatedOn?.toDate(),
                                    )}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {client?.data()?.customerId && (
                          <a
                            data-tip="View Stripe Customer Details"
                            href={
                              environment === "production"
                                ? `https://dashboard.stripe.com/customers/` +
                                  client?.data()?.customerId?.toString()
                                : `https://dashboard.stripe.com/test/customers/` +
                                  client?.data()?.customerId?.toString()
                            }
                            target="_blank"
                            className="md:hidden mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                            rel="noreferrer"
                          >
                            <FontAwesomeIcon icon={faCreditCard} size="lg" />
                            {client?.data()?.paymentMethod?.card ? (
                              <span className="ml-2">
                                {client
                                  ?.data()
                                  ?.paymentMethod?.card?.brand?.toUpperCase()}{" "}
                                {client
                                  ?.data()
                                  ?.paymentMethod?.card?.last4?.toUpperCase()}
                              </span>
                            ) : (
                              ""
                            )}
                          </a>
                        )}
                        <div className="flex justify-center items-center mt-3 w-full">
                          {client?.data()?.id && (
                            <>
                              <a
                                href={
                                  environment === "production"
                                    ? `https://us.provetcloud.com/4285/client/${client?.data()
                                        ?.id}/`
                                    : `https://us.provetcloud.com/4285/client/${client?.data()
                                        ?.id}/`
                                }
                                target="_blank"
                                className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                                rel="noreferrer"
                              >
                                <FontAwesomeIcon icon={faPaw} size="lg" />
                              </a>
                            </>
                          )}
                          {client?.data()?.email && (
                            <>
                              <a
                                href={`mailto://${client?.data()?.email}`}
                                target="_blank"
                                className="mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                                rel="noreferrer"
                              >
                                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                              </a>
                            </>
                          )}
                          {client?.data()?.phone && (
                            <>
                              <a
                                href={`${GOTO_PHONE_URL}/${client?.data()
                                  ?.phone}`}
                                target="_blank"
                                className="mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                                rel="noreferrer"
                              >
                                <FontAwesomeIcon icon={faPhone} size="lg" />
                              </a>
                            </>
                          )}
                          {client?.data()?.phone &&
                            client?.data()?.status === "complete" && (
                              <>
                                <button
                                  onClick={() => {
                                    toast(
                                      `SENDING "Ready for Appointment" message to ${
                                        client?.data()?.firstName
                                          ? client?.data()?.firstName
                                          : ""
                                      } @ ${
                                        client?.data()?.phone
                                          ? formatPhoneNumber(
                                              client?.data()?.phone,
                                            )
                                          : ""
                                      }`,
                                      {
                                        icon: (
                                          <FontAwesomeIcon
                                            icon={faPaperPlane}
                                            size="sm"
                                            className="text-movet-yellow"
                                          />
                                        ),
                                      },
                                    );
                                    const checkInText = httpsCallable(
                                      functions,
                                      "checkInText",
                                    );
                                    checkInText({
                                      id: client?.data()?.id,
                                    })
                                      .then(() =>
                                        toast(
                                          `SENT "Ready for Appointment" message to ${
                                            client?.data()?.firstName
                                              ? client?.data()?.firstName
                                              : ""
                                          } @ ${
                                            client?.data()?.phone
                                              ? formatPhoneNumber(
                                                  client?.data()?.phone,
                                                )
                                              : ""
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
                                        ),
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
                                  }}
                                  className="mx-2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out focus:outline-none hover:text-movet-black"
                                >
                                  <FontAwesomeIcon
                                    icon={faCommentSms}
                                    size="lg"
                                  />
                                </button>
                              </>
                            )}
                        </div>
                        <div className="md:hidden lg:hidden flex flex-row items-center text-sm mt-4">
                          {!client?.data()?.status && (
                            <p className="mr-2 font-extrabold text-lg text-movet-red">
                              UNKNOWN STATUS
                            </p>
                          )}
                          {client?.data()?.status === "started" && (
                            <>
                              <span className="flex-shrink-0 cursor-pointer mr-2">
                                <FontAwesomeIcon
                                  icon={faFlagCheckered}
                                  size="sm"
                                />
                              </span>
                              <p className="mr-2 text-xs">STARTED</p>
                            </>
                          )}
                          {client?.data()?.status === "creating-client" && (
                            <>
                              <span className="flex-shrink-0 cursor-pointer mr-2 text-movet-green">
                                <FontAwesomeIcon icon={faUserCog} />
                              </span>
                              <p className="mr-2 text-xs">CREATING CLIENT</p>
                            </>
                          )}
                          {client?.data()?.status === "processing-client" && (
                            <>
                              <span className="flex-shrink-0 cursor-pointer mr-2 text-movet-green">
                                <FontAwesomeIcon icon={faUser} />
                              </span>
                              <p className="mr-2 text-xs">PROCESSING</p>
                            </>
                          )}
                          {client?.data()?.status === "checkout" && (
                            <>
                              <span className="flex-shrink-0 cursor-pointer mr-2">
                                <FontAwesomeIcon
                                  icon={faCartShopping}
                                  size="sm"
                                />
                              </span>
                              <p className="mr-2 text-xs">CHECKING OUT</p>
                            </>
                          )}
                          {client?.data()?.status === "complete" && (
                            <>
                              <span className="flex-shrink-0 cursor-pointer mr-2 text-movet-white">
                                <FontAwesomeIcon icon={faCheck} />
                              </span>
                              <span className="mr-2 text-xs">
                                CHECK IN COMPLETE
                              </span>
                            </>
                          )}
                          <span className="flex-shrink-0 cursor-pointer mr-2">
                            <FontAwesomeIcon icon={faClockFour} />
                          </span>
                          <time
                            className="text-xs"
                            dateTime={client
                              ?.data()
                              ?.updatedOn?.toDate()
                              .toString()}
                          >
                            {timeSince(client?.data()?.updatedOn?.toDate())}
                          </time>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <></>
                  ),
                )}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
