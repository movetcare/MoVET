import tw from "tailwind";
import {
  BodyText,
  Container,
  HeadingText,
  Icon,
  ItalicText,
  View,
} from "./themed";
import { isTablet } from "utils/isTablet";
import { Appointment, AppointmentsStore, Patient } from "stores";

export const AppointmentList = () => {
  const { upcomingAppointments } = AppointmentsStore.useState();
  return (
    <View
      style={[
        isTablet ? tw`px-16` : tw`px-4`,
        tw`flex-col rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white bg-transparent w-full`,
      ]}
      noDarkMode
    >
      {upcomingAppointments &&
        upcomingAppointments.map((appointment: Appointment) => {
          const location =
            appointment.resources.includes(6) || // Exam Room 1
            appointment.resources.includes(7) || // Exam Room 2
            appointment.resources.includes(8) || // Exam Room 3
            appointment.resources.includes(14) || // Exam Room 1
            appointment.resources.includes(15) || // Exam Room 2
            appointment.resources.includes(16) // Exam Room 3
              ? "CLINIC"
              : appointment.resources.includes(3) || // Truck 1
                  appointment.resources.includes(9) // Truck 2
                ? "HOUSECALL"
                : appointment.resources.includes(11) || // Virtual Room 1
                    appointment.resources.includes(18) // Virtual Room 2
                  ? "TELEHEALTH"
                  : "UNKNOWN APPOINTMENT TYPE";
          return (
            <View
              key={appointment.id}
              style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full`}
            >
              <Container style={tw`p-3`}>
                <Icon
                  name={
                    location === "CLINIC"
                      ? "clinic-alt"
                      : location === "HOUSECALL"
                        ? "mobile"
                        : location === "TELEHEALTH"
                          ? "telehealth"
                          : "question"
                  }
                  size="md"
                />
              </Container>
              <Container style={tw`flex-shrink`}>
                <HeadingText style={tw`text-black text-lg`}>
                  {JSON.stringify(appointment.patients)}
                  {appointment.patients.map((patient: Patient) => patient.name)}
                  {__DEV__ && ` - #${appointment.id}`}
                </HeadingText>
                <BodyText style={tw`text-black text-sm -mt-0.5`}>
                  {appointment.start.toDate().toLocaleDateString("en-us", {
                    weekday: "long",
                    year: "2-digit",
                    month: "numeric",
                    day: "numeric",
                  })}{" "}
                  @{" "}
                  {appointment.start.toDate().toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </BodyText>
                <Container style={tw`flex-row`}>
                  <ItalicText style={tw`text-black text-xs`}>
                    {appointment.patients[0].minorIllness}
                  </ItalicText>
                </Container>
              </Container>
            </View>
          );
        })}
    </View>
  );
};
