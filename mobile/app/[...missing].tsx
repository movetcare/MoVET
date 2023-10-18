import { MoVETLogo } from "components/MoVETLogo";
import {
  ActionButton,
  View,
  SubHeadingText,
  HeadingText,
} from "components/themed";
import { router } from "expo-router";
import { ImageBackground, useColorScheme } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "tailwind";
import DeviceDimensions from "utils/DeviceDimensions";

const backgroundLight = require("assets/images/backgrounds/pets-background.png");
const backgroundDark = require("assets/images/backgrounds/pets-background.png");

export default function NotFoundScreen() {
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={tw`flex-1`}
      contentContainerStyle={tw`flex-grow`}
    >
      <ImageBackground
        source={useColorScheme() === "light" ? backgroundLight : backgroundDark}
        resizeMode="cover"
        style={tw`flex-1 px-6`}
      >
        <View
          style={tw`w-full bg-transparent flex-1 justify-center items-center`}
        >
          <View
            style={tw`
              w-full rounded-t-xl flex justify-center items-center bg-transparent
            `}
          >
            <MoVETLogo
              type="default"
              override="default"
              height={160}
              width={260}
            />
          </View>
          <View
            style={[
              tw`w-full pb-12 px-8 bg-transparent items-center rounded-b-xl`,
              DeviceDimensions.window.height > 640 ? tw`mt-12` : tw`mt-4`,
            ]}
          >
            <HeadingText
              style={tw`text-movet-black font-extrabold text-center normal-case text-3xl italic`}
            >
              Whoops
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-black font-medium text-center normal-case italic mt-2 text-lg`}
            >
              The screen you are looking for does not exist...
            </SubHeadingText>
          </View>
          <View style={tw`w-full pb-12 px-8 bg-transparent items-center`}>
            <ActionButton
              title="Go Home"
              iconName="home"
              onPress={() => router.replace("/(app)/home")}
            />
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}
