import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  useColorScheme,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import tw from "tailwind";
import { ButtonText } from "../Text";

export const SubmitButton = ({
  handleSubmit,
  onSubmit,
  disabled,
  loading,
  title,
  color = "black",
  style,
  iconName,
}: {
  handleSubmit: any;
  onSubmit: any;
  disabled: boolean;
  loading: boolean;
  title: string;
  color?: "red" | "black";
  style?: any;
  iconName?: string;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <TouchableOpacity
      onPress={handleSubmit(onSubmit)}
      style={[
        style,
        color === "black"
          ? tw`border-movet-black bg-movet-black dark:border-movet-white dark:bg-movet-white`
          : tw`border-movet-red bg-movet-red`,
        tw`w-full flex-row justify-center items-center border-2 mt-4 py-4 rounded-xl`,
        disabled && tw`opacity-50`,
      ]}
      disabled={disabled}
    >
      {iconName && !loading && (
        <FontAwesome5
          name={iconName}
          size={16}
          color={
            isDarkMode && color === "black"
              ? tw.color("movet-black")
              : tw.color("movet-white")
          }
          style={tw`mr-2`}
        />
      )}
      {loading ? (
        <View style={tw`flex-row bg-transparent`}>
          <ActivityIndicator
            style={tw`mr-2`}
            size="small"
            color={
              isDarkMode && color === "black"
                ? tw.color("movet-black")
                : tw.color("movet-white")
            }
          />
          <ButtonText
            style={
              isDarkMode && color === "black"
                ? tw`text-movet-black`
                : tw`text-movet-white`
            }
          >
            {title}
          </ButtonText>
        </View>
      ) : isDarkMode && color === "black" ? (
        <ButtonText style={tw`text-movet-black`}>{title}</ButtonText>
      ) : (
        <ButtonText style={tw`text-movet-white`}>{title}</ButtonText>
      )}
    </TouchableOpacity>
  );
};
