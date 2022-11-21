import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { applyActionCode } from "firebase/auth";
import { environment } from "utilities";
import { auth } from "services/firebase";
import { Loader } from "ui";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Verify() {
  const router = useRouter();
  const { mode, oobCode, apiKey, continueUrl } = router.query;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [verificationSuccessful, setVerificationSuccessful] =
    useState<boolean>(false);

  useEffect(() => {
    if (mode === "verifyEmail" && oobCode && apiKey) {
      applyActionCode(auth, oobCode as string)
        .then(() => setVerificationSuccessful(true))
        .catch((error: any) => {
          console.error(error.message);
          setVerificationSuccessful(false);
        })
        .finally(() => setLoading(false));
    } else
      router.replace({
        pathname: "/404",
        query: router.query,
      });
  }, [router, mode, oobCode, apiKey]);

  useEffect(() => {
    if (verificationSuccessful)
      setTimeout(() => {
        window.location.href = (continueUrl as string)
          ? (continueUrl as string)?.replaceAll("3000", "3001")?.toString()
          : environment === "production"
          ? "movet://onboarding"
          : "exp://172.16.30.224:19000/--/onboarding";
      }, 1500);
  }, [verificationSuccessful, continueUrl]);

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>Verifying Your Account...</title>
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
          {isLoading ? (
            <Loader />
          ) : verificationSuccessful ? (
            <div className="flex-col justify-center items-center">
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="4x"
                className="text-movet-green mx-auto w-full mb-4"
              />
              <h1 className="font-abside text-3xl mb-2">
                Your Account is Verified!
              </h1>
              <h1 className="font-source-sans-pro-italic text-2xl mb-8">
                Taking you back to the app, please wait...
              </h1>
              {environment !== "production" && (
                <h2>URL: exp://172.16.30.224:19000/--/dashboard</h2>
              )}
            </div>
          ) : (
            <div className="flex-col justify-center items-center">
              <h1 className="font-abside text-3xl mb-2">
                Account Verification Failed
              </h1>
              <h1 className="font-source-sans-pro-italic text-2xl mb-8">
                Please Try Again...
              </h1>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
