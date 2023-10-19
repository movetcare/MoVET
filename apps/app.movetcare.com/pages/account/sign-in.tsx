import { AppHeader } from "components/AppHeader";
import { Loader } from "ui";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Account() {
  const router = useRouter();
  const { mode, oobCode, continueUrl, lang, apiKey } = router.query;
  const signInText = "Signing Into Your Account...";
  useEffect(() => {
    if (router && mode && oobCode && continueUrl && lang && apiKey)
      window.location.href = `movet://sign-in?mode=${mode}&oobCode=${oobCode}&continueUrl=${continueUrl}&lang=${lang}&apiKey=${apiKey}`;
  }, [router, mode, oobCode, continueUrl, lang, apiKey]);

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>{signInText}</title>
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
          <Loader message={signInText} />
        </section>
      </main>
    </div>
  );
}
