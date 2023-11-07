import tw from "tailwind";
import {
  Container,
  Icon,
  HeadingText,
  SupportedIcons,
} from "components/themed";

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
      style={[tw`flex-row justify-center items-center`, containerStyle]}
    >
      <Icon name={iconName} size="xs" style={[tw`mt-4 mr-2`, iconStyle]} />
      <HeadingText style={[tw`mt-4 text-xl`, textStyle]}>{text}</HeadingText>
    </Container>
  );
};
