import { router } from "expo-router";
import { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import tw from "tailwind";
import {
  BodyText,
  Container,
  HeadingText,
  Icon,
  View,
} from "components/themed";
import { isTablet } from "utils/isTablet";
import { AuthStore } from "stores";

export type PopUpClinic = {
  name: string;
  id: string;
  isActive: boolean;
  schedule: {
    date?: any;
    startTime?: number;
    endTime?: number;
  };
};

const formatTime = (time: string) =>
  time?.toString()?.length === 3 ? `0${time}` : `${time}`;

export const PopUpClinics = ({
  popUpClinics,
}: {
  popUpClinics: Array<PopUpClinic>;
}): ReactNode => {
  const { user } = AuthStore.useState();
  return popUpClinics.map(({ name, id, schedule }: PopUpClinic) => (
    <TouchableOpacity
      onPress={() =>
        router.navigate({
          pathname: "/(app)/home/announcement",
          params: {
            path: `/booking/${id}`,
            applicationSource: "app",
            email: user?.email,
          },
        })
      }
    >
      <View
        noDarkMode
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-row mb-4 rounded-xl bg-transparent`,
        ]}
      >
        <View
          style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full shadow-lg shadow-movet-black dark:shadow-movet-white bg-movet-blue`}
          noDarkMode
        >
          <Container>
            <Icon name="syringe" height={30} width={30} color="white" />
          </Container>
          <Container style={tw`pl-3 mr-6`}>
            <HeadingText style={tw`text-movet-white text-lg`} noDarkMode>
              {name}
            </HeadingText>
            <BodyText style={tw`text-movet-white mb-2`} noDarkMode>
              {new Date(
                "1970-01-01T" +
                  formatTime(schedule?.startTime as any).slice(0, 2) +
                  ":" +
                  formatTime(schedule?.startTime as any).slice(2) +
                  ":00Z",
              ).toLocaleTimeString("en-US", {
                timeZone: "UTC",
                hour12: true,
                hour: "numeric",
                minute: "numeric",
              })}{" "}
              -{" "}
              {new Date(
                "1970-01-01T" +
                  formatTime(schedule?.endTime as any).slice(0, 2) +
                  ":" +
                  formatTime(schedule?.endTime as any).slice(2) +
                  ":00Z",
              ).toLocaleTimeString("en-US", {
                timeZone: "UTC",
                hour12: true,
                hour: "numeric",
                minute: "numeric",
              })}{" "}
              on{" "}
              {schedule?.date?.toDate()?.toLocaleDateString("en-us", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </BodyText>
          </Container>
        </View>
      </View>
    </TouchableOpacity>
  ));
};
