import { Appointment, AppointmentList } from "components/AppointmentList";
import { Loader } from "components/Loader";
import { SectionHeading } from "components/SectionHeading";
import { Ad } from "components/home/Ad";
import { Announcement } from "components/home/Announcement";
import { TelehealthStatus } from "components/home/TelehealthStatus";
import { VcprAlert } from "components/home/VcprAlert";
import { ActionButton, Container, Screen, View } from "components/themed";
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
import { AuthStore } from "stores/AuthStore";
import tw from "tailwind";

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
  const [isLoadingAlerts, setIsLoadingAlerts] = useState<boolean>(true);
  const [announcement, setAnnouncement] = useState<null | Announcement>(null);
  const [ad, setAd] = useState<null | Ad>(null);
  const [telehealthStatus, setTelehealthStatus] =
    useState<null | TelehealthStatus>(null);
  const [appointments, setAppointments] = useState<null | Appointment[]>(null);
  const [showVcprAlert, setShowVcprAlert] = useState<boolean>(false);
  const [vcprPatients, setVcprPatients] = useState<Patient[] | null>(null);
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
        const vcprPatients: Array<Patient> = [];
        patients.forEach((patient: Patient) => {
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
      {(announcement?.isActiveMobile || ad?.isActive) && (
        <SectionHeading iconName={"bullhorn"} text={"Latest Announcements"} />
      )}
      {announcement?.isActiveMobile && (
        <Announcement announcement={announcement} />
      )}
      {ad?.isActive && <Ad content={ad} />}
      {showVcprAlert && <VcprAlert patients={vcprPatients} />}
      {telehealthStatus?.isOnline && (
        <>
          {!announcement?.isActiveMobile && !ad?.isActive && (
            <View style={tw`h-4`} />
          )}
          <TelehealthStatus status={telehealthStatus} />
        </>
      )}
      {appointments && appointments.length ? (
        <>
          <SectionHeading
            iconName={"clipboard-medical"}
            text={"Upcoming Appointments"}
          />
          <AppointmentList appointments={appointments} />
          <Container
            style={tw`flex-col sm:flex-row justify-around w-full px-4`}
          >
            <ActionButton
              title="Schedule an Appointment"
              iconName="calendar-plus"
              onPress={() => router.push("/(app)/appointments/new")}
              style={tw`sm:w-2.75/6`}
            />
            <ActionButton
              color="black"
              title="Chat with Us"
              iconName="user-medical-message"
              onPress={() => router.push("/(app)/appointments/new")}
              style={tw`sm:w-2.75/6`}
            />
          </Container>
        </>
      ) : (
        <>
          <SectionHeading
            iconName={"clipboard-medical"}
            text={"Ready to See Us?"}
          />
          <Container style={tw`flex-row mx-4`}>
            <ActionButton
              title="Schedule an Appointment"
              iconName="calendar-plus"
              onPress={() => router.push("/(app)/appointments/new")}
            />
          </Container>
        </>
      )}
      <View style={tw`h-8`} />
    </Screen>
  );
};
export default Home;
