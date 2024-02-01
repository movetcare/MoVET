import React from "react";
import { ActivityIndicator, ImageBackground, Platform, useColorScheme } from "react-native";
import LottieView from "lottie-react-native";
import { MoVETLogo } from "components/MoVETLogo";
import tw from "tailwind";
import { HeadingText, View, Screen, ItalicText } from "./themed";
import { getRandomInt } from "utils/getRandomInt";

export const Loader = ({
  description = "Loading, Please Wait...",
  noBackground = false,
}: {
  description?: string;
  noBackground?: boolean;
}) => {
  const isDarkMode = useColorScheme() !== "light";
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

  return (
    <Screen
      withBackground="pets"
      style={tw`flex-grow justify-center items-center`}
    >
      <MoVETLogo
        type="default"
        height={86}
        width={206}
        style={tw`-mb-8 -mt-24`}
      />
      <LottieView
        style={{ width: "100%", aspectRatio: 16 / 9 }}
        source={randomLoadingAnimation()}
        autoPlay
        loop
      />
      <ItalicText style={tw`-mt-8 text-center text-lg normal-case`}>
        {description}
      </ItalicText>
    </Screen>
  );
};
