import React from "react";
import { Text as DefaultText } from "react-native";
import { useThemeColor } from "hooks/useThemeColor";
import tw from "tailwind";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};
type TextProps = ThemeProps & DefaultText["props"];

export const Text = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
};

export const HeadingText = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <Text
      {...otherProps}
      style={[{ color }, tw`capitalize font-parkinson text-2xl`, style]}
    />
  );
};

export const SubHeadingText = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <Text
      {...otherProps}
      style={[{ color }, tw`uppercase leading-6 font-abside`, style]}
    />
  );
};

export const BodyText = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <Text
      {...otherProps}
      style={[{ color }, tw`font-source-sans-pro rounded-xl text-base`, style]}
    />
  );
};

export const ItalicText = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <Text
      {...otherProps}
      style={[{ color }, tw`font-source-sans-pro-italic text-base`, style]}
    />
  );
};

export const ButtonText = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <Text
      {...otherProps}
      style={[{ color }, tw`uppercase font-abside-smooth font-bold`, style]}
    />
  );
};

export const LinkText = ({
  text,
  onPress,
  style,
  italic,
}: {
  text: string;
  onPress: any;
  style?: any;
  italic?: boolean;
}) =>
  italic ? (
    <ItalicText
      style={[tw`underline rounded-xl"`, style]}
      onPress={() => onPress()}
    >
      {text}
    </ItalicText>
  ) : (
    <BodyText
      style={[tw`underline rounded-xl`, style]}
      onPress={() => onPress()}
    >
      {text}
    </BodyText>
  );

export const ErrorText = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <ItalicText style={tw`text-movet-red font-bold flex flex-wrap w-full`}>
      {errorMessage}
    </ItalicText>
  );
};
