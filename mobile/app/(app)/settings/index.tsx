import {
  View,
  Screen,
  Icon,
  Container,
  HeadingText,
  SubHeadingText,
  SupportedIcons,
  ItalicText,
} from "components/themed";
import { Stack, router } from "expo-router";
import tw from "tailwind";
import { Linking, TouchableOpacity } from "react-native";
import { isTablet } from "utils/isTablet";
import Constants from "expo-constants";
import { isProductionEnvironment } from "utils/isProductionEnvironment";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
const versions = require("../../../version.json");

interface Option {
  name: string;
  icon: SupportedIcons;
  link: string | null;
}

const settingsOptions: Array<Option> = [
  {
    name: "My Account",
    icon: "user-edit",
    link: "/(app)/settings/account",
  },
  {
    name: "Payment Methods",
    icon: "credit-card",
    link: "/(app)/settings/payment-methods",
  },
  {
    name: "Notifications",
    icon: "bell",
    link: "/(app)/settings/notifications",
  },
  {
    name: "System Settings",
    icon: "gear",
    link: null,
  },
  {
    name: "Logout",
    icon: "right-from-bracket",
    link: "/(app)/settings/sign-out",
  },
];
const Settings = () => {
  const fadeInOpacity = useSharedValue(0);

  const fadeIn = () => {
    fadeInOpacity.value = withTiming(1, {
      duration: 1500,
      easing: Easing.linear,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInOpacity.value,
    };
  });

  useEffect(() => {
    fadeIn();
  });

  return (
    <Screen withBackground="pets">
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View
        style={[
          tw`flex-grow items-center justify-center w-full`,
          animatedStyle,
        ]}
      >
        <View
          style={[
            isTablet ? tw`px-16` : tw`px-4`,
            tw`flex-col mx-4 rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white bg-transparent w-full`,
          ]}
          noDarkMode
        >
          <View
            style={tw`
              w-full flex justify-center items-center bg-transparent${
                isTablet ? " mb-8" : " mb-4"
              }
            `}
            noDarkMode
          >
            <Icon
              name="clinic-alt"
              height={isTablet ? 200 : 130}
              width={isTablet ? 200 : 130}
              style={tw`-mb-4`}
            />
            <HeadingText
              style={[tw`mt-2`, isTablet ? tw`text-2xl` : tw`text-xl`]}
            >
              Settings
            </HeadingText>
          </View>
          {settingsOptions.map((option: Option, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                option.link ? router.push(option.link) : Linking.openSettings()
              }
            >
              <View
                style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-col items-center border-2 dark:border-movet-white w-full`}
              >
                <Container
                  style={tw`flex-row items-center justify-center w-full`}
                >
                  <Container style={tw`px-3`}>
                    <Icon name={option.icon} size="xs" />
                  </Container>
                  <Container style={tw`flex-shrink`}>
                    <SubHeadingText style={tw`text-movet-black`}>
                      {option.name}
                    </SubHeadingText>
                  </Container>
                </Container>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <ItalicText style={tw`text-xs mt-4`}>
          Version: {versions.appVersion.toString()}
        </ItalicText>
        {!isProductionEnvironment && (
          <ItalicText style={tw`text-xs`}>
            Environment: &quot;{Constants?.expoConfig?.extra?.environment}
            &quot;
          </ItalicText>
        )}
      </Animated.View>
    </Screen>
  );
};
export default Settings;
