import { ClientSearch } from "components/ClientSearch";
import { HoursStatus } from "components/HoursStatus";
import { HoloweenCostumeContest } from "components/inactive/HowloweenCostumeContest";
import { PushNotificationWarning } from "components/PushNotificationWarning";
import TelehealthChatSummary from "components/TelehealthChatSummary";
import Head from "next/head";

// TODO: This is just to trigger a deployment on Vercel.

export default function Dashboard() {
  return (
    <section>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <ClientSearch />
      <PushNotificationWarning />
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <HoursStatus mode="admin" />
        <TelehealthChatSummary />
      </div>
      <HoloweenCostumeContest />
    </section>
  );
}
