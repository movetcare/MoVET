import { BodyText, HeadingText, SubHeadingText } from "components/themed";
import { Container, View, Icon } from "components/themed";
import { Link } from "expo-router";
import { ReactNode } from "react";
import tw from "tailwind";

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
    <Link href="/(app)/chat/" style={tw`mx-6 mt-4`}>
      <View
        style={tw`pr-4 py-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white`}
      >
        <Container>
          <Icon name="telehealth" />
        </Container>
        <Container style={tw`flex-shrink`}>
          <HeadingText style={tw`text-black text-lg`}>
            Telehealth Chat is ONLINE!
          </HeadingText>
          <BodyText style={tw`text-black text-sm -mt-0.5`}>{message}</BodyText>
          <Container style={tw`flex-row mt-1.5`}>
            {queueSize > 0 && (
              <>
                <BodyText style={tw`text-black text-xs`}>
                  Queue Size:{" "}
                  <SubHeadingText
                    style={tw`text-black text-xs normal-case mt-2`}
                  >
                    {queueSize}
                  </SubHeadingText>
                </BodyText>
                <BodyText style={tw`text-black text-xs`}>
                  {" "}
                  | Wait Time:{" "}
                  <SubHeadingText
                    style={tw`text-black text-xs normal-case mt-2`}
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
