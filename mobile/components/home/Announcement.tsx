import { FontAwesome5 } from "@expo/vector-icons";
import { HeadingText, SubHeadingText } from "components/themed";
import { Container } from "components/themed/View";
import { Link } from "expo-router";
import { ReactNode } from "react";
import { View } from "react-native";
import tw from "tailwind";

export interface Announcement {
  color: string;
  icon: "info-circle";
  isActiveMobile: boolean;
  link: string;
  message: string;
  title: string;
}

export const Announcement = ({
  announcement,
}: {
  announcement: Announcement;
}): ReactNode => {
  const { icon, title, message, link } = announcement;
  const backgroundColor =
    announcement?.color === "#DAAA00"
      ? "bg-movet-yellow"
      : announcement?.color === "#2C3C72"
      ? "bg-movet-dark-blue"
      : announcement?.color === "#E76159"
      ? "bg-movet-red"
      : announcement?.color === "#232127"
      ? "bg-movet-black"
      : announcement?.color === "#00A36C"
      ? "bg-movet-green"
      : announcement?.color === "#A15643"
      ? "bg-movet-brown"
      : "bg-movet-dark-blue";

  return (
    <Link
      href={{
        pathname: "/(app)/home/web-view",
        params: { path: link },
      }}
      style={tw`mx-4 mt-4`}
    >
      <View
        style={tw`p-4 ${backgroundColor} text-movet-white rounded-xl flex-row items-center`}
      >
        <Container>
          <FontAwesome5 name={icon} size={30} color={tw.color("movet-white")} />
        </Container>
        <Container style={tw`pl-4 mr-6`}>
          <HeadingText style={tw`text-movet-white text-lg`}>
            {title}
          </HeadingText>
          <SubHeadingText style={tw`text-movet-white text-xs mb-2`}>
            {message}
          </SubHeadingText>
        </Container>
      </View>
    </Link>
  );
};
