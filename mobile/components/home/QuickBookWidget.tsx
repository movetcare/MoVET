import { HeadingText, View } from "components/themed";
import tw from "tailwind";

export const QuickBookWidget = () => {
  return (
    <View
      style={tw`pr-4 pt-2 pb-3 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full shadow-lg shadow-movet-black dark:shadow-movet-white`}
      noDarkMode
    >
      <HeadingText>Book an Appointment</HeadingText>
    </View>
  );
};
