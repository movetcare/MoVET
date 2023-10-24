import { FontAwesome5 } from "@expo/vector-icons";

import tw from "tailwind";
import { HeadingText, View } from "./themed";
import { useRouter } from "expo-router";

export const NavigationHeader = ({
  title = "Untitled Screen",
  icon = null,
  canGoBack = false,
}: {
  title: string;
  icon: string | null;
  canGoBack?: boolean;
}) => {
  const router = useRouter();
  return canGoBack ? (
    <>
      <FontAwesome5
        name="arrow-left"
        size={20}
        color={tw.color("movet-white")}
        style={tw`-mb-8 mt-3 z-100 max-w-8 ml-4`}
        onPress={() => router.canGoBack() && router.back()}
      />
      <View
        style={tw`flex flex-row justify-center items-center bg-movet-red h-11 w-full`}
      >
        <View
          style={tw`flex flex-row justify-center items-center bg-movet-red`}
        >
          {icon && (
            <FontAwesome5
              name={icon}
              size={20}
              color={tw.color("movet-white")}
              style={tw`mr-2`}
            />
          )}
          <HeadingText style={tw`text-movet-white text-lg normal-case`}>
            {title}
          </HeadingText>
        </View>
      </View>
    </>
  ) : (
    <View
      style={tw`flex flex-row justify-center items-center bg-movet-red h-11`}
    >
      {icon && (
        <FontAwesome5
          name={icon}
          size={20}
          color={tw.color("movet-white")}
          style={tw`mr-2`}
        />
      )}
      <HeadingText style={tw`text-movet-white text-lg normal-case`}>
        {title}
      </HeadingText>
    </View>
  );
};
