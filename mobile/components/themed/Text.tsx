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

export const MonoText = (props: TextProps) => (
  <Text {...props} style={[props.style, { fontFamily: "SpaceMono" }]} />
);

export const HeadingText = (props: TextProps) => (
  <Text
    {...props}
    style={[
      tw`capitalize font-parkinson-bold text-2xl text-movet-black dark:text-movet-white`,
      props.style,
    ]}
  />
);

export const SubHeadingText = (props: TextProps) => (
  <Text
    {...props}
    style={[
      tw`uppercase leading-6 font-abside-regular text-movet-black dark:text-movet-white`,
      props.style,
    ]}
  />
);

export const BodyText = (props: TextProps) => (
  <Text
    {...props}
    style={[
      tw`font-source-sans-pro-regular rounded-xl text-movet-black dark:text-movet-white text-base`,
      props.style,
    ]}
  />
);

export const ItalicText = (props: TextProps) => (
  <Text
    {...props}
    style={[
      tw`font-source-sans-pro-italic text-movet-black dark:text-movet-white text-base`,
      props.style,
    ]}
  />
);

export const ButtonText = (props: TextProps) => (
  <Text
    {...props}
    style={[
      tw`uppercase font-abside-smooth text-movet-black dark:text-movet-white`,
      props.style,
    ]}
  />
);

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
      style={[
        tw`underline rounded-xl text-movet-black dark:text-movet-white"`,
        style,
      ]}
      onPress={() => onPress()}
    >
      {text}
    </ItalicText>
  ) : (
    <BodyText
      style={[
        tw`underline rounded-xl text-movet-black dark:text-movet-white`,
        style,
      ]}
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
