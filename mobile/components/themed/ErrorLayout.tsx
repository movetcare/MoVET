import { MoVETLogo } from "components/MoVETLogo";
import tw from "tailwind";
import DeviceDimensions from "utils/DeviceDimensions";
import { BodyText, HeadingText, SubHeadingText } from "./Text";
import { ActionButton } from "./buttons/ActionButton";
import { View, Screen } from "./View";
import { router } from "expo-router";
import {  useColorScheme } from "react-native";

export const ErrorLayout = ({
  message = "Something went wrong",
  actionTitle = "Go Home",
  actionIconName = "home",
  action = () => router.replace("/(auth)/sign-in"),
  details,
}: {
  message: string;
  actionTitle?: string;
  actionIconName?: string;
  action?: any;
  details?: string;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    // <ImageBackground
    //   source={require("assets/images/backgrounds/pets-background.png")}
    //   resizeMode="cover"
    //   style={tw`flex-1`}
    // >
    //   <View
    //     style={tw`w-full bg-transparent flex-1 justify-center items-center`}
    //   >
    <Screen withBackground="pets">
      <View
        style={tw`
              w-full rounded-t-xl flex justify-center items-center bg-transparent
            `}
            noDarkMode
      >
        <MoVETLogo
          type={isDarkMode ? "white" : "default"}
          override={isDarkMode ? "white" : "default"}
          height={160}
          width={260}
          style={tw`bg-transparent`}
        />
      </View>
      <View
        style={[
          tw`w-full pb-12 px-8 bg-transparent items-center rounded-b-xl`,
          DeviceDimensions.window.height > 640 ? tw`mt-12` : tw`mt-4`,
        ]}
        noDarkMode
      >
        <HeadingText
          style={tw`text-movet-black font-extrabold text-center normal-case text-3xl italic`}
        >
          Whoops...
        </HeadingText>
        <SubHeadingText
          style={tw`text-movet-black font-medium text-center normal-case italic mt-2 text-lg`}
        >
          {message}
        </SubHeadingText>
        {details && (
          <View style={tw`mt-8 bg-movet-white p-4 rounded-xl `}>
            <BodyText style={tw`text-xs`}>{details}</BodyText>
          </View>
        )}
      </View>
      <View style={tw`w-full px-8 bg-transparent items-center`} noDarkMode>
        <ActionButton
          title={actionTitle}
          iconName={actionIconName}
          onPress={() => action()}
        />
      </View>
    </Screen>
    //   </View>
    // </ImageBackground>
  );
};
