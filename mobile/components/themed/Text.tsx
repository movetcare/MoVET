import React from "react";
import { Text as DefaultText } from "react-native";
import { useThemeColor } from "hooks/useThemeColor";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};
type TextProps = ThemeProps & DefaultText["props"];

export const Text = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  console.log("TEXT COLOR", color);
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
};
