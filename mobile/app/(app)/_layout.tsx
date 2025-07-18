import * as SplashScreen from "expo-splash-screen";
import { Tabs, router } from "expo-router";
import { useThemeColor } from "hooks/useThemeColor";
import { useColorScheme } from "react-native";
import { Icon } from "components/themed";
import { isTablet } from "utils/isTablet";
import {
  Appointment,
  AppointmentsStore,
  AuthStore,
  Invoice,
  InvoicesStore,
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
import { openUrlInWebBrowser } from "utils/openUrlInWebBrowser";
import tw from "tailwind";
import { getProVetIdFromUrl } from "utils/getProVetIdFromUrl";

const DEBUG_DATA = false;

const TabsLayout = (props: any) => {
  const { user, initialized, isLoggedIn } = AuthStore.useState();
  const { patients } = PatientsStore.useState();
  const [patientsCount, setPatientsCount] = useState<number | null>(null);
  const [reasons, setReasons] = useState<Array<any> | null>(null);
  const [loadedUser, setLoadedUser] = useState<boolean>(false);
  const [loadedInvoices, setLoadedInvoices] = useState<boolean>(false);
  const [loadedPastAppointments, setLoadedPastAppointments] =
    useState<boolean>(false);
  const [loadedUpcomingAppointments, setLoadedUpcomingAppointments] =
    useState<boolean>(false);
  const [loadedPatients, setLoadedPatients] = useState<boolean>(false);
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
    if (!isLoggedIn || !initialized || !user?.uid || !reasons || !patients) {
      if (!isLoggedIn) router.replace("/sign-in");
      return;
    }
    const unsubscribeUser = onSnapshot(
      doc(firestore, "clients", user?.uid),
      (doc) => {
        if (doc.exists()) {
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
        } else
          AuthStore.update((store) => {
            store.client = null;
          });
        setLoadedUser(true);
      },
      (error: any) => {
        setLoadedUser(true);
        setError({ ...error, source: "unsubscribeUser" });
      },
    );
    const unsubscribeUpcomingAppointments = onSnapshot(
      query(
        collection(firestore, "appointments"),
        where("client", "==", Number(user.uid)),
        where("end", ">=", new Date()),
        orderBy("end", "asc"),
        limit(100),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          AppointmentsStore.update((store: any) => {
            store.upcomingAppointments = null;
          });
          setLoadedUpcomingAppointments(true);
          return;
        }
        const appointments: Appointment[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA)
            console.log("UPCOMING APPOINTMENT DATA => ", doc.data());
          if (doc.data()?.active) {
            const appointmentPatients: any[] = [];
            doc.data()?.patients.forEach((patient: any) => {
              patients.forEach((fullPatient: any) => {
                if (fullPatient.id === patient.id) {
                  appointmentPatients.push(fullPatient);
                }
              });
            });
            let reasonText = "Medical Examination";
            reasons.forEach((reason) => {
              if (reason.id === getProVetIdFromUrl(doc.data()?.reason)) {
                reasonText = reason.name;
              }
            });
            appointments.push({
              ...doc.data(),
              id: doc.id,
              reason: reasonText,
              patients: appointmentPatients,
            });
          }
        });
        if (appointments.length > 0)
          AppointmentsStore.update((store: any) => {
            store.upcomingAppointments = appointments;
          });
        else
          AppointmentsStore.update((store: any) => {
            store.upcomingAppointments = null;
          });
        setLoadedUpcomingAppointments(true);
      },
      (error: any) => {
        setLoadedUpcomingAppointments(true);
        setError({ ...error, source: "unsubscribeUpcomingAppointments" });
      },
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
        if (querySnapshot.empty) {
          AppointmentsStore.update((store: any) => {
            store.pastAppointments = null;
          });
          setLoadedPastAppointments(true);
          return;
        }
        const appointments: Appointment[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA) console.log("PAST APPOINTMENT DATA => ", doc.data());
          if (doc.data()?.active) {
            const appointmentPatients: any[] = [];
            doc.data()?.patients.forEach((patient: any) => {
              patients.forEach((fullPatient: any) => {
                if (fullPatient.id === patient.id) {
                  appointmentPatients.push(fullPatient);
                }
              });
            });
            let reasonText = "Medical Examination";
            reasons.forEach((reason) => {
              if (reason.id === getProVetIdFromUrl(doc.data()?.reason)) {
                reasonText = reason.name;
              }
            });
            appointments.push({
              ...doc.data(),
              id: doc.id,
              reason: reasonText,
              patients: appointmentPatients,
            });
            appointments.push({ id: doc.id, ...doc.data() });
          }
        });
        if (appointments.length > 0)
          AppointmentsStore.update((store: any) => {
            store.pastAppointments = appointments;
          });
        else
          AppointmentsStore.update((store: any) => {
            store.pastAppointments = null;
          });
        setLoadedPastAppointments(true);
      },
      (error: any) => {
        setLoadedPastAppointments(true);
        setError({ ...error, source: "unsubscribePastAppointments" });
      },
    );

    return () => {
      unsubscribeUser();
      unsubscribeUpcomingAppointments();
      unsubscribePastAppointments();
    };
  }, [user?.uid, initialized, isLoggedIn, user?.email, reasons, patients]);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const unsubscribePatients = onSnapshot(
      query(
        collection(firestore, "patients"),
        where("client", "==", Number(user.uid)),
        where("archived", "==", false),
        orderBy("createdOn", "desc"),
        limit(100),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          PatientsStore.update((store: any) => {
            store.patients = null;
          });
          setLoadedPatients(true);
          return;
        } else setPatientsCount(querySnapshot.size);
        const patients: Patient[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA) console.log("PATIENT DATA => ", doc.data());
          patients.push(doc.data());
        });
        if (patients.length > 0)
          PatientsStore.update((store: any) => {
            store.patients = patients;
          });
        else
          PatientsStore.update((store: any) => {
            store.patients = null;
          });
        setLoadedPatients(true);
      },
      (error: any) => {
        setLoadedPatients(true);
        setError({ ...error, source: "unsubscribePatients" });
      },
    );
    const unsubscribeInvoices = onSnapshot(
      query(
        collection(firestore, `clients/${user?.uid}/invoices`),
        orderBy("updatedOn", "desc"),
        limit(100),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          InvoicesStore.update((store: any) => {
            store.invoices = null;
          });
          setLoadedInvoices(true);
          return;
        }
        const invoices: Invoice[] = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (DEBUG_DATA) console.log("INVOICE DATA => ", doc.data());
          if (
            doc.data()?.totalDue !== undefined &&
            doc.data()?.items !== undefined
          )
            invoices.push(doc.data());
        });
        if (invoices.length > 0)
          InvoicesStore.update((store: any) => {
            store.invoices = invoices;
          });
        else
          InvoicesStore.update((store: any) => {
            store.invoices = null;
          });
        setLoadedInvoices(true);
      },
      (error: any) => {
        setLoadedInvoices(true);
        setError({ ...error, source: "unsubscribeInvoices" });
      },
    );
    return () => {
      unsubscribePatients();
      unsubscribeInvoices();
    };
  }, [user?.uid]);

  useEffect(() => {
    const unsubscribeReasons = onSnapshot(
      query(collection(firestore, "reasons")),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) return;
        const reasons: Array<any> = [];
        querySnapshot.forEach((doc: DocumentData) => {
          reasons.push(doc.data());
        });
        setReasons(reasons);
      },
      (error: any) => setError({ ...error, source: "unsubscribeReasons" }),
    );
    return () => unsubscribeReasons();
  }, []);

  useEffect(() => {
    if (
      loadedPastAppointments &&
      loadedUpcomingAppointments &&
      loadedUser &&
      loadedInvoices &&
      loadedPatients
    )
      SplashScreen.hideAsync();
  }, [
    loadedUser,
    loadedInvoices,
    loadedPatients,
    loadedUpcomingAppointments,
    loadedPastAppointments,
  ]);

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? tw.color("movet-black") : "transparent",
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
        name="book"
        options={
          patientsCount
            ? {
                title: "Book Now",
                tabBarIcon: (navigationOptions: any) =>
                  navigationOptions.focused ? (
                    <Icon
                      color="black"
                      noDarkMode
                      name="calendar-heart"
                      height={iconHeight}
                      width={iconWidth}
                    />
                  ) : isDarkMode ? (
                    <Icon
                      color="white"
                      noDarkMode
                      name="calendar-heart"
                      height={iconHeight}
                      width={iconWidth}
                    />
                  ) : (
                    <Icon
                      color="black"
                      noDarkMode
                      name="calendar-heart"
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
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: (navigationOptions: any) =>
            navigationOptions.focused ? (
              <Icon
                color="black"
                noDarkMode
                name="shop"
                height={iconHeight}
                width={iconWidth}
              />
            ) : isDarkMode ? (
              <Icon
                color="white"
                noDarkMode
                name="shop"
                height={iconHeight}
                width={iconWidth}
              />
            ) : (
              <Icon
                color="black"
                noDarkMode
                name="shop"
                height={iconHeight}
                width={iconWidth}
              />
            ),
          ...tabBarStyle,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            openUrlInWebBrowser(
              "https://movetcare.com/pharmacy/?mode=app",
              isDarkMode,
              {
                dismissButtonStyle: "done",
                enableBarCollapsing: true,
                enableDefaultShareMenuItem: false,
                readerMode: false,
                showTitle: false,
              },
            );
          },
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
  );
};

export default TabsLayout;
