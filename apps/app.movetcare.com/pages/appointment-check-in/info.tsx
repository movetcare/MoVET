import { AppHeader } from "components/AppHeader";
import UpdateExistingClient from "forms/checkin/updateExistingClient";
import Head from "next/head";

export default function Info() {
  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>Contact Information</title>
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        <UpdateExistingClient />
      </main>
    </div>
  );
}
