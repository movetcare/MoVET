import tw from "tailwind";
import {
  Container,
  Icon,
  HeadingText,
  SupportedIcons,
} from "components/themed";
import { isTablet } from "utils/isTablet";

export const SectionHeading = ({
  containerStyle,
  iconStyle,
  iconName,
  text,
  textStyle,
}: {
  containerStyle?: any;
  iconStyle?: any;
  iconName: SupportedIcons;
  text: string;
  textStyle?: any;
}) => {
  return (
    <Container
      style={[
        tw`flex-row justify-center items-center`,
        isTablet ? tw`mt-2 mb-4` : tw`mt-0.5 mb-3`,
        containerStyle,
      ]}
    >
      <Icon
        name={iconName}
        size={isTablet ? "sm" : "xs"}
        style={[tw`mt-4 mr-2`, iconStyle]}
      />
      <HeadingText
        style={[tw`mt-4`, isTablet ? tw`text-2xl` : tw`text-xl`, textStyle]}
      >
        {text}
      </HeadingText>
    </Container>
  );
};
