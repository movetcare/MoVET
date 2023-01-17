import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { Button, Loader } from "ui";
import { BookingHeader } from "components/BookingHeader";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function ContactInfo() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router) {
      setIsLoading(false);
    } else router.push("/schedule-an-appointment");
  }, [router]);
  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null)
      setSession(
        JSON.parse(window.localStorage.getItem("bookingSession") as string)
      );
  }, []);
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    setIsLoading(false);
  };
  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    if (session?.checkoutSession) window.location = session.checkoutSession;
    else handleError({ message: "FAILED TO START CHECKOUT SESSION" });
  };
  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-xl mx-auto${
          !isAppMode ? " p-4 mb-4 sm:p-8" : ""
        }`}
      >
        <div className={isAppMode ? "px-4 mb-8" : "my-4"}>
          <section className="relative mx-auto">
            <>
              {isLoading ? (
                <>
                  <Loader
                    message="Loading Payment Information..."
                    isAppMode={isAppMode}
                  />
                  <Image
                    src="/images/icons/powered-by-stripe.svg"
                    alt="Powered by Stripe"
                    height={40}
                    width={120}
                    className="-mt-4 mx-auto"
                  />
                </>
              ) : error ? (
                <Error errorMessage={error?.message || "Unknown Error"} />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    size="4x"
                    className="text-movet-black mx-auto w-full mb-2"
                  />
                  <BookingHeader
                    isAppMode={isAppMode}
                    title="Form of Payment Required"
                    description={
                      "Having a payment source on file allows you to receive expedited service and skip the checkout lines when visiting our clinic and boutique."
                    }
                  />
                  <form onSubmit={onSubmit}>
                    <p className="text-center font-extrabold italic mt-4">
                      * You will <span className="underline">not</span> be
                      charged until your appointment is completed.
                    </p>
                    <Button
                      type="submit"
                      icon={faCreditCard}
                      disabled={
                        session?.checkoutSession === null ||
                        session?.checkoutSession === undefined
                      }
                      iconSize={"sm"}
                      color="black"
                      text="Add Payment"
                      className="mt-6 mb-4"
                    />
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
                  </form>
                </>
              )}
            </>
          </section>
        </div>
      </div>
    </section>
  );
}
