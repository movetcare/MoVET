import AdminCheck from 'components/AdminCheck';
import ManageTelehealth from 'components/settings/booking/ManageTelehealth';

const Telehealth = () => {
  return (
    <main>
      <AdminCheck>
        <ManageTelehealth />
      </AdminCheck>
    </main>
  );
};

export default Telehealth;
