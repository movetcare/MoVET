import { BookingFooter } from "components/booking/BookingFooter";
import { Booking } from "types/Booking";

export const Confirmation = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  return (
    <>
      <p>Confirmation: {JSON.stringify({ ...session, isAppMode })}</p>
      <BookingFooter session={session} />
    </>
  );
};
