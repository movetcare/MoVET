import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  checkActionCode,
  applyActionCode,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Button } from "ui";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { environment } from "utilities";
import { Loader } from "ui";
import { auth } from "services/firebase";

export default function RecoverEmail() {
  const router = useRouter();
  const { mode, oobCode, apiKey, continueUrl } = router.query;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>();
  const [recoverySuccessful, setRecoverSuccessful] = useState<boolean>();
  const [resetLinkSent, setResetLinkSent] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (mode !== "recoverEmail" || !oobCode || !apiKey)
      router.replace({
        pathname: "/404",
        query: router.query,
      });
  }, [router, mode, oobCode, apiKey]);

  useEffect(() => {
    if (oobCode)
      checkActionCode(auth, oobCode as string)
        .then((info: any) => {
          setEmail(info["data"]["email"]);
          return applyActionCode(auth, oobCode as string);
        })
        .then(() => setRecoverSuccessful(true))
        .catch((error: any) => {
          console.error(error);
          setRecoverSuccessful(false);
          setErrorMessage(error.message);
        })
        .finally(() => setLoading(false));
  }, [oobCode]);

  useEffect(() => {
    if (recoverySuccessful)
      setTimeout(() => {
        window.location.href =
          (continueUrl as string) || environment === "production"
            ? "movet://dashboard"
            : "exp://172.16.30.224:19000/--/dashboard";
      }, 1500);
  }, [recoverySuccessful, continueUrl]);

  const resetPassword = async () => {
    setLoading(true);
    if (auth && email)
      sendPasswordResetEmail(auth, email as string)
        .then(() => setResetLinkSent(true))
        .catch((error: any) => {
          console.error(error);
          setResetLinkSent(false);
          setErrorMessage(error.message);
        })
        .finally(() => setLoading(false));
    else {
      setRecoverSuccessful(false);
      setErrorMessage("Failed to Send Password Reset Link");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>Recover Your Account...</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
          {isLoading ? (
            <Loader />
          ) : recoverySuccessful && !errorMessage ? (
            <div className="flex-col justify-center items-center">
              <h2 className="font-abside text-4xl mb-2">
                Success! Your MoVET Account has been recovered
              </h2>
              {resetLinkSent ? (
                <h2 className="font-source-sans-pro-italic text-2xl mb-8">
                  A password reset link has been emailed to {email}!
                </h2>
              ) : (
                <>
                  <h2 className="font-source-sans-pro-italic text-2xl mb-8">
                    We strongly suggest you reset your account password incase
                    it has been compromised.
                  </h2>
                  <Button
                    icon={faKey}
                    loading={isLoading}
                    disabled={isLoading}
                    text="Reset My Password"
                    onClick={() => resetPassword()}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="flex-col justify-center items-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-center">
                Something went wrong...
              </h2>
              <p className="text-center mb-4">Please try again</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
