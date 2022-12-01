/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppLinks, Loader } from "ui";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { auth, firestore } from "services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Error } from "components/Error";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { BookingHeader } from "components/booking/BookingHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { AppHeader } from "components/AppHeader";

export default function BookingSuccess() {
  const router = useRouter();
  const { id, mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        const completeBooking = async (id: string) => {
          setIsLoading(true);
          // const docSnap = await getDoc(doc(firestore, "bookings", `${id}`));
          // if (docSnap.exists()) {
          //   console.log("Document data:", docSnap.data());
          //   await setDoc(
          //     doc(firestore, "bookings", `${id}`),
          //     {
          //       step: "complete",
          //       updatedOn: serverTimestamp(),
          //     },
          //     { merge: true }
          //   )
          //     .then(() => setIsLoading(false))
          //     .catch((error: any) => {
          //       handleError(error);
          //     });
          // } else {
          //   handleError({ message: "CAN NOT LOCATE APPOINTMENT BOOKING" });
          // }
          await setDoc(
            doc(firestore, "bookings", `${id}`),
            {
              step: "complete",
              updatedOn: serverTimestamp(),
            },
            { merge: true }
          )
            .then(() => setIsLoading(false))
            .catch((error: any) => {
              handleError(error);
            });
        };
        if (id) completeBooking(`${id}`);
      }
    });
    return () => unsubscribe();
  }, [id, executeRecaptcha]);
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  };
  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-lg mx-auto mb-4`}
      >
        <div className={isAppMode ? "px-4 mb-8" : "p-4"}>
          <section className="relative mx-auto">
            {isLoading ? (
              <Loader message="Loading Confirmation..." />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="4x"
                  className="text-movet-green mx-auto w-full mb-4"
                />
                <BookingHeader
                  isAppMode={isAppMode}
                  title="Booking Request Successful"
                  description={
                    "We will get contact to you as soon as we can to confirm the exact day and time of your appointment!"
                  }
                />
                <p className="text-xs italic text-center mt-4 sm:px-8">
                  Please allow 1 business day for a response. All appointment
                  requests are responded to in the order they are received.
                </p>
              </>
            )}
          </section>
          {!isAppMode && !isLoading && (
            <section>
              <hr className="border-movet-gray w-full sm:w-2/3 mx-auto mt-8" />
              <h2 className="text-center mb-0">Download The App!</h2>
              <div className="flex flex-row justify-center w-full mx-auto mt-4">
                <AppLinks />
              </div>
              <p className="text-center mb-4 italic text-sm w-full sm:w-2/3 mx-auto">
                Download our our mobile app to manage your pets, manage your
                appointments, chat with us, and more!
              </p>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
