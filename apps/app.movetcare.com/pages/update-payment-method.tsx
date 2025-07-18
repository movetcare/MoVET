/* eslint-disable react-hooks/exhaustive-deps */
import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  faArrowLeft,
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
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import Image from "next/image";

export default function UpdatePaymentMethod() {
  const router = useRouter();
  const { email, success } = router.query || {};
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
    } as any,
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
            router.push(result);
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
      reset({
        email: (email as string)
          ?.toLowerCase()
          ?.replaceAll(" ", "+")
          ?.replaceAll("%20", "+")
          ?.replaceAll("%40", "@"),
      });
      onSubmit({
        email: (email as string)
          ?.toLowerCase()
          ?.replaceAll(" ", "+")
          ?.replaceAll("%20", "+")
          ?.replaceAll("%40", "@"),
      });
    }
  }, [email, executeRecaptcha]);

  const onSubmit = async (data: any) =>
    updatePaymentMethod({ email: data.email?.toLowerCase() });

  return (
    <div className="h-screen flex flex-grow items-center justify-center max-w-screen-md mx-auto px-4 sm:px-8 overflow-hidden">
      <Head>
        <title>Update Payment Method - MoVET</title>
        <meta
          name="description"
          content="Update the default payment method for your MoVET account."
        />
      </Head>
      <main className="w-full flex-1 overflow-hidden">
        <AppHeader />
        {success ? (
          <div className="text-center relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
            <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#00A36C" />
            <h2 className="text-2xl tracking-tight text-movet-black font-parkinson mt-6">
              You are all set!
            </h2>
            <p
              className={
                "text-lg leading-6 text-movet-black font-source-sans-pro my-4"
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
              <>
                <Loader message="Loading Payment Processing..." />
                <a
                  href="https://stripe.com/payments"
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0"
                >
                  <Image
                    src="/images/icons/powered-by-stripe.svg"
                    alt="Powered by Stripe"
                    height={40}
                    width={120}
                    className="mx-auto"
                  />
                </a>
              </>
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
                <p className="mb-4">{JSON.stringify(error)}</p>
                <Button
                  color="black"
                  text="Go Back"
                  icon={faArrowLeft}
                  onClick={() => router.reload()}
                />
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
                      <div className="flex flex-col sm:col-span-2 -mt-2 mx-auto">
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
                    <a
                      href="https://stripe.com/payments"
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 col-span-2"
                    >
                      <Image
                        src="/images/icons/powered-by-stripe.svg"
                        alt="Powered by Stripe"
                        height={40}
                        width={120}
                        className="mx-auto mb-4"
                      />
                    </a>
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
