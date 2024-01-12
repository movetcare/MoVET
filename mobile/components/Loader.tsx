import React from "react";
import { ImageBackground, Platform } from "react-native";
import LottieView from "lottie-react-native";
import { MoVETLogo } from "components/MoVETLogo";
import tw from "tailwind";
import { HeadingText, View, Screen } from "./themed";
import { getRandomInt } from "utils/getRandomInt";

export const Loader = ({
  description = "Loading, Please Wait...",
  noBackground = false,
}: {
  description?: string;
  noBackground?: boolean;
}) => {
  // Loading Animation Sources:
  // https://lottiefiles.com/web-player?lottie_url=https%3A%2F%2Fassets5.lottiefiles.com%2Fpackages%2Flf20_2ixzdfvy.json
  // https://lottiefiles.com/65612-paws
  // https://lottiefiles.com/82636-pets
  // https://lottiefiles.com/46472-lurking-cat
  // https://lottiefiles.com/73716-purple-dog-walking
  // https://lottiefiles.com/77369-happy-dog-day
  // https://lottiefiles.com/11549-dog-tail
  // https://lottiefiles.com/52831-rotation-cats
  // https://lottiefiles.com/40674-animation-for-veterinarian
  // https://lottiefiles.com/14592-loader-cat

  const randomLoadingAnimation = () => {
    const randomNumber = getRandomInt(1, 3);
    let backgroundImage = null;
    switch (randomNumber) {
      case 1:
        backgroundImage = require("assets/animations/loading_animation_3.json");
        break;
      case 2:
        backgroundImage = require("assets/animations/loading_animation_8.json");
        break;
      case 3:
        backgroundImage = require("assets/animations/loading_animation_9.json");
        break;
      default:
        backgroundImage = require("assets/animations/loading_animation_9.json");
    }
    return backgroundImage;
  };

  const Loading = () => {
    return (
      <Screen
        withBackground="pets"
        style={tw`flex-grow justify-center items-center bg-movet-white dark:bg-movet-black bg-transparent -mt-36 pt-12`}
      >
        <LottieView
          style={[
            Platform.OS !== "ios" ? tw`h-64 my-10 mt-20` : tw`h-64 my-10`,
            tw`bg-transparent`,
          ]}
          source={randomLoadingAnimation()}
          autoPlay
          loop
        />
        <View style={tw`-mt-64 bg-transparent`} noDarkMode>
          <MoVETLogo
            type="default"
            height={86}
            width={206}
            style={tw`bg-transparent`}
          />
        </View>
        <HeadingText
          style={tw`pt-36 text-center my-6 text-lg normal-case bg-transparent`}
        >
          {description}
        </HeadingText>
      </Screen>
    );
  };
  return noBackground ? (
    <Loading />
  ) : (
    <ImageBackground
      source={require("assets/images/backgrounds/pets-background.png")}
      resizeMode="cover"
      style={tw`flex-1`}
    >
      <Loading />
    </ImageBackground>
  );
};
