import { Booking } from "types/Booking";
import { useState } from "react";
import { BookingHeader } from "components/booking/BookingHeader";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { Button } from "ui";
import { Error } from "components/Error";
import { Loader } from "ui";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export const PaymentConfirmation = ({
  session,
  setStep,
  isAppMode,
}: {
  session: Booking;
  setStep: any;
  isAppMode: boolean;
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session.id}`),
      {
        step: "checkout",
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() => (window.location.href = session?.checkout?.url))
      .catch((error: any) => {
        setIsLoading(false);
        setError(error);
      });
  };
  return (
    <>
      {isLoading ? (
        <>
          <Loader message="Loading Payment Information..." />
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
            className="text-movet-black mx-auto w-full mb-4"
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
              * You will <span className="underline">not</span> be charged until
              your appointment is completed.
            </p>
            <Button
              type="submit"
              icon={faCreditCard}
              disabled={
                session?.checkout?.url === null ||
                session?.checkout?.url === undefined
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
                className="hover:bg-movet-gray ease-in-out duration-500 mx-auto"
              />
            </a>
          </form>
        </>
      )}
    </>
  );
};
