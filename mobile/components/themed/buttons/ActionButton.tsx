import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import tw from "tailwind";
import { ButtonText, SubHeadingText } from "../Text";
import { Icon, SupportedIcons } from "../Icons";
import { isTablet } from "utils/isTablet";

export const ActionButton = ({
  title,
  onPress,
  color = "red",
  style,
  iconName,
  disabled,
  type = "button",
  textStyle,
  loading = false,
}: {
  title: string;
  onPress: any;
  color?: "red" | "black" | "brown" | "blue";
  style?: any;
  iconName?: SupportedIcons;
  disabled?: boolean;
  type?: "button" | "text";
  textStyle?: any;
  loading?: boolean;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      disabled={disabled}
      style={[
        tw`flex-row justify-center items-center border-2 mt-4 py-4 rounded-full shadow-lg shadow-movet-black dark:shadow-movet-white`,
        isTablet ? tw`w-1/2` : tw`w-full`,
        color === "red"
          ? tw`bg-movet-red border-movet-red`
          : color === "brown"
            ? tw`bg-movet-brown border-movet-brown`
            : color === "blue"
              ? tw`bg-movet-blue border-movet-blue`
              : tw`bg-movet-black dark:bg-movet-white border-movet-black dark:border-movet-white`,
        disabled && tw`opacity-50`,
        type === "text" && tw`bg-transparent border-0 shadow-none`,
        style,
      ]}
    >
      {iconName && !loading && (
        <>
          {type === "button" ? (
            <Icon
              name={iconName}
              height={18}
              width={18}
              color={color === "black" && isDarkMode ? "black" : "white"}
              style={tw`mr-2`}
              noDarkMode
            />
          ) : (
            <Icon
              name={iconName}
              height={18}
              width={18}
              color={isDarkMode ? "white" : "black"}
              style={tw`mr-2`}
              noDarkMode
            />
          )}
        </>
      )}
      {loading && (
        <ActivityIndicator
          style={tw`mr-2`}
          size="small"
          color={
            isDarkMode && color === "black"
              ? tw.color("movet-black")
              : tw.color("movet-white")
          }
        />
      )}
      {type === "button" ? (
        <ButtonText
          style={[
            color === "black" && isDarkMode
              ? tw`text-movet-black text-center`
              : tw`text-movet-white text-center`,
            textStyle,
          ]}
          noDarkMode
        >
          {title}
        </ButtonText>
      ) : (
        <SubHeadingText
          style={[
            tw`shadow-lg shadow-movet-black dark:shadow-movet-white`,
            color === "black" && isDarkMode
              ? tw`text-movet-black text-center`
              : tw`text-movet-white text-center`,
            textStyle,
          ]}
          noDarkMode
        >
          {title}
        </SubHeadingText>
      )}
    </TouchableOpacity>
  );
};
