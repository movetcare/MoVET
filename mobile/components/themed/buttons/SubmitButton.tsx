import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  View,
  useColorScheme,
} from "react-native";
import tw from "tailwind";
import { ButtonText } from "../Text";
import { Icon, SupportedIcons } from "../Icons";
import { isTablet } from "utils/isTablet";

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
  iconName?: SupportedIcons;
}) => {
  const isDarkMode = useColorScheme() !== "light";
  return (
    <TouchableOpacity
      onPress={handleSubmit(onSubmit)}
      style={[
        color === "black"
          ? tw` bg-movet-black dark:border-movet-white dark:bg-movet-white`
          : tw`border-movet-red bg-movet-red`,
        tw`flex-row justify-center items-center border-2 mt-4 py-4 rounded-full shadow-lg shadow-movet-black dark:shadow-movet-white`,
        isTablet ? tw`w-1/2` : tw`w-full`,
        disabled && tw`opacity-50`,
        style,
      ]}
      disabled={disabled}
    >
      {iconName && !loading && (
        <Icon
          name={iconName}
          height={18}
          width={18}
          color={color === "black" && isDarkMode ? "black" : "white"}
          style={tw`mr-2`}
          noDarkMode
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
            noDarkMode
            style={
              isDarkMode && color === "black" ? tw`text-black` : tw`text-white`
            }
          >
            {title}
          </ButtonText>
        </View>
      ) : isDarkMode && color === "black" ? (
        <ButtonText style={tw`text-black`} noDarkMode>
          {title}
        </ButtonText>
      ) : (
        <ButtonText style={tw`text-white`} noDarkMode>
          {title}
        </ButtonText>
      )}
    </TouchableOpacity>
  );
};
