import { router, useLocalSearchParams } from "expo-router";
import {
  ActionButton,
  BodyText,
  Container,
  HeadingText,
  Icon,
  ItalicText,
  Screen,
  SubHeadingText,
  View,
} from "./themed";
import { Image, Linking, Platform, TouchableOpacity } from "react-native";
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
import tw from "tailwind";
import { isTablet } from "utils/isTablet";
import { getProVetIdFromUrl } from "utils/getProVetIdFromUrl";
import { Patient, PatientsStore } from "stores/PatientsStore";
import { Modal } from "./Modal";

export const AppointmentDetail = () => {
  const { id } = useLocalSearchParams();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const { patients: patientsData } = PatientsStore.useState();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [reasons, setReasons] = useState<Array<any> | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

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
          const appointmentPatients: Array<Patient> = [];
          appointment?.patients?.forEach(
            (patient: any) =>
              patientsData?.forEach((patientData: Patient) => {
                if (patientData?.id === patient.id) {
                  appointmentPatients.push(patientData);
                }
              }),
          );
          setAppointment({
            ...appointment,
            reason: reasons.find(
              (reason: any) =>
                reason.id === getProVetIdFromUrl(appointment.reason as string),
            ) as { name: string; instructions: string },
            patients: appointmentPatients,
            location:
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
                    : "UNKNOWN APPOINTMENT TYPE",
          });
        }
      });
    }
  }, [id, pastAppointments, upcomingAppointments, reasons, patientsData]);

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
      <View
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-grow items-center justify-center w-full bg-transparent`,
        ]}
        noDarkMode
      >
        {__DEV__ && <BodyText style={tw`text-xs`}>#{appointment?.id}</BodyText>}
        <Container style={tw`p-3`}>
          <Icon
            name={
              appointment?.location === "CLINIC"
                ? "clinic-alt"
                : appointment?.location === "HOUSECALL"
                  ? "mobile"
                  : appointment?.location === "TELEHEALTH"
                    ? "telehealth"
                    : "question"
            }
            height={100}
            width={100}
          />
        </Container>
        <HeadingText style={tw`text-center mb-2`}>
          {
            (appointment?.reason as { name: string; instructions: string })
              ?.name
          }
        </HeadingText>
        <SubHeadingText style={tw`text-lg mb-2`}>
          {appointment?.start?.toDate()?.toLocaleString("en-US", {
            timeZone: "America/Denver",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          @{" "}
          {appointment?.start?.toDate()?.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </SubHeadingText>
        {(appointment?.instructions ||
          (appointment?.reason as { name: string; instructions: string })
            ?.instructions) && (
          <>
            <SubHeadingText style={tw`mt-4`}>INSTRUCTIONS</SubHeadingText>
            <ItalicText style={tw`mb-4`}>
              {appointment?.instructions ||
                (
                  appointment?.reason as {
                    name: string;
                    instructions: string;
                  }
                )?.instructions}
            </ItalicText>
          </>
        )}
        {appointment?.notes && (
          <>
            <SubHeadingText style={tw`mt-4`}>
              Appointment Location
            </SubHeadingText>
            <ItalicText style={tw`mb-4`}>{appointment?.notes}</ItalicText>
          </>
        )}
        {/* <SubHeadingText>
          PET
          {appointment?.patients && appointment?.patients?.length > 1
            ? "S"
            : ""}
        </SubHeadingText> */}
        {appointment?.patients?.map((patient: Patient, index: number) => (
          <TouchableOpacity
            key={index}
            style={tw`flex-row`}
            // onPress={() =>
            //   router.push({
            //     pathname: "/(app)/pets/detail",
            //     params: { id: patient?.id },
            //   })
            // }
          >
            <View
              noDarkMode
              style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:bg-movet-black dark:border-movet-white w-full`}
            >
              <Container style={tw`px-4 flex items-center justify-center`}>
                {patient?.photoUrl ? (
                  <Image
                    source={{ uri: patient?.photoUrl }}
                    alt={patient?.name + "'s photo"}
                    height={50}
                    width={50}
                    style={tw`rounded-full`}
                  />
                ) : (
                  <Icon
                    name={
                      patient?.species?.toLowerCase()?.includes("dog")
                        ? "dog"
                        : "cat"
                    }
                    size="md"
                  />
                )}
              </Container>
              <Container style={tw`flex-shrink`}>
                <HeadingText style={tw`text-black text-lg`}>
                  {patient.name}
                  {/* {__DEV__ && ` - #${patient.id}`} */}
                </HeadingText>
                <BodyText style={tw`text-black text-sm -mt-0.5`}>
                  {patient.breed}
                </BodyText>
                <Container style={tw`flex-row items-center`}>
                  <Icon
                    name={
                      patient?.gender?.toLowerCase()?.includes("male")
                        ? "male"
                        : "female"
                    }
                    size="xxs"
                  />
                  <ItalicText style={tw`text-black text-xs ml-1`}>
                    {patient.birthday}
                  </ItalicText>
                </Container>
              </Container>
            </View>
          </TouchableOpacity>
        ))}
        <Modal
          isVisible={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
          }}
          title="Cancel Appointment"
        >
          <>
            <BodyText
              style={[isTablet ? tw`text-lg` : tw`text-sm`, tw`text-center`]}
            >
              Are you sure you want to cancel this appointment?
            </BodyText>
            <ItalicText
              style={[
                isTablet ? tw`text-sm` : tw`text-xs`,
                tw`mt-2 text-center`,
              ]}
            >
              A $60 cancellation fee will be charged if cancellation occurs
              within 24 hours of your appointment.
            </ItalicText>
            <Container style={[tw`flex-row justify-center sm:mb-2`]}>
              <ActionButton
                title="Yes, Cancel My Appointment"
                iconName="cancel"
                onPress={() => {
                  setShowCancelModal(false);
                  // TODO : Cancel Appointment
                }}
              />
            </Container>
          </>
        </Modal>
        {appointment?.location === "CLINIC" &&
        appointment?.start?.toDate() >= new Date() ? (
          <Container
            style={tw`flex-col sm:flex-row justify-around w-full mt-4 mb-8`}
          >
            <ActionButton
              title="Get Directions"
              iconName="map"
              onPress={() => {
                const scheme = Platform.select({
                  ios: "maps:0,0?q=",
                  android: "geo:0,0?q=",
                });
                const latLng = "39.6252378,-104.9067691";
                const label =
                  "MoVET Clinic - 4912 S Newport St Denver, CO 80237";
                const url: any = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });
                Linking.canOpenURL(url).then((supported) => {
                  if (supported) Linking.openURL(url);
                });
              }}
              style={tw`sm:w-2.75/6`}
            />
            <ActionButton
              color="black"
              title="Cancel Appointment"
              iconName="cancel"
              onPress={() => setShowCancelModal(true)}
              style={tw`sm:w-2.75/6`}
            />
          </Container>
        ) : appointment?.location === "VIRTUAL" &&
          appointment?.start?.toDate() >= new Date() ? (
          <Container
            style={tw`flex-col sm:flex-row justify-around w-full mt-4 mb-8`}
          >
            <ActionButton
              title="START CONSULTATION"
              iconName="check"
              onPress={() => console.log("START CONSULTATION")}
              style={tw`sm:w-2.75/6`}
            />
            <ActionButton
              color="black"
              title="Cancel Consultation"
              iconName="cancel"
              onPress={() => setShowCancelModal(true)}
              style={tw`sm:w-2.75/6`}
            />
          </Container>
        ) : appointment?.start?.toDate() >= new Date() ? (
          <ActionButton
            color="black"
            title="Cancel Appointment"
            iconName="cancel"
            onPress={() => setShowCancelModal(true)}
            style={tw`mb-8`}
          />
        ) : (
          <></>
        )}
      </View>
    </Screen>
  );
};
