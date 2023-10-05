import { useThemeColor } from "hooks/useThemeColor";
import { View as DefaultView } from "react-native";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ViewProps = ThemeProps & DefaultView["props"];

export const View = (props: ViewProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  console.log("VIEW backgroundColor", backgroundColor);
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
};
