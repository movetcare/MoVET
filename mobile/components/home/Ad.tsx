import { router } from "expo-router";
import { ReactNode } from "react";
import { Image, TouchableOpacity } from "react-native";
import LayoutDimensions from "constants/Layout";
import tw from "tailwind";
import { View } from "components/themed";

export interface Ad {
  autoOpen?: boolean;
  description: string;
  height?: number;
  icon?: "bullhorn";
  ignoreUrlPath?: string;
  imagePath: string;
  isActive: boolean;
  title: string;
  link: string;
  width?: number;
}
export const Ad = ({ content }: { content: Ad }): ReactNode => {
  const { imagePath, link, title } = content;
  return (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/(app)/home/announcement",
          params: { path: link },
        })
      }
    >
      <View
        style={tw`flex-row mb-4`}
        noDarkMode
      >
        <View
          style={tw` flex-row items-center w-full`}
          noDarkMode
        >
          <Image
            style={tw`flex-1 bg-movet-black/10 w-full ${
              LayoutDimensions.window.width > 600 ? "h-180" : "h-90"
            }`}
            source={{ uri: "https://movetcare.com/" + imagePath }}
            resizeMode="cover"
            alt={title}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
