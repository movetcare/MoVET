import { AppHeader } from "components/AppHeader";
import UpdateExistingClient from "forms/checkin/updateExistingClient";
import Head from "next/head";

export default function Info() {
  return (
    <div>
      <Head>
        <title>Contact Information</title>
      </Head>
      <div className="w-full flex-1">
        <AppHeader />
        <UpdateExistingClient />
      </div>
    </div>
  );
}
