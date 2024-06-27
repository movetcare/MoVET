import { Loader } from "components/Loader";
import { MoVETLogo } from "components/MoVETLogo";
import { SectionHeading } from "components/SectionHeading";
import { Ad } from "components/home/Ad";
import { Announcement } from "components/home/Announcement";
import { PopUpClinic, PopUpClinics } from "components/home/PopUpClinics";
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
import { useColorScheme } from "react-native";
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
import { QuickBookWidget } from "components/home/QuickBookWidget";
import { PetSummary } from "components/home/PetSummary";

const DEBUG_DATA = false;

const Home = () => {
  const isDarkMode = useColorScheme() !== "light";
  const { patients } = PatientsStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [announcement, setAnnouncement] = useState<null | Announcement>(null);
  const [ad, setAd] = useState<null | Ad>(null);
  const [popUpClinics, setPopUpClinics] = useState<null | Array<PopUpClinic>>(
    null,
  );
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
      else setVcprPatients(null);
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
            case "pop_up_clinics":
              if (DEBUG_DATA)
                console.log("DATA => POP UP CLINICS: ", doc.data());
              setPopUpClinics(
                doc
                  .data()
                  .popUpClinics.filter(
                    (clinic: any) =>
                      clinic?.isActive &&
                      (clinic?.isTestClinic !== true ||
                        typeof clinic?.isTestClinic === "undefined"),
                  ),
              );
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
                pathname: "/(app)/home/services",
                params: {
                  path: "/services",
                  applicationSource: "website",
                  screenTitle: "Our Services",
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
      <Animated.View style={[tw`w-full`, tw`flex-1`, animatedStyle]}>
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
            style={tw`bg-transparent`}
          />
        </View>
        {patients && patients.length ? (
          <View
            style={tw`flex-grow w-full justify-center items-center bg-transparent`}
            noDarkMode
          >
            {ad?.isActive && <Ad content={ad} />}
            {announcement?.isActiveMobile && (
              <Announcement announcement={announcement} />
            )}
            {!announcement?.isActiveMobile && !ad?.isActive && (
              <View noDarkMode style={tw`h-4 bg-transparent`} />
            )}
            {popUpClinics && popUpClinics?.length > 0 && (
              <PopUpClinics popUpClinics={popUpClinics} />
            )}
            {vcprPatients && vcprPatients?.length > 0 && (
              <>
                <VcprAlert patients={vcprPatients} />
                {(announcement?.isActiveMobile || ad?.isActive) &&
                  upcomingAppointments && (
                    <View noDarkMode style={tw`h-4 bg-transparent`} />
                  )}
              </>
            )}
            {upcomingAppointments !== null && <PaymentMethodSummary />}
            {upcomingAppointments !== null ? (
              <>
                <PetSummary />
                <QuickBookWidget />
              </>
            ) : (
              <>
                <QuickBookWidget />
                <PetSummary />
              </>
            )}
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
