import { useThemeColor } from "hooks/useThemeColor";
import { View as DefaultView, ImageBackground } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "tailwind";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultView["props"];
interface ExtendedViewProps extends ViewProps {
  withBackground?: "pets";
  noDarkMode?: boolean;
}

export const Screen = (props: ExtendedViewProps) => {
  const { style, lightColor, darkColor, withBackground, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={tw`flex-1 bg-transparent`}
      contentContainerStyle={tw`flex-grow bg-transparent`}
    >
      {withBackground === "pets" ? (
        <ImageBackground
          source={require("assets/images/backgrounds/pets-background.png")}
          resizeMode="cover"
          style={[{ backgroundColor }, tw`flex-1`]}
        >
          <DefaultView
            style={[
              { backgroundColor },
              tw`flex-1 items-center bg-transparent`,
              style,
            ]}
            {...otherProps}
          />
        </ImageBackground>
      ) : (
        <DefaultView style={[style, { backgroundColor }]} {...otherProps} />
      )}
    </KeyboardAwareScrollView>
  );
};

export const View = (props: ExtendedViewProps) => {
  const {
    style,
    lightColor,
    darkColor,
    withBackground,
    noDarkMode,
    ...otherProps
  } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  return withBackground === "pets" ? (
    <ImageBackground
      source={require("assets/images/backgrounds/pets-background.png")}
      resizeMode="cover"
      style={tw`flex-1`}
    >
      <DefaultView
        style={[
          { backgroundColor },
          tw`flex-1 items-center bg-transparent`,
          style,
        ]}
        {...otherProps}
      />
    </ImageBackground>
  ) : noDarkMode ? (
    <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />
  ) : (
    <DefaultView style={[style, { backgroundColor }]} {...otherProps} />
  );
};

export const Container = DefaultView;