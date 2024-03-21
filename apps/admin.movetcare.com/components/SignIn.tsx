import { auth } from "services/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faPhone,
  faSignIn,
} from "@fortawesome/free-solid-svg-icons";
import { Loader } from "ui";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

const provider = new GoogleAuthProvider();

export const SignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabledNotice, setDisabledNotice] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInToken, setSignInToken] = useState<string | null>(null);

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
            handleError(error) && setTimeout(() => router.reload(), 3000),
        );
  }, [signInToken, router]);

  const handleError = (error: { message: string }) => {
    console.error(error);
    setSignInError(error?.message);
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
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoading(true);
                      signInWithPopup(auth, provider).catch((error: any) => {
                        if (error.code === "auth/user-disabled") {
                          setSignInError(
                            "Please contact support for assistance!",
                          );
                          console.error(error);
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
                    SIGN IN
                    <span className="ml-2">
                      <FontAwesomeIcon icon={faSignIn} size="lg" />
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
