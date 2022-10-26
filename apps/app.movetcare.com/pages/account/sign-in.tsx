import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { Button } from "ui";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { AppHeader } from "components/AppHeader";
import { Loader } from "ui";
import { auth } from "services/firebase";

export default function SignIn() {
  const router = useRouter();
  const { oobCode, continueUrl } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [verificationSuccessful, setVerificationSuccessful] =
    useState<boolean>(false);

  useEffect(() => {
    if (router && oobCode) {
      if (
        isSignInWithEmailLink(
          auth,
          window.location.href.replaceAll("sign-in", "")
        )
      ) {
        let email = window.localStorage.getItem("email");
        if (!email) {
          email = window.prompt("Please provide your email for confirmation");
        }
        signInWithEmailLink(
          auth,
          (email as string)?.toLowerCase(),
          window.location.href.replaceAll("sign-in", "")
        )
          .then(() => {
            window.localStorage.removeItem("email");
            setVerificationSuccessful(true);
            setIsLoading(false);
          })
          .catch((error: any) => {
            console.error(error);
            setVerificationSuccessful(false);
            setIsLoading(false);
          });
      }
    }
  }, [router, oobCode]);

  useEffect(() => {
    if (router && verificationSuccessful)
      router.replace(
        (continueUrl as any)?.replaceAll("3000", "3001")?.toString() ||
          "/booking"
      );
  }, [verificationSuccessful, continueUrl, router]);

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>Verifying Your Account...</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8 py-8">
          {isLoading ? (
            <Loader />
          ) : verificationSuccessful ? (
            <div className="text-center">
              <Loader message="Sign In Successful!" />
            </div>
          ) : (
            <div className="flex-col justify-center items-center text-center mx-auto">
              <h2 className="text-2xl font-extrabold tracking-tight text-center">
                Account Verification Failed
              </h2>
              <p className="text-center mb-4">Please try again...</p>
              <Button
                color="red"
                text="Retry Sign In"
                icon={faRedo}
                onClick={() => router.replace("/")}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
