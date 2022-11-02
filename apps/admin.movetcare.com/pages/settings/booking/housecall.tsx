import AdminCheck from 'components/AdminCheck';
import ManageHousecall from 'components/settings/booking/ManageHousecall';

const Housecall = () => {
  return (
    <main>
      <AdminCheck>
        <ManageHousecall />
      </AdminCheck>
    </main>
  );
};

export default Housecall;
