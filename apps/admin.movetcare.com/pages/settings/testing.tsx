import {
  faUsersBetweenLines,
  faTrash,
  faEnvelope,
  faUserCircle,
  faPhone,
  faCreditCard,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { collection } from "firebase/firestore";
import { firestore } from "services/firebase";
import environment from "utils/environment";
import "react-tooltip/dist/react-tooltip.css";
import { Loader } from "ui";
import { useCollection } from "react-firebase-hooks/firestore";
import Error from "../../components/Error";
import { GOTO_PHONE_URL } from "constants/urls";
import { Tooltip } from "react-tooltip";

interface Client {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  customer: string;
}

const Testing = () => {
  const [testClients, setTestClients] = useState<Array<Client> | null>(null);
  const [archivedClients, setArchivedClients] = useState<Array<Client> | null>(
    null
  );
  const [clientData, loading, error] = useCollection(
    collection(firestore, "clients"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  useEffect(() => {
    if (clientData) {
      const clients: Array<Client> = [];
      const archivedClients: Array<Client> = [];
      clientData.docs.map((client: any) => {
        const { firstName, lastName, email, phone, customer, archived } =
          client.data();
        if (
          email.includes("+test") &&
          email !== "dev+test@movetcare.com" &&
          email !== "dev+test_vcpr_not_required@movetcare.com"
        )
          clients.push({
            id: client.id,
            label: `${firstName} ${lastName}`,
            firstName,
            lastName,
            email,
            phone,
            customer,
          });
        else if (archived)
          archivedClients.push({
            id: client.id,
            label: `${firstName} ${lastName}`,
            firstName,
            lastName,
            email,
            phone,
            customer,
          });
      });
      console.log("clients", clients);
      console.log("archivedClients", archivedClients);
      setTestClients(clients);
      setArchivedClients(archivedClients);
    }
  }, [clientData]);

  return (
    <>
      <div className="bg-white shadow overflow-hidden rounded-lg mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-center mt-1 px-8">
          <div className="flex flex-row items-center">
            <FontAwesomeIcon
              icon={faUsersBetweenLines}
              className={"text-movet-red"}
              size="lg"
            />
            <h1 className="ml-2 my-4 text-lg">Test Accounts</h1>
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
              <h1 className="text-base">Not Test Clients Found</h1>
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
                    <Tooltip anchorId="openInProVet" />
                    <a
                      id="openInProVet"
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
                    <Tooltip anchorId="sendEmail" />
                    <a
                      id="sendEmail"
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
                {(testClient?.firstName || testClient?.lastName) && (
                  <div className="w-full flex flex-row items-center justify-center sm:w-4/5">
                    <Tooltip anchorId="viewInProvet" />
                    <a
                      id="viewInProvet"
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
                      <FontAwesomeIcon icon={faUserCircle} />
                    </a>
                    <p>{testClient?.firstName}</p>
                    <p className="ml-1">{testClient?.lastName}</p>
                  </div>
                )}
                {testClient?.phone && (
                  <div className="w-full flex flex-row items-center justify-center sm:w-4/5">
                    <Tooltip anchorId="callPhone" />
                    <a
                      data-tooltip-content="Call Client"
                      title="Call Client"
                      id="callPhone"
                      href={`${GOTO_PHONE_URL}/${testClient?.phone}`}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </a>
                    <p>{testClient?.phone}</p>
                  </div>
                )}
                {testClient?.customer && (
                  <div className="w-full flex flex-row items-center justify-center sm:w-4/5">
                    <Tooltip anchorId="viewInStripe" />
                    <a
                      id="viewInStripe"
                      data-tooltip-content="View Customer in Stripe"
                      title="View Customer in Stripe"
                      href={
                        environment === "production"
                          ? `https://dashboard.stripe.com/customers/${testClient?.customer}/`
                          : `https://dashboard.stripe.com/test/customers/${testClient?.customer}/`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
                    >
                      <FontAwesomeIcon icon={faCreditCard} />
                    </a>
                    <p>{testClient?.customer}</p>
                  </div>
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
                    id="deleteClient"
                    data-tooltip-content="Delete Client"
                    title="Delete Client"
                  >
                    <Tooltip anchorId="deleteClient" />
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
            archivedClients.map((archivedClient: Client, index: number) => (
              <li className="px-8 p-4 flex flex-col sm:flex-row" key={index}>
                {archivedClient?.id && (
                  <h2 className="my-2 sm:my-0 w-full text-center sm:w-1/2 flex items-center justify-center">
                    <Tooltip anchorId="openInProVet" />
                    <a
                      id="openInProVet"
                      data-tooltip-content="View Client in Provet"
                      title="View Client in Provet"
                      href={
                        environment === "production"
                          ? `https://us.provetcloud.com/4285/client/${archivedClient?.id}/`
                          : `https://us.provetcloud.com/4285/client/${archivedClient?.id}/`
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
                    <Tooltip anchorId="sendEmail" />
                    <a
                      id="sendEmail"
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
                {(archivedClient?.firstName || archivedClient?.lastName) && (
                  <div className="w-full flex flex-row items-center justify-center sm:w-4/5">
                    <Tooltip anchorId="viewInProvet" />
                    <a
                      id="viewInProvet"
                      data-tooltip-content="View Client in Provet"
                      title="View Client in Provet"
                      href={
                        environment === "production"
                          ? `https://us.provetcloud.com/4285/client/${archivedClient?.id}/`
                          : `https://us.provetcloud.com/4285/client/${archivedClient?.id}/`
                      }
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faUserCircle} />
                    </a>
                    <p>{archivedClient?.firstName}</p>
                    <p className="ml-1">{archivedClient?.lastName}</p>
                  </div>
                )}
                {archivedClient?.phone && (
                  <div className="w-full flex flex-row items-center justify-center sm:w-4/5">
                    <Tooltip anchorId="callPhone" />
                    <a
                      data-tooltip-content="Call Client"
                      title="Call Client"
                      id="callPhone"
                      href={`${GOTO_PHONE_URL}/${archivedClient?.phone}`}
                      target="_blank"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </a>
                    <p>{archivedClient?.phone}</p>
                  </div>
                )}
                {archivedClient?.customer && (
                  <div className="w-full flex flex-row items-center justify-center sm:w-4/5">
                    <Tooltip anchorId="viewInStripe" />
                    <a
                      id="viewInStripe"
                      data-tooltip-content="View Customer in Stripe"
                      title="View Customer in Stripe"
                      href={
                        environment === "production"
                          ? `https://dashboard.stripe.com/customers/${archivedClient?.customer}/`
                          : `https://dashboard.stripe.com/test/customers/${archivedClient?.customer}/`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out hover:bg-movet-gray hover:bg-opacity-25 focus:outline-none hover:text-movet-red mr-2"
                    >
                      <FontAwesomeIcon icon={faCreditCard} />
                    </a>
                    <p>{archivedClient?.customer}</p>
                  </div>
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
                    id="deleteClient"
                    data-tooltip-content="Delete Client"
                    title="Delete Client"
                  >
                    <Tooltip anchorId="deleteClient" />
                    <FontAwesomeIcon icon={faTrash} />
                  </a>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default Testing;
