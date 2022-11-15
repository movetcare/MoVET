/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loader } from "ui";
import { httpsCallable } from "firebase/functions";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { auth, functions } from "services/firebase";
import { environment } from "utilities";
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithCustomToken,
} from "firebase/auth";
import { BookingController } from "components/booking/BookingController";
import { StartBooking } from "forms/booking/StartBooking";
import { SignInWithEmailLinkRequired } from "components/SignInWithEmailLinkRequired";
import { Error } from "components/Error";
import { useClientData } from "hooks/useClientData";
import { ClientDataContext } from "contexts/ClientDataContext";
import { LoadScript } from "@react-google-maps/api";

export default function Booking() {
  const router = useRouter();
  const { email, id, mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [bookingToken, setBookingToken] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<
    boolean | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [booking, setBooking] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const clientData = useClientData();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        const verifyBooking = async (id?: string) => {
          setIsLoading(true);
          if (executeRecaptcha) {
            const token = await executeRecaptcha("booking");
            if (token) {
              try {
                const { data: result }: any = await httpsCallable(
                  functions,
                  "verifyBooking"
                )(
                  id
                    ? {
                        id,
                        token,
                      }
                    : { token }
                );
                if (result.error !== true || result.error === undefined) {
                  setBooking(`${result.id}`);
                  setIsLoading(false);
                } else handleError(result);
              } catch (error) {
                handleError(error);
              }
            }
          }
        };
        if (id) verifyBooking(`${id}`);
        else if (bookingToken) verifyBooking();
      }
    });
    return () => unsubscribe();
  }, [id, bookingToken, executeRecaptcha]);

  useEffect(() => {
    if (email && executeRecaptcha) verifyBookingWithEmail();
    else setIsLoading(false);
  }, [email, executeRecaptcha]);

  useEffect(() => {
    if (
      bookingToken === null &&
      window.localStorage.getItem("bookingToken") !== undefined &&
      window.localStorage.getItem("bookingToken") !== null
    ) {
      setBookingToken(window.localStorage.getItem("bookingToken"));
      signInWithCustomToken(
        auth,
        window.localStorage.getItem("bookingToken") as string
      ).catch((error) => {
        console.error(error);
      });
    }
  }, []);
  const verifyBookingWithEmail = async () => {
    setIsLoading(true);
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "verifyBooking"
          )({
            email: email,
            id,
            token,
          });
          if (result.error !== true || result.error === undefined) {
            if (email) {
              if (result.isNewClient !== true)
                setSuccessMessage(
                  `${
                    result.displayName
                      ? `Welcome back, ${result.displayName}!`
                      : "Sign In Required!"
                  }`
                );
              sendSignInLinkToEmail(auth, (email as string)?.toLowerCase(), {
                url:
                  (environment === "production"
                    ? "https://app.movetcare.com"
                    : "http://localhost:3001") + `/booking?id=${result.id}`,
                handleCodeInApp: true,
                iOS: {
                  bundleId: "com.movet.inc",
                },
                android: {
                  packageName: "com.movet",
                  installApp: true,
                  minimumVersion: "16",
                },
                dynamicLinkDomain: "movetcare.com",
              })
                .then(() => {
                  window.localStorage.setItem(
                    "email",
                    (email as string)?.toLowerCase()
                  );
                })
                .catch((error) => handleError(error));
              setVerificationSuccess(true);
              setIsLoading(false);
            }
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    }
  };
  const handleError = (error: any) => {
    setVerificationSuccess(null);
    console.error(error);
    setError(error);
    setIsLoading(false);
  };
  return (
    <section className="w-full flex-1">
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-xl mx-auto${
          !isAppMode ? " p-4 my-8 sm:p-8" : ""
        }`}
      >
        <div className={isAppMode ? "px-4 mb-8" : "p-4 sm:p-8"}>
          <section className="relative mx-auto">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                {booking !== null ? (
                  <ClientDataContext.Provider value={clientData as any}>
                    <LoadScript
                      googleMapsApiKey="AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0"
                      language="en"
                      region="en"
                      libraries={["places"]}
                      loadingElement={<Loader />}
                    >
                      <BookingController id={booking} isAppMode={isAppMode} />
                    </LoadScript>
                  </ClientDataContext.Provider>
                ) : verificationSuccess === null ? (
                  <StartBooking isAppMode={isAppMode} />
                ) : (
                  <SignInWithEmailLinkRequired
                    successMessage={successMessage}
                    email={window.localStorage.getItem("email") || undefined}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
