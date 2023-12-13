import tw from "tailwind";
import {
  Container,
  Icon,
  HeadingText,
  SupportedIcons,
  View,
} from "components/themed";
import { isTablet } from "utils/isTablet";

export const SectionHeading = ({
  containerStyle,
  iconStyle,
  iconName = null,
  text,
  textStyle,
}: {
  containerStyle?: any;
  iconStyle?: any;
  iconName?: SupportedIcons | null;
  text: string;
  textStyle?: any;
}) => {
  return (
    <View
      style={[
        tw`flex-row justify-center items-center rounded-xl shadow-sm shadow-movet-black dark:shadow-movet-white bg-movet-white/70 dark:bg-movet-black/70 p-2`,
        isTablet ? tw`my-3` : tw`my-1.5`,
        containerStyle,
      ]}
      noDarkMode
    >
      {iconName && (
        <Icon
          name={iconName}
          size={isTablet ? "sm" : "xs"}
          style={[tw`mr-2`, iconStyle]}
        />
      )}
      <HeadingText style={[isTablet ? tw`text-2xl` : tw`text-xl`, textStyle]}>
        {text}
      </HeadingText>
    </View>
  );
};
