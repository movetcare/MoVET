import { AppHeader } from "components/AppHeader";
import { Loader } from "ui";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Account() {
  const router = useRouter();
  const { mode } = router.query;
  const signInText = "Signing Into Your Account...";
  useEffect(() => {
    if (router && mode) {
      alert("mode:" + mode);
      alert("query:" + JSON.stringify(router.query));
      alert(
        "REDIRECTING TO: " +
          "movet://sign-in?email=" +
          router.query.email +
          "&link=" +
          `?mode=${router.query?.mode}&oobCode=${router.query?.oobCode}&continueUrl=${router.query?.continueUrl}&lang=${router.query?.lang}&apiKey=${router.query?.apiKey}` +
          "&success=" +
          router.query.success,
      );
      window.location.href =
        "movet://sign-in?email=" +
        router.query.email +
        "&link=" +
        `https://app.movetcare.com/account?mode=${router.query?.mode}&oobCode=${router.query?.oobCode}&continueUrl=${router.query?.continueUrl}&lang=${router.query?.lang}&apiKey=${router.query?.apiKey}` +
        "&success=" +
        router.query.success;
    }
  }, [router, mode]);

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>{signInText}</title>
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
          <Loader message={signInText} />
          <code>{JSON.stringify(router.query)}</code>
        </section>
      </main>
    </div>
  );
}
