import {
  BodyText,
  HeadingText,
  Icon,
  View,
  Container,
  ActionButton,
  SubHeadingText,
  ItalicText,
} from "components/themed";
import { Pressable } from "react-native";
import { ReactNode, useState } from "react";
import tw from "tailwind";
import { Patient } from "app/(app)/home";
import { Modal } from "components/Modal";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isTablet } from "utils/isTablet";

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
  const [showVcprModal, setShowVcprModal] = useState<boolean>(false);
  const textStyles = [isTablet ? tw`text-lg` : tw`text-sm`, tw`mb-2`];
  return (
    <>
      <Pressable onPress={() => setShowVcprModal(true)}>
        <View
          style={tw`flex-row mx-4 shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent`}
        >
          <View
            style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full ${
              patients && patients.length > 1
                ? "bg-movet-red"
                : "bg-movet-yellow"
            }`}
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
            <Container style={tw`px-3 mr-6`}>
              <HeadingText
                style={tw`text-movet-white text-lg normal-case`}
                noDarkMode
              >
                {patients && patients.length > 1
                  ? "You have " + patients.length + " pets without a VCPR!"
                  : patients?.map((patient: Patient) => patient.name) +
                    " does not have a VCPR!"}
              </HeadingText>
              <BodyText style={tw`text-movet-white mb-2 text-sm`} noDarkMode>
                Please schedule an appointment at your earliest convince to
                establish (or renew) your pet&apos;s VCPR
              </BodyText>
            </Container>
          </View>
        </View>
      </Pressable>
      <Modal
        isVisible={showVcprModal}
        onClose={() => {
          setShowVcprModal(false);
        }}
        title="What is a VCPR?"
      >
        <>
          <BodyText style={textStyles}>
            A Veterinarian-Client-Patient Relationship (&quot;VCPR&quot;) is
            established only when your veterinarian examines your pet in person,
            and is maintained by regular veterinary visits as needed to monitor
            your pet&apos;s health.
          </BodyText>
          <BodyText style={textStyles}>
            If a VCPR is established but your veterinarian does not regularly
            see your pet afterward, the VCPR is no longer valid and it would be
            illegal (and unethical) for your veterinarian to dispense or
            prescribe medications or recommend treatment without recently
            examining your pet.
          </BodyText>
          <BodyText style={textStyles}>
            A valid VCPR cannot be established online, via email, or over the
            phone. However, once a VCPR is established, it may be able to be
            maintained between medically necessary examinations via telephone or
            other types of consultations; but it&apos;s up to your
            veterinarian&apos; discretion to determine if this is appropriate
            and in the best interests of your pets&apos; health.
          </BodyText>
          <SubHeadingText
            style={[
              isTablet ? tw`mt-4 text-base` : tw`text-xs`,
              tw`text-center uppercase mb-1`,
            ]}
          >
            Pet{patients && patients.length > 1 && "s"} without a VCPR
          </SubHeadingText>
          {patients?.map((patient: Patient, index: number) =>
            index <= 2 ? (
              <ItalicText
                key={index}
                style={[
                  isTablet ? tw`text-base` : tw`text-xs`,
                  tw`text-center`,
                ]}
              >
                {patient.name}
              </ItalicText>
            ) : null,
          )}
          {patients && patients.length > 3 && (
            <ItalicText style={tw`text-center text-xs`}>
              ...and {patients.length - 3} more
            </ItalicText>
          )}
          <Container style={[isTablet ? tw`mt-4` : tw``, tw`flex-row`]}>
            <ActionButton
              title="Schedule an Appointment"
              iconName="calendar-plus"
              onPress={() => {
                setShowVcprModal(false);
                router.replace("/(app)/appointments/new");
              }}
            />
          </Container>
        </>
      </Modal>
    </>
  );
};
