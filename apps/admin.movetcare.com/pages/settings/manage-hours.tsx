import AdminCheck from "components/AdminCheck";
import ManageSchedule from "components/settings/booking/ManageSchedule";

const ManageScheduleSettings = () => {
  return (
    <main>
      <AdminCheck>
        <ManageSchedule />
      </AdminCheck>
    </main>
  );
};

export default ManageScheduleSettings;
