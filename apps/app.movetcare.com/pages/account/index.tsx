import { AppHeader } from "components/AppHeader";
import { Loader } from "ui";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Account() {
  const router = useRouter();
  const { mode } = router.query;

  useEffect(() => {
    if (router && mode) {
      if (mode === "verifyEmail")
        router.replace({
          pathname: "/account/verify",
          query: router.query,
        });
      else if (mode === "resetPassword")
        router.replace({
          pathname: "/account/reset-password",
          query: router.query,
        });
      else if (mode === "recoverEmail")
        router.replace({
          pathname: "/account/recover-email",
          query: router.query,
        });
      else if (mode === "signIn")
        router.replace({
          pathname: "/account/sign-in",
          query: router.query,
        });
      else
        router.replace({
          pathname: "/404",
          query: router.query,
        });
    }
  }, [router, mode]);

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>Loading...</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
          <Loader />
        </section>
      </main>
    </div>
  );
}
