import {
  faCheckCircle,
  faCircleCheck,
  faCircleExclamation,
  faGhost,
  faSms,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClientSearch } from "components/ClientSearch";
import { HoursStatus } from "components/HoursStatus";
import { PushNotificationWarning } from "components/PushNotificationWarning";
import TelehealthChatSummary from "components/TelehealthChatSummary";
import {
  query,
  collection,
  orderBy,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Head from "next/head";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore, functions } from "services/firebase";
import { Loader, Modal } from "ui";
import Error from "components/Error";
import toast from "react-hot-toast";
import { httpsCallable } from "firebase/functions";
import { formatPhoneNumber } from "utilities";
import { useRef, useState } from "react";

export default function Dashboard() {
  const cancelButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [smsMessage, setSmsMessage] = useState<{
    name: string | null;
    phone: string | null;
    message: string;
  }>({
    name: null,
    phone: null,
    message:
      "Hey there! It's MoVET letting you know it's time for your Howl-O-Ween photo. Please meet us in the front of the Belleview Station Beer Garden within the next 5 minutes.",
  });
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);

  const [contestEntries, loadingContestEntries, errorContestEntries] =
    useCollection(
      query(collection(firestore, "howloween"), orderBy("createdOn", "desc")),
    );

  const updateStatus = async (
    id: string,
    status: "submitted" | "waiting" | "complete",
  ) => {
    setIsLoading(true);
    await updateDoc(doc(firestore, `howloween/${id}`), {
      updatedOn: serverTimestamp(),
      status,
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
      )
      .finally(() => setIsLoading(false));
  };

  const sendClientSMS = () => {
    setIsLoading(true);
    const sendSmsToClient = httpsCallable(functions, "sendSmsToClient");
    sendSmsToClient({
      id: null,
      phone: smsMessage.phone,
      message: smsMessage.message,
    })
      .then(() => {
        setShowSmsModal(false);
        setSmsMessage({
          name: null,
          phone: null,
          message:
            "Hey there! It's MoVET letting you know it's time for your Howl-O-Ween photo. Please meet us in the front of the Belleview Station Beer Garden within the next 5 minutes.",
        });
        toast(`SENT SMS Message to ${smsMessage.name} @ ${smsMessage.phone}`, {
          icon: (
            <FontAwesomeIcon
              icon={faCircleCheck}
              size="sm"
              className="text-movet-green"
            />
          ),
        });
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
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <section>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <ClientSearch />
      <PushNotificationWarning />
      <div className="grid lg:grid-cols-2 gap-4">
        <HoursStatus mode="admin" />
        <TelehealthChatSummary />
      </div>
      <div className="mt-8 lg:mt-0">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="flex flex-row items-center justify-center">
            <FontAwesomeIcon
              icon={faGhost}
              className="text-movet-red mt-4"
              size="lg"
            />
            <h1 className="ml-2 mt-4 text-lg">HOWL-O-WEEN Contest Entries</h1>
          </div>
          {loadingContestEntries ? (
            <div className="mb-6">
              <Loader height={200} width={200} />
            </div>
          ) : errorContestEntries ? (
            <div className="px-8 pb-8">
              <Error error={errorContestEntries} />
            </div>
          ) : contestEntries && contestEntries.docs.length < 1 ? (
            <p className="text-lg italic text-movet-red opacity-50 text-center mx-8 mt-6 py-4 divide-y divide-movet-gray border-t border-movet-gray">
              There are no contest entries yet...
            </p>
          ) : (
            <table className="min-w-full divide-y divide-movet-gray border-t border-movet-gray mt-4">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold"
                  >
                    Client Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Pet
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Costume / Fun Fact
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contestEntries &&
                  contestEntries.docs.map((entry: any, index: number) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <p>
                          {entry.data()?.firstName} {entry.data()?.lastName}
                        </p>
                        <p>{entry.data()?.email}</p>
                        <p> {entry.data()?.phone}</p>
                        <p>{entry.data()?.handle}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <p>{entry.data()?.petName}</p>
                        <p>{entry.data()?.petBreed}</p>
                        <p>{entry.data()?.petGender}</p>
                        <p>{entry.data()?.petAge}</p>
                        <p>{entry.data()?.petHandle}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <p>{entry.data()?.description}</p>
                        <p>{entry.data()?.funFact}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className="group cursor-pointer">
                          {entry.data()?.status === "submitted" ? (
                            <span className="inline-flex items-center rounded-full bg-movet-yellow px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              NEEDS CHECK IN
                            </span>
                          ) : entry.data()?.status === "waiting" ? (
                            <>
                              <span className="inline-flex items-center rounded-full bg-movet-green px-3 py-0.5 text-sm font-extrabold text-white text-center">
                                WAITING...
                              </span>
                              <p
                                className="mt-4 hover:text-movet-green"
                                onClick={() => {
                                  setShowSmsModal(true);
                                  setSmsMessage({
                                    name:
                                      entry.data()?.firstName +
                                      " " +
                                      entry.data()?.lastName,
                                    phone: entry.data()?.phone,
                                    message: smsMessage.message,
                                  });
                                }}
                              >
                                Send SMS
                                <FontAwesomeIcon
                                  icon={faSms}
                                  className="ml-2"
                                />
                              </p>
                            </>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-movet-red px-3 py-0.5 text-sm font-extrabold text-white text-center">
                              COMPLETE
                            </span>
                          )}
                          <p className="hidden group-hover:flex text-xs italic mt-4">
                            Change Status:
                          </p>
                          <p
                            className="hidden group-hover:flex my-2 hover:text-movet-yellow"
                            onClick={() => updateStatus(entry.id, "submitted")}
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="mr-2 mt-0.5"
                            />
                            Needs Check In
                          </p>
                          <p
                            className="hidden group-hover:flex my-2 hover:text-movet-green"
                            onClick={() => updateStatus(entry.id, "waiting")}
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="mr-2 mt-0.5"
                            />
                            Checked In - Waiting
                          </p>
                          <p
                            className="hidden group-hover:flex my-2 hover:text-movet-red"
                            onClick={() => updateStatus(entry.id, "complete")}
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="mr-2 mt-0.5"
                            />
                            Photo Shoot Complete
                          </p>
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Modal
        showModal={showSmsModal}
        setShowModal={setShowSmsModal}
        cancelButtonRef={cancelButtonRef}
        isLoading={isLoading}
        loadingMessage="Sending SMS to Client, Please Wait..."
        content={
          <>
            <h2>
              Send SMS to {smsMessage.name} at{" "}
              {formatPhoneNumber(smsMessage?.phone as string)}
            </h2>
            <textarea
              className={
                "focus:ring-movet-brown focus:border-movet-brown text-movet-black py-3 px-4 block w-full rounded-lg font-abside-smooth"
              }
              value={smsMessage.message}
              onChange={(e) =>
                setSmsMessage({
                  name: smsMessage.name,
                  phone: smsMessage.phone,
                  message: e.target.value,
                })
              }
            />
          </>
        }
        icon={faSms}
        action={sendClientSMS}
        yesButtonText="SEND"
        noButtonText="CANCEL"
      />
    </section>
  );
}
