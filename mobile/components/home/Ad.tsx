//import { View } from "components/themed";
import { Link } from "expo-router";
import { ReactNode } from "react";
import { Image, Pressable, View } from "react-native";
import LayoutDimensions from "constants/Layout";
import tw from "tailwind";

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
    <View style={tw`w-full px-4 mt-3 shadow-lg dark:shadow-white`}>
      <Link
        href={{
          pathname: "/(app)/home/web-view",
          params: { path: urlRedirect },
        }}
        asChild
      >
        <Pressable>
          <Image
            style={tw`flex-1 bg-movet-black/10 w-full rounded-xl ${
              LayoutDimensions.window.width > 600 ? "h-180" : "h-80"
            }`}
            source={{ uri: "https://movetcare.com/" + imagePath }}
            resizeMode="cover"
            alt={title}
          />
        </Pressable>
      </Link>
    </View>
  );
};
