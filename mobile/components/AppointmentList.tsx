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

export const AppointmentList = () => {
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
    <View
      style={[
        isTablet ? tw`px-16` : tw`px-4`,
        tw`flex-col rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white bg-transparent w-full`,
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
                     if (reason.id === getProVetIdFromUrl(appointment.reason))
                       return reason.name;
                   });
                   return (
                     <View
                       key={appointment.id}
                       style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full`}
                     >
                       <Container style={tw`p-3`}>
                         <Icon
                           name={
                             location === "CLINIC"
                               ? "clinic-alt"
                               : location === "HOUSECALL"
                                 ? "mobile"
                                 : location === "TELEHEALTH"
                                   ? "telehealth"
                                   : "question"
                           }
                           size="md"
                         />
                       </Container>
                       <Container style={tw`flex-shrink`}>
                         <HeadingText style={tw`text-black text-lg`}>
                           {appointment.patients.map(
                             (patient: Patient) => patient.name,
                           )}
                           {/* {__DEV__ && ` - #${appointment.id}`} */}
                         </HeadingText>
                         <BodyText style={tw`text-black text-sm -mt-0.5`}>
                           {appointment.start
                             .toDate()
                             .toLocaleDateString("en-us", {
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
                           <ItalicText style={tw`text-black text-xs`}>
                             {reason}
                           </ItalicText>
                         </Container>
                       </Container>
                     </View>
                   );
        })}
    </View>
  );
};
