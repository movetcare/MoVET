/* eslint-disable react-hooks/exhaustive-deps */
import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  faCheckCircle,
  faCircleExclamation,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, AppLinks, Loader } from "ui";
import EmailInput from "components/inputs/EmailInput";
import { httpsCallable } from "firebase/functions";
import Link from "next/link";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { functions } from "services/firebase";
import { QRCodeSVG } from "qrcode.react";
import { setTimeout } from "timers";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function UpdatePaymentMethod() {
  const router = useRouter();
  const { mode, email, success } = router.query || {};
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    control,
    handleSubmit,
    reset,
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

  const updatePaymentMethod = async (data: any) => {
    setIsLoading(true);
    if (executeRecaptcha) {
      const token = await executeRecaptcha("updatePaymentMethod");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "updatePaymentMethod"
          )({
            ...data,
            token,
          });
          if (result === false) {
            setSignUpSuccess(false);
            setError("ERROR - UNKNOWN");
          } else {
            setSignUpSuccess(true);
            setTimeout(() => router.push(result), 1500);
          }
        } catch (error) {
          console.error(error);
          setError(error);
          reset();
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (email && executeRecaptcha) {
      reset({ email: (email as string)?.toLowerCase() });
      updatePaymentMethod({ email: (email as string)?.toLowerCase() });
    }
  }, [email, executeRecaptcha]);

  const onSubmit = async (data: any) =>
    updatePaymentMethod({ email: data.email?.toLowerCase() });

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <main className="w-full flex-1 overflow-hidden">
        {!isLoading && <AppHeader />}
        {mode === "kiosk" ? (
          <section className="flex flex-col justify-center items-center max-w-xl mx-auto bg-white rounded-xl mb-8 p-8">
            <QRCodeSVG
              size={250}
              value={
                (window.location.hostname === "localhost"
                  ? "http://localhost:3001"
                  : "https://movetcare.com") +
                `/payment/${email ? `?email=${email}` : ""}`
              }
            />
            <p className="text-center mt-8 italic text-xl">
              Scan the QR code above to update your payment method for MoVET
              Care.
            </p>
          </section>
        ) : success ? (
          <div className="text-center relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
            <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#00A36C" />
            <h3 className="text-2xl tracking-tight text-movet-black font-parkinson mt-6">
              You are all set!
            </h3>
            <p
              className={
                "text-lg leading-6 text-movet-black font-source-sans-pro mt-4"
              }
            >
              We have updated your payment method on file and will use that
              information to process your MoVET invoices going forward.
            </p>
            <hr className="border-movet-gray w-full sm:w-2/3 mx-auto" />
            <p
              className={
                "mt-4 leading-6 text-movet-black font-source-sans-pro italic"
              }
            >
              If you haven&apos;t already, checkout our new mobile app which you
              can use to book future clinic, at home, and telehealth
              appointments!
            </p>
            <div className="flex flex-col justify-center items-center mb-4 mt-6">
              <div className="flex justify-center">
                <AppLinks />
              </div>
            </div>
          </div>
        ) : (
          <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <div className="text-center">
                <h2 className="text-2xl font-extrabold tracking-tight text-movet-black sm:text-4xl font-parkinson mb-4">
                  Whoops!
                </h2>
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  size="3x"
                  className="text-movet-red"
                />
                <p className={"mt-4 text-lg leading-6 text-movet-black"}>
                  We&apos;re sorry, but something went wrong. Please try again
                  or ask support@movetcare.com for assistance.
                </p>
                <p>{JSON.stringify(error)}</p>
              </div>
            ) : (
              <>
                {signUpSuccess === null ? (
                  <>
                    <h2 className="text-2xl font-extrabold tracking-tight text-center">
                      Add a Payment Method
                    </h2>
                    <p className="text-center mb-4">
                      Submit your email address below to add a new credit card
                      to your account
                    </p>
                    <form className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 pb-4">
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
                          icon={faCreditCard}
                          iconSize={"lg"}
                          color="red"
                          disabled={email ? false : !isDirty}
                          text="Add a Payment Method"
                          onClick={handleSubmit(onSubmit)}
                        />
                      </div>
                      <div className="flex sm:col-span-2 -mt-0 mx-auto">
                        <div className="flex items-center justify-center text-center">
                          <p className="text-xs italic text-movet-black">
                            By clicking the &quot;Add a Payment Method&quot;
                            button above,
                            <br />
                            you agree to the{" "}
                            <span className="font-medium font-abside text-center md:text-left hover:underline ease-in-out duration-500 mb-2">
                              <Link href="/privacy-policy?mode=app">
                                <span className="text-movet-brown hover:underline ease-in-out duration-500 cursor-pointer">
                                  privacy policy
                                </span>
                              </Link>
                            </span>{" "}
                            and{" "}
                            <span className="font-medium font-abside text-center md:text-left hover:underline ease-in-out duration-500 mb-2">
                              <Link href="/terms-and-conditions?mode=app">
                                <span className="text-movet-brown hover:underline ease-in-out duration-500 cursor-pointer">
                                  terms of service
                                </span>
                              </Link>
                            </span>
                            .
                          </p>
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <Loader />
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
