import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import tw from "tailwind";
import { ButtonText, SubHeadingText } from "../Text";
import { Icon, SupportedIcons } from "../Icons";

export const ActionButton = ({
  title,
  onPress,
  color = "red",
  style,
  iconName,
  disabled,
  type = "button",
  textStyle,
}: {
  title: string;
  onPress: any;
  color?: "red" | "black" | "brown";
  style?: any;
  iconName?: SupportedIcons;
  disabled?: boolean;
  type?: "button" | "text";
  textStyle?: any;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      disabled={disabled}
      style={[
        tw`w-full flex-row justify-center items-center border-2 mt-4 py-4 rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white`,
        color === "red"
          ? tw`bg-movet-red border-movet-red`
          : color === "brown"
          ? tw`bg-movet-brown border-movet-brown`
          : tw`bg-movet-black border-movet-black dark:bg-movet-white dark:border-movet-white`,
        disabled && tw`opacity-50`,
        type === "text" && tw`bg-transparent border-0`,
        style,
      ]}
    >
      {iconName && (
        <Icon
          name={iconName}
          height={18}
          width={18}
          color={color === "black" && isDarkMode ? "black" : "white"}
          style={tw`mr-2`}
          noDarkMode
        />
      )}
      {type === "button" ? (
        <ButtonText
          style={[
            textStyle,
            color === "black" && isDarkMode
              ? tw`text-black text-center`
              : tw`text-white text-center`,
          ]}
          noDarkMode
        >
          {title}
        </ButtonText>
      ) : (
        <SubHeadingText
          style={[
            textStyle,
            tw`shadow-lg shadow-movet-black dark:shadow-movet-white`,
            color === "black" && isDarkMode
              ? tw`text-black text-center`
              : tw`text-white text-center`,
          ]}
          noDarkMode
        >
          {title}
        </SubHeadingText>
      )}
    </TouchableOpacity>
  );
};
