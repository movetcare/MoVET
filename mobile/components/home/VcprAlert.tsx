import {
  BodyText,
  HeadingText,
  Icon,
  View,
  Container,
} from "components/themed";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ReactNode } from "react";
import tw from "tailwind";
import { Patient } from "app/(app)/home";

export interface Announcement {
  color: string;
  icon: "info-circle" | "exclamation-circle" | "star" | "bullhorn" | "bell";
  isActiveMobile: boolean;
  link: string;
  message: string;
  title: string;
}

export const VcprAlert = ({
  patients,
}: {
  patients: Array<Patient> | null;
}): ReactNode => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(app)/appointments/new",
          params: { path: "" },
        })
      }
    >
      <View
        style={tw`flex-row mx-4 mt-4 shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent`}
      >
        <View
          style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full bg-movet-red`}
          noDarkMode
        >
          <Container>
            <Icon
              name={"exclamation-circle"}
              height={30}
              width={30}
              color="white"
            />
          </Container>
          <Container style={tw`pl-3 mr-6`}>
            <HeadingText
              style={tw`text-movet-white text-lg normal-case`}
              noDarkMode
            >
              {patients && patients.length > 5
                ? "Your Pet's VCPR is Expired!"
                : patients?.map((patient: Patient) => patient.name).join(", ")}
            </HeadingText>
            <BodyText style={tw`text-movet-white mb-2`} noDarkMode>
              testing 123
            </BodyText>
          </Container>
        </View>
      </View>
    </Pressable>
  );
};
