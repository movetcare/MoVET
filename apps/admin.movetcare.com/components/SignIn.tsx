import { auth } from "services/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faEnvelopeSquare,
  faPaw,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";
import PhoneInput from "./inputs/PhoneInput";
import { useForm } from "react-hook-form";
import Button from "./Button";
import Link from "next/link";
import toast from "react-hot-toast";
import { SignInModal } from "./modals/SignInModal";
import { formatPhoneNumber } from "utils/formatPhoneNumber";
import Image from "next/image";

const provider = new GoogleAuthProvider();

export const SignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabledNotice, setDisabledNotice] = useState<boolean>(false);
  const [showPhoneAuthFlow, setShowPhoneAuthFlow] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [appVerifier, setAppVerifier] = useState<any>();
  const [signInTokenSent, setSignInTokenSent] = useState<any>(null);
  const [signInToken, setSignInToken] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [phone, setPhone] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      phone: "",
    },
  });

  useEffect(() => {
    setAppVerifier((window as any).recaptchaVerifier);
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
      },
      auth
    );
  }, []);

  useEffect(() => {
    if (signInTokenSent && signInToken)
      (window as any).confirmationResult
        .confirm(signInToken)
        .then((result: any) => {
          const user = result.user;
          console.log(user);
        })
        .catch((error: any) => {
          console.error(error);
          setSignInError(error.message);
        })
        .finally(() => setIsLoading(false));
  }, [signInTokenSent, signInToken]);

  useEffect(() => {
    if (signInError) {
      toast(signInError + " Reloading Page...", {
        position: "top-center",
        duration: 3500,
        icon: (
          <FontAwesomeIcon
            icon={faCircleExclamation}
            size="sm"
            className="text-movet-red"
          />
        ),
      });
      setTimeout(() => router.reload(), 3000);
    }
  }, [signInError, router]);

  useEffect(() => {
    if (signInToken)
      (window as any).confirmationResult
        .confirm(signInToken)
        .then((result: any) => {
          const user = result.user;
          console.log("USER", user);
        })
        .catch(
          (error: any) =>
            handleError(error) && setTimeout(() => router.reload(), 3000)
        );
  }, [signInToken, router]);

  const onPhoneSubmit = (data: { phone: string }) => {
    setIsLoading(true);
    setPhone(data?.phone);
    signInWithPhoneNumber(auth, `+1${data?.phone}`, appVerifier)
      .then((confirmationResult: any) => {
        (window as any).confirmationResult = confirmationResult;
        setSignInTokenSent(confirmationResult);
        setShowTokenModal(true);
      })
      .catch(
        (error: any) =>
          handleError(error) && setTimeout(() => router.reload(), 3000)
      )
      .finally(() => setIsLoading(false));
  };

  const handleError = (error: { message: string }) => {
    console.error(error);
    setSignInError(error?.message);
    setShowPhoneAuthFlow(false);
    setShowTokenModal(false);
    setSignInToken(null);
    setIsLoading(false);
    return false;
  };

  return isLoading ? (
    <main
      className={
        "h-screen flex flex-grow items-center justify-center p-8 md:px-12 lg:px-24 bg-movet-white"
      }
    >
      <div className="bg-white rounded-lg">
        <Loader />
      </div>
    </main>
  ) : (
    <main
      className={
        "h-screen flex flex-grow items-center justify-center p-8 bg-movet-white"
      }
    >
      <div className="flex flex-col items-center justify-center w-full flex-1 text-center">
        <div className="min-h-full flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full space-y-4 bg-white p-12 rounded-xl">
            {!disabledNotice ? (
              <>
                <Link href="/">
                  <Image
                    className="mx-auto h-12 w-auto"
                    src="/images/logo/logo.png"
                    alt="MoVET"
                    priority
                    height={40}
                    width={175}
                  />
                </Link>
                {!showPhoneAuthFlow ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoading(true);
                        signInWithPopup(auth, provider).catch((error: any) => {
                          if (error.code === "auth/user-disabled") {
                            setSignInError(
                              "Please contact support for assistance!"
                            );
                            console.error(error);
                            setShowPhoneAuthFlow(false);
                            setShowTokenModal(false);
                            setSignInToken(null);
                            setDisabledNotice(true);
                            setIsLoading(false);
                          } else {
                            handleError(error) &&
                              setTimeout(() => router.reload(), 3000);
                          }
                        });
                      }}
                      className="flex flex-row bg-movet-red group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red"
                    >
                      EMAIL
                      <span className="ml-2">
                        <FontAwesomeIcon icon={faEnvelopeSquare} size="lg" />
                      </span>
                    </button>
                    <button
                      type="button"
                      id="sign-in-button"
                      // onClick={() => setShowPhoneAuthFlow(true)}
                      className="flex-row bg-movet-black group relative w-full justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-movet-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red hidden"
                    >
                      PHONE
                      <span className="ml-2">
                        <FontAwesomeIcon icon={faPhone} />
                      </span>
                    </button>
                  </>
                ) : showTokenModal ? (
                  <SignInModal
                    icon={faPhone}
                    title="Sign In Code"
                    text={`Please enter 6 digit code we just texted to ${formatPhoneNumber(
                      phone as string
                    )}`}
                    yesButtonText="SIGN IN"
                    cancelButtonText="CANCEL"
                    modalIsOpen={showTokenModal}
                    setModalIsOpen={setShowTokenModal}
                    iconColor="green"
                    yesButtonColor="green"
                    setToken={setSignInToken}
                  />
                ) : (
                  <form className="w-full">
                    <PhoneInput
                      disabled={isLoading}
                      label="Phone Number"
                      name="phone"
                      control={control}
                      errors={errors}
                      required={false}
                    />
                    <Button
                      type="submit"
                      icon={faPaw}
                      iconSize={"sm"}
                      loading={isLoading}
                      disabled={!isDirty || isLoading}
                      color="black"
                      text="Submit"
                      className={"w-full mt-6"}
                      onClick={handleSubmit(onPhoneSubmit as any)}
                    />
                  </form>
                )}
              </>
            ) : (
              <Image
                className="mx-auto h-50 w-auto"
                src="/animations/ahahah.gif"
                alt="MoVET"
                height={100}
                width={100}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
