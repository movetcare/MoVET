import { FontAwesome5 } from "@expo/vector-icons";
import { BodyText, HeadingText, SubHeadingText } from "components/themed";
import { Container } from "components/themed/View";
import { Link } from "expo-router";
import { ReactNode } from "react";
import { View } from "react-native";
import tw from "tailwind";
import TelehealthIcon from "assets/images/svgs/telehealth.svg";

export interface TelehealthStatus {
  isOnline: boolean;
  message: string;
  queueSize: number;
  waitTime: number;
}

export const TelehealthStatus = ({
  status,
}: {
  status: TelehealthStatus;
}): ReactNode => {
  const { queueSize, waitTime, message } = status;

  return (
    <Link href="/(app)/chat/" style={tw`mx-4 mt-4`}>
      <View
        style={tw`px-4 py-3 bg-movet-blue text-movet-white rounded-xl flex-row items-center`}
      >
        <Container>
          {/* <FontAwesome5
            name={"stethoscope"}
            size={30}
            color={tw.color("movet-white")}
          /> */}
          <TelehealthIcon height={40} width={40} />
        </Container>
        <Container style={tw`pl-4 mr-6`}>
          <HeadingText style={tw`text-movet-white text-lg`}>
            Telehealth Chat is ONLINE!
          </HeadingText>
          <BodyText style={tw`text-movet-white text-sm`}>{message}</BodyText>
          <Container style={tw`flex-row mt-1`}>
            {queueSize > 0 && (
              <>
                <BodyText style={tw`text-movet-white text-xs`}>
                  Queue Size:{" "}
                  <SubHeadingText
                    style={tw`text-movet-white text-xs normal-case mt-2`}
                  >
                    {queueSize}
                  </SubHeadingText>
                </BodyText>
                <BodyText style={tw`text-movet-white text-xs`}>
                  {" "}
                  | Wait Time:{" "}
                  <SubHeadingText
                    style={tw`text-movet-white text-xs normal-case mt-2`}
                  >
                    {waitTime}
                    {waitTime > 1 ? " minutes" : " minute"}
                  </SubHeadingText>
                </BodyText>
              </>
            )}
          </Container>
        </Container>
      </View>
    </Link>
  );
};
