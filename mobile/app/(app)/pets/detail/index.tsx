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
  ExtendedViewProps,
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
import { RequestRecords } from "components/RequestRecords";

const PetDetail = () => {
  const { id } = useLocalSearchParams();
  const { client } = AuthStore.useState();
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
  const [showAllPastAppointments, setShowAllPastAppointments] =
    useState<boolean>(false);
  const [vcprPatients, setVcprPatients] = useState<Patient[] | null>(null);
  const [backgroundImage, setBackgroundImage] =
    useState<ExtendedViewProps["withBackground"]>("bone");

  const textStyles = [isTablet ? tw`text-lg` : tw`text-sm`, tw`mb-2`];

  useEffect(() => {
    if (id && patients) {
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
        if (id === `${patient.id}`) {
          if (patient.species?.toLowerCase()?.includes("cat"))
            setBackgroundImage("mouse");
          setPatient(patient);
          if (upcomingAppointments && upcomingAppointments.length > 0) {
            const upcomingPatientAppointments: Array<Appointment> = [];
            upcomingAppointments.map((appointment: Appointment) => {
              appointment?.patients?.forEach((patientData: Patient) => {
                if (patientData.id === patient.id)
                  upcomingPatientAppointments.push(appointment);
              });
            });
            if (upcomingPatientAppointments?.length > 0)
              setUpcomingPatientAppointments(upcomingPatientAppointments);
            else setUpcomingPatientAppointments(null);
          }
          if (pastAppointments && pastAppointments.length > 0) {
            const pastPatientAppointments: Array<Appointment> = [];
            pastAppointments.map((appointment: Appointment) => {
              appointment?.patients?.forEach((patientData: Patient) => {
                if (patientData.id === patient.id)
                  pastPatientAppointments.push(appointment);
              });
            });
            if (pastPatientAppointments?.length > 0)
              setPastPatientAppointments(pastPatientAppointments);
          }
        }
      });
      if (vcprPatients.length > 0) setVcprPatients(vcprPatients);
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
      (error: any) => setError({ ...error, source: "unsubscribeReasons" }),
    );
    return () => unsubscribeReasons();
  }, []);

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });


  return (
    <Screen withBackground={backgroundImage}>
      <Stack.Screen options={{ title: patient?.name }} />
      {__DEV__ && (
        <BodyText style={tw`text-xs`}>#{JSON.stringify(patient?.id)}</BodyText>
      )}
      <View
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-grow items-center justify-center w-full bg-transparent`,
        ]}
        noDarkMode
      >
        <TouchableOpacity
          onPress={() =>
            router.navigate({
              pathname: "/(app)/pets/detail/edit",
              params: { id: patient?.id },
            })
          }
        >
          <View
            style={tw`w-30 h-30 bg-movet-gray rounded-full mb-4 mt-8`}
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
        </TouchableOpacity>
        {!patient?.photoUrl && (
          <>
            <TouchableOpacity onPress={() => router.navigate({
              pathname: "/(app)/pets/detail/edit",
              params: { id: patient?.id },
            })}>
              <View
                noDarkMode
                style={[
                  tw`flex-row shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent mb-4`,
                ]}
              >
                <View
                  style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full bg-movet-black/50 dark:bg-movet-white/50`}
                  noDarkMode
                >
                  <Container>
                    <Icon
                      name={
                        "plus"
                      }
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
                      Add a photo of {patient?.name}
                    </ItalicText>
                  </Container>
                </View>
              </View>
            </TouchableOpacity>
            {patient?.vcprRequired && !upcomingPatientAppointments && (
              <>
                <TouchableOpacity onPress={() => setShowVcprModal(true)}>
                  <View
                    noDarkMode
                    style={[
                      tw`flex-row shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent mb-4`,
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
                    <BodyText style={textStyles}>
                      A Veterinarian-Client-Patient Relationship (&quot;VCPR&quot;)
                      is established only when your veterinarian examines your pet
                      in person, and is maintained by regular veterinary visits as
                      needed to monitor your pet&apos;s health.
                    </BodyText>
                    <BodyText style={textStyles}>
                      If a VCPR is established but your veterinarian does not
                      regularly see your pet afterward, the VCPR is no longer valid
                      and it would be illegal (and unethical) for your veterinarian
                      to dispense or prescribe medications or recommend treatment
                      without recently examining your pet.
                    </BodyText>
                    <BodyText style={textStyles}>
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
                      Pet{vcprPatients && vcprPatients.length > 1 && "s"} without a
                      VCPR
                    </SubHeadingText>
                    {vcprPatients?.map((patient: Patient, index: number) =>
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
                    {vcprPatients && vcprPatients.length > 3 && (
                      <ItalicText style={tw`text-center text-xs`}>
                        ...and {vcprPatients.length - 3} more
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
                          router.navigate("/(app)/pets/new-appointment");
                        }}
                      />
                    </Container>
                  </>
                </Modal>
              </>
            )}
          </>
        )}

        <Container
          style={tw`flex-col items-center justify-center w-full rounded-xl bg-movet-white/70 dark:bg-movet-black/70`}
        >
          <Container
            style={tw`flex-row items-center justify-center w-full mt-2`}
          >
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
          <Container
            style={tw`flex-row items-center justify-center w-full mt-1`}
          >
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
            style={tw`flex-row items-center justify-center w-full mb-4 mt-1`}
          >
            <Icon name="cake" height={20} width={20} />
            <SubHeadingText style={tw`ml-1`}>
              {patient?.birthday?.toUpperCase()}
            </SubHeadingText>
          </Container>
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
              style={tw`flex-col rounded-xl bg-transparent w-full`}
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
                            router.navigate({
                              pathname: `/(app)/pets/detail/appointment-detail/`,
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
                pastPatientAppointments.map(
                  (appointment: Appointment, index: number) => {
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
                    return !showAllPastAppointments && index < 3 ? (
                      <TouchableOpacity
                        key={appointment.id}
                        onPress={() =>
                          router.navigate({
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
                    ) : showAllPastAppointments ? (
                      <TouchableOpacity
                        key={appointment.id}
                        onPress={() =>
                          router.navigate({
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
                    ) : null;
                  },
                )}
              {pastPatientAppointments &&
                pastPatientAppointments.length > 3 && (
                  <ActionButton
                    type="text"
                    iconName={"folder-heart"}
                    style={tw`text-center -mt-1.5 w-full`}
                    textStyle={tw`text-movet-black dark:text-movet-white`}
                    title={showAllPastAppointments ? "Show Fewer" : "View All"}
                    onPress={() =>
                      setShowAllPastAppointments(!showAllPastAppointments)
                    }
                  />
                )}
            </View>
          </>
        )}
        <Container
          style={tw`flex-col sm:flex-row justify-around w-full mb-8 mt-4`}
        >{patient?.photoUrl && patient?.vcprRequired && !upcomingPatientAppointments && (
          <>
            <TouchableOpacity onPress={() => setShowVcprModal(true)}>
              <View
                noDarkMode
                style={[
                  tw`flex-row shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent mb-4`,
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
                <BodyText style={textStyles}>
                  A Veterinarian-Client-Patient Relationship (&quot;VCPR&quot;)
                  is established only when your veterinarian examines your pet
                  in person, and is maintained by regular veterinary visits as
                  needed to monitor your pet&apos;s health.
                </BodyText>
                <BodyText style={textStyles}>
                  If a VCPR is established but your veterinarian does not
                  regularly see your pet afterward, the VCPR is no longer valid
                  and it would be illegal (and unethical) for your veterinarian
                  to dispense or prescribe medications or recommend treatment
                  without recently examining your pet.
                </BodyText>
                <BodyText style={textStyles}>
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
                  Pet{vcprPatients && vcprPatients.length > 1 && "s"} without a
                  VCPR
                </SubHeadingText>
                {vcprPatients?.map((patient: Patient, index: number) =>
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
                  {vcprPatients && vcprPatients.length > 3 && (
                    <ItalicText style={tw`text-center text-xs`}>
                      ...and {vcprPatients.length - 3} more
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
                        router.navigate("/(app)/pets/new-appointment");
                      }}
                    />
                  </Container>
                </>
              </Modal>
            </>
          )}
          <ActionButton
            title={
              (!upcomingAppointments && !pastAppointments
                ? "Request"
                : "Schedule") + " an Appointment"
            }
            iconName="calendar-plus"
            onPress={() =>
              router.navigate({
                pathname: "/(app)/pets/detail/new-appointment",
                params: {
                  id: patient?.id,
                },
              })
            }
            style={
              pastPatientAppointments && pastPatientAppointments?.length > 0
                ? tw`sm:w-0.9/3`
                : tw`sm:mr-4`
            }
          />
          {pastPatientAppointments && pastPatientAppointments?.length > 0 && (
            <>
            <ActionButton
                color="red"
                title="Request Medication Refill"
                iconName="med-bottle"
                onPress={() => {
                  router.navigate({
                    pathname: "/(app)/pets/detail/web-view",
                    params: {
                      path: "/contact",
                      screenTitle: "Medication Refill Request",
                      queryString: `${client?.firstName ? `&firstName=${client?.firstName}` : ""
                        }${client?.lastName ? `&lastName=${client?.lastName}` : ""
                        }${client?.email ? `&email=${client?.email}` : ""}${client?.phone
                          ? `&phone=${client?.phone
                            ?.replaceAll(" ", "")
                            ?.replaceAll("(", "")
                            ?.replaceAll(")", "")
                            ?.replaceAll("-", "")}`
                        : ""
                        }&message=${patient?.name} is in need of a refill for <MEDICATION_NAME>. Thanks!`
                        ?.replaceAll(")", "")
                        ?.replaceAll("(", ""),
                    },
                  });
                }}
              /><RequestRecords patientName={patient?.name as string} /></>
          )}
          <ActionButton
            color="brown"
            title="Edit Pet"
            iconName="pencil"
            onPress={() =>
              router.navigate({
                pathname: "/(app)/pets/detail/edit",
                params: { id: patient?.id },
              })
            }
            style={
              pastPatientAppointments && pastPatientAppointments?.length > 0
                ? tw`sm:w-0.9/3`
                : tw`sm:ml-4`
            }
          />
        </Container>
      </View>
    </Screen>
  );
};

export default PetDetail;
