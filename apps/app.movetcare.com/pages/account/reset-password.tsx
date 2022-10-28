import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  confirmPasswordReset,
  getAuth,
  verifyPasswordResetCode,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { Button } from "ui";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { environment } from "utilities";
import { Loader } from "ui";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "components/inputs/TextInput";
import { Error } from "components/Error";
import { AppHeader } from "components/AppHeader";

export default function ResetPassword() {
  const router = useRouter();
  const auth = getAuth();
  const { mode, oobCode, apiKey, continueUrl } = router.query;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [resetSuccessful, setResetSuccessful] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid, errors, isSubmitted },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        password: string()
          .min(6, "Password must be at least 6 characters")
          .required("Please enter a new password"),
      })
    ),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    if (mode !== "resetPassword" || !oobCode || !apiKey)
      router.replace({
        pathname: "/404",
        query: router.query,
      });
  }, [router, mode, oobCode, apiKey]);

  useEffect(() => {
    if (resetSuccessful)
      setTimeout(() => {
        window.location.href =
          (continueUrl as string) || environment === "production"
            ? "movet://dashboard"
            : "exp://172.16.30.224:19000/--/dashboard";
      }, 1500);
  }, [resetSuccessful, continueUrl]);

  const onSubmitUpdatePassword = async (data: { password: string }) => {
    setLoading(true);
    if (data.password) {
      verifyPasswordResetCode(auth, oobCode as string)
        .then(() =>
          confirmPasswordReset(auth, oobCode as string, data.password)
            .then(() => setResetSuccessful(true))
            .catch((error: any) => {
              setError(error);
              setResetSuccessful(false);
            })
            .finally(() => setLoading(false))
        )
        .catch((error: any) => {
          setResetSuccessful(false);
          setError(error);
        })
        .finally(() => setLoading(false));
    } else setLoading(false);
  };

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>Reset Password</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
          {isLoading ? (
            <Loader />
          ) : resetSuccessful ? (
            <div className="flex-col justify-center items-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-center">
                Success!
              </h2>
              <p className="text-center mb-4">
                You may now sign in with your new password
              </p>
              {environment !== "production" && (
                <h2>URL: exp://172.16.30.224:19000/--/dashboard</h2>
              )}
            </div>
          ) : isSubmitted && error ? (
            <Error error={error} />
          ) : (
            <>
              <h1 className="font-abside text-3xl mb-2">
                Choose Your MoVET Password
              </h1>
              <form className="space-y-8 py-4">
                <TextInput
                  autoFocus
                  name="password"
                  label=""
                  type="password"
                  required={true}
                  placeholder="Password"
                  errors={errors}
                  control={control}
                />
                <Button
                  disabled={!isDirty || !isValid || isLoading}
                  text="Change Password"
                  color="red"
                  icon={faKey}
                  iconSize="sm"
                  className="mx-auto"
                  onClick={handleSubmit(onSubmitUpdatePassword as any)}
                />
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
