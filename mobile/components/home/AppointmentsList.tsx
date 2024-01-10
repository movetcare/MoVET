import { AppointmentList } from "components/AppointmentList";
import { SectionHeading } from "components/SectionHeading";
import { Container, ActionButton } from "components/themed";
import { router } from "expo-router";
import { AppointmentsStore } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

export const AppointmentsList = ({ source = "pets" }: { source: "home" | "pets" }) => {
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  return upcomingAppointments && upcomingAppointments.length ? (
    <>
      <SectionHeading
        iconName={"clipboard-medical"}
        text={"Upcoming Appointments"}
      />
      <AppointmentList source={source} />
      <Container
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-col sm:flex-row justify-around w-full mt-4`,
        ]}
      >
        <ActionButton
          title={
            (!upcomingAppointments && !pastAppointments
              ? "Request"
              : "Schedule") + " an Appointment"
          }
          iconName="calendar-plus"
          onPress={() =>
            source === "pets"
              ? router.navigate("/(app)/pets/new-appointment")
              : router.navigate("/(app)/home/new-appointment")
          }
          style={tw`sm:w-2.75/6`}
        />
        <ActionButton
          color="black"
          title="Chat with Us"
          iconName="user-medical-message"
          onPress={() => router.navigate("/(app)/chat")}
          style={tw`sm:w-2.75/6`}
        />
      </Container>
    </>
  ) : (
    <>
      <SectionHeading
        iconName={"clipboard-medical"}
        text={"Ready to See Us?"}
      />
      <Container
        style={tw`flex-col sm:flex-row justify-around w-full px-4 -mt-2`}
      >
        <ActionButton
          title={
            (!upcomingAppointments && !pastAppointments
              ? "Request"
              : "Schedule") + " an Appointment"
          }
          iconName="calendar-plus"
          onPress={() =>
            source === "pets"
              ? router.navigate("/(app)/pets/new-appointment")
              : router.navigate("/(app)/home/new-appointment")
          }
          style={tw`sm:w-2.75/6`}
        />
        <ActionButton
          color="black"
          title="Chat with Us"
          iconName="user-medical-message"
          onPress={() => router.navigate("/(app)/chat")}
          style={tw`sm:w-2.75/6`}
        />
      </Container>
    </>
  );
};
