import { BodyText, HeadingText, SubHeadingText } from "components/themed";
import { Container, View, Icon } from "components/themed";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { Pressable } from "react-native";
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
  const router = useRouter();
  const { queueSize, waitTime, message } = status;

  return (
    <Pressable
      onPress={() => router.replace("/(app)/chat/")}
      style={tw`rounded-xl`}
    >
      <View
        style={tw`flex-row mx-4 my-4 rounded-xl shadow-lg dark:shadow-white`}
      >
        <View
          style={tw`pr-4 py-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full`}
        >
          <Container>
            <Icon name="telehealth" size="xl" />
          </Container>
          <Container style={tw`flex-shrink`}>
            <HeadingText style={tw`text-black text-lg`}>
              Telehealth Chat is ONLINE!
            </HeadingText>
            <BodyText style={tw`text-black text-sm -mt-0.5`}>
              {message}
            </BodyText>
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
      </View>
    </Pressable>
  );
};
