import { Loader } from "components/Loader";
import { MoVETLogo } from "components/MoVETLogo";
import { ErrorModal } from "components/Modal";
import { SectionHeading } from "components/SectionHeading";
import { Ad } from "components/home/Ad";
import { Announcement } from "components/home/Announcement";
import { AppointmentsList } from "components/home/AppointmentsList";
import { TelehealthStatus } from "components/home/TelehealthStatus";
import { VcprAlert } from "components/home/VcprAlert";
import {
  ActionButton,
  BodyText,
  Container,
  Icon,
  Screen,
  View,
} from "components/themed";
import { router } from "expo-router";
import { firestore } from "firebase-config";
import {
  collection,
  query,
  DocumentData,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AuthStore, ErrorStore, Patient, PatientsStore } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

const DEBUG_DATA = false;

const Home = () => {
  const isDarkMode = useColorScheme() !== "light";
  const { patients } = PatientsStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [announcement, setAnnouncement] = useState<null | Announcement>(null);
  const [ad, setAd] = useState<null | Ad>(null);
  const [telehealthStatus, setTelehealthStatus] =
    useState<null | TelehealthStatus>(null);
  const [showVcprAlert, setShowVcprAlert] = useState<boolean>(false);
  const [vcprPatients, setVcprPatients] = useState<Patient[] | null>(null);
  const { user } = AuthStore.useState();
  const fadeInOpacity = useSharedValue(0);

  const fadeIn = () => {
    fadeInOpacity.value = withTiming(1, {
      duration: 1500,
      easing: Easing.linear,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInOpacity.value,
    };
  });

  useEffect(() => {
    fadeIn();
  });

  useEffect(() => {
    if (patients) {
      const vcprPatients: Array<Patient> = [];
      patients.forEach((patient: Patient) => {
        if (patient.vcprRequired) {
          vcprPatients.push(patient);
          setShowVcprAlert(true);
        }
      });
      setVcprPatients(vcprPatients);
      setIsLoading(false);
    }
  }, [patients]);

  useEffect(() => {
    const unsubscribeAlerts = onSnapshot(
      query(collection(firestore, "alerts")),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          setIsLoading(false);
          return;
        }
        querySnapshot.forEach((doc: DocumentData) => {
          switch (doc.id) {
            case "banner":
              if (DEBUG_DATA) console.log("DATA => ANNOUNCEMENT: ", doc.data());
              setAnnouncement(doc.data());
              break;
            case "pop_up_ad":
              if (DEBUG_DATA) console.log("DATA => AD: ", doc.data());
              setAd(doc.data());
              break;
            case "telehealth":
              if (DEBUG_DATA)
                console.log("DATA => TELEHEALTH STATUS: ", doc.data());
              setTelehealthStatus(doc.data());
              break;
            default:
              break;
          }
        });
        setIsLoading(false);
      },
      (error: any) => {
        setIsLoading(false);
        ErrorStore.update((s: any) => {
          s.currentError = error;
        });
      },
    );
    return () => unsubscribeAlerts();
  }, [user?.uid]);

  const OnboardingFlow = () => {
    return (
      <View
        style={tw`flex-grow w-full justify-center items-center bg-transparent`}
        noDarkMode
      >
        <Icon
          name="clinic"
          height={isTablet ? 150 : 100}
          width={isTablet ? 150 : 100}
          style={tw`-mb-4`}
        />
        <SectionHeading text={"Setup Your Account"} />
        <BodyText style={tw`text-center px-8 mb-2 mt-2`}>
          Welcome to MoVET! Please add your pet(s) to start booking your first
          appointment.
        </BodyText>
        <Container
          style={tw`w-full flex-col sm:flex-row justify-around items-center px-4`}
        >
          <ActionButton
            title="Add a Pet"
            iconName="plus"
            onPress={() => router.push("/(app)/home/new-pet")}
            style={tw`sm:w-0.9/3`}
          />
          <ActionButton
            title="View Our Services"
            iconName="list"
            color="brown"
            style={tw`sm:w-0.9/3`}
            onPress={() =>
              router.push({
                pathname: "/(app)/home/web-view",
                params: {
                  path: "/services",
                  applicationSource: "website",
                  screenTitle: "Our Services",
                  screenTitleIcon: "list",
                },
              })
            }
          />
          <ActionButton
            color="black"
            title="Chat w/ Us"
            iconName="user-medical-message"
            onPress={() => router.push("/(app)/chat")}
            style={tw`sm:w-0.9/3`}
          />
        </Container>
      </View>
    );
  };

  return isLoading ? (
    <Loader />
  ) : (
    <Screen withBackground="pets">
      <Animated.View style={[tw`w-full flex-grow`, animatedStyle]}>
        <View
          style={tw`
              w-full justify-center items-center bg-transparent
            `}
          noDarkMode
        >
          <MoVETLogo
            type={isDarkMode ? "white" : "default"}
            override={isDarkMode ? "white" : "default"}
            height={isTablet ? 160 : 100}
            width={isTablet ? 260 : 200}
            style={tw`bg-transparent -mb-4`}
          />
        </View>
        {patients && patients.length ? (
          <View
            style={tw`flex-grow w-full justify-center items-center bg-transparent`}
            noDarkMode
          >
            {(announcement?.isActiveMobile || ad?.isActive) && (
              <SectionHeading
                iconName={"bullhorn"}
                text={"Latest Announcements"}
                containerStyle={tw`mb-4 -mt-2`}
                textStyle={tw`text-lg sm:text-2xl`}
              />
            )}
            {announcement?.isActiveMobile && (
              <Announcement announcement={announcement} />
            )}
            {ad?.isActive && <Ad content={ad} />}
            {!announcement?.isActiveMobile && !ad?.isActive && (
              <View noDarkMode style={tw`h-4 bg-transparent`} />
            )}
            {showVcprAlert && <VcprAlert patients={vcprPatients} />}
            {(announcement?.isActiveMobile || ad?.isActive) && (
              <View noDarkMode style={tw`h-4 bg-transparent`} />
            )}
            {patients && patients.length && telehealthStatus?.isOnline && (
              <>
                {!announcement?.isActiveMobile && !ad?.isActive && (
                  <View noDarkMode style={tw`h-4 bg-transparent`} />
                )}
                <TelehealthStatus status={telehealthStatus} />
              </>
            )}
            <AppointmentsList source="home" />
          </View>
        ) : (
          <OnboardingFlow />
        )}
      </Animated.View>
      <View style={tw`h-8`} />
    </Screen>
  );
};
export default Home;
