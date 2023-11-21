import tw from "tailwind";
import { HeadingText, Icon, SupportedIcons, View } from ".";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

export const NavigationHeader = ({
  title = "Untitled Screen",
  iconName = null,
  canGoBack = false,
  goBackRoot = "/(app)/home",
}: {
  title: string;
  iconName: SupportedIcons | null;
  canGoBack?: boolean;
  goBackRoot?: string;
}) =>
  canGoBack ? (
    <>
      <TouchableOpacity
        style={tw`absolute z-1 h-12 w-12`}
        onPress={() => {
          console.log("tapped");
          (router.canGoBack() && router.back()) || router.push(goBackRoot);
        }}
      >
        <Icon
          name="arrow-left"
          color={"white"}
          style={tw`-mb-8 mt-3 max-w-8 ml-4`}
        />
      </TouchableOpacity>
      <View
        style={tw`flex flex-row justify-center items-center h-12 border-b-2 border-movet-white bg-movet-red`}
        noDarkMode
      >
        <View
          style={tw`flex flex-row justify-center items-center bg-transparent`}
          noDarkMode
        >
          {iconName && (
            <Icon name={iconName} size="xs" style={tw`mr-2`} color="white" />
          )}
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
      {iconName && (
        <Icon name={iconName} size="xs" style={tw`mr-2`} color="white" />
      )}
      <HeadingText style={tw`text-movet-white text-xl normal-case`} noDarkMode>
        {title}
      </HeadingText>
    </View>
  );
