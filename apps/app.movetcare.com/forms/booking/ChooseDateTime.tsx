import { BookingFooter } from "components/booking/BookingFooter";
import { Booking } from "types/Booking";

export const ChooseDateTime = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  return (
    <>
      <pre>ChooseDateTime: {JSON.stringify({ ...session, isAppMode })}</pre>
      <BookingFooter session={session} />
    </>
  );
};
