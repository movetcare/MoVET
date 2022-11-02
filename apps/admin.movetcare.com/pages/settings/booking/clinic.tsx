import AdminCheck from 'components/AdminCheck';
import ManageClinic from 'components/settings/booking/ManageClinic';

const Clinic = () => {
  return (
    <main>
      <AdminCheck>
        <ManageClinic />
      </AdminCheck>
    </main>
  );
};

export default Clinic;
