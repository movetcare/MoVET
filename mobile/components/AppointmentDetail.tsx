import { useLocalSearchParams } from "expo-router";
import { BodyText, Screen } from "./themed";
import { useEffect, useState } from "react";
import { Appointment, AppointmentsStore } from "stores/AppointmentsStore";
import { firestore } from "firebase-config";
import {
  onSnapshot,
  query,
  collection,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { ErrorStore } from "stores/ErrorStore";

export const AppointmentDetail = () => {
  const { id } = useLocalSearchParams();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [reasons, setReasons] = useState<Array<any> | null>(null);

  useEffect(() => {
    if (id && reasons) {
      const allAppointments: Array<Appointment> =
        upcomingAppointments && pastAppointments
          ? [...upcomingAppointments, ...pastAppointments]
          : upcomingAppointments
            ? upcomingAppointments
            : pastAppointments
              ? pastAppointments
              : [];
      allAppointments.map((appointment: Appointment) => {
        if (String(appointment.id) === id) {
          setAppointment(appointment);
        }
      });
    }
  }, [id, pastAppointments, upcomingAppointments, reasons]);

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
      (error: any) => setError(error),
    );
    return () => unsubscribeReasons();
  }, []);

  const setError = (error: any) => {
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });
  };

  return (
    <Screen>
      <BodyText>{JSON.stringify(appointment)}</BodyText>
    </Screen>
  );
};
