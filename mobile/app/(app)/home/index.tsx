import { Loader } from "components/Loader";
import { MoVETLogo } from "components/MoVETLogo";
import { SectionHeading } from "components/SectionHeading";
import { Ad } from "components/home/Ad";
import { Announcement } from "components/home/Announcement";
import { AppointmentsList } from "components/home/AppointmentsList";
import { TelehealthStatus } from "components/home/TelehealthStatus";
import { VcprAlert } from "components/VcprAlert";
import {
  ActionButton,
  BodyText,
  Container,
  Icon,
  Screen,
  View,
} from "components/themed";
import { Stack, router } from "expo-router";
import { firestore } from "firebase-config";
import {
  collection,
  query,
  DocumentData,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pressable, useColorScheme } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Appointment,
  AppointmentsStore,
  AuthStore,
  ErrorStore,
  Patient,
  PatientsStore,
} from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";
import { PaymentMethodSummary } from "components/home/PaymentMethodSummary";

const DEBUG_DATA = false;

const Home = () => {
  const isDarkMode = useColorScheme() !== "light";
  const { patients } = PatientsStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAnnouncements, setShowAnnouncements] = useState<boolean>(true);
  const [announcement, setAnnouncement] = useState<null | Announcement>(null);
  const [ad, setAd] = useState<null | Ad>(null);
  const [telehealthStatus, setTelehealthStatus] =
    useState<null | TelehealthStatus>(null);
  const [vcprPatients, setVcprPatients] = useState<Patient[] | null>(null);
  const { user } = AuthStore.useState();
  const fadeInOpacity = useSharedValue(0);
  const { upcomingAppointments } = AppointmentsStore.useState();

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
          let upcomingPatientAppointments = 0;
          if (upcomingAppointments)
            upcomingAppointments.forEach((appointment: Appointment) => {
              appointment?.patients?.forEach((patientData: Patient) => {
                if (patientData.id === patient.id)
                  upcomingPatientAppointments += 1;
              });
            });
          if (upcomingPatientAppointments === 0) vcprPatients.push(patient);
        }
      });
      if (vcprPatients.length > 0) setVcprPatients(vcprPatients);
      setIsLoading(false);
    }
  }, [patients, upcomingAppointments]);

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
        <Stack.Screen options={{ headerShown: false }} />
        <Icon
          name="clinic"
          height={isTablet ? 150 : 100}
          width={isTablet ? 150 : 100}
          style={tw`-mb-8`}
        />
        <SectionHeading text={"Setup Your Account"} />
        <BodyText style={[tw`text-center px-8 mb-8`]}>
          Welcome to MoVET! Please add your pet(s) to start booking your first
          appointment.
        </BodyText>
        <Container
          style={tw`w-full flex-col sm:flex-row justify-around items-center px-4`}
        >
          <ActionButton
            title="Add a Pet"
            iconName="plus"
            onPress={() => router.navigate("/(app)/home/new-pet")}
            style={tw`sm:w-0.9/3`}
          />
          <ActionButton
            title="View Our Services"
            iconName="list"
            color="brown"
            style={tw`sm:w-0.9/3`}
            onPress={() =>
              router.navigate({
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
            onPress={() => router.navigate("/(app)/chat")}
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
      <Animated.View
        style={[tw`w-full`, showAnnouncements && tw`flex-grow`, animatedStyle]}
      >
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
              <Pressable
                onPress={() => setShowAnnouncements(!showAnnouncements)}
                style={tw`w-full flex-row justify-center items-center`}
              >
                <SectionHeading
                  iconName={"bullhorn"}
                  text={
                    announcement?.isActiveMobile && ad?.isActive
                      ? "Latest Announcements"
                      : "Latest Announcement"
                  }
                  containerStyle={tw`mb-2 mt-2`}
                  textStyle={tw`text-lg sm:text-2xl`}
                />
                <Icon
                  name={showAnnouncements ? "chevron-down" : "chevron-up"}
                  size="xs"
                />
              </Pressable>
            )}
            {showAnnouncements && (
              <>
                {announcement?.isActiveMobile && (
                  <Announcement announcement={announcement} />
                )}
                {ad?.isActive && <Ad content={ad} />}
                {!announcement?.isActiveMobile && !ad?.isActive && (
                  <View noDarkMode style={tw`h-4 bg-transparent`} />
                )}
              </>
            )}
            {(announcement?.isActiveMobile || ad?.isActive) && (
              <View
                style={tw`border-t-2 border-movet-gray mt-2 mb-6 mx-8 w-2.6/3`}
              />
            )}
            {vcprPatients && vcprPatients?.length > 0 && (
              <VcprAlert patients={vcprPatients} />
            )}
            {(announcement?.isActiveMobile || ad?.isActive) && (
              <View noDarkMode style={tw`h-4 bg-transparent`} />
            )}
            {patients && patients.length > 0 && telehealthStatus?.isOnline && (
              <>
                {!announcement?.isActiveMobile && !ad?.isActive && (
                  <View noDarkMode style={tw`h-4 bg-transparent`} />
                )}
                <TelehealthStatus status={telehealthStatus} />
              </>
            )}
            {upcomingAppointments !== null && <PaymentMethodSummary />}
            {(announcement?.isActiveMobile || ad?.isActive) && (
              <View
                style={tw`border-t-2 border-movet-gray mt-6 mx-8 w-2.6/3`}
              />
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
