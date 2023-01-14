import TelehealthChatSummary from "components/TelehealthChatSummary";
import { Waitlist } from "components/Waitlist";
import Head from "next/head";

export default function Dashboard() {
  return (
    <section>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="grid lg:grid-cols-2 gap-4">
        <Waitlist />
        <TelehealthChatSummary />
      </div>
    </section>
  );
}
