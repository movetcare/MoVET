import {
  faDollarSign,
  faEdit,
  faChevronCircleUp,
  faChevronCircleDown,
  faCreditCard,
  faRedo,
  faMoneyCheckDollar,
  faMoneyBill1,
  faTriangleExclamation,
  faInfoCircle,
  faUser,
  faHandHoldingDollar,
  faHeadset,
  faThumbsUp,
  faCheck,
  faLink,
  faFileInvoiceDollar,
  faFilePen,
  faTag,
  faBan,
  faEnvelopeSquare,
  faHospitalUser,
  faCircleExclamation,
  faCircleCheck,
  faMoneyBillTransfer,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { collection, doc, query } from "firebase/firestore";
import { Fragment, useEffect, useRef, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { firestore, functions } from "services/firebase";
import environment from "utils/environment";
import { timeSince } from "utils/timeSince";
import Error from "components/Error";
import { getMMDDFromDate } from "utils/getMMDDFromDate";
import { httpsCallable } from "firebase/functions";
import { Loader } from "ui";
import toast from "react-hot-toast";

interface Invoice {
  due_sum: number;
  client: string | null;
  id: number;
  updatedOn: any;
  total: number;
  total_vat: number;
  total_with_vat: number;
  client_due_sum: number;
  credit_note: boolean;
  invoice_payment: Array<string>;
  paymentStatus: string;
  paymentIntent: string;
  failureCode: string;
  failureMessage: string;
  paymentIntentObject: any;
  first_original_invoice: string;
  remarks?: string;
}

interface InvoiceItem {
  id: number;
  sum: number;
  sum_vat: number;
  sum_total: number;
  invoice: string;
  invoice_group: string;
  item: string;
  name: string;
}

const InvoiceItemHeader = ({
  client,
  showInvoiceDetails,
  setShowInvoiceDetails,
  transactionState,
  invoice,
  paymentMethods,
}: {
  client: any;
  showInvoiceDetails: boolean;
  setShowInvoiceDetails: any;
  transactionState: any;
  invoice: any;
  paymentMethods: any;
}) => {
  const [invoicePayments]: any = useCollection(
    query(
      collection(
        firestore,
        `${invoice?.client ? "client_invoices" : "counter_sales"}/${
          invoice?.id
        }/payments`
      )
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div
      onClick={() => setShowInvoiceDetails(!showInvoiceDetails)}
      className={
        (showInvoiceDetails
          ? "flex items-center px-4 py-4 sm:px-6 bg-movet-black text-movet-white cursor-pointer"
          : "flex items-center px-4 py-4 sm:px-6 hover:bg-movet-black hover:text-movet-white cursor-pointer") +
        `${
          invoice?.paymentStatus === "partially-refunded" || transactionState
            ? " bg-movet-yellow text-white"
            : invoice?.paymentStatus === "succeeded" ||
              transactionState === "succeeded"
            ? "bg-movet-green"
            : ""
        }`
      }
    >
      <div className="min-w-0 flex-1 flex items-center">
        <div className="flex-shrink-0 cursor-pointer">
          <a
            href={`${
              environment === "production"
                ? "https://us.provetcloud.com/4285/billing/invoice/"
                : "https://us.provetcloud.com/4285/billing/invoice/"
            }${
              invoice?.first_original_invoice
                ? `${getProVetIdFromUrl(invoice?.first_original_invoice)}`
                : `${invoice?.id}`
            }`}
            target="_blank"
            rel="noreferrer"
            className={"hover:text-movet-red"}
          >
            <span className="mr-1 text-sm">
              #
              {invoice?.first_original_invoice
                ? `${getProVetIdFromUrl(invoice?.first_original_invoice)}`
                : `${invoice?.id}`}
            </span>
            <FontAwesomeIcon
              icon={invoice?.client_due_sum === 0 ? faLink : faEdit}
              size="xs"
            />
          </a>
        </div>
        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-6 md:gap-2">
          <div className="flex flex-row col-span-5 justify-between items-center">
            <div className="flex flex-row items-center md:w-full">
              <p className="flex flex-row items-center font-bold">
                <FontAwesomeIcon icon={faDollarSign} />
                <span className="text-xl mr-1">
                  {invoice?.due_sum === 0
                    ? invoice?.total_with_vat?.toFixed(2)
                    : invoice?.due_sum?.toFixed(2)}
                </span>
                {invoicePayments &&
                  invoicePayments.docs.length > 0 &&
                  invoicePayments.docs.map((item: any, index: number) => {
                    if (index === 0)
                      return item.data()?.payment_type === 0 &&
                        invoice?.paymentIntentObject?.charges?.data[0]
                          ?.payment_method_details ? (
                        <span className="mx-1">
                          <FontAwesomeIcon icon={faCreditCard} size={"sm"} />
                        </span>
                      ) : item.data()?.payment_type === 1 ? (
                        <span className="mx-1">
                          <FontAwesomeIcon icon={faMoneyBill1} />
                        </span>
                      ) : (
                        <span className="mx-1">
                          <FontAwesomeIcon icon={faMoneyCheckDollar} />
                        </span>
                      );
                    return;
                  })}
                <span className="ml-1 text-sm">
                  {invoice?.paymentStatus === "partially-refunded"
                    ? " REFUND IN PROGRESS..."
                    : invoice?.first_original_invoice
                    ? " REFUND"
                    : ""}
                </span>
              </p>
              {client?.firstName && client?.lastName && (
                <>
                  <a
                    href={`${
                      environment === "production"
                        ? "https://us.provetcloud.com/4285/client/"
                        : "https://us.provetcloud.com/4285/client/"
                    }${getProVetIdFromUrl(invoice?.client)}/tabs/`}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:flex flex-row items-center text-sm mx-4 hover:text-movet-red w-full"
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span className="text-sm ml-2">
                      {client?.firstName} {client?.lastName}
                    </span>
                  </a>
                </>
              )}
              {client &&
                paymentMethods &&
                paymentMethods.docs.map(
                  (paymentMethod: any, index: number) =>
                    paymentMethod.data()?.active &&
                    index === 0 && (
                      <>
                        <a
                          key={index}
                          href={
                            environment === "production"
                              ? `https://dashboard.stripe.com/customers/${
                                  client?.customer?.id !== undefined
                                    ? client?.customer?.id
                                    : client?.customer
                                }/`
                              : `https://dashboard.stripe.com/test/customers/${
                                  client?.customer?.id !== undefined
                                    ? client?.customer?.id
                                    : client?.customer
                                }/`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="hidden md:flex flex-row items-center text-sm mx-4 hover:text-movet-red w-full"
                        >
                          <FontAwesomeIcon icon={faCreditCard} />
                          <span className="text-sm ml-2">
                            {paymentMethod.data()?.card?.brand.toUpperCase()} -{" "}
                            {paymentMethod.data()?.card?.last4}
                          </span>
                        </a>
                      </>
                    )
                )}
            </div>
            {client?.firstName && client?.lastName && (
              <a
                href={`${
                  environment === "production"
                    ? "https://us.provetcloud.com/4285/client/"
                    : "https://us.provetcloud.com/4285/client/"
                }${getProVetIdFromUrl(invoice?.client)}/tabs/`}
                target="_blank"
                rel="noreferrer"
                className="md:hidden flex flex-row items-center text-sm hover:text-movet-red w-full"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="text-sm ml-1">
                  {client?.firstName} {client?.lastName}
                </span>
              </a>
            )}
            <p className="md:hidden flex flex-row items-center text-sm">
              {transactionState && (
                <>
                  <span className="flex-shrink-0 cursor-pointer mr-2">
                    <FontAwesomeIcon icon={faHandHoldingDollar} size="sm" />
                  </span>
                  <p className="text-sm flex flex-row">
                    PAYMENT IN PROGRESS...
                  </p>
                </>
              )}
            </p>
            {client &&
              paymentMethods &&
              paymentMethods.docs.map(
                (paymentMethod: any, index: number) =>
                  paymentMethod.data()?.active &&
                  index === 0 && (
                    <a
                      data-tip="View Customer in Stripe"
                      data-for="stripe"
                      key={index}
                      href={
                        environment === "production"
                          ? `https://dashboard.stripe.com/customers/${
                              client?.customer?.id !== undefined
                                ? client?.customer?.id
                                : client?.customer
                            }/`
                          : `https://dashboard.stripe.com/test/customers/${
                              client?.customer?.id !== undefined
                                ? client?.customer?.id
                                : client?.customer
                            }/`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className={
                        "md:hidden text-xl text-movet-white hover:text-movet-red mx-2"
                      }
                    >
                      <FontAwesomeIcon icon={faCreditCard} size="sm" />
                    </a>
                  )
              )}
          </div>
          <div className="hidden md:flex flex-row justify-end items-center">
            {invoice?.client && (
              <>
                <a
                  href={`${
                    environment === "production"
                      ? "https://us.provetcloud.com/4285/client/"
                      : "https://us.provetcloud.com/4285/client/"
                  }${getProVetIdFromUrl(invoice?.client)}/tabs/`}
                  target="_blank"
                  rel="noreferrer"
                  className={`hidden md:flex flex-row items-center text-xl hover:text-movet-white mx-2${
                    client?.email ? " text-movet-green" : " text-movet-red"
                  }`}
                >
                  <FontAwesomeIcon icon={faEnvelopeSquare} />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      {showInvoiceDetails ? (
        <FontAwesomeIcon icon={faChevronCircleDown} />
      ) : (
        <FontAwesomeIcon icon={faChevronCircleUp} />
      )}
    </div>
  );
};

const InvoiceDetails = ({
  client,
  showInvoiceDetails,
  transactionState,
  setTransactionState,
  invoice,
  paymentMethods,
}: {
  client: any;
  showInvoiceDetails: boolean;
  transactionState: any;
  setTransactionState: any;
  invoice: Invoice;
  paymentMethods: any;
}) => {
  const [reader, setReader] = useState<any>();
  const [paymentError, setPaymentError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>();
  const [waitingForSync, setWaitingForSync] = useState<boolean>();
  const [refundModalIsOpen, setRefundModalIsOpen] = useState<boolean>(false);
  const cancelButtonRef = useRef(null);
  const [invoiceItems, loadingInvoiceItems, errorInvoiceItems]: any =
    useCollection(
      query(
        collection(
          firestore,
          `${invoice?.client ? "client_invoices" : "counter_sales"}/${
            invoice?.id
          }/items`
        )
      ),
      {
        snapshotListenOptions: { includeMetadataChanges: true },
      }
    );
  const [invoicePayments, loadingInvoicePayments, errorInvoicePayments]: any =
    useCollection(
      query(
        collection(
          firestore,
          `${invoice?.client ? "client_invoices" : "counter_sales"}/${
            invoice?.id
          }/payments`
        )
      ),
      {
        snapshotListenOptions: { includeMetadataChanges: true },
      }
    );

  const [terminals, loadingTerminals, errorTerminals]: any = useCollection(
    query(collection(firestore, "configuration/pos/terminals")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    if (terminals && terminals.docs.length > 0)
      setReader(terminals.docs[0].data());
  }, [terminals]);

  useEffect(() => {
    if (invoice) {
      if (invoice?.paymentStatus === "in_progress") {
        setTransactionState("in_progress");
        setPaymentError(null);
      } else if (invoice?.paymentStatus === "complete") {
        setIsLoading(false);
        setTransactionState("succeeded");
        setPaymentError(null);
      } else if (invoice?.paymentStatus === "failed") {
        setIsLoading(false);
        setTransactionState("failed");
        setPaymentError({
          code: invoice?.failureCode,
          message: invoice?.failureMessage,
        });
      }
    }
  }, [invoice, setTransactionState]);

  useEffect(() => {
    if (invoiceItems && invoiceItems?.length > 0) setWaitingForSync(false);
    if (client && client?.email) setWaitingForSync(false);
  }, [invoiceItems, client]);

  const simulatePayment = async (reader: string, card: string) => {
    setIsLoading(true);
    setLoadingMessage("Processing Simulator Payment");
    const createPaymentIntent = httpsCallable(functions, "simulatePayment");
    createPaymentIntent({
      reader,
      card,
    })
      .then((result: any) => {
        const {
          failure_code,
          failure_message,
          process_payment_intent,
          status,
          type,
        }: any = result.data || {};
        if (
          failure_code === null &&
          failure_message === null &&
          process_payment_intent !== null &&
          status === "succeeded" &&
          type === "process_payment_intent"
        ) {
          setTransactionState(status);
          setIsLoading(false);
        } else if (failure_code && failure_message) {
          setPaymentError({
            code: failure_code,
            message: failure_message,
          });
          setIsLoading(false);
          setTransactionState("failed");
        } else if (result.data === false) {
          setPaymentError({
            code: "unknown",
            message: "Something went wrong, please try again...",
          });
          setIsLoading(false);
          setTransactionState("failed");
        }
      })
      .catch((error: any) => setPaymentError(error));
  };

  return (
    <>
      <Transition.Root show={refundModalIsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => {
            setRefundModalIsOpen(false);
          }}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-movet-white bg-opacity-50 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 text-movet-red">
                    <FontAwesomeIcon icon={faMoneyBillTransfer} size="2x" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-xl uppercase leading-6 font-medium text-gray-900"
                    >
                      Refund ${invoice?.total_with_vat.toFixed(2)} to{" "}
                      {invoice?.paymentIntentObject?.charges?.data[0]
                        ?.payment_method_details?.card_present
                        ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.brand.toUpperCase()
                        : invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card.brand.toUpperCase()}{" "}
                      -{" "}
                      {invoice?.paymentIntentObject?.charges?.data[0]
                        ?.payment_method_details?.card_present
                        ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.last4.toUpperCase()
                        : invoice?.paymentIntentObject?.charges?.data[0]
                            ?.payment_method_details?.card.last4}
                      ?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-lg">
                        Are you sure you want to issue this refund?{" "}
                        <span className="text-lg italic font-extrabold">
                          This action cannot be undone!
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="bg-movet-red w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setIsLoading(true);
                      setLoadingMessage("Refunding Payment");
                      setRefundModalIsOpen(false);
                      const refundPaymentIntent = httpsCallable(
                        functions,
                        "refundPaymentIntent"
                      );
                      refundPaymentIntent({
                        paymentIntent: invoice?.paymentIntent || "not-found",
                        invoice: invoice?.id?.toString() || "not-found",
                        mode: invoice?.client ? "client" : "counter",
                      })
                        .then((result: any) => {
                          if (result?.data === false) {
                            toast(
                              "Refund could NOT be completed. Please contact support for assistance",
                              {
                                icon: (
                                  <FontAwesomeIcon
                                    icon={faCircleExclamation}
                                    size="sm"
                                    className="text-movet-red"
                                  />
                                ),
                              }
                            );
                            setPaymentError({
                              code: "refund-failed",
                              message:
                                "Refund could NOT be completed. Please contact support for assistance.",
                            });
                            setTransactionState("failed");
                          } else
                            toast(
                              `Payment of $${invoice?.total_with_vat.toFixed(
                                2
                              )} was successfully refunded${
                                client?.firstName && client?.lastName
                                  ? ` to ${client?.firstName} ${client?.lastName}`
                                  : ""
                              }`,
                              {
                                icon: (
                                  <FontAwesomeIcon
                                    icon={faCircleCheck}
                                    className="text-movet-green"
                                    size="sm"
                                  />
                                ),
                              }
                            );
                          toast(
                            `DONT FORGET TO ADD A CREDIT NOTE IN PROVET FOR INVOICE #${invoice?.id}`,
                            {
                              icon: (
                                <FontAwesomeIcon
                                  icon={faCircleExclamation}
                                  className="text-movet-yellow"
                                  size="sm"
                                />
                              ),
                            }
                          );
                        })
                        .catch((error: any) => {
                          console.error(error);
                          toast(error?.message, {
                            icon: (
                              <FontAwesomeIcon
                                icon={faCircleExclamation}
                                size="sm"
                                className="text-movet-red"
                              />
                            ),
                          });
                          setPaymentError(error);
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                  >
                    PROCESS REFUND
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setRefundModalIsOpen(false)}
                    ref={cancelButtonRef}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition
        show={showInvoiceDetails}
        enter="transition ease-in duration-250"
        leave="transition ease-out duration-250"
        leaveTo="opacity-10"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leaveFrom="opacity-100"
      >
        <div className="sm:my-8 flex flex-col w-full justify-center items-center text-large text-movet-black sm:max-w-md border-movet-gray sm:rounded-xl bg-white sm:mx-auto p-8 drop-shadow-2xl">
          <h2 className="my-0 text-xl">
            {invoice?.first_original_invoice
              ? `Credit Note #${invoice?.id}`
              : invoice?.client_due_sum === 0
              ? `PAID Invoice - #${invoice?.id}`
              : `UNPAID Invoice - #${invoice?.id}`}
            <a
              href={`${
                environment === "production"
                  ? "https://us.provetcloud.com/4285/billing/invoice/"
                  : "https://us.provetcloud.com/4285/billing/invoice/"
              }${invoice?.id}`}
              target="_blank"
              rel="noreferrer"
              className="ml-2 hover:underline ease-in-out duration-500 hover:text-movet-red"
            >
              <FontAwesomeIcon
                icon={invoice?.client_due_sum === 0 ? faLink : faEdit}
                size="xs"
              />
            </a>
          </h2>
          <p className="flex flex-rows items-center text-xs mb-4">
            Updated
            <time
              dateTime={invoice?.updatedOn.toDate().toString()}
              className="ml-1"
            >
              {timeSince(invoice?.updatedOn.toDate())}
            </time>
          </p>
          {invoice?.remarks && (
            <div className="bg-movet-white border-l-4 border-movet-black p-4 mb-2 w-full">
              <div className="flex flex-row items-center">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faInfoCircle} size="lg" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">{invoice?.remarks}</p>
                </div>
              </div>
            </div>
          )}
          {transactionState !== "succeeded" ? (
            <div className="w-full">
              {(loadingInvoiceItems ||
                loadingInvoicePayments ||
                loadingTerminals) && (
                <h3 className="text-center uppercase italic">Loading...</h3>
              )}
              {(errorInvoiceItems ||
                errorInvoicePayments ||
                errorTerminals) && (
                <Error
                  error={
                    errorInvoiceItems || errorInvoicePayments || errorTerminals
                  }
                />
              )}
              {!isLoading && invoiceItems && invoiceItems.docs.length > 0 ? (
                invoiceItems.docs.map((item: any, index: number) => (
                  <>
                    <div
                      key={item.data()?.name}
                      className={`flex flex-row justify-between items-center py-2 ${
                        index !== invoiceItems.docs.length - 1
                          ? " border-b"
                          : " border-none"
                      }`}
                    >
                      <h3 className="text-sm">
                        {item.data()?.name}
                        <span className="text-xs">
                          {item.data()?.quantity > 1 &&
                            ` - ${item.data()?.quantity}X`}
                        </span>
                      </h3>
                      <p>${item.data()?.sum?.toFixed(2)}</p>
                    </div>
                    {index === invoiceItems.docs.length - 1 && (
                      <div className="flex flex-col w-full mx-auto italic">
                        <div className="flex flex-row justify-between items-center mt-4 text-sm">
                          <h3>Subtotal</h3>
                          <p>${invoice?.total?.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center border-b p-2 mb-2 text-sm">
                          <h3>Tax</h3>
                          <p>${invoice?.total_vat?.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-row justify-between items-center mt-0 text-sm">
                          <h3>Total</h3>
                          <p>${invoice?.total_with_vat?.toFixed(2)}</p>
                        </div>
                        {invoicePayments &&
                          invoicePayments.docs.length > 0 &&
                          !invoice?.first_original_invoice && (
                            <div className="mt-3 mb-4">
                              <h3 className="text-center italic text-xs uppercase mb-2">
                                Payments & Discounts
                              </h3>
                              {invoicePayments &&
                                invoicePayments.docs.length > 0 &&
                                invoicePayments.docs.map(
                                  (item: any, index: number) => (
                                    <div
                                      key={index}
                                      className={
                                        "flex flex-row justify-between items-center p-2 text-sm"
                                      }
                                    >
                                      <h3>
                                        {item.data()?.payment_type === 0 ? (
                                          <>
                                            <span className="mr-2">
                                              <FontAwesomeIcon
                                                icon={
                                                  invoice?.paymentIntentObject
                                                    ? faCreditCard
                                                    : faTag
                                                }
                                              />
                                            </span>
                                            {invoice?.paymentIntentObject
                                              ?.charges ? (
                                              <span className="text-xs mr-2">
                                                {invoice?.paymentIntentObject
                                                  ?.charges?.data[0]
                                                  ?.payment_method_details
                                                  ?.card_present
                                                  ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.brand.toUpperCase()
                                                  : invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card.brand.toUpperCase()}{" "}
                                                -{" "}
                                                {invoice?.paymentIntentObject
                                                  ?.charges?.data[0]
                                                  ?.payment_method_details
                                                  ?.card_present
                                                  ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.last4.toUpperCase()
                                                  : invoice?.paymentIntentObject
                                                      ?.charges?.data[0]
                                                      ?.payment_method_details
                                                      ?.card.last4}
                                              </span>
                                            ) : (
                                              <span className="text-xs font-bold mr-2">
                                                DISCOUNT
                                              </span>
                                            )}
                                          </>
                                        ) : item.data()?.payment_type === 1 ? (
                                          <span className="mr-2">
                                            <FontAwesomeIcon
                                              icon={faMoneyBill1}
                                            />
                                          </span>
                                        ) : (
                                          <span className="mr-2">
                                            <FontAwesomeIcon
                                              icon={faMoneyCheckDollar}
                                            />
                                          </span>
                                        )}
                                        {invoice?.paymentIntentObject?.charges
                                          ?.data[0]?.payment_method_details &&
                                        item.data()?.created ? (
                                          <span className="text-xs">{`- ${getMMDDFromDate(
                                            new Date(item.data()?.created)
                                          )}`}</span>
                                        ) : (
                                          ""
                                        )}
                                      </h3>
                                      <p>${item.data()?.paid.toFixed(2)}</p>
                                    </div>
                                  )
                                )}
                            </div>
                          )}
                        {invoice?.client_due_sum !== 0 &&
                          invoice?.paymentStatus !== "succeeded" && (
                            <div className="rounded-md bg-movet-red p-4 text-movet-white mt-6">
                              <div className="flex flex-row justify-center items-center text-base">
                                <FontAwesomeIcon
                                  icon={faHandHoldingDollar}
                                  size={"2x"}
                                />
                                <h3 className="ml-2 font-medium text-center text-lg">
                                  AMOUNT DUE - $
                                  <span className="font-bold">
                                    {invoice?.client_due_sum?.toFixed(2)}
                                  </span>
                                </h3>
                              </div>
                            </div>
                          )}
                        {invoice?.client &&
                          invoice?.paymentStatus === "succeeded" && (
                            <a
                              href={
                                (environment === "production"
                                  ? "https://us.provetcloud.com/4285/billing/invoice/"
                                  : "https://us.provetcloud.com/4285/billing/invoice/") +
                                `${invoice?.id}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className={`p-2 mb-4${
                                client?.email
                                  ? " hover:text-movet-green hover:underline ease-in-out duration-500 hover:cursor-pointer"
                                  : " text-movet-yellow"
                              }`}
                            >
                              <div className="flex flex-row justify-center items-center text-xs">
                                <FontAwesomeIcon
                                  icon={faEnvelopeSquare}
                                  size={"2x"}
                                />
                                <h3 className="ml-2 mt-2 font-medium text-center text-sm">
                                  {client?.email
                                    ? "EMAIL INVOICE"
                                    : "MISSING EMAIL"}
                                </h3>
                              </div>
                            </a>
                          )}
                        {invoice?.paymentStatus !== "partially-refunded" ? (
                          <>
                            {(String(invoice?.client_due_sum).slice(-2) ===
                              "75" ||
                              String(invoice?.client_due_sum).slice(-2) ===
                                "65" ||
                              String(invoice?.client_due_sum).slice(-2) ===
                                "55" ||
                              String(invoice?.client_due_sum).slice(-2) ===
                                "05" ||
                              String(invoice?.client_due_sum).slice(-2) ===
                                "03" ||
                              String(invoice?.client_due_sum).slice(-2) ===
                                "02" ||
                              String(invoice?.client_due_sum).slice(-2) ===
                                "01") &&
                              environment !== "production" && (
                                <div className="rounded-md bg-movet-yellow p-4 text-movet-white mt-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                      <FontAwesomeIcon
                                        icon={faTriangleExclamation}
                                        size="2x"
                                      />
                                    </div>
                                    <div className="ml-3">
                                      <h3 className="text-sm font-medium">
                                        WARNING
                                      </h3>
                                      <p className="italic text-xs">
                                        The invoice amount decimal is .
                                        {String(invoice?.client_due_sum).slice(
                                          -2
                                        )}
                                        . This will cause an error to be
                                        returned. To fix this, edit the invoice
                                        amount due to be .00
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            {environment === "production" &&
                              transactionState &&
                              !paymentError &&
                              invoice?.client_due_sum > 0 && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setPaymentError(null);
                                    setTransactionState("in_progress");
                                    setIsLoading(true);
                                    setLoadingMessage("Cancelling Payment...");
                                    const cancelTerminalAction = httpsCallable(
                                      functions,
                                      "cancelTerminalAction"
                                    );
                                    cancelTerminalAction({
                                      reader: reader?.id,
                                      paymentIntent: invoice?.paymentIntent,
                                    })
                                      .then(() => {
                                        setPaymentError(null);
                                        setTransactionState(null);
                                      })
                                      .catch((error: any) =>
                                        setPaymentError(error)
                                      )
                                      .finally(() => setIsLoading(false));
                                  }}
                                  className="mt-6 flex flex-row bg-movet-black group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                >
                                  <span className="mr-2">
                                    <FontAwesomeIcon icon={faBan} size="lg" />
                                  </span>
                                  Cancel Payment
                                </button>
                              )}
                            {!transactionState &&
                              !paymentError &&
                              invoice?.client_due_sum > 0 &&
                              invoice?.paymentStatus !== "succeeded" && (
                                <div className="flex flex-col sm:flex-row mt-8">
                                  <a
                                    href={`${
                                      environment === "production"
                                        ? "https://us.provetcloud.com/4285/billing/invoice/"
                                        : "https://us.provetcloud.com/4285/billing/invoice/"
                                    }${invoice?.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mr-2 flex flex-row bg-movet-white group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-movet-green hover:bg-movet-green hover:text-movet-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                  >
                                    <span className="mr-2">
                                      <FontAwesomeIcon
                                        icon={faMoneyBill1}
                                        size="lg"
                                      />
                                    </span>
                                    Pay w/ CASH
                                  </a>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      setIsLoading(true);
                                      setLoadingMessage(
                                        "Preparing Card Reader"
                                      );
                                      const createPaymentIntent = httpsCallable(
                                        functions,
                                        "createPaymentIntent"
                                      );
                                      createPaymentIntent({
                                        invoice: invoice?.id,
                                        mode: invoice?.client
                                          ? "client"
                                          : "counter",
                                        reader: reader?.id,
                                      })
                                        .then((result: any) => {
                                          const {
                                            failure_code,
                                            failure_message,
                                            process_payment_intent,
                                            status,
                                            type,
                                          }: any = result.data || {};
                                          if (
                                            failure_code === null &&
                                            failure_message === null &&
                                            process_payment_intent !== null &&
                                            status === "in_progress" &&
                                            type === "process_payment_intent"
                                          )
                                            setTransactionState(
                                              process_payment_intent?.payment_intent
                                            );
                                          else if (
                                            failure_code &&
                                            failure_message
                                          ) {
                                            setPaymentError({
                                              code: failure_code,
                                              message: failure_message,
                                            });
                                            setTransactionState("failed");
                                          }
                                        })
                                        .catch((error: any) =>
                                          setPaymentError(error)
                                        )
                                        .finally(() => setIsLoading(false));
                                    }}
                                    className="mt-4 sm:mt-0 ml-0 sm:ml-2 flex flex-row bg-movet-white group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-movet-black hover:bg-movet-green hover:text-movet-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                  >
                                    <span className="mr-2">
                                      <FontAwesomeIcon
                                        icon={faCreditCard}
                                        size="lg"
                                      />
                                    </span>
                                    Pay w/ CARD
                                  </button>
                                </div>
                              )}
                            {client &&
                              paymentMethods?.docs?.length > 0 &&
                              invoice?.client_due_sum !== 0 &&
                              invoice?.paymentStatus !== "succeeded" && (
                                <h2 className="font-extrabold text-center mt-10 -mb-1 text-2xl">
                                  <FontAwesomeIcon icon={faWallet} />
                                  <span className="ml-2">
                                    Saved Payment Methods
                                  </span>
                                </h2>
                              )}
                            {invoice?.client_due_sum !== 0 &&
                              invoice?.paymentStatus !== "succeeded" &&
                              client &&
                              paymentMethods &&
                              paymentMethods.docs.map(
                                (paymentMethod: any, index: number) =>
                                  paymentMethod.data()?.active && (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={async () => {
                                        setIsLoading(true);
                                        setLoadingMessage(`Charging $${invoice?.client_due_sum?.toFixed(
                                          2
                                        )} to ${paymentMethod
                                          .data()
                                          ?.card?.brand.toUpperCase()}
                                        - ${
                                          paymentMethod.data()?.card?.last4
                                        }`);
                                        const createPaymentIntent =
                                          httpsCallable(
                                            functions,
                                            "createPaymentIntent"
                                          );
                                        createPaymentIntent({
                                          invoice: invoice?.id,
                                          mode: "client",
                                          paymentMethod:
                                            paymentMethod.data()?.id,
                                        })
                                          .then((result: any) => {
                                            const {
                                              failure_code,
                                              failure_message,
                                              process_payment_intent,
                                              status,
                                              type,
                                            }: any = result.data || {};
                                            if (
                                              failure_code === null &&
                                              failure_message === null &&
                                              process_payment_intent !== null &&
                                              status === "in_progress" &&
                                              type === "process_payment_intent"
                                            ) {
                                              toast(
                                                `Payment of $${invoice?.total_with_vat.toFixed(
                                                  2
                                                )} was successfully charged${
                                                  client?.firstName &&
                                                  client?.lastName
                                                    ? ` to ${client?.firstName} ${client?.lastName}`
                                                    : ""
                                                }`,
                                                {
                                                  icon: (
                                                    <FontAwesomeIcon
                                                      icon={faCircleCheck}
                                                      className="text-movet-green"
                                                      size="sm"
                                                    />
                                                  ),
                                                }
                                              );
                                              setTransactionState(
                                                process_payment_intent?.payment_intent
                                              );
                                            } else if (
                                              failure_code &&
                                              failure_message
                                            ) {
                                              setPaymentError({
                                                code: failure_code,
                                                message: failure_message,
                                              });
                                              setTransactionState("failed");
                                              toast(
                                                "Payment could NOT be completed. Please try again or contact support for assistance",
                                                {
                                                  icon: (
                                                    <FontAwesomeIcon
                                                      icon={faCircleExclamation}
                                                      size="sm"
                                                      className="text-movet-red"
                                                    />
                                                  ),
                                                }
                                              );
                                            }
                                          })
                                          .catch((error: any) => {
                                            setPaymentError(error);
                                            toast(error.message, {
                                              icon: (
                                                <FontAwesomeIcon
                                                  icon={faCircleExclamation}
                                                  size="sm"
                                                  className="text-movet-red"
                                                />
                                              ),
                                            });
                                          })
                                          .finally(() => setIsLoading(false));
                                      }}
                                      className="mt-6 flex flex-col bg-movet-black group relative w-full justify-center items-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                    >
                                      <>
                                        <div className="flex flex-row justify-center items-center text-lg w-full">
                                          <FontAwesomeIcon
                                            icon={faCreditCard}
                                          />
                                          <span className="ml-2">
                                            Pay w/{" "}
                                            {paymentMethod
                                              .data()
                                              ?.card?.brand.toUpperCase()}{" "}
                                            -{" "}
                                            {paymentMethod.data()?.card?.last4}
                                          </span>
                                        </div>
                                        <span className="text-xs italic mt-2">
                                          Added{" "}
                                          {`${new Date(
                                            paymentMethod
                                              .data()
                                              ?.updatedOn.toDate()
                                          ).toDateString()} @ ${paymentMethod
                                            .data()
                                            ?.updatedOn.toDate()
                                            .toLocaleTimeString("en-US", {
                                              timeZone: "America/Denver",
                                              timeZoneName: "short",
                                              hour12: true,
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}`}
                                        </span>
                                      </>
                                    </button>
                                  )
                              )}
                            {invoice?.client_due_sum === 0 &&
                              invoice?.invoice_payment?.length === 1 &&
                              !invoice?.paymentIntentObject &&
                              invoice?.total_with_vat >= 0 &&
                              invoice?.paymentStatus !== "fully-refunded" &&
                              item.data()?.payment_type === 0 && (
                                <a
                                  href={`mailto:support@movetcare.com?subject=Assistance w/ Refunding Customer Invoice #${invoice?.id}`}
                                  target="_blank"
                                  className="mt-4 flex flex-row bg-movet-black group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                  rel="noreferrer"
                                >
                                  <span className="mr-2">
                                    <FontAwesomeIcon
                                      icon={faHeadset}
                                      size="lg"
                                    />
                                  </span>
                                  CONTACT SUPPORT TO REFUND
                                </a>
                              )}
                            {invoice?.client_due_sum === 0 &&
                              invoice?.invoice_payment?.length === 1 &&
                              !invoice?.paymentIntentObject &&
                              invoice?.total_with_vat >= 0 &&
                              invoice?.paymentStatus !== "fully-refunded" &&
                              item.data()?.payment_type !== 0 && (
                                <div className="rounded-md bg-movet-yellow p-4 text-movet-white mt-4">
                                  <div className="flex items-center justify-left">
                                    <div className="flex-shrink-0">
                                      <FontAwesomeIcon
                                        icon={faMoneyBillTransfer}
                                        size="2x"
                                      />
                                    </div>
                                    <div className="ml-3 uppercase">
                                      <h3 className="font-medium">
                                        Refund Payment
                                      </h3>
                                      <a
                                        href={`${
                                          environment === "production"
                                            ? "https://us.provetcloud.com/4285/billing/invoice/"
                                            : "https://us.provetcloud.com/4285/billing/invoice/"
                                        }${invoice?.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="uppercase mt-2 flex flex-row bg-movet-white bg-opacity-75 hover:bg-opacity-75  group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-movet-green hover:bg-movet-green hover:text-movet-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                      >
                                        <div className="flex-shrink-0 mr-2 text-lg">
                                          {item.data()?.payment_type === 0 &&
                                          invoice?.paymentIntentObject?.charges
                                            ?.data[0]
                                            ?.payment_method_details ? (
                                            <>
                                              <span className="mr-2">
                                                <FontAwesomeIcon
                                                  icon={faCreditCard}
                                                />
                                              </span>
                                              <span className="text-xs mr-2">
                                                {invoice?.paymentIntentObject
                                                  ?.charges?.data[0]
                                                  ?.payment_method_details
                                                  ?.card_present
                                                  ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.brand.toUpperCase()
                                                  : invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card.brand.toUpperCase()}{" "}
                                                -{" "}
                                                {invoice?.paymentIntentObject
                                                  ?.charges?.data[0]
                                                  ?.payment_method_details
                                                  ?.card_present
                                                  ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.last4.toUpperCase()
                                                  : invoice?.paymentIntentObject
                                                      ?.charges?.data[0]
                                                      ?.payment_method_details
                                                      ?.card.last4}
                                              </span>
                                            </>
                                          ) : item.data()?.payment_type ===
                                            1 ? (
                                            <span className="mr-2">
                                              <FontAwesomeIcon
                                                icon={faMoneyBill1}
                                              />
                                            </span>
                                          ) : (
                                            <span className="mr-2">
                                              <FontAwesomeIcon
                                                icon={faMoneyCheckDollar}
                                              />
                                            </span>
                                          )}
                                        </div>
                                        Refund Payment
                                      </a>
                                      <p className="text-xs mt-2 normal-case">
                                        * Refunds are NOT complete until a
                                        &quot;Credit Note&quot; is added!
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            {invoice?.first_original_invoice &&
                              invoice?.paymentStatus !== "fully-refunded" && (
                                <a
                                  key={index}
                                  href={
                                    client?.customer
                                      ? environment === "production"
                                        ? `https://dashboard.stripe.com/customers/${
                                            client?.customer?.id !== undefined
                                              ? client?.customer?.id
                                              : client?.customer
                                          }/`
                                        : `https://dashboard.stripe.com/test/customers/${
                                            client?.customer?.id !== undefined
                                              ? client?.customer?.id
                                              : client?.customer
                                          }/`
                                      : `https://us.provetcloud.com/4285/billing/invoice/${invoice?.id}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <div className="rounded-md bg-movet-green p-4 text-movet-white mt-8">
                                    <div className="flex items-center justify-left">
                                      <div className="flex-shrink-0">
                                        <FontAwesomeIcon
                                          icon={faCheck}
                                          size="2x"
                                        />
                                      </div>
                                      <div className="ml-3 uppercase">
                                        <h3 className="font-medium">
                                          Invoice{" "}
                                          <a
                                            href={`${
                                              environment === "production"
                                                ? "https://us.provetcloud.com/4285/billing/invoice/"
                                                : "https://us.provetcloud.com/4285/billing/invoice/"
                                            }${getProVetIdFromUrl(
                                              invoice?.first_original_invoice
                                            )}
          `}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="hover:underline ease-in-out duration-500 hover:text-movet-red font-bold"
                                          >
                                            #
                                            {getProVetIdFromUrl(
                                              invoice?.first_original_invoice
                                            )}
                                          </a>
                                        </h3>
                                        <h3 className="text-sm">
                                          REFUND COMPLETE
                                        </h3>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              )}
                            {invoice?.client_due_sum === 0 &&
                              invoice?.invoice_payment?.length === 1 &&
                              invoice?.paymentIntentObject &&
                              invoice?.paymentStatus !== "fully-refunded" && (
                                <>
                                  <div className="rounded-md bg-movet-green p-2 text-movet-white">
                                    <div className="flex flex-row justify-center items-center text-base">
                                      <FontAwesomeIcon icon={faCheck} />
                                      <h3 className="ml-2 my-0 font-medium text-center text-lg">
                                        PAID -
                                        <span className="font-bold ml-1">
                                          ${invoice?.total_with_vat.toFixed(2)}
                                        </span>
                                      </h3>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={async () =>
                                      setRefundModalIsOpen(true)
                                    }
                                    className="mt-6 flex flex-row bg-movet-black group relative w-full justify-center items-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                  >
                                    <span className="mr-2">
                                      <FontAwesomeIcon
                                        icon={faHandHoldingDollar}
                                        size="lg"
                                      />
                                    </span>
                                    REFUND ${invoice?.total_with_vat.toFixed(2)}{" "}
                                    <span className="ml-2 text-xs">
                                      (
                                      {invoice?.paymentIntentObject?.charges
                                        ?.data[0]?.payment_method_details
                                        ?.card_present
                                        ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.brand.toUpperCase()
                                        : invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card.brand.toUpperCase()}{" "}
                                      -{" "}
                                      {invoice?.paymentIntentObject?.charges
                                        ?.data[0]?.payment_method_details
                                        ?.card_present
                                        ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.last4.toUpperCase()
                                        : invoice?.paymentIntentObject?.charges
                                            ?.data[0]?.payment_method_details
                                            ?.card.last4}
                                      )
                                    </span>
                                  </button>
                                </>
                              )}
                            {invoice?.paymentStatus === "fully-refunded" &&
                              !invoice?.first_original_invoice && (
                                <div className="rounded-md bg-movet-yellow hover:bg-movet-green p-2 text-movet-white hover:cursor-pointer">
                                  <div className="flex flex-row justify-center items-center text-base ">
                                    <FontAwesomeIcon
                                      icon={faMoneyBillTransfer}
                                    />
                                    <a
                                      key={index}
                                      href={
                                        client?.customer
                                          ? environment === "production"
                                            ? `https://dashboard.stripe.com/customers/${
                                                client?.customer?.id !==
                                                undefined
                                                  ? client?.customer?.id
                                                  : client?.customer
                                              }/`
                                            : `https://dashboard.stripe.com/test/customers/${
                                                client?.customer?.id !==
                                                undefined
                                                  ? client?.customer?.id
                                                  : client?.customer
                                              }/`
                                          : environment === "production"
                                          ? `https://dashboard.stripe.com/payments/${invoice?.paymentIntent}`
                                          : `https://dashboard.stripe.com/test/payments/${invoice?.paymentIntent}`
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                      className="ml-2 font-medium text-center text-sm my-2 md:text-lg flex flex-row items-center"
                                    >
                                      REFUNDED $
                                      {invoice?.total_with_vat.toFixed(2)}
                                      {invoice?.paymentIntentObject && (
                                        <span className="ml-1">
                                          TO{" "}
                                          {invoice?.paymentIntentObject?.charges
                                            ?.data[0]?.payment_method_details
                                            ?.card_present
                                            ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.brand.toUpperCase()
                                            : invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card.brand.toUpperCase()}{" "}
                                          -{" "}
                                          {invoice?.paymentIntentObject?.charges
                                            ?.data[0]?.payment_method_details
                                            ?.card_present
                                            ? invoice?.paymentIntentObject?.charges?.data[0]?.payment_method_details?.card_present?.last4.toUpperCase()
                                            : invoice?.paymentIntentObject
                                                ?.charges?.data[0]
                                                ?.payment_method_details?.card
                                                .last4}
                                        </span>
                                      )}
                                    </a>
                                  </div>
                                </div>
                              )}
                            {invoice?.client_due_sum === 0 &&
                              invoice?.invoice_payment.length > 1 &&
                              invoice?.total_with_vat >= 0 &&
                              invoicePayments &&
                              invoicePayments.docs.length > 0 &&
                              invoicePayments.docs.map(
                                (item: any, index: number) =>
                                  item.data()?.payment_type === 0 &&
                                  invoice?.paymentIntentObject?.charges?.data[0]
                                    ?.payment_method_details &&
                                  index === 0 ? (
                                    <a
                                      href={`mailto:support@movetcare.com?subject=Assistance w/ Refunding Customer Invoice #${invoice?.id}`}
                                      target="_blank"
                                      className="mt-4 flex flex-row bg-movet-black group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                      rel="noreferrer"
                                    >
                                      <span className="mr-2">
                                        <FontAwesomeIcon
                                          icon={faHeadset}
                                          size="lg"
                                        />
                                      </span>
                                      CONTACT SUPPORT TO REFUND
                                    </a>
                                  ) : (
                                    index === 0 && (
                                      <a
                                        href={`${
                                          environment === "production"
                                            ? "https://us.provetcloud.com/4285/billing/invoice/"
                                            : "https://us.provetcloud.com/4285/billing/invoice/"
                                        }${invoice?.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="uppercase mt-2 flex flex-row bg-movet-black  group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-movet-white hover:bg-movet-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                      >
                                        {item.data()?.payment_type === 1 ? (
                                          <span className="mx-2">
                                            <FontAwesomeIcon
                                              icon={faMoneyBill1}
                                            />
                                          </span>
                                        ) : (
                                          <span className="mx-2">
                                            <FontAwesomeIcon
                                              icon={faMoneyCheckDollar}
                                            />
                                          </span>
                                        )}
                                        ISSUE REFUND
                                      </a>
                                    )
                                  )
                              )}
                            {environment !== "production" &&
                              transactionState &&
                              !paymentError && (
                                <>
                                  <div className="rounded-md bg-movet-white p-4 text-movet-black mt-4">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0">
                                        <FontAwesomeIcon
                                          icon={faInfoCircle}
                                          size="2x"
                                        />
                                      </div>
                                      <div className="ml-3 uppercase">
                                        <h3 className="text-sm font-medium">
                                          TRANSACTION INFO
                                        </h3>
                                        <p className="italic text-xs">
                                          Status:{" "}
                                          {invoice?.paymentStatus?.replace(
                                            "_",
                                            " "
                                          )}
                                        </p>
                                        <p className="italic text-xs">
                                          Transaction ID:{" "}
                                          {invoice?.paymentIntent}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {transactionState !== "succeeded" && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={async () =>
                                          await simulatePayment(
                                            reader?.id,
                                            "4242424242424242"
                                          )
                                        }
                                        className="mt-6 flex flex-row bg-movet-green group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                      >
                                        <span className="mr-2">
                                          <FontAwesomeIcon
                                            icon={faCreditCard}
                                            size="lg"
                                          />
                                        </span>
                                        PAY W/ VISA (4242)
                                      </button>
                                      <div className="flex flex-row w-full mx-auto justify-center items-center">
                                        <button
                                          type="button"
                                          onClick={async () =>
                                            await simulatePayment(
                                              reader?.id,
                                              "4000000000000119"
                                            )
                                          }
                                          className="mr-2 mt-6 flex flex-row bg-movet-red group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                        >
                                          <span className="mr-2">
                                            <FontAwesomeIcon
                                              icon={faCreditCard}
                                              size="lg"
                                            />
                                          </span>
                                          PROCESSING
                                        </button>
                                        <button
                                          type="button"
                                          onClick={async () =>
                                            await simulatePayment(
                                              reader?.id,
                                              "4000000000000002"
                                            )
                                          }
                                          className="ml-2 mt-6 flex flex-row bg-movet-red group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                        >
                                          <span className="mr-2">
                                            <FontAwesomeIcon
                                              icon={faCreditCard}
                                              size="lg"
                                            />
                                          </span>
                                          DECLINED
                                        </button>
                                      </div>
                                      <div className="flex flex-row w-full mx-auto justify-center items-center">
                                        <button
                                          type="button"
                                          onClick={async () =>
                                            await simulatePayment(
                                              reader?.id,
                                              "4000000000009995"
                                            )
                                          }
                                          className="mr-2 mt-6 flex flex-row bg-movet-red group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                        >
                                          <span className="mr-2">
                                            <FontAwesomeIcon
                                              icon={faCreditCard}
                                              size="lg"
                                            />
                                          </span>
                                          INSUF FUNDS
                                        </button>
                                        <button
                                          type="button"
                                          onClick={async () =>
                                            await simulatePayment(
                                              reader?.id,
                                              "4000000000009987"
                                            )
                                          }
                                          className="ml-2 mt-6 flex flex-row bg-movet-red group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                        >
                                          <span className="mr-2">
                                            <FontAwesomeIcon
                                              icon={faCreditCard}
                                              size="lg"
                                            />
                                          </span>
                                          LOST CARD
                                        </button>
                                      </div>
                                      <div className="flex flex-row w-full mx-auto justify-center items-center">
                                        <button
                                          type="button"
                                          onClick={async () =>
                                            await simulatePayment(
                                              reader?.id,
                                              "4000000000009979"
                                            )
                                          }
                                          className="mr-2 mt-6 flex flex-row bg-movet-red group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                        >
                                          <span className="mr-2">
                                            <FontAwesomeIcon
                                              icon={faCreditCard}
                                              size="lg"
                                            />
                                          </span>
                                          STOLEN CARD
                                        </button>
                                        <button
                                          type="button"
                                          onClick={async () =>
                                            await simulatePayment(
                                              reader?.id,
                                              "4000000000000069"
                                            )
                                          }
                                          className="ml-2 mt-6 flex flex-row bg-movet-red group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                        >
                                          <span className="mr-2">
                                            <FontAwesomeIcon
                                              icon={faCreditCard}
                                              size="lg"
                                            />
                                          </span>
                                          EXPIRED CARD
                                        </button>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          setPaymentError(null);
                                          setTransactionState("in_progress");
                                          setIsLoading(true);
                                          setLoadingMessage(
                                            "Cancelling Payment..."
                                          );
                                          const cancelTerminalAction =
                                            httpsCallable(
                                              functions,
                                              "cancelTerminalAction"
                                            );
                                          cancelTerminalAction({
                                            reader: reader?.id,
                                            paymentIntent:
                                              invoice?.paymentIntent,
                                          })
                                            .then(() => {
                                              setPaymentError(null);
                                              setTransactionState(null);
                                            })
                                            .catch((error: any) =>
                                              setPaymentError(error)
                                            )
                                            .finally(() => setIsLoading(false));
                                        }}
                                        className="mt-6 flex flex-row bg-movet-black group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                      >
                                        <span className="mr-2">
                                          <FontAwesomeIcon
                                            icon={faBan}
                                            size="lg"
                                          />
                                        </span>
                                        Cancel Payment
                                      </button>
                                    </>
                                  )}
                                </>
                              )}
                            {paymentError && invoice?.client_due_sum && (
                              <>
                                <div className="rounded-md bg-movet-white p-4 text-movet-black mt-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                      <FontAwesomeIcon
                                        icon={faInfoCircle}
                                        size="2x"
                                      />
                                    </div>
                                    <div className="ml-3 uppercase">
                                      <h3 className="text-sm font-medium">
                                        TRANSACTION INFO
                                      </h3>
                                      <p className="italic text-xs">
                                        Status:{" "}
                                        {invoice?.paymentStatus?.replace(
                                          "_",
                                          " "
                                        )}
                                      </p>
                                      <p className="italic text-xs">
                                        Transaction ID: {invoice?.paymentIntent}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <Error error={paymentError} />
                                </div>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setPaymentError(null);
                                    setTransactionState("in_progress");
                                    setIsLoading(true);
                                    setLoadingMessage(
                                      "Resetting Card Reader..."
                                    );
                                    const cancelTerminalAction = httpsCallable(
                                      functions,
                                      "cancelTerminalAction"
                                    );
                                    cancelTerminalAction({
                                      reader: reader?.id,
                                    })
                                      .then(() => {
                                        setPaymentError(null);
                                        setTransactionState(null);
                                      })
                                      .catch((error: any) =>
                                        setPaymentError(error)
                                      )
                                      .finally(() => setIsLoading(false));
                                  }}
                                  className="mt-6 flex flex-row bg-movet-black group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                >
                                  <span className="mr-2">
                                    <FontAwesomeIcon icon={faRedo} size="lg" />
                                  </span>
                                  Try Again
                                </button>
                              </>
                            )}
                            {!paymentError &&
                              invoice?.client_due_sum === 0 &&
                              invoice?.credit_note === false && (
                                <a
                                  key={index}
                                  href={
                                    invoice?.paymentIntent
                                      ? client?.customer
                                        ? environment === "production"
                                          ? `https://dashboard.stripe.com/customers/${
                                              client?.customer?.id !== undefined
                                                ? client?.customer?.id
                                                : client?.customer
                                            }/`
                                          : `https://dashboard.stripe.com/test/customers/${
                                              client?.customer?.id !== undefined
                                                ? client?.customer?.id
                                                : client?.customer
                                            }/`
                                        : environment === "production"
                                        ? `https://dashboard.stripe.com/payments/${invoice?.paymentIntent}`
                                        : `https://dashboard.stripe.com/test/payments/${invoice?.paymentIntent}`
                                      : `https://us.provetcloud.com/4285/billing/invoice_finished/${invoice?.id}`
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full"
                                >
                                  <div
                                    className={`rounded-md  p-4 mt-4${
                                      invoice?.paymentIntent
                                        ? " bg-movet-white text-movet-black"
                                        : " bg-movet-yellow text-movet-white"
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0">
                                        <FontAwesomeIcon
                                          icon={faInfoCircle}
                                          size="2x"
                                        />
                                      </div>
                                      <div className="ml-3 uppercase">
                                        <h3 className="text-sm font-medium">
                                          TRANSACTION INFO
                                        </h3>
                                        {invoice?.paymentIntent ? (
                                          <>
                                            <p className="italic text-xs">
                                              Status:{" "}
                                              {invoice?.paymentStatus?.replace(
                                                "_",
                                                " "
                                              )}
                                            </p>
                                            <p className="italic text-xs">
                                              Type:{" "}
                                              {JSON.stringify(
                                                invoice?.paymentIntentObject
                                                  ?.payment_method_types
                                              )}
                                            </p>
                                            <p className="italic text-xs">
                                              Payment Intent:{" "}
                                              {invoice?.paymentIntent}
                                            </p>
                                            <p className="italic text-xs">
                                              Payment Method:{" "}
                                              {
                                                invoice?.paymentIntentObject
                                                  ?.payment_method
                                              }
                                            </p>
                                            <p className="italic text-xs">
                                              Charge:{" "}
                                              {
                                                invoice?.paymentIntentObject
                                                  ?.charges?.data[0]?.id
                                              }
                                            </p>
                                          </>
                                        ) : (
                                          <p className="text-sm font-extrabold">
                                            FORCED PAYMENT DETECTED
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              )}
                          </>
                        ) : (
                          <>
                            <a
                              href={
                                client?.customer
                                  ? environment === "production"
                                    ? `https://dashboard.stripe.com/customers/${
                                        client?.customer?.id !== undefined
                                          ? client?.customer?.id
                                          : client?.customer
                                      }/`
                                    : `https://dashboard.stripe.com/test/customers/${
                                        client?.customer?.id !== undefined
                                          ? client?.customer?.id
                                          : client?.customer
                                      }/`
                                  : environment === "production"
                                  ? `https://dashboard.stripe.com/payments/${invoice?.paymentIntent}`
                                  : `https://dashboard.stripe.com/test/payments/${invoice?.paymentIntent}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="block mb-4 -mt-4"
                            >
                              <div className="rounded-md bg-movet-white p-4 text-movet-black mt-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">
                                    <FontAwesomeIcon
                                      icon={faInfoCircle}
                                      size="2x"
                                    />
                                  </div>
                                  <div className="ml-3 uppercase">
                                    <h3 className="text-sm font-medium">
                                      TRANSACTION INFO
                                    </h3>
                                    <p className="italic text-xs">
                                      Status:{" "}
                                      {invoice?.paymentStatus?.replace(
                                        "_",
                                        " "
                                      )}
                                    </p>
                                    <p className="italic text-xs">
                                      Type:{" "}
                                      {JSON.stringify(
                                        invoice?.paymentIntentObject
                                          ?.payment_method_types
                                      )}
                                    </p>
                                    <p className="italic text-xs">
                                      Payment Intent: {invoice?.paymentIntent}
                                    </p>
                                    <p className="italic text-xs">
                                      Payment Method:{" "}
                                      {
                                        invoice?.paymentIntentObject
                                          ?.payment_method
                                      }
                                    </p>
                                    <p className="italic text-xs">
                                      Charge:{" "}
                                      {
                                        invoice?.paymentIntentObject?.charges
                                          ?.data[0]?.id
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </a>
                            <div className="rounded-md bg-movet-green p-4 text-movet-white">
                              <div className="flex items-center justify-left">
                                <div className="flex-shrink-0">
                                  <FontAwesomeIcon
                                    icon={faHandHoldingDollar}
                                    size="2x"
                                  />
                                </div>
                                <div className="ml-3 uppercase">
                                  <h3 className="font-medium">
                                    STEP 1 - COMPLETE
                                  </h3>
                                  <h3 className="text-sm">PAYMENT REFUNDED</h3>
                                  <p className="text-sm">
                                    <span className="font-bold text-base">
                                      ${invoice?.total_with_vat?.toFixed(2)}
                                    </span>{" "}
                                    -{" "}
                                    <span className="text-xs">
                                      {" "}
                                      {invoice?.updatedOn
                                        .toDate()
                                        .toDateString()}{" "}
                                      @{" "}
                                      {invoice?.updatedOn
                                        .toDate()
                                        .toLocaleTimeString("en-US")}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="rounded-md bg-movet-yellow p-4 text-movet-white mt-4">
                              <div className="flex items-center justify-left">
                                <div className="flex-shrink-0">
                                  <FontAwesomeIcon
                                    icon={faFileInvoiceDollar}
                                    size="2x"
                                  />
                                </div>
                                <div className="ml-3 uppercase">
                                  <h3 className="font-medium">
                                    STEP 2 - In Progress
                                  </h3>
                                  <h3 className="text-sm italic underline">
                                    INVOICE UPDATE REQUIRED
                                  </h3>
                                  <a
                                    href={`${
                                      environment === "production"
                                        ? "https://us.provetcloud.com/4285/billing/invoice/"
                                        : "https://us.provetcloud.com/4285/billing/invoice/"
                                    }${invoice?.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="uppercase mt-2 flex flex-row bg-movet-white bg-opacity-75 hover:bg-opacity-75  group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-movet-green hover:bg-movet-green hover:text-movet-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-white"
                                  >
                                    <div className="flex-shrink-0 mr-2 text-lg">
                                      <FontAwesomeIcon icon={faFilePen} />
                                    </div>
                                    Add Credit Note
                                  </a>
                                  <p className="text-xs mt-2 normal-case">
                                    * Refunds are NOT complete until a
                                    &quot;Credit Note&quot; is added!
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ))
              ) : isLoading ? (
                <div className="flex flex-col justify-center items-center -mt-4">
                  <Loader height={200} width={200} />
                  <h2 className="mt-0 text-xl">{loadingMessage}</h2>
                  <p className="italic uppercase text-sm -mt-2">
                    Please Wait...
                  </p>
                </div>
              ) : paymentError ? (
                <Error error={paymentError} />
              ) : (
                <a
                  onClick={() => setWaitingForSync(true)}
                  href={`${
                    environment === "production"
                      ? "https://us.provetcloud.com/4285/billing/invoice/"
                      : "https://us.provetcloud.com/4285/billing/invoice/"
                  }${invoice?.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center rounded-lg mt-4 bg-movet-white p-4 text-movet-black hover:text-movet-green cursor-pointer italic"
                >
                  {waitingForSync ? (
                    <div className="flex flex-col justify-center items-center mt-3">
                      <FontAwesomeIcon icon={faHospitalUser} size="3x" />
                      <h2 className="mt-4 text-xl text-center">
                        Waiting on Sync from ProVet...
                      </h2>
                    </div>
                  ) : (
                    <>
                      <h3>NO ITEMS FOUND</h3>
                      <div className="my-4">
                        <FontAwesomeIcon icon={faRedo} size="2x" />
                      </div>
                      <p className="text-sm">Please resync the invoice...</p>
                    </>
                  )}
                </a>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 mt-2 text-movet-green w-full">
              <FontAwesomeIcon icon={faThumbsUp} size="2x" />
              <h1 className="text-lg uppercase mt-8 mb-0 italic">
                PAYMENT COMPLETE!
              </h1>
            </div>
          )}
        </div>
      </Transition>
    </>
  );
};

const getProVetIdFromUrl = (url: string | null): number | null => {
  if (url !== null && url?.substring !== undefined) {
    let id: string = url.substring(0, url.length - 1);
    id = id.substring(id.lastIndexOf("/") + 1);
    return parseInt(id);
  } else return null;
};

const InvoiceItem = ({ key, invoice }: { key: number; invoice: Invoice }) => {
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<boolean>(false);
  const [client] = useDocument(
    doc(firestore, `clients/${getProVetIdFromUrl(invoice?.client)?.toString()}`)
  );
  const [paymentMethods] = useCollection(
    collection(
      firestore,
      `clients/${getProVetIdFromUrl(
        invoice?.client
      )?.toString()}/payment_methods`
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [transactionState, setTransactionState] = useState<any>();

  return (
    <li key={key}>
      <InvoiceItemHeader
        client={client?.data()}
        showInvoiceDetails={showInvoiceDetails}
        invoice={invoice}
        setShowInvoiceDetails={setShowInvoiceDetails}
        transactionState={transactionState}
        paymentMethods={paymentMethods}
      />
      <InvoiceDetails
        client={client?.data()}
        showInvoiceDetails={showInvoiceDetails}
        transactionState={transactionState}
        setTransactionState={setTransactionState}
        invoice={invoice}
        paymentMethods={paymentMethods}
      />
    </li>
  );
};

export default InvoiceItem;
