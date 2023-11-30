import {
  BodyText,
  HeadingText,
  Icon,
  View,
  Container,
} from "components/themed";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ReactNode } from "react";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

export interface Announcement {
  color: string;
  icon: "info-circle" | "exclamation-circle" | "star" | "bullhorn" | "bell";
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
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(app)/home/web-view",
          params: { path: link },
        })
      }
    >
      <View
        noDarkMode
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-row mb-4 shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent`,
        ]}
      >
        <View
          style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full ${backgroundColor}`}
          noDarkMode
        >
          <Container>
            <Icon name={icon} height={30} width={30} color="white" />
          </Container>
          <Container style={tw`pl-3 mr-6`}>
            <HeadingText style={tw`text-movet-white text-lg`} noDarkMode>
              {title}
            </HeadingText>
            <BodyText style={tw`text-movet-white mb-2`} noDarkMode>
              {message}
            </BodyText>
          </Container>
        </View>
      </View>
    </TouchableOpacity>
  );
};
