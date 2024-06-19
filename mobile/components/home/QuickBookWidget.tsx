import {
  Container,
  HeadingText,
  Icon,
  SubHeadingText,
  View,
} from "components/themed";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

export const QuickBookWidget = () => {
  return (
    <View
      style={[
        isTablet ? tw`px-16` : tw`px-4`,
        tw`flex-col my-4 rounded-xl bg-transparent`,
      ]}
    >
      <View
        style={tw`flex-row bg-movet-blue rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white p-2`}
        noDarkMode
      >
        <HeadingText
          style={tw`text-movet-white text-lg w-full text-center`}
          noDarkMode
        >
          Book an Appointment
        </HeadingText>
      </View>
      <View
        style={tw`flex-row bg-movet-blue/70 rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white p-2 mt-2 items-center w-full`}
        noDarkMode
      >
        <Container style={tw`mr-2`}>
          <HeadingText
            style={tw`text-movet-white text-lg w-full text-center`}
            noDarkMode
          >
            MoVET @ Belleview Station
          </HeadingText>
          <SubHeadingText noDarkMode style={tw`text-movet-white`}>
            4912 S Newport Street, Denver
          </SubHeadingText>
        </Container>
        <Container
          style={tw`bg-movet-red/75 items-center justify-center ml-4 py-4 pl-4 pr-3 rounded-xl`}
        >
          <Icon name="calendar-plus" height={30} width={30} color="white" />
        </Container>
      </View>
    </View>
  );
};
