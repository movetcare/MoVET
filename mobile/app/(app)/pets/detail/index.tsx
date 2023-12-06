import { Stack, router, useLocalSearchParams } from "expo-router";
import { Image } from "react-native";
import {
  BodyText,
  Icon,
  View,
  Container,
  ActionButton,
  SubHeadingText,
  ItalicText,
  Screen,
  HeadingText,
} from "components/themed";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import tw from "tailwind";
import { Modal } from "components/Modal";
import {
  Appointment,
  AppointmentsStore,
  AuthStore,
  ErrorStore,
  Patient,
  PatientsStore,
} from "stores";
import { isTablet } from "utils/isTablet";
import { SectionHeading } from "components/SectionHeading";
import { firestore } from "firebase-config";
import {
  onSnapshot,
  query,
  collection,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { getProVetIdFromUrl } from "utils/getProVetIdFromUrl";

const PetDetail = () => {
  const { id } = useLocalSearchParams();
  const { user } = AuthStore.useState();
  const { patients } = PatientsStore.useState();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const [reasons, setReasons] = useState<Array<any> | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [upcomingPatientAppointments, setUpcomingPatientAppointments] =
    useState<Array<Appointment> | null>(null);
  const [pastPatientAppointments, setPastPatientAppointments] =
    useState<Array<Appointment> | null>(null);
  const [showVcprModal, setShowVcprModal] = useState<boolean>(false);
  const [showRecordsRequestModal, setShowRecordsRequestModal] =
    useState<boolean>(false);

  useEffect(() => {
    if (id && patients) {
      patients.forEach((patient: Patient) => {
        if (id === `${patient.id}`) {
          setPatient(patient);
          if (upcomingAppointments && upcomingAppointments.length > 0) {
            const upcomingPatientAppointments: Array<Appointment> = [];
            upcomingAppointments.map((appointment: Appointment) => {
              appointment?.patients?.forEach((patientData: Patient) => {
                if (patientData.id === patient.id)
                  upcomingPatientAppointments.push(appointment);
              });
            });
            setUpcomingPatientAppointments(upcomingPatientAppointments);
          }
          if (pastAppointments && pastAppointments.length > 0) {
            const pastPatientAppointments: Array<Appointment> = [];
            pastAppointments.map((appointment: Appointment) => {
              appointment?.patients?.forEach((patientData: Patient) => {
                if (patientData.id === patient.id)
                  pastPatientAppointments.push(appointment);
              });
            });
            setPastPatientAppointments(pastPatientAppointments);
          }
        }
      });
    }
  }, [id, patients, upcomingAppointments, pastAppointments]);

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
      <Stack.Screen options={{ title: patient?.name }} />
      <View
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-grow items-center justify-center w-full bg-transparent`,
        ]}
        noDarkMode
      >
        <View
          style={tw`w-30 h-30 bg-movet-gray/50 rounded-full mb-4 mt-8`}
          noDarkMode
        >
          {patient?.photoUrl ? (
            <Image
              source={{ uri: patient?.photoUrl }}
              style={tw`w-full h-full rounded-full`}
              alt={patient?.name + "'s photo"}
            />
          ) : (
            <Container style={tw`absolute top-8.5 left-8.5`}>
              <Icon
                name={
                  patient?.species?.toLowerCase()?.includes("dog")
                    ? "dog"
                    : "cat"
                }
                size="xl"
                color="white"
              />
            </Container>
          )}
        </View>
        <Container style={tw`flex-row items-center justify-center w-full mt-2`}>
          <Icon
            name={
              patient?.species?.toLowerCase()?.includes("dog") ? "dog" : "cat"
            }
            height={20}
            width={20}
          />
          <SubHeadingText style={tw`ml-1`}>
            {patient?.breed?.toUpperCase()}
          </SubHeadingText>
        </Container>
        <Container style={tw`flex-row items-center justify-center w-full mt-2`}>
          <Icon
            name={
              patient?.gender?.toLowerCase()?.includes("male")
                ? "male"
                : "female"
            }
            height={20}
            width={20}
          />
          <SubHeadingText style={tw`ml-1`}>
            {patient?.gender?.toUpperCase()}
          </SubHeadingText>
        </Container>
        <Container
          style={tw`flex-row items-center justify-center w-full mt-2 mb-4`}
        >
          <Icon name="cake" height={20} width={20} />
          <SubHeadingText style={tw`ml-1`}>
            {patient?.birthday?.toUpperCase()}
          </SubHeadingText>
        </Container>
        {upcomingPatientAppointments &&
          upcomingPatientAppointments.length > 0 && (
            <>
              <SectionHeading
                iconName={"calendar-heart"}
                text={
                  upcomingPatientAppointments.length > 1
                    ? "Upcoming Appointments"
                    : "Upcoming Appointment"
                }
              />
              <View
                style={tw`flex-col rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white bg-transparent w-full`}
                noDarkMode
              >
                {reasons &&
                  upcomingPatientAppointments.map(
                    (appointment: Appointment) => {
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
                        if (
                          reason.id ===
                          getProVetIdFromUrl(appointment.reason as any)
                        )
                          return reason.name;
                      });
                      return (
                        <TouchableOpacity
                          key={appointment.id}
                          onPress={() =>
                            router.push({
                              pathname: `/(app)/pets/detail/appointment-detail/`,
                              params: { id: appointment?.id },
                            })
                          }
                        >
                          <View
                            style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full`}
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
                                        : "question"
                                }
                                height={50}
                                width={50}
                              />
                            </Container>
                            <Container style={tw`flex-shrink`}>
                              <HeadingText style={tw`text-lg`}>
                                {reason}
                              </HeadingText>
                              <BodyText style={tw`text-sm -mt-0.5`}>
                                {appointment.start
                                  .toDate()
                                  .toLocaleDateString("en-us", {
                                    weekday: "long",
                                    year: "2-digit",
                                    month: "numeric",
                                    day: "numeric",
                                  })}{" "}
                                @{" "}
                                {appointment.start
                                  .toDate()
                                  .toLocaleString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}
                              </BodyText>
                            </Container>
                          </View>
                        </TouchableOpacity>
                      );
                    },
                  )}
              </View>
            </>
          )}
        {pastPatientAppointments && pastPatientAppointments.length > 0 && (
          <>
            <SectionHeading
              iconName={"clipboard-medical"}
              text={
                pastPatientAppointments.length > 1
                  ? "Past Appointments"
                  : "Past Appointment"
              }
            />
            <View
              style={tw`flex-col rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white bg-transparent w-full`}
              noDarkMode
            >
              {reasons &&
                pastPatientAppointments.map((appointment: Appointment) => {
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
                    if (
                      reason.id ===
                      getProVetIdFromUrl(appointment.reason as any)
                    )
                      return reason.name;
                  });
                  return (
                    <TouchableOpacity
                      key={appointment.id}
                      onPress={() =>
                        router.push({
                          pathname: `/(app)/pets/detail/appointment-detail/`,
                          params: { id: appointment?.id },
                        })
                      }
                    >
                      <View
                        key={appointment.id}
                        style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full`}
                      >
                        <Container style={tw`p-2`}>
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
                            height={50}
                            width={50}
                          />
                        </Container>
                        <Container style={tw`flex-shrink`}>
                          <HeadingText style={tw`text-lg`}>
                            {reason}
                          </HeadingText>
                          <BodyText style={tw`text-sm -mt-0.5`}>
                            {appointment.start
                              .toDate()
                              .toLocaleDateString("en-us", {
                                weekday: "long",
                                year: "2-digit",
                                month: "numeric",
                                day: "numeric",
                              })}{" "}
                            @{" "}
                            {appointment.start
                              .toDate()
                              .toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                          </BodyText>
                        </Container>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </>
        )}
        {patient?.vcprRequired && !upcomingPatientAppointments && (
          <>
            <TouchableOpacity onPress={() => setShowVcprModal(true)}>
              <View
                noDarkMode
                style={[
                  tw`flex-row shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent mt-4`,
                ]}
              >
                <View
                  style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full bg-movet-yellow`}
                  noDarkMode
                >
                  <Container>
                    <Icon
                      name={"exclamation-circle"}
                      height={22}
                      width={22}
                      color="white"
                    />
                  </Container>
                  <Container style={tw`px-3 mr-4 flex-1`}>
                    <ItalicText
                      style={tw`text-movet-white text-sm text-center`}
                      noDarkMode
                    >
                      Please schedule an appointment for {patient?.name} to
                      update{" "}
                      {patient?.gender?.toLowerCase()?.includes("male")
                        ? "his"
                        : "her"}{" "}
                      VCPR status
                    </ItalicText>
                  </Container>
                </View>
              </View>
            </TouchableOpacity>
            <Modal
              isVisible={showVcprModal}
              onClose={() => {
                setShowVcprModal(false);
              }}
              title="What is a VCPR?"
            >
              <>
                <BodyText>
                  A Veterinarian-Client-Patient Relationship (&quot;VCPR&quot;)
                  is established only when your veterinarian examines your pet
                  in person, and is maintained by regular veterinary visits as
                  needed to monitor your pet&apos;s health.
                </BodyText>
                <BodyText>
                  If a VCPR is established but your veterinarian does not
                  regularly see your pet afterward, the VCPR is no longer valid
                  and it would be illegal (and unethical) for your veterinarian
                  to dispense or prescribe medications or recommend treatment
                  without recently examining your pet.
                </BodyText>
                <BodyText>
                  A valid VCPR cannot be established online, via email, or over
                  the phone. However, once a VCPR is established, it may be able
                  to be maintained between medically necessary examinations via
                  telephone or other types of consultations; but it&apos;s up to
                  your veterinarian&apos; discretion to determine if this is
                  appropriate and in the best interests of your pets&apos;
                  health.
                </BodyText>
                <SubHeadingText
                  style={[
                    isTablet ? tw`mt-4 text-base` : tw`text-xs`,
                    tw`text-center uppercase mb-1`,
                  ]}
                >
                  Pet{patients && patients.length > 1 && "s"} without a VCPR
                </SubHeadingText>
                {patients?.map((patient: Patient, index: number) =>
                  index <= 2 ? (
                    <ItalicText
                      key={index}
                      style={[
                        isTablet ? tw`text-base` : tw`text-xs`,
                        tw`text-center`,
                      ]}
                    >
                      {patient.name}
                    </ItalicText>
                  ) : null,
                )}
                {patients && patients.length > 3 && (
                  <ItalicText style={tw`text-center text-xs`}>
                    ...and {patients.length - 3} more
                  </ItalicText>
                )}
                <Container
                  style={[
                    isTablet ? tw`mt-4` : tw``,
                    tw`flex-row justify-center sm:mb-2`,
                  ]}
                >
                  <ActionButton
                    title={
                      (!upcomingAppointments && !pastAppointments
                        ? "Request"
                        : "Schedule") + " an Appointment"
                    }
                    iconName="calendar-plus"
                    onPress={() => {
                      setShowVcprModal(false);
                      router.push("/(app)/pets/new-appointment");
                    }}
                  />
                </Container>
              </>
            </Modal>
          </>
        )}
        <Modal
          isVisible={showRecordsRequestModal}
          onClose={() => {
            setShowRecordsRequestModal(false);
          }}
          title="Confirm Pet Records Request"
        >
          <>
            <BodyText>
              Do you want a copy of {patient?.name}&apos;s records sent to your
              email address - {user?.email}?
            </BodyText>
            <Container style={[tw`flex-row justify-center sm:mb-2`]}>
              <ActionButton
                title="Send Records via Email"
                iconName="plane"
                onPress={() => {
                  setShowRecordsRequestModal(false);
                  // TODO : Send Records Request Email to Admin
                }}
              />
            </Container>
          </>
        </Modal>
        <Container
          style={tw`flex-col sm:flex-row justify-around w-full mb-8 mt-4`}
        >
          <ActionButton
            title={
              (!upcomingAppointments && !pastAppointments
                ? "Request"
                : "Schedule") + " an Appointment"
            }
            iconName="calendar-plus"
            onPress={() =>
              router.push({
                pathname: "/(app)/pets/detail/new-appointment",
                params: {
                  id: patient?.id,
                  goBackRoot: "/(app)/pets/detail",
                },
              })
            }
            style={tw`sm:w-0.9/3`}
          />
          <ActionButton
            color="black"
            title="Request Records"
            iconName="folder-heart"
            onPress={() => setShowRecordsRequestModal(true)}
            style={tw`sm:w-0.9/3`}
          />
          <ActionButton
            color="brown"
            title="Edit Pet"
            iconName="pencil"
            onPress={() =>
              router.push({
                pathname: "/(app)/pets/detail/edit",
                params: { id: patient?.id },
              })
            }
            style={tw`sm:w-0.9/3`}
          />
        </Container>
      </View>
    </Screen>
  );
};

export default PetDetail;
