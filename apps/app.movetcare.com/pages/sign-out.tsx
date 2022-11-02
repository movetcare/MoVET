import { AppHeader } from "components/AppHeader";
import { Loader } from "ui";
import { signOut } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "services/firebase";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    signOut(auth).finally(() => router.replace("/"));
  }, [router]);

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>Signing Out of MoVET...</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full flex-1 overflow-hidden">
        <AppHeader />
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8 text-center">
          <div className="overflow-hidden">
            <Loader message="Signing Out of MoVET..." />
          </div>
        </section>
      </div>
    </div>
  );
}
