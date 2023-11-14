import { FontAwesome5 } from "@expo/vector-icons";
import tw from "tailwind";
import { HeadingText, View } from ".";
import { router } from "expo-router";

export const NavigationHeader = ({
  title = "Untitled Screen",
  icon = null,
  canGoBack = false,
  goBackRoot = "/(app)/home",
}: {
  title: string;
  icon: any | null;
  canGoBack?: boolean;
  goBackRoot?: string;
}) =>
  canGoBack ? (
    <>
      <FontAwesome5
        name="arrow-left"
        size={20}
        color={tw.color("movet-white")}
        style={tw`-mb-8 mt-3 z-100 max-w-8 ml-4`}
        onPress={() =>
          (router.canGoBack() && router.back()) || router.push(goBackRoot)
        }
      />
      <View
        style={tw`flex flex-row justify-center items-center h-12 border-b-2 border-movet-white bg-movet-red`}
        noDarkMode
      >
        <View
          style={tw`flex flex-row justify-center items-center bg-transparent`}
          noDarkMode
        >
          {icon}
          <HeadingText
            style={tw`text-movet-white text-lg normal-case`}
            noDarkMode
          >
            {title}
          </HeadingText>
        </View>
      </View>
    </>
  ) : (
    <View
      style={tw`flex flex-row justify-center items-center bg-movet-red h-12 border-b-2 border-movet-white`}
      noDarkMode
    >
      {icon}
      <HeadingText style={tw`text-movet-white text-xl normal-case`} noDarkMode>
        {title}
      </HeadingText>
    </View>
  );
