import { Appointment, AppointmentList } from "components/AppointmentList";
import { SectionHeading } from "components/SectionHeading";
import { Container, ActionButton } from "components/themed";
import { router } from "expo-router";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

export const AppointmentsList = ({
  appointments,
}: {
  appointments: Array<Appointment> | null;
}) => {
  return appointments && appointments.length ? (
    <>
      <SectionHeading
        iconName={"clipboard-medical"}
        text={"Upcoming Appointments"}
      />
      <AppointmentList appointments={appointments} />
      <Container
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-col sm:flex-row justify-around w-full`,
        ]}
      >
        <ActionButton
          title="Schedule an Appointment"
          iconName="calendar-plus"
          onPress={() => router.push("/(app)/appointments/new")}
          style={tw`sm:w-2.75/6`}
        />
        <ActionButton
          color="black"
          title="Chat with Us"
          iconName="user-medical-message"
          onPress={() => router.push("/(app)/chat")}
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
          title="Schedule an Appointment"
          iconName="calendar-plus"
          onPress={() => router.push("/(app)/appointments/new")}
          style={tw`sm:w-2.75/6`}
        />
        <ActionButton
          color="black"
          title="Chat with Us"
          iconName="user-medical-message"
          onPress={() => router.push("/(app)/chat")}
          style={tw`sm:w-2.75/6`}
        />
      </Container>
    </>
  );
};
