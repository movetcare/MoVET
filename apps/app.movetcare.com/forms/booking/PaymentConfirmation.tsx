import { BookingFooter } from "components/booking/BookingFooter";
import { Booking } from "types/Booking";
import { useState } from "react";
import { BookingHeader } from "components/booking/BookingHeader";
import { faArrowRight, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { Button } from "ui";
import { Error } from "components/Error";
import { Loader } from "ui";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "services/firebase";

export const PaymentConfirmation = ({
  session,
  isAppMode,
}: {
  session: Booking;
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
        <Loader message="Taking you to Stripe..." />
      ) : error ? (
        <Error errorMessage={error?.message || "Unknown Error"} />
      ) : (
        <>
          <BookingHeader
            isAppMode={isAppMode}
            title="Form of Payment Required"
            description={`A valid form of payment on file is required before MoVET can perform any services on your pet${
              session?.patients && session?.patients?.length > 1 ? "s" : ""
            }.`}
          />
          <form onSubmit={onSubmit}>
            <h2 className="text-center font-extrabold italic mt-4">
              You will not be charged until your appointment is completed.
            </h2>
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
              className="mt-8 mb-4"
            />
          </form>
        </>
      )}
    </>
  );
};
