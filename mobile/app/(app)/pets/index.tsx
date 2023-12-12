import {
  ActionButton,
  BodyText,
  Container,
  View,
  Screen,
  Icon,
  HeadingText,
  ItalicText,
  ExtendedViewProps,
} from "components/themed";
import { router } from "expo-router";
import { Appointment, AppointmentsStore, Patient, PatientsStore } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";
import { Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";

const MyPets = () => {
  const { patients } = PatientsStore.useState();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const [appointmentCounts, setAppointmentCounts] = useState<Array<{
    id: number;
    count: number;
  }> | null>(null);
  const [backgroundImage, setBackgroundImage] =
    useState<ExtendedViewProps["withBackground"]>("dog");

  useEffect(() => {
    if (patients) {
      const appointmentCounts: any = [];
      let dogCount = 0;
      let catCount = 0;
      patients?.forEach((patient: Patient) => {
        if (patient.species?.toLowerCase()?.includes("dog")) dogCount += 1;
        else if (patient.species?.toLowerCase()?.includes("cat")) catCount += 1;
        let upcomingPatientAppointments = 0;
        if (upcomingAppointments)
          upcomingAppointments.forEach((appointment: Appointment) => {
            appointment?.patients?.forEach((patientData: Patient) => {
              if (patientData.id === patient.id)
                upcomingPatientAppointments += 1;
            });
          });
        appointmentCounts.push({
          id: patient?.id,
          count: upcomingPatientAppointments,
        });
      });
      if (catCount > dogCount) setBackgroundImage("cat");
      if (appointmentCounts.length > 0) setAppointmentCounts(appointmentCounts);
    }
  }, [patients, upcomingAppointments]);

  return (
    <Screen withBackground={backgroundImage}>
      <View
        noDarkMode
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-grow items-center justify-center w-full pt-2 bg-transparent`,
        ]}
      >
        <View
          style={[
            tw`flex-col rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white bg-transparent w-full`,
          ]}
          noDarkMode
        >
          {patients &&
            patients.length > 0 &&
            patients.map((patient: Patient, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={tw`flex-row`}
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/pets/detail",
                      params: { id: patient?.id },
                    })
                  }
                >
                  <View
                    noDarkMode
                    style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:bg-movet-black dark:border-movet-white w-full`}
                  >
                    <Container
                      style={tw`px-4 flex items-center justify-center`}
                    >
                      {patient?.photoUrl ? (
                        <Image
                          source={{ uri: patient?.photoUrl }}
                          alt={patient?.name + "'s photo"}
                          height={50}
                          width={50}
                          style={tw`rounded-full`}
                        />
                      ) : (
                        <Icon
                          name={
                            patient?.species?.toLowerCase()?.includes("dog")
                              ? "dog"
                              : "cat"
                          }
                          size="md"
                        />
                      )}
                    </Container>
                    <Container style={tw`flex-shrink`}>
                      <HeadingText style={tw`text-lg`}>
                        {patient.name}
                        {/* {__DEV__ && ` - #${patient.id}`} */}
                      </HeadingText>
                      <BodyText style={tw`text-sm -mt-0.5`}>
                        {patient.breed}
                      </BodyText>
                      <Container style={tw`flex-row items-center`}>
                        <Icon
                          name={
                            patient?.gender?.toLowerCase()?.includes("male")
                              ? "male"
                              : "female"
                          }
                          size="xxs"
                        />
                        <ItalicText style={tw`text-xs ml-1`}>
                          {patient.birthday}
                        </ItalicText>
                      </Container>
                      {appointmentCounts &&
                        appointmentCounts.map(
                          (appointmentCount: { id: number; count: number }) => {
                            if (
                              appointmentCount.id === patient.id &&
                              appointmentCount.count > 0
                            ) {
                              return (
                                <Container
                                  style={tw`flex-row items-center`}
                                  key={appointmentCount.id}
                                >
                                  <Icon name={"calendar-heart"} size="xxs" />
                                  <ItalicText style={tw`text-xs ml-1`}>
                                    {appointmentCount.count} Upcoming
                                    Appointment
                                    {appointmentCount.count > 1 ? "s" : ""}
                                  </ItalicText>
                                </Container>
                              );
                            } else if (
                              patient.vcprRequired &&
                              appointmentCount.id === patient.id &&
                              appointmentCount.count === 0
                            )
                              return (
                                <Container
                                  style={tw`flex-row items-center`}
                                  key={index}
                                >
                                  <Icon
                                    name={"exclamation-circle"}
                                    size="xxs"
                                  />
                                  <ItalicText
                                    noDarkMode
                                    style={tw`text-movet-red text-xs ml-1`}
                                  >
                                    VCPR Required!
                                  </ItalicText>
                                </Container>
                              );
                          },
                        )}
                    </Container>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
        <Container style={tw`flex-col sm:flex-row justify-around w-full my-8`}>
          <ActionButton
            title={
              (!upcomingAppointments && !pastAppointments
                ? "Request"
                : "Schedule") + " an Appointment"
            }
            iconName="calendar-plus"
            onPress={() => router.push("/(app)/pets/new-appointment")}
            style={tw`sm:w-2.75/6`}
          />
          <ActionButton
            color="black"
            title="Add a Pet"
            iconName="plus"
            onPress={() => router.push("/(app)/pets/new-pet")}
            style={tw`sm:w-2.75/6`}
          />
        </Container>
      </View>
    </Screen>
  );
};
export default MyPets;
