import AdminCheck from 'components/AdminCheck';
import ManageUsers from 'components/settings/ManageUsers';

const Users = () => {
  return (
    <main>
      <AdminCheck>
        <ManageUsers />;
      </AdminCheck>
    </main>
  );
};

export default Users;
