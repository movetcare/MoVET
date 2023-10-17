import React from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import tw from "tailwind";
import { ButtonText, SubHeadingText } from "../Text";

export const ActionButton = ({
  title,
  onPress,
  color = "red",
  style,
  iconName,
  disabled,
  type = "button",
  textStyle,
  iconSize,
}: {
  title: string;
  onPress: any;
  color?: "red" | "black" | "brown";
  style?: any;
  iconName?: string;
  disabled?: boolean;
  type?: "button" | "text";
  textStyle?: any;
  iconSize?: number;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      disabled={disabled}
      style={[
        style,
        tw`w-full flex-row justify-center items-center border-2 mt-4 py-4 rounded-xl`,
        color === "red"
          ? tw`bg-movet-red border-movet-red`
          : color === "brown"
          ? tw`bg-movet-brown border-movet-brown`
          : tw`bg-movet-black border-movet-black dark:bg-movet-white dark:border-movet-white`,
        disabled && tw`opacity-50`,
        type === "text" && tw`bg-transparent border-0`,
      ]}
    >
      {iconName && (
        <FontAwesome5
          name={iconName}
          size={iconSize || 16}
          color={
            type === "button"
              ? isDarkMode && color === "black"
                ? tw.color("movet-black")
                : tw.color("movet-white")
              : isDarkMode
              ? tw.color("movet-white")
              : tw.color("movet-black")
          }
          style={[style, tw`mr-2`]}
        />
      )}
      {type === "button" ? (
        <ButtonText
          style={[
            textStyle,
            color === "black" && isDarkMode
              ? tw`text-movet-black text-center`
              : tw`text-movet-white text-center`,
          ]}
        >
          {title}
        </ButtonText>
      ) : (
        <SubHeadingText style={textStyle}>{title}</SubHeadingText>
      )}
    </TouchableOpacity>
  );
};
