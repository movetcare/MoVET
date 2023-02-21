import AdminCheck from "components/AdminCheck";
import { RequestAnAppointmentControls } from "components/settings/RequestAnAppointmentControls";
const RequestAnAppointment = () => (
  <AdminCheck>
    <RequestAnAppointmentControls />
  </AdminCheck>
);

export default RequestAnAppointment;
