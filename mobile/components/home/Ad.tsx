import { router } from "expo-router";
import { ReactNode } from "react";
import { Image, TouchableOpacity } from "react-native";
import LayoutDimensions from "constants/Layout";
import tw from "tailwind";
import { View } from "components/themed";
import { isTablet } from "utils/isTablet";

export interface Ad {
  autoOpen?: boolean;
  description: string;
  height?: number;
  icon?: "bullhorn";
  ignoreUrlPath?: string;
  imagePath: string;
  isActive: boolean;
  title: string;
  urlRedirect: string;
  width?: number;
}
export const Ad = ({ content }: { content: Ad }): ReactNode => {
  const { imagePath, urlRedirect, title } = content;
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(app)/home/web-view",
          params: { path: urlRedirect },
        })
      }
    >
      <View
        style={tw`flex-row mb-4 shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent`}
        noDarkMode
      >
        <View
          style={[
            //isTablet ? tw`px-16` : tw`px-4`,
            tw`bg-transparent rounded-xl flex-row items-center w-full px-4`,
          ]}
          noDarkMode
        >
          <Image
            style={tw`flex-1 bg-movet-black/10 w-full rounded-xl ${
              LayoutDimensions.window.width > 600 ? "h-180" : "h-80"
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
