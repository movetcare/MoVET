import { Tabs, usePathname } from "expo-router";
import { useThemeColor } from "hooks/useThemeColor";
import { SafeAreaView, useColorScheme } from "react-native";
import tw from "tailwind";
import { Icon } from "components/themed";
import { isTablet } from "utils/isTablet";
import {
  Appointment,
  AppointmentsStore,
  AuthStore,
  Patient,
  PatientsStore,
} from "stores";
import { firestore } from "firebase-config";
import {
  onSnapshot,
  query,
  collection,
  where,
  QuerySnapshot,
  orderBy,
  DocumentData,
  limit,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { ErrorStore } from "stores";
import LogRocket from "@logrocket/react-native";

const DEBUG_DATA = false;

const TabsLayout = (props: any) => {
  const { user, initialized, isLoggedIn } = AuthStore.useState();
  const [patientsCount, setPatientsCount] = useState<number | null>(null);
  // const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState<
  //   number | null
  // >(null);
  // const [pastAppointmentsCount, setPastAppointmentsCount] = useState<
  //   number | null
  // >(null);
  const pathName = usePathname();
  const iconHeight = isTablet ? 26 : 20;
  const iconWidth = isTablet ? 26 : 20;
  const isDarkMode = useColorScheme() !== "light";
  const { lightColor, darkColor } = props;
  const tabBarActiveTintColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBarActiveTintColor",
  );
  const tabBarActiveBackgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBarActiveBackgroundColor",
  );
  const tabBarInactiveBackgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBarInactiveBackgroundColor",
  );
  const tabBarInactiveTintColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBarInactiveTintColor",
  );
  const tabBarStyle = {
    tabBarActiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor,
    tabBarInactiveTintColor,
    tabBarLabelPosition: (isTablet ? "beside-icon" : "below-icon") as any,
    tabBarLabelStyle: {
      fontFamily: "Abside",
      fontSize: isTablet ? 16 : 8,
      marginBottom: isTablet ? 0 : 4,
      marginTop: isTablet ? 0 : 4,
    },
    tabBarIconStyle: {
      marginTop: isTablet ? 0 : 8,
    },
  };

  useEffect(() => {
    if (!isLoggedIn || !initialized || !user?.uid) return; 
    if (!__DEV__ && user?.email) LogRocket.identify(user?.email, { status: "logged-in" });
    const unsubscribeUser = onSnapshot(
      doc(firestore, "clients", user?.uid),
      (doc) => {
        if (doc.exists()) {
          AuthStore.update((store) => {
            store.client = null;
          });
          AuthStore.update((store) => {
            store.client = {
              firstName: doc.data()?.firstName,
              lastName: doc.data()?.lastName,
              email: doc.data()?.email,
              phone: doc.data()?.phone,
              address:
                doc.data()?.street && doc.data()?.city
                  ? `${doc.data()?.street ? doc.data()?.street + "," : ""} ${
                      doc.data()?.city ? doc.data()?.city + "," : ""
                    } ${doc.data()?.state ? doc.data()?.state : ""} ${
                      doc.data()?.zipCode ? doc.data().zipCode : ""
                    }`
                  : "",
            };
          });
        }
      },
      (error: any) => setError({ ...error, source: "unsubscribeUser" }),
    );
    const unsubscribeUpcomingAppointments = onSnapshot(
      query(
        collection(firestore, "appointments"),
        where("client", "==", Number(user.uid)),
        where("start", ">=", new Date()),
        orderBy("start", "asc"),
        limit(100),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) return;
        const appointments: Appointment[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA)
            console.log("UPCOMING APPOINTMENT DATA => ", doc.data());
          if (doc.data()?.active)
            appointments.push({ id: doc.id, ...doc.data() });
        });
        if (appointments.length) {
          AppointmentsStore.update((store: any) => {
            store.upcomingAppointments = null;
          });
          AppointmentsStore.update((store: any) => {
            store.upcomingAppointments = appointments;
          });
        }
      },
      (error: any) =>
        setError({ ...error, source: "unsubscribeUpcomingAppointments" }),
    );
    const unsubscribePastAppointments = onSnapshot(
      query(
        collection(firestore, "appointments"),
        where("client", "==", Number(user.uid)),
        where("start", "<", new Date()),
        orderBy("start", "desc"),
        limit(100),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) return;
        const appointments: Appointment[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA) console.log("PAST APPOINTMENT DATA => ", doc.data());
          if (doc.data()?.active)
            appointments.push({ id: doc.id, ...doc.data() });
        });
        if (appointments.length) {
          AppointmentsStore.update((store: any) => {
            store.pastAppointments = null;
          });
          AppointmentsStore.update((store: any) => {
            store.pastAppointments = appointments;
          });
        }
      },
      (error: any) =>
        setError({ ...error, source: "unsubscribePastAppointments" }),
    );
    const unsubscribePatients = onSnapshot(
      query(
        collection(firestore, "patients"),
        where("client", "==", Number(user.uid)),
        where("archived", "==", false),
        orderBy("createdOn", "desc"),
        limit(100),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) return;
        else setPatientsCount(querySnapshot.size);
        const patients: Patient[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA) console.log("PATIENT DATA => ", doc.data());
          patients.push(doc.data());
        });
        if (patients.length) {
          PatientsStore.update((store: any) => {
            store.patients = null;
          });
          PatientsStore.update((store: any) => {
            store.patients = patients;
          });
        }
      },
      (error: any) => setError({ ...error, source: "unsubscribePatients" }),
    );
    return () => {
      unsubscribeUser();
      unsubscribePatients();
      unsubscribeUpcomingAppointments();
      unsubscribePastAppointments();
    };
  }, [user?.uid, initialized, isLoggedIn]);

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  return (
    <SafeAreaView style={tw`flex-1 bg-movet-red dark:bg-movet-black`}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            display:
              (pathName === "appointments" || pathName === "pets") &&
              patientsCount
                ? "none"
                : "flex",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: (navigationOptions: any) =>
              navigationOptions.focused ? (
                <Icon
                  color="black"
                  noDarkMode
                  name="hospital"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : isDarkMode ? (
                <Icon
                  color="white"
                  noDarkMode
                  name="hospital"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : (
                <Icon
                  color="black"
                  noDarkMode
                  name="hospital"
                  height={iconHeight}
                  width={iconWidth}
                />
              ),
            ...tabBarStyle,
          }}
        />
        {/* <Tabs.Screen
          name="appointments"
          options={
            upcomingAppointmentsCount &&
            pastAppointmentsCount &&
            upcomingAppointmentsCount + pastAppointmentsCount > 0
              ? {
                  title: "Appointments",
                  tabBarIcon: (navigationOptions: any) =>
                    navigationOptions.focused ? (
                      <Icon
                        color="black"
                        noDarkMode
                        name="clipboard-medical"
                        height={iconHeight}
                        width={iconWidth}
                      />
                    ) : isDarkMode ? (
                      <Icon
                        color="white"
                        noDarkMode
                        name="clipboard-medical"
                        height={iconHeight}
                        width={iconWidth}
                      />
                    ) : (
                      <Icon
                        color="black"
                        noDarkMode
                        name="clipboard-medical"
                        height={iconHeight}
                        width={iconWidth}
                      />
                    ),
                  ...tabBarStyle,
                }
              : { href: null }
          }
        /> */}
        <Tabs.Screen
          name="pets"
          options={
            patientsCount
              ? {
                  title: "Pets",
                  tabBarIcon: (navigationOptions: any) =>
                    navigationOptions.focused ? (
                      <Icon
                        color="black"
                        noDarkMode
                        name="paw"
                        height={iconHeight}
                        width={iconWidth}
                      />
                    ) : isDarkMode ? (
                      <Icon
                        color="white"
                        noDarkMode
                        name="paw"
                        height={iconHeight}
                        width={iconWidth}
                      />
                    ) : (
                      <Icon
                        color="black"
                        noDarkMode
                        name="paw"
                        height={iconHeight}
                        width={iconWidth}
                      />
                    ),
                  ...tabBarStyle,
                }
              : { href: null }
          }
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: (navigationOptions: any) =>
              navigationOptions.focused ? (
                <Icon
                  color="black"
                  noDarkMode
                  name="user-medical-message"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : isDarkMode ? (
                <Icon
                  color="white"
                  noDarkMode
                  name="user-medical-message"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : (
                <Icon
                  color="black"
                  noDarkMode
                  name="user-medical-message"
                  height={iconHeight}
                  width={iconWidth}
                />
              ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: (navigationOptions: any) =>
              navigationOptions.focused ? (
                <Icon
                  color="black"
                  noDarkMode
                  name="gear"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : isDarkMode ? (
                <Icon
                  color="white"
                  noDarkMode
                  name="gear"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : (
                <Icon
                  color="black"
                  noDarkMode
                  name="gear"
                  height={iconHeight}
                  width={iconWidth}
                />
              ),
            ...tabBarStyle,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;
