import { Redirect } from "expo-router";
import { AuthStore } from "stores/AuthStore";

const RequestAnAppointment = () => {
  const { isLoggedIn } = AuthStore.useState();
  return isLoggedIn ? (
    <Redirect href={`/(app)/home/request-an-appointment`} />
  ) : (
    <Redirect href={`/(auth)/login`} />
  );
};

export default RequestAnAppointment;
