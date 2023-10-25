import { faGhost } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClientSearch } from "components/ClientSearch";
import { HoursStatus } from "components/HoursStatus";
import { PushNotificationWarning } from "components/PushNotificationWarning";
import TelehealthChatSummary from "components/TelehealthChatSummary";
import { query, collection, orderBy } from "firebase/firestore";
import Head from "next/head";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "services/firebase";
import { Loader } from "ui";
import Error from "components/Error";

export default function Dashboard() {
  const [contestEntries, loadingContestEntries, errorContestEntries] =
    useCollection(
      query(collection(firestore, "howloween"), orderBy("createdOn", "desc")),
    );
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
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Social
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contestEntries &&
                  contestEntries.docs.map((entry: any, index: number) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        {entry.data()?.firstName} {entry.data()?.lastName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {entry.data()?.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {entry.data()?.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {entry.data()?.handle || "Not Provided"}
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
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
