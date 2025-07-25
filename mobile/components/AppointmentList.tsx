import tw from "tailwind";
import {
  BodyText,
  Container,
  HeadingText,
  Icon,
  ItalicText,
  View,
} from "./themed";
import { isTablet } from "utils/isTablet";
import { Appointment, AppointmentsStore, ErrorStore, Patient } from "stores";
import { firestore } from "firebase-config";
import {
  onSnapshot,
  query,
  collection,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getProVetIdFromUrl } from "utils/getProVetIdFromUrl";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

export const AppointmentList = ({
  source = "pets",
}: {
  source: "home" | "pets";
}) => {
  const { upcomingAppointments } = AppointmentsStore.useState();
  const [reasons, setReasons] = useState<Array<any> | null>(null);

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

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  return (
    <View
      style={[
        isTablet ? tw`px-16` : tw`px-4`,
        tw`flex-col rounded-xl bg-transparent w-full`,
      ]}
      noDarkMode
    >
      {upcomingAppointments &&
        upcomingAppointments.map((appointment: Appointment) => {
          const location =
            appointment.resources.includes(6) || // Exam Room 1
            appointment.resources.includes(7) || // Exam Room 2
            appointment.resources.includes(8) || // Exam Room 3
            appointment.resources.includes(14) || // Exam Room 1
            appointment.resources.includes(15) || // Exam Room 2
            appointment.resources.includes(16) // Exam Room 3
              ? "CLINIC"
              : appointment.resources.includes(3) || // Truck 1
                  appointment.resources.includes(9) // Truck 2
                ? "HOUSECALL"
                : appointment.resources.includes(11) || // Virtual Room 1
                    appointment.resources.includes(18) // Virtual Room 2
                  ? "TELEHEALTH"
                  : "UNKNOWN APPOINTMENT TYPE";
          const reason = reasons?.map((reason: any) => {
            if (reason.id === getProVetIdFromUrl(appointment.reason as any))
              return reason.name;
          });
          return (
            <TouchableOpacity
              key={appointment.id}
              onPress={() =>
                router.navigate({
                  pathname: `/(app)/${source}/appointment-detail/`,
                  params: { id: appointment?.id },
                })
              }
            >
              <View
                style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full shadow-lg shadow-movet-black dark:shadow-movet-white`}
              >
                <Container style={tw`px-3`}>
                  <Icon
                    name={
                      location === "CLINIC"
                        ? "clinic-alt"
                        : location === "HOUSECALL"
                          ? "mobile"
                          : location === "TELEHEALTH"
                            ? "telehealth"
                            : "clinic"
                    }
                    height={50}
                    width={50}
                  />
                </Container>
                <Container style={tw`flex-shrink`}>
                  <HeadingText style={tw`text-movet-black text-lg`}>
                    {appointment.patients.map(
                      (patient: Patient, index: number) =>
                        index === appointment.patients.length - 1
                          ? patient.name
                          : patient.name + ", ",
                    )}
                  </HeadingText>
                  <BodyText style={tw`text-movet-black text-sm -mt-0.5`}>
                    {appointment.start.toDate().toLocaleDateString("en-us", {
                      weekday: "long",
                      year: "2-digit",
                      month: "numeric",
                      day: "numeric",
                    })}{" "}
                    @{" "}
                    {appointment.start.toDate().toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </BodyText>
                  <Container style={tw`flex-row`}>
                    <ItalicText style={tw`text-movet-black text-xs`}>
                      {reason.includes("provet") ? "Exam" : reason}
                    </ItalicText>
                  </Container>
                </Container>
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};
