import { Appointment } from "components/AppointmentList";
import { Loader } from "components/Loader";
import { MoVETLogo } from "components/MoVETLogo";
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
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { AuthStore } from "stores";
import { PatientsStore } from "stores/PatientsStore";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

export interface Patient {
  archived: boolean;
  birthday: string;
  breed: string;
  breedId: number;
  client: number;
  createdOn: any;
  customFields: Array<{
    field_id: number;
    id: number;
    label: string;
    value: string;
  }>;
  gender: string;
  id: number;
  name: string;
  picture: string | null;
  species: string;
  vcprRequired: boolean;
  weight: number;
}

const DEBUG_DATA = false;
const Home = () => {
  const isDarkMode = useColorScheme() !== "light";
  const [isLoadingAlerts, setIsLoadingAlerts] = useState<boolean>(true);
  const [announcement, setAnnouncement] = useState<null | Announcement>(null);
  const [ad, setAd] = useState<null | Ad>(null);
  const [telehealthStatus, setTelehealthStatus] =
    useState<null | TelehealthStatus>(null);
  const [appointments, setAppointments] = useState<null | Appointment[]>(null);
  const [showVcprAlert, setShowVcprAlert] = useState<boolean>(false);
  const [vcprPatients, setVcprPatients] = useState<Patient[] | null>(null);
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const { user } = AuthStore.useState();

  useEffect(() => {
    const unsubscribeAlerts = onSnapshot(
      query(collection(firestore, "alerts")),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          setIsLoadingAlerts(false);
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
        setIsLoadingAlerts(false);
      },
      (error: any) => console.error("ERROR => ", error),
    );
    const unsubscribeAppointments = onSnapshot(
      query(
        collection(firestore, "appointments"),
        where("client", "==", Number(user.uid)),
        where("active", "==", 1),
        where("start", ">=", new Date()),
        orderBy("start", "desc"),
        limit(20),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          if (DEBUG_DATA)
            console.log("APPOINTMENT DATA => NO APPOINTMENTS FOUND");
          setIsLoadingAlerts(false);
          return;
        }
        const appointments: Appointment[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA) console.log("APPOINTMENT DATA => ", doc.data());
          appointments.push({ id: doc.id, ...doc.data() });
        });
        setAppointments(appointments);
        setIsLoadingAlerts(false);
      },
      (error: any) => console.error("ERROR => ", error),
    );
    const unsubscribePatients = onSnapshot(
      query(
        collection(firestore, "patients"),
        where("client", "==", Number(user.uid)),
        where("archived", "==", false),
        orderBy("createdOn", "desc"),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          if (DEBUG_DATA) console.log("PATIENT DATA => NO PATIENTS FOUND");
          setIsLoadingAlerts(false);
          return;
        }
        const patients: Patient[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA) console.log("PATIENT DATA => ", doc.data());
          patients.push(doc.data());
        });
        PatientsStore.update((store: any) => {
          store.patients = patients;
        });
        const vcprPatients: Array<Patient> = [];
        patients.forEach((patient: Patient) => {
          setPatients(patients);
          if (patient.vcprRequired) {
            vcprPatients.push(patient);
            setShowVcprAlert(true);
          }
        });
        setVcprPatients(vcprPatients);
        setIsLoadingAlerts(false);
      },
      (error: any) => console.error("ERROR => ", error),
    );
    return () => {
      unsubscribeAlerts();
      unsubscribeAppointments();
      unsubscribePatients();
    };
  }, [user?.uid]);

  return isLoadingAlerts ? (
    <Loader />
  ) : (
    <Screen withBackground="pets">
      <View
        style={tw`
              w-full rounded-t-xl flex justify-center items-center bg-transparent
            `}
        noDarkMode
      >
        <MoVETLogo
          type={isDarkMode ? "white" : "default"}
          override={isDarkMode ? "white" : "default"}
          height={isTablet ? 160 : 100}
          width={isTablet ? 260 : 200}
          style={tw`bg-transparent -mb-8`}
        />
      </View>
      {patients && patients.length ? (
        <>
          {(announcement?.isActiveMobile || ad?.isActive) && (
            <SectionHeading
              iconName={"bullhorn"}
              text={"Latest Announcements"}
              containerStyle={tw`my-4`}
              textStyle={tw`text-lg sm:text-2xl`}
            />
          )}
          {announcement?.isActiveMobile && (
            <Announcement announcement={announcement} />
          )}
          {ad?.isActive && <Ad content={ad} />}
          {!announcement?.isActiveMobile && !ad?.isActive && (
            <View style={tw`h-4`} />
          )}
          {showVcprAlert && <VcprAlert patients={vcprPatients} />}
          {(announcement?.isActiveMobile || ad?.isActive) && (
            <View style={tw`h-4`} />
          )}
          {patients && patients.length && telehealthStatus?.isOnline && (
            <>
              {!announcement?.isActiveMobile && !ad?.isActive && (
                <View style={tw`h-4`} />
              )}
              <TelehealthStatus status={telehealthStatus} />
            </>
          )}
          <AppointmentsList appointments={appointments} />
        </>
      ) : (
        <View
          style={tw`flex-grow w-full justify-center items-center bg-transparent${
            isTablet ? " -mt-28" : " -mt-8"
          }`}
          noDarkMode
        >
          <Icon
            name="clinic"
            height={isTablet ? 150 : 100}
            width={isTablet ? 150 : 100}
            style={tw`-mb-4`}
          />
          <SectionHeading text={"Setup Your Pet's Profile"} />
          <BodyText style={tw`text-center px-8 mb-2 mt-2`}>
            Welcome to MoVET! Please add your pets to start booking your first
            appointment.
          </BodyText>
          <Container
            style={tw`w-full flex-col sm:flex-row justify-around items-center px-4`}
          >
            <ActionButton
              title="Add My Pet"
              iconName="plus"
              onPress={() => router.push("/(app)/pets/new")}
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
      )}
      <View style={tw`h-8`} />
    </Screen>
  );
};
export default Home;
