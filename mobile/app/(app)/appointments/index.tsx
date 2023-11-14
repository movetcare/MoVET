import { SectionHeading } from "components/SectionHeading";
import { Icon, BodyText, Container, ActionButton, View, Screen } from "components/themed";
import {  router } from "expo-router";
import { PatientsStore } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

const Appointments = () => {
  const {patients} = PatientsStore.useState()
  return (
    <Screen withBackground="pets">
      {patients && patients.length ? (
         <BodyText style={tw`text-center px-8 mb-2`}>
           INSERT FULL APPOINTMENTS UI
          </BodyText>
      ) : (
        <View
          style={tw`flex-grow w-full justify-center items-center bg-transparent`}
          noDarkMode
        >
          <Icon
            name="clinic"
            height={isTablet ? 150 : 100}
            width={isTablet ? 150 : 100}
            style={tw`-mb-4`}
          />
          <SectionHeading text={"Setup Your Pet's Profile"} />
          <BodyText style={tw`text-center px-8 mb-2`}>
            Please add your pets to start booking your first appointment with
            MoVET
          </BodyText>
          <Container
            style={tw`w-full flex-col sm:flex-row justify-around items-center px-4`}
          >
            <ActionButton
              title="Add My Pet"
              iconName="plus"
              onPress={() => router.push("/(app)/pets/new")}
               style={tw`sm:w-2.75/6`}
            />
            <ActionButton
              title="View Our Services"
              iconName="list"
              color="black"
               style={tw`sm:w-2.75/6`}
              onPress={() =>
                router.push({
                  pathname: "/(app)/home/web-view",
                  params: {
                    path: "/services",
                    applicationSource: "website",
                    screenTitle: "Our Services",
                    screenTitleIcon: "list",
                  },
                })
              }
            />
          </Container>
        </View>
      )}
      <View style={tw`h-8`} />
    </Screen>
  );
};
export default Appointments;
