import AdminCheck from 'components/AdminCheck';
import ManageBooking from 'components/settings/booking/ManageBooking';

const Booking = () => {
  return (
    <main>
      <AdminCheck>
        <ManageBooking />
      </AdminCheck>
    </main>
  );
};

export default Booking;
