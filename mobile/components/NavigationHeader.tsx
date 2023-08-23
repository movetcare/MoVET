import { View, Text } from "react-native";
import tw from "tailwind";

export const NavigationHeader = ({
  title = "Untitled Screen",
  icon = "❗",
}: {
  title: string;
  icon: string;
}) => (
  <View style={tw`flex justify-center items-center bg-movet-red h-11`}>
    <Text style={tw`text-movet-white text-lg`}>
      {icon} {title}
    </Text>
  </View>
);
