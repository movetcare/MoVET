import {
  faUsersBetweenLines,
  faTrash,
  faEnvelope,
  faIdCard,
  faRedo,
  faCheckCircle,
  faCircleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { firestore, functions } from "services/firebase";
import environment from "utils/environment";
import "react-tooltip/dist/react-tooltip.css";
import { Button, Loader } from "ui";
import { useCollection } from "react-firebase-hooks/firestore";
import Error from "../../components/Error";
import { Tooltip } from "react-tooltip";
import AdminCheck from "components/AdminCheck";
import { ClientSearch } from "components/ClientSearch";
import { httpsCallable } from "firebase/functions";
import toast from "react-hot-toast";

interface Client {
  id: string;
  email: string;
}

const Testing = () => {
  const [testClients, setTestClients] = useState<Array<Client> | null>(null);
  const [archivedClients, setArchivedClients] = useState<Array<any> | null>(
    null,
  );
  const [clientData, loading, error] = useCollection(
    collection(firestore, "clients"),
  );
  useEffect(() => {
    if (clientData) {
      const clients: Array<Client> = [];
      const archivedClients: Array<any> = [];
      clientData.docs.map((client: any) => {
        const { email, archived } = client.data();
        if (
          email?.includes("+test") &&
          email !== "dev+test@movetcare.com" &&
          email !== "dev+test_vcpr_not_required@movetcare.com"
        )
          clients.push({
            id: client.id,
            email,
          });
        else if (archived)
          archivedClients.push({
            id: client.id,
            email,
          });
      });
      setTestClients(clients);
      setArchivedClients(archivedClients);
    }
  }, [clientData]);

  const syncData = async ({
    environment,
    type,
  }: {
    environment: "production";
    type: "bookings" | "closures" | "openings";
  }) => {
    toast(
      `Syncing ${type.toUpperCase()} Configuration Data from ${environment.toUpperCase()}...`,
      {
        duration: 1000,
        icon: (
          <FontAwesomeIcon
            icon={faSpinner}
            size="sm"
            className="text-movet-gray"
            spin
          />
        ),
      },
    );
    await httpsCallable(
      functions,
      "syncData",
    )({ environment, type })
      .then(async (result: any) => {
        if (result.data?.error)
          toast(
            `${type.toUpperCase()} Data Sync FAILED: "${JSON.stringify(result.data?.error)}"`,
            {
              duration: 5000,
              icon: (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  size="sm"
                  className="text-movet-red"
                />
              ),
            },
          );
        else {
          console.log("RESULT", result.data);
          if (type === "closures") {
            const {
              closureDates,
              closureDatesClinic,
              closureDatesHousecall,
              closureDatesVirtual,
            } = result.data;
            const finalClosureDates: any = [];
            const finalClosureDatesClinic: any = [];
            const finalClosureDatesHousecall: any = [];
            const finalClosureDatesVirtual: any = [];
            closureDates.forEach(
              (closure: {
                endDate: any;
                name: string;
                startDate: any;
                isActiveForClinic: boolean;
                isActiveForHousecalls: boolean;
                isActiveForTelehealth: boolean;
                showOnWebsite: boolean;
              }) => {
                finalClosureDates.push({
                  ...closure,
                  startDate: new Date(
                    closure.startDate._seconds * 1000 +
                      closure.startDate._nanoseconds / 1000000,
                  ),
                  endDate: new Date(
                    closure.endDate._seconds * 1000 +
                      closure.endDate._nanoseconds / 1000000,
                  ),
                });
              },
            );
            closureDatesClinic.forEach(
              (closure: {
                endTime: string;
                name: string;
                startTime: string;
                date: any;
              }) => {
                finalClosureDatesClinic.push({
                  ...closure,
                  date: new Date(
                    closure.date._seconds * 1000 +
                      closure.date._nanoseconds / 1000000,
                  ),
                });
              },
            );
            closureDatesHousecall.forEach(
              (closure: {
                endTime: string;
                name: string;
                startTime: string;
                date: any;
              }) => {
                finalClosureDatesHousecall.push({
                  ...closure,
                  date: new Date(
                    closure.date._seconds * 1000 +
                      closure.date._nanoseconds / 1000000,
                  ),
                });
              },
            );
            closureDatesVirtual.forEach(
              (closure: {
                endTime: string;
                name: string;
                startTime: string;
                date: any;
              }) => {
                finalClosureDatesVirtual.push({
                  ...closure,
                  date: new Date(
                    closure.date._seconds * 1000 +
                      closure.date._nanoseconds / 1000000,
                  ),
                });
              },
            );
            await setDoc(
              doc(firestore, "configuration", type),
              {
                closureDates: finalClosureDates,
                closureDatesClinic: finalClosureDatesClinic,
                closureDatesHousecall: finalClosureDatesHousecall,
                closureDatesVirtual: finalClosureDatesVirtual,
                updatedOn: serverTimestamp(),
              },
              { merge: true },
            )
              .then(() =>
                toast(
                  `FINISHED Syncing ${type.toUpperCase()} Configuration Data from ${environment.toUpperCase()}!`,
                  {
                    duration: 3500,
                    icon: (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size="sm"
                        className="text-movet-green"
                      />
                    ),
                  },
                ),
              )
              .catch((error: any) =>
                toast(
                  `${type.toUpperCase()} Data Sync FAILED: "${JSON.stringify(error)}"`,
                  {
                    duration: 5000,
                    icon: (
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        size="sm"
                        className="text-movet-red"
                      />
                    ),
                  },
                ),
              );
          } else if (type === "bookings") {
            await setDoc(
              doc(firestore, "configuration", type),
              {
                ...result.data,
                winterHousecallMode: {
                  ...result.data.winterHousecallMode,
                  startDate: new Date(
                    result.data.winterHousecallMode.startDate,
                  ),
                  endDate: new Date(result.data.winterHousecallMode.endDate),
                },
                updatedOn: serverTimestamp(),
              },
              { merge: true },
            )
              .then(() =>
                toast(
                  `FINISHED Syncing ${type.toUpperCase()} Configuration Data from ${environment.toUpperCase()}!`,
                  {
                    duration: 3500,
                    icon: (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size="sm"
                        className="text-movet-green"
                      />
                    ),
                  },
                ),
              )
              .catch((error: any) =>
                toast(
                  `${type.toUpperCase()} Data Sync FAILED: "${JSON.stringify(error)}"`,
                  {
                    duration: 5000,
                    icon: (
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        size="sm"
                        className="text-movet-red"
                      />
                    ),
                  },
                ),
              );
          } else
            await setDoc(
              doc(firestore, "configuration", type),
              {
                ...result.data,
                updatedOn: serverTimestamp(),
              },
              { merge: true },
            )
              .then(() =>
                toast(
                  `FINISHED Syncing ${type.toUpperCase()} Configuration Data from ${environment.toUpperCase()}!`,
                  {
                    duration: 3500,
                    icon: (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size="sm"
                        className="text-movet-green"
                      />
                    ),
                  },
                ),
              )
              .catch((error: any) =>
                toast(
                  `${type.toUpperCase()} Data Sync FAILED: "${JSON.stringify(error)}"`,
                  {
                    duration: 5000,
                    icon: (
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        size="sm"
                        className="text-movet-red"
                      />
                    ),
                  },
                ),
              );
        }
      })
      .catch((error: any) =>
        toast(
          `${type.toUpperCase()} Data Sync FAILED: "${JSON.stringify(error)}"`,
          {
            duration: 5000,
            icon: (
              <FontAwesomeIcon
                icon={faCircleExclamation}
                size="sm"
                className="text-movet-red"
              />
            ),
          },
        ),
      );
  };

  return (
    <AdminCheck>
      <ClientSearch />
      <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-center mt-1 px-8">
          <div className="flex flex-row items-center">
            <FontAwesomeIcon
              icon={faUsersBetweenLines}
              className={"text-movet-red"}
              size="lg"
            />
            <h1 className="ml-2 my-4 text-lg">Test Accounts</h1>
            <div
              onClick={() =>
                testClients &&
                testClients?.length > 0 &&
                testClients.forEach((testClient: Client) =>
                  window.open(
                    `https://us.provetcloud.com/4285/client/${testClient?.id}/forget`,
                    "_blank",
                  ),
                )
              }
              className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
              data-tooltip-id="deleteClients"
              data-tooltip-content="Delete ALL Clients"
              title="Delete ALL Client"
            >
              <Tooltip id="deleteClients" />
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </div>
        </div>
        <ul
          role="list"
          className="divide-y divide-movet-gray border-t border-movet-gray mt-2"
        >
          {loading ? (
            <li>
              <Loader
                message={
                  loading
                    ? "Loading All MoVET Test Accounts..."
                    : "Processing Deletion, Please Wait..."
                }
              />
            </li>
          ) : error ? (
            <Error error={error} />
          ) : testClients && testClients?.length === 0 ? (
            <li className="text-center p-4">
              <h1 className="text-lg italic">No Test Clients Found</h1>
              <h3 className="text-lg italic">
                Use &quot;+test&quot; in the email address to make a new test
                account
              </h3>
              <pre>ex: &quot;info+test@movetcare.com&quot;</pre>
            </li>
          ) : (
            testClients &&
            testClients?.length > 0 &&
            testClients.map((testClient: Client, index: number) => (
              <li className="px-8 p-4 flex flex-col sm:flex-row" key={index}>
                {testClient?.id && (
                  <h2 className="my-2 sm:my-0 w-full text-center sm:w-1/2 flex items-center justify-center">
                    <Tooltip id="openInProVet" />
                    <a
                      data-tooltip-id="openInProVet"
                      data-tooltip-content="View Client in Provet"
                      title="View Client in Provet"
                      href={
                        environment === "production"
                          ? `https://us.provetcloud.com/4285/client/${testClient?.id}/`
                          : `https://us.provetcloud.com/4285/client/${testClient?.id}/`
                      }
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faIdCard} />
                    </a>
                    {testClient?.id}
                  </h2>
                )}
                {testClient?.email && (
                  <h3 className="my-2 sm:my-0 w-full text-center sm:w-1/2 flex items-center justify-center">
                    <Tooltip id="sendEmail" />
                    <a
                      data-tooltip-id="sendEmail"
                      data-tooltip-content="Email Client"
                      title="Email Client"
                      href={`mailto:${testClient?.email}`}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                    {testClient?.email}
                  </h3>
                )}
                <div className="w-full flex flex-row justify-end -mt-10 sm:mt-0">
                  <a
                    href={
                      environment === "production"
                        ? `https://us.provetcloud.com/4285/client/${testClient?.id}/forget`
                        : `https://us.provetcloud.com/4285/client/${testClient?.id}/forget`
                    }
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
                    rel="noreferrer"
                    data-tooltip-id="deleteClient"
                    data-tooltip-content="Delete Client"
                    title="Delete Client"
                  >
                    <Tooltip id="deleteClient" />
                    <FontAwesomeIcon icon={faTrash} />
                  </a>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-center mt-1 px-8">
          <div className="flex flex-row items-center">
            <FontAwesomeIcon
              icon={faUsersBetweenLines}
              className={"text-movet-red"}
              size="lg"
            />
            <h1 className="ml-2 my-4 text-lg">Archived Clients</h1>
          </div>
        </div>
        <ul
          role="list"
          className="divide-y divide-movet-gray border-t border-movet-gray mt-2"
        >
          {loading ? (
            <li>
              <Loader
                message={
                  loading
                    ? "Loading All MoVET Test Accounts..."
                    : "Processing Deletion, Please Wait..."
                }
              />
            </li>
          ) : error ? (
            <Error error={error} />
          ) : archivedClients && archivedClients?.length === 0 ? (
            <li className="text-center p-4">
              <h1 className="text-sm italic">No Archived Clients Found...</h1>
            </li>
          ) : (
            archivedClients &&
            archivedClients?.length > 0 &&
            archivedClients.map((archivedClient: any, index: number) => (
              <li className="px-8 p-4 flex flex-col sm:flex-row" key={index}>
                {archivedClient?.id && (
                  <h2 className="my-2 sm:my-0 w-full text-center sm:w-1/2 flex items-center justify-center">
                    <Tooltip id="viewClient" />
                    <a
                      data-tooltip-id="viewClient"
                      data-tooltip-content="View Client Verification"
                      title="View Client Verification"
                      href={
                        environment === "production"
                          ? `https://admin.movetcare.com/client/?id=${archivedClient?.id}`
                          : `http://localhost:3002/client/?id=${archivedClient?.id}`
                      }
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faIdCard} />
                    </a>
                    {archivedClient?.id}
                  </h2>
                )}
                {archivedClient?.email && (
                  <h3 className="my-2 sm:my-0 w-full text-center sm:w-1/2 flex items-center justify-center">
                    <Tooltip id="sendEmail" />
                    <a
                      data-tooltip-id="sendEmail"
                      data-tooltip-content="Email Client"
                      title="Email Client"
                      href={`mailto:${archivedClient?.email}`}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </a>
                    {archivedClient?.email}
                  </h3>
                )}
                <div className="w-full flex flex-row justify-end -mt-10 sm:mt-0">
                  <a
                    href={
                      environment === "production"
                        ? `https://us.provetcloud.com/4285/client/${archivedClient?.id}/forget`
                        : `https://us.provetcloud.com/4285/client/${archivedClient?.id}/forget`
                    }
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
                    rel="noreferrer"
                    data-tooltip-id="deleteClient"
                    data-tooltip-content="Delete Client"
                    title="Delete Client"
                  >
                    <Tooltip id="deleteClient" />
                    <FontAwesomeIcon icon={faTrash} />
                  </a>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-center mt-1 px-8">
          <div className="flex flex-row items-center">
            <FontAwesomeIcon
              icon={faRedo}
              className={"text-movet-red"}
              size="lg"
            />
            <h1 className="ml-2 my-4 text-lg">
              Sync Data w/ Production Environment
            </h1>
          </div>
        </div>
        <ul
          role="list"
          className="divide-y divide-movet-gray border-t border-movet-gray mt-2"
        >
          <li className="flex flex-col sm:flex-row text-center p-4">
            <Button
              className="m-4"
              color="black"
              onClick={async () => {
                await syncData({ environment: "production", type: "bookings" });
              }}
            >
              <span className="flex-shrink-0 cursor-pointer mr-2">
                <FontAwesomeIcon icon={faRedo} className="text-movet-white" />
              </span>
              Sync Bookings Configuration
            </Button>
            <Button
              className="m-4"
              color="black"
              onClick={async () => {
                await syncData({ environment: "production", type: "closures" });
              }}
            >
              <span className="flex-shrink-0 cursor-pointer mr-2">
                <FontAwesomeIcon icon={faRedo} className="text-movet-white" />
              </span>
              Sync Closures Configuration
            </Button>
            <Button
              className="m-4"
              color="black"
              onClick={async () => {
                await syncData({ environment: "production", type: "openings" });
              }}
            >
              <span className="flex-shrink-0 cursor-pointer mr-2">
                <FontAwesomeIcon icon={faRedo} className="text-movet-white" />
              </span>
              Sync Openings Configuration
            </Button>
          </li>
        </ul>
      </div>
    </AdminCheck>
  );
};

export default Testing;
