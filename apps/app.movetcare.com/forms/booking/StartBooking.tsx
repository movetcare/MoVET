import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "ui";
import EmailInput from "components/inputs/EmailInput";
import { Loader } from "ui";
import { SignInWithEmailLinkRequired } from "components/SignInWithEmailLinkRequired";
import { onAuthStateChanged, sendSignInLinkToEmail } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { auth, functions } from "services/firebase";
import { environment } from "utilities";
import { Error } from "components/Error";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppLinks } from "ui";
import { useRouter } from "next/router";

export const StartBooking = ({ isAppMode }: { isAppMode: boolean }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<
    boolean | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object().shape({
        email: string()
          .email("Email must be a valid email address")
          .required("An email address is required"),
      })
    ),
    defaultValues: {
      email: "",
    },
  });
  const email = watch("email");
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setIsLoading(true);
      if (user) {
        if (
          window.location.href !==
          window.location.origin + `/request-an-appointment/?id=${user.uid}`
        )
          router.push(`/request-an-appointment/?id=${user.uid}`);
      } else setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);
  const verifyBookingWithEmail = async (data: { email: string }) => {
    setIsLoading(true);
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "verifyBooking"
          )({
            email: data.email,
            token,
          });
          if (result.error !== true || result.error === undefined) {
            if (result.isNewClient !== true)
              setSuccessMessage(
                `${
                  result.displayName
                    ? `Welcome back, ${result.displayName}!`
                    : "Sign In Required!"
                }`
              );
            sendSignInLinkToEmail(auth, data.email?.toLowerCase(), {
              url:
                (environment === "production"
                  ? "https://app.movetcare.com"
                  : window.location.hostname === "localhost"
                  ? "http://localhost:3001"
                  : "https://stage.app.movetcare.com") +
                `${
                  result.id !== null && result.id !== undefined
                    ? `/request-an-appointment?id=${result.id}`
                    : "/request-an-appointment"
                }`,
              // handleCodeInApp: true,
              // iOS: {
              //   bundleId: "com.movet.inc",
              // },
              // android: {
              //   packageName: "com.movet",
              //   installApp: true,
              //   minimumVersion: "16",
              // },
              // dynamicLinkDomain:
              //   environment === "production"
              //     ? "app.movetcare.com"
              //     : window.location.hostname === "localhost"
              //     ? "localhost"
              //     : "stage.app.movetcare.com",
            })
              .then(() => {
                window.localStorage.setItem("email", data.email?.toLowerCase());
              })
              .catch((error) => handleError(error));
            setVerificationSuccess(true);
            setIsLoading(false);
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    }
  };
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setVerificationSuccess(null);
    reset();
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    await verifyBookingWithEmail(data);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error !== null ? (
        <Error error={error} isAppMode={isAppMode} />
      ) : verificationSuccess === null ? (
        <>
          {!isAppMode && (
            <h2 className="text-2xl font-extrabold tracking-tight text-center">
              Request an Appointment
            </h2>
          )}
          <p className="text-center mb-4 w-full sm:w-2/3 mx-auto">
            Start an appointment request by providing your email address below
          </p>
          <form className="group grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 pb-4 mb-4 w-full sm:w-2/3 mx-auto">
            <div className="sm:col-span-2 my-2">
              <EmailInput
                autoFocus
                required
                label=""
                name="email"
                errors={errors}
                control={control}
                placeholder={"Your Email Address"}
              />
            </div>
            <div className="flex justify-center items-center sm:col-span-2">
              <Button
                type="submit"
                icon={faArrowRight}
                iconSize={"lg"}
                disabled={!isDirty}
                text="Continue"
                className={"w-full md:w-2/3"}
                color="red"
                onClick={handleSubmit(onSubmit)}
              />
            </div>
            <div className="hidden group-hover:flex sm:col-span-2 -mt-0 mx-auto">
              <div className="flex items-center justify-center text-center">
                <p className="text-xs italic text-movet-black">
                  By clicking the &quot;Continue&quot; button above,
                  <br />
                  you agree to the{" "}
                  <span className="font-medium font-abside text-center md:text-left hover:underline  ease-in-out duration-500 mb-2">
                    <Link href="/privacy-policy?mode=app">
                      <span className="text-movet-brown hover:underline  ease-in-out duration-500 cursor-pointer">
                        privacy policy
                      </span>
                    </Link>
                  </span>{" "}
                  and{" "}
                  <span className="font-medium font-abside text-center md:text-left hover:underline  ease-in-out duration-500 mb-2">
                    <Link href="/terms-and-conditions?mode=app">
                      <span className="text-movet-brown hover:underline  ease-in-out duration-500 cursor-pointer">
                        terms of service
                      </span>
                    </Link>
                  </span>
                  .
                </p>
              </div>
            </div>
          </form>
          {!isAppMode && (
            <>
              <hr className="border-movet-gray w-full sm:w-2/3 mx-auto" />
              <div className="flex flex-row justify-center w-full mx-auto mt-8">
                <AppLinks />
              </div>
              <p className="text-center mb-4 italic text-sm w-full sm:w-2/3 mx-auto">
                You can also download our our mobile app to book appointments,
                manage your pets, chat with us, and much more!
              </p>
            </>
          )}
        </>
      ) : (
        <SignInWithEmailLinkRequired
          successMessage={successMessage}
          email={email}
        />
      )}
    </>
  );
};
