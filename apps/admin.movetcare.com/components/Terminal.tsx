import {
  faCashRegister,
  faTriangleExclamation,
  faChevronCircleDown,
  faCog,
  faHeadset,
  faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import { auth, firestore, functions } from 'services/firebase';
import Error from 'components/Error';
import environment from 'utils/environment';
import { httpsCallable } from 'firebase/functions';

const Terminal = () => {
  const [showReaderDetails, setShowReaderDetails] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [reader, setReader] = useState<any>();
  const [readerError, setReaderError] = useState<any>();
  const [terminals, loadingTerminals, errorTerminals]: any = useCollection(
    query(collection(firestore, 'configuration/pos/terminals')),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const claimsString = (user as any)?.reloadUserInfo?.customAttributes;
        if (claimsString) {
          const claims = JSON.parse(claimsString);
          if (claims?.isSuperAdmin || claims?.isAdmin) setIsAdmin(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (reader && reader?.status !== 'online') {
      toast(
        `Card Reader Status: ${
          reader?.status.charAt(0).toUpperCase() + reader?.status.slice(1)
        }`,
        {
          icon: <FontAwesomeIcon icon={faCashRegister} size="2x" />,
          position: 'top-center',
          duration: 5000,
        }
      );
      if (reader?.status === 'online') setShowReaderDetails(false);
    }
  }, [reader]);

  useEffect(() => {
    if (terminals && terminals.docs.length > 0) {
      setReader(terminals.docs[0].data());
      if (
        terminals.docs[0].data()?.action?.failure_code &&
        terminals.docs[0].data()?.action?.message
      )
        setReaderError({
          code: terminals.docs[0].data()?.action?.failure_code,
          message: terminals.docs[0].data()?.action?.message,
        });
    }
  }, [terminals]);

  useEffect(() => {
    if (errorTerminals || readerError) {
      toast(
        `Card Reader Error ${
          errorTerminals?.message
            ? errorTerminals?.message
            : readerError?.message
        }`,
        {
          icon: <FontAwesomeIcon icon={faCashRegister} size="2x" />,
          position: 'top-center',
          duration: 10000,
        }
      );
    }
  }, [errorTerminals, readerError]);

  return (
    <div className="mb-4 sm:mb-8">
      <div
        onClick={() => {
          if (isAdmin) setShowReaderDetails(!showReaderDetails);
        }}
        className={`bg-opacity-50 shadow overflow-hidden flex flex-col justify-between items-center px-6 hover:cursor-pointer rounded-full${
          reader?.status === "online"
            ? " bg-movet-green bg-opacity-100 text-movet-white"
            : reader?.status === "offline" ||
              (!reader?.status && !loadingTerminals)
            ? " bg-movet-red bg-opacity-100 text-movet-white"
            : ""
        }`}
      >
        <div
          className={`flex flex-row justify-between items-center w-full${
            errorTerminals ? " bg-movet-red" : ""
          }`}
        >
          <div className={"flex flex-row items-center justify-center w-full"}>
            {errorTerminals || readerError ? (
              <div className="text-center text-sm cursor-pointer hover:text-movet-red">
                <Error error={errorTerminals || readerError} />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <h2 className="italic text-lg font-bold mt-2">
                  <FontAwesomeIcon
                    icon={
                      !reader?.status && !loadingTerminals
                        ? faTriangleExclamation
                        : faCashRegister
                    }
                    size="lg"
                  />
                  <span className="ml-2">
                    {loadingTerminals
                      ? "Loading..."
                      : reader?.status === "online"
                      ? "Ready to Accept Payments"
                      : !reader
                      ? "Configuration Required"
                      : `Reader Status: ${reader?.status
                          ?.replace("_", " ")
                          .toUpperCase()}`}
                  </span>
                </h2>
                {reader?.action?.status && (
                  <h2 className="italic text-sm font-bold -mt-2">
                    {reader?.action?.status === "in_progress"
                      ? "Transaction In Progress..."
                      : reader?.action?.status === "failed"
                      ? "Transaction Failed..."
                      : ""}
                  </h2>
                )}
                {readerError && (
                  <h2 className="italic text-sm font-bold -mt-2">
                    ERROR: {readerError?.code} - {readerError?.message}
                  </h2>
                )}
              </div>
            )}
          </div>
          <FontAwesomeIcon
            icon={showReaderDetails ? faChevronCircleDown : faCog}
          />
        </div>
      </div>
      {showReaderDetails && !loadingTerminals && (
        <div
          className={
            "mt-4 bg-white shadow overflow-hidden flex flex-col justify-between items-center rounded-lg"
          }
        >
          <div className="flex flex-col w-full">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden sm:rounded-lg">
                  {reader?.status === "online" ? (
                    <table className="min-w-full divide-y divide-movet-gray">
                      <thead className="bg-movet-white bg-opacity-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs text-movet-black font-bold text-opacity-75 uppercase tracking-wider"
                          >
                            Item
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-bold text-movet-black text-opacity-75 uppercase tracking-wider"
                          >
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            ID
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.id}
                          </td>
                        </tr>
                        <tr className="bg-movet-white bg-opacity-50">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            Label
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.label}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            Object
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.object}
                          </td>
                        </tr>
                        <tr className="bg-movet-white bg-opacity-50">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            Device Type
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.device_type}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            IP Address
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.ip_address}
                          </td>
                        </tr>
                        <tr className="bg-movet-white bg-opacity-50">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            Serial Number
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.serial_number}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            Location
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.location}
                          </td>
                        </tr>
                        <tr className="bg-movet-white bg-opacity-50">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            Device Version
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.device_sw_version === ""
                              ? "virtual_terminal_simulator"
                              : reader?.device_sw_version}
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            status
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.status}
                          </td>
                        </tr>
                        <tr className="bg-movet-white bg-opacity-50">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                            Live Mode
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                            {reader?.livemode?.toString() || ""}
                          </td>
                        </tr>
                        {reader?.action?.failure_code && (
                          <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                              Failure Code
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                              {reader?.action?.failure_code}
                            </td>
                          </tr>
                        )}
                        {reader?.action?.failure_message && (
                          <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                              Failure Message
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                              {reader?.action?.failure_message}
                            </td>
                          </tr>
                        )}
                        {reader?.action?.process_payment_intent
                          ?.payment_intent && (
                          <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                              Transaction ID
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                              {
                                reader?.action?.process_payment_intent
                                  ?.payment_intent
                              }
                            </td>
                          </tr>
                        )}
                        {reader?.action?.status && (
                          <tr className="bg-white">
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                              Transaction Status
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                              {reader?.action?.status}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className="max-w-sm flex flex-col justify-center items-center mx-auto text-movet-red p-8">
                      <FontAwesomeIcon icon={faCashRegister} size="2x" />
                      <h3 className="text-center italic uppercase text-lg mt-4">
                        No Card Reader Found
                      </h3>
                      <button
                        onClick={() => {
                          setReader({
                            status: "Resetting Card Reader...",
                          });
                          const resetTerminal = httpsCallable(
                            functions,
                            "resetTerminal"
                          );
                          resetTerminal()
                            .then((result: any) => {
                              if (result.data)
                                setReader({
                                  status: "online",
                                });
                            })
                            .catch((error: any) => setReaderError(error));
                        }}
                        className="mt-4 flex flex-row bg-movet-red group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red"
                      >
                        <span className="mr-2">
                          <FontAwesomeIcon icon={faRedo} size="lg" />
                        </span>
                        Reset Card Reader
                      </button>
                      <a
                        href="mailto:support@movetcare.com"
                        target="_blank"
                        className="mt-4 flex flex-row bg-movet-black group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red"
                        rel="noreferrer"
                      >
                        <span className="mr-2">
                          <FontAwesomeIcon icon={faHeadset} size="lg" />
                        </span>
                        Contact Support
                      </a>
                    </div>
                  )}
                  {environment !== "production" && (
                    <>
                      <h3 className="text-center uppercase italic text-base my-4 hover:text-movet-red hover:underline ease-in-out duration-500">
                        <a
                          href="https://stripe.com/docs/terminal/references/testing#physical-test-cards"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Test Invoice Amounts
                        </a>
                      </h3>
                      <table className="min-w-full divide-y divide-movet-gray">
                        <thead className="bg-movet-white bg-opacity-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs text-movet-black font-bold text-opacity-75 uppercase tracking-wider"
                            >
                              Decimal
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-bold text-movet-black text-opacity-75 uppercase tracking-wider"
                            >
                              Result
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="px-6 py-4 text-xs font-medium text-movet-black">
                              01
                            </td>
                            <td className="px-6 py-4 text-xs text-movet-black">
                              Payment is declined with a call_issuer code.
                            </td>
                          </tr>
                          <tr className="bg-movet-white bg-opacity-50">
                            <td className="px-6 py-4 text-xs font-medium text-movet-black">
                              02
                            </td>
                            <td className="px-6 py-4 text-xs text-movet-black">
                              (Contactless, non-US only) Payment is declined
                              with an offline_pin_required code. When using
                              readers featuring a cardholder-facing screen,
                              follow the on-screen prompts to complete the
                              transaction. If a PIN is required, enter the PIN
                              1234.
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-6 py-4 text-xs font-medium text-movet-black">
                              03
                            </td>
                            <td className="px-6 py-4 text-xs text-movet-black">
                              (Contactless, non-US only) Payment is declined
                              with an online_or_offline_pin_required code. When
                              using readers featuring a cardholder-facing
                              screen, follow the on-screen prompts to complete
                              the transaction. If a PIN is required, enter any
                              4-digit PIN.
                            </td>
                          </tr>
                          <tr className="bg-movet-white bg-opacity-50">
                            <td className="px-6 py-4 text-xs font-medium text-movet-black">
                              05
                            </td>
                            <td className="px-6 py-4 text-xs text-movet-black">
                              Payment is declined with an generic_decline code.
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-6 py-4 text-xs font-medium text-movet-black">
                              55
                            </td>
                            <td className="px-6 py-4 text-xs text-movet-black">
                              Payment is declined with an incorrect_pin code.
                            </td>
                          </tr>
                          <tr className="bg-movet-white bg-opacity-50">
                            <td className="px-6 py-4 text-xs font-medium text-movet-black">
                              65
                            </td>
                            <td className="px-6 py-4 text-xs text-movet-black">
                              Payment is declined with an
                              withdrawal_count_limit_exceeded code.
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-6 py-4 text-xs font-medium text-movet-black">
                              75
                            </td>
                            <td className="px-6 py-4 text-xs text-movet-black">
                              Payment is declined with an pin_try_exceeded code.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {reader?.display && environment !== "production" && (
        <div
          className={`mt-4 p-4 bg-opacity-50 shadow overflow-hidden flex flex-col justify-between items-center px-6 hover:cursor-pointer rounded-lg${
            reader?.status === "online"
              ? " bg-movet-green bg-opacity-100 text-movet-white"
              : reader?.status === "offline" ||
                (!reader?.status && !loadingTerminals)
              ? " bg-movet-red bg-opacity-100 text-movet-white"
              : ""
          }`}
        >
          <h3 className="mb-2 -mt-2 text-lg font-medium">SIMULATOR DISPLAY</h3>
          <table className="min-w-full divide-y divide-movet-gray">
            <thead className="bg-movet-white bg-opacity-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs text-movet-black font-bold text-opacity-75 uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-movet-black text-opacity-75 uppercase tracking-wider"
                >
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {reader?.display?.set_reader_display &&
                reader?.display?.set_reader_display?.cart?.line_items?.map(
                  (item: any) => (
                    <>
                      <tr className="bg-white">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                          Description
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                          {item?.description}
                        </td>
                      </tr>
                      <tr className="bg-movet-white bg-opacity-50">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                          Quantity
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                          {item?.quantity}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                          Amount
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                          &cent;{item?.amount}
                        </td>
                      </tr>
                    </>
                  )
                )}
              {reader?.display?.set_reader_display?.cart && (
                <>
                  <tr className="bg-movet-white bg-opacity-50">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                      Currency
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                      {reader?.display?.set_reader_display?.cart?.currency}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                      Tax
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                      &cent;
                      {reader?.display?.set_reader_display?.cart?.tax}
                    </td>
                  </tr>
                  <tr className="bg-movet-white bg-opacity-50">
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-movet-black">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-movet-black">
                      &cent;
                      {reader?.display?.set_reader_display?.cart?.total}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Terminal;
