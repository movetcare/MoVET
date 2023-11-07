import { FontAwesome5 } from "@expo/vector-icons";
import { BodyText, HeadingText, View } from "components/themed";
import { Container } from "components/themed/View";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ReactNode } from "react";
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
  const router = useRouter();
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
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(app)/home/web-view",
          params: { path: link },
        })
      }
    >
      <View
        style={tw`flex-row mx-4 my-4 shadow-lg dark:shadow-white rounded-xl bg-transparent`}
      >
        <View
          style={tw`p-4 text-movet-white rounded-xl flex-row items-center w-full ${backgroundColor}`}
          noDarkMode
        >
          <Container>
            <FontAwesome5
              name={icon}
              size={30}
              color={tw.color("movet-white")}
            />
          </Container>
          <Container style={tw`pl-4 mr-6`}>
            <HeadingText style={tw`text-movet-white text-lg`} noDarkMode>
              {title}
            </HeadingText>
            <BodyText style={tw`text-movet-white mb-2`} noDarkMode>
              {message}
            </BodyText>
          </Container>
        </View>
      </View>
    </Pressable>
  );
};
