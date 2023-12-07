import { BodyText, HeadingText, SubHeadingText } from "components/themed";
import { Container, View, Icon } from "components/themed";
import { router } from "expo-router";
import { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

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
    <TouchableOpacity
      onPress={() => router.replace("/(app)/chat/")}
      style={tw`rounded-xl`}
    >
      <View
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-row rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white bg-transparent`,
        ]}
        noDarkMode
      >
        <View
          style={tw`pr-4 pt-2 pb-3 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full`}
        >
          <Container>
            <Icon
              name="telehealth"
              height={isTablet ? 90 : 70}
              width={isTablet ? 90 : 70}
            />
          </Container>
          <Container style={tw`flex-shrink`}>
            <HeadingText style={tw`text-movet-black text-lg`}>
              Telehealth Chat is ONLINE!
            </HeadingText>
            <BodyText style={tw`text-movet-black text-sm -mt-0.5`}>
              {message}
            </BodyText>
            <Container style={tw`flex-row mt-1.5`}>
              {queueSize > 0 && (
                <>
                  <BodyText style={tw`text-movet-black text-xs`}>
                    Queue Size:{" "}
                    <SubHeadingText
                      style={tw`text-movet-black text-xs normal-case mt-2`}
                    >
                      {queueSize}
                    </SubHeadingText>
                  </BodyText>
                  <BodyText style={tw`text-movet-black text-xs`}>
                    {" "}
                    | Wait Time:{" "}
                    <SubHeadingText
                      style={tw`text-movet-black text-xs normal-case mt-2`}
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
    </TouchableOpacity>
  );
};
