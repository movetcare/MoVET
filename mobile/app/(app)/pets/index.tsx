import {
  ActionButton,
  BodyText,
  Container,
  View,
  Screen,
} from "components/themed";
import { router } from "expo-router";
import { PatientsStore } from "stores/PatientsStore";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

const MyPets = () => {
  return (
    <Screen>
      <View
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-grow items-center justify-center w-full`,
        ]}
      >
        <BodyText>{JSON.stringify(PatientsStore.useState())}</BodyText>
        <Container style={tw`flex-col sm:flex-row justify-around w-full`}>
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
