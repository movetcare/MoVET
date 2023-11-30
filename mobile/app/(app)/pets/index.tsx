import {
  ActionButton,
  BodyText,
  Container,
  View,
  Screen,
  Icon,
  HeadingText,
  ItalicText,
} from "components/themed";
import { router } from "expo-router";
import { Patient, PatientsStore } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";
import { Image, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { VcprAlert } from "components/home/VcprAlert";

const MyPets = () => {
  const { patients } = PatientsStore.useState();
  const [showVcprAlert, setShowVcprAlert] = useState<boolean>(false);
  const [vcprPatients, setVcprPatients] = useState<Patient[] | null>(null);

  useEffect(() => {
    if (patients) {
      const vcprPatients: Array<Patient> = [];
      patients.forEach((patient: Patient) => {
        if (patient.vcprRequired) {
          vcprPatients.push(patient);
          setShowVcprAlert(true);
        }
      });
      setVcprPatients(vcprPatients);
    }
  }, [patients]);

  return (
    <Screen>
      {showVcprAlert && (
        <Container style={tw`mt-4`}>
          <VcprAlert
            patients={vcprPatients}
            scheduleAppointmentPath="/(app)/pets/new-appointment"
          />
        </Container>
      )}
      <View
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-grow items-center justify-center w-full mt-2`,
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
                    style={[
                      tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:bg-movet-black dark:border-movet-white w-full`,
                      patient?.vcprRequired && tw`bg-movet-red/30`,
                    ]}
                  >
                    <Container style={tw`p-3`}>
                      {patient?.photoUrl ? (
                        <Image
                          source={{ uri: patient?.photoUrl }}
                          alt="pic"
                          height={35}
                          width={35}
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
                      <HeadingText style={tw`text-black text-lg`}>
                        {patient.name}
                        {__DEV__ && ` - #${patient.id}`}
                      </HeadingText>
                      <BodyText style={tw`text-black text-sm -mt-0.5`}>
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
                        <ItalicText style={tw`text-black text-xs ml-1`}>
                          {patient.birthday}
                        </ItalicText>
                      </Container>
                    </Container>
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
        <Container style={tw`flex-col sm:flex-row justify-around w-full mb-8`}>
          <ActionButton
            title="Schedule an Appointment"
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
