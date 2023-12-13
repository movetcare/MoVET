import { useThemeColor } from "hooks/useThemeColor";
import { View as DefaultView, ImageBackground } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import tw from "tailwind";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultView["props"];
export interface ExtendedViewProps extends ViewProps {
  withBackground?: "pets" | "cat" | "dog" | "bone" | "mouse";
  noDarkMode?: boolean;
  noScroll?: boolean;
}

export const Screen = (props: ExtendedViewProps) => {
  const {
    style,
    lightColor,
    darkColor,
    withBackground,
    noScroll,
    ...otherProps
  } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  let backgroundImage = null;
  switch (withBackground) {
    case "pets":
      backgroundImage = require("assets/images/backgrounds/pets-background.png");
      break;
    case "cat":
      backgroundImage = require("assets/images/backgrounds/cat-background.png");
      break;
    case "dog":
      backgroundImage = require("assets/images/backgrounds/dog-background.png");
      break;
    case "bone":
      backgroundImage = require("assets/images/backgrounds/bone-background.png");
      break;
    case "mouse":
      backgroundImage = require("assets/images/backgrounds/mouse-background.png");
      break;
    default:
      break;
  }
  return noScroll ? (
    <>
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={[{ backgroundColor }, tw`flex-1`]}
        >
          <DefaultView
            style={[
              { backgroundColor },
              style,
              tw`flex-1 items-center bg-transparent`,
            ]}
            {...otherProps}
          />
        </ImageBackground>
      ) : (
        <DefaultView
          style={[{ backgroundColor }, style, tw`flex-1 items-center`]}
          {...otherProps}
        />
      )}
    </>
  ) : (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={tw`flex-1 bg-transparent`}
      contentContainerStyle={tw`flex-grow bg-transparent`}
    >
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={[{ backgroundColor }, tw`flex-1`]}
        >
          <DefaultView
            style={[
              { backgroundColor },
              style,
              tw`flex-1 items-center bg-transparent`,
            ]}
            {...otherProps}
          />
        </ImageBackground>
      ) : (
        <DefaultView
          style={[{ backgroundColor }, style, tw`flex-1 items-center`]}
          {...otherProps}
        />
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

  let backgroundImage = null;
  switch (withBackground) {
    case "pets":
      backgroundImage = require("assets/images/backgrounds/pets-background.png");
      break;
    case "cat":
      backgroundImage = require("assets/images/backgrounds/cat-background.png");
      break;
    case "dog":
      backgroundImage = require("assets/images/backgrounds/dog-background.png");
      break;
    case "bone":
      backgroundImage = require("assets/images/backgrounds/bone-background.png");
      break;
    case "mouse":
      backgroundImage = require("assets/images/backgrounds/mouse-background.png");
      break;
    default:
      break;
  }
  return backgroundImage ? (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={tw`flex-1`}
    >
      <DefaultView
        style={[
          { backgroundColor },
          style,
          tw`flex-1 items-center bg-transparent`,
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