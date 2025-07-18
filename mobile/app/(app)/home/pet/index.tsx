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
  Patient,
  PatientsStore,
} from "stores";
import { isTablet } from "utils/isTablet";
import { SectionHeading } from "components/SectionHeading";
import { RequestRecords } from "components/RequestRecords";

const PetDetail = () => {
  const { id } = useLocalSearchParams();
  const { client } = AuthStore.useState();
  const { patients } = PatientsStore.useState();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
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
  const [petAge, setPetAge] = useState<string | null>(null);

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
    if (patient?.birthday) {
      const yearsAgo = (date: Date) => {
        const now = new Date();
        const years = now.getFullYear() - date.getFullYear();
        if (
          now.getMonth() < date.getMonth() ||
          (now.getMonth() === date.getMonth() && now.getDate() < date.getDate())
        ) {
          if (years === 1)
            return 12 + (now.getMonth() - date.getMonth()) + " Months Old";
          else return years - 1 + " Years Old";
        } else {
          if (years === 0)
            return now.getMonth() - date.getMonth() + " Months Old";
          if (years === 1) return "1 Year Old";
          else return years + " Years Old";
        }
      };
      const [month, day, year] = (patient?.birthday as string)?.split(
        "-",
      ) as any;
      setPetAge(
        yearsAgo(new Date(Number(year), Number(month) - 1, Number(day))),
      );
    }
  }, [patient?.birthday]);

  return (
    <Screen withBackground={backgroundImage} resizeMode="repeat">
      <Stack.Screen options={{ title: patient?.name }} />
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
              pathname: "/(app)/home/pet/edit",
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
                    patient?.species?.toLowerCase()?.includes("dog") ||
                    patient?.species?.toLowerCase()?.includes("canine")
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

        <Container
          style={tw`flex-col items-center justify-center w-full rounded-xl bg-movet-white/70 dark:bg-movet-black/70`}
        >
          <Container
            style={tw`flex-row items-center justify-center w-full mt-2`}
          >
            <Icon
              name={
                patient?.species?.toLowerCase()?.includes("dog") ||
                patient?.species?.toLowerCase()?.includes("canine")
                  ? "dog"
                  : "cat"
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
                patient?.gender?.toLowerCase()?.includes("female") ||
                patient?.gender?.toLowerCase()?.includes("female,")
                  ? "female"
                  : "male"
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
            <SubHeadingText style={tw`ml-1`}>{petAge}</SubHeadingText>
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
                {upcomingPatientAppointments.map(
                  (appointment: Appointment, index: number) => {
                    return (
                      <TouchableOpacity
                        key={appointment.id + index}
                        onPress={() =>
                          router.navigate({
                            pathname: `/(app)/home/pet/appointment-detail/`,
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
                                appointment?.locationType === "Clinic"
                                  ? "clinic-alt"
                                  : appointment?.locationType === "Home"
                                    ? "mobile"
                                    : appointment?.locationType === "Virtually"
                                      ? "telehealth"
                                      : "question"
                              }
                              height={50}
                              width={50}
                            />
                          </Container>
                          <Container style={tw`flex-shrink`}>
                            <HeadingText style={tw`text-lg`}>
                              {appointment.reason as string}
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
              style={tw`flex-col rounded-xl bg-transparent w-full`}
              noDarkMode
            >
              {pastPatientAppointments.map(
                (appointment: Appointment, index: number) => {
                  return !showAllPastAppointments && index < 3 ? (
                    <TouchableOpacity
                      key={appointment.id + index}
                      onPress={() =>
                        router.navigate({
                          pathname: `/(app)/home/pet/appointment-detail/`,
                          params: { id: appointment?.id },
                        })
                      }
                    >
                      <View
                        style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full shadow-lg shadow-movet-black dark:shadow-movet-white`}
                      >
                        <Container style={tw`p-2`}>
                          <Icon
                            name={
                              appointment?.locationType === "Clinic"
                                ? "clinic-alt"
                                : appointment?.locationType === "Home"
                                  ? "mobile"
                                  : appointment?.locationType === "Virtually"
                                    ? "telehealth"
                                    : "clinic"
                            }
                            height={50}
                            width={50}
                          />
                        </Container>
                        <Container style={tw`flex-shrink`}>
                          <HeadingText style={tw`text-lg`}>
                            {(appointment.reason as string).includes("provet")
                              ? "Exam"
                              : (appointment.reason as string)}
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
                      key={appointment.id + index}
                      onPress={() =>
                        router.navigate({
                          pathname: `/(app)/home/pet/appointment-detail/`,
                          params: { id: appointment?.id },
                        })
                      }
                    >
                      <View
                        style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-row items-center border-2 dark:border-movet-white w-full`}
                      >
                        <Container style={tw`p-2`}>
                          <Icon
                            name={
                              appointment?.locationType === "Clinic"
                                ? "clinic-alt"
                                : appointment?.locationType === "Home"
                                  ? "mobile"
                                  : appointment?.locationType === "Virtually"
                                    ? "telehealth"
                                    : "clinic"
                            }
                            height={50}
                            width={50}
                          />
                        </Container>
                        <Container style={tw`flex-shrink`}>
                          <HeadingText style={tw`text-lg`}>
                            {(appointment.reason as string).includes("provet")
                              ? "Exam"
                              : (appointment.reason as string)}
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
        {!patient?.photoUrl && (
          <TouchableOpacity
            onPress={() =>
              router.navigate({
                pathname: "/(app)/home/pet/edit",
                params: { id: patient?.id },
              })
            }
          >
            <View
              noDarkMode
              style={[
                tw`flex-row shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent my-4`,
              ]}
            >
              <View
                style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full bg-movet-black/50 dark:bg-movet-white/50`}
                noDarkMode
              >
                <Container>
                  <Icon name={"plus"} height={22} width={22} color="white" />
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
        )}
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
                      {patient?.gender?.toLowerCase()?.includes("female") ||
                      patient?.gender?.toLowerCase()?.includes("female,")
                        ? "her"
                        : "his"}{" "}
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
                      router.navigate("/(app)/home/pet/new-appointment");
                    }}
                  />
                </Container>
              </>
            </Modal>
          </>
        )}
        <Container style={tw`flex-col sm:flex-row justify-around w-full mb-8`}>
          <ActionButton
            color="blue"
            title={
              (!upcomingAppointments && !pastAppointments
                ? "Request"
                : "Schedule") + " an Appointment"
            }
            iconName="calendar-plus"
            onPress={() =>
              router.navigate({
                pathname: "/(app)/home/new-appointment",
                params: {
                  id: patient?.id,
                },
              })
            }
            style={
              pastPatientAppointments && pastPatientAppointments?.length > 0
                ? tw`sm:w-0.9/4`
                : tw`sm:mr-4`
            }
          />
          {pastPatientAppointments && pastPatientAppointments?.length > 0 && (
            <>
              <ActionButton
                color="red"
                title="Request Medication Refill"
                iconName="med-bottle"
                style={
                  pastPatientAppointments && pastPatientAppointments?.length > 0
                    ? tw`sm:w-0.9/4`
                    : tw`sm:mr-4`
                }
                onPress={() => {
                  router.navigate({
                    pathname: "/(app)/home/pet/web-view",
                    params: {
                      path: "/contact",
                      screenTitle: "Medication Refill Request",
                      queryString: `${
                        client?.firstName
                          ? `&firstName=${client?.firstName}`
                          : ""
                      }${
                        client?.lastName ? `&lastName=${client?.lastName}` : ""
                      }${client?.email ? `&email=${client?.email}` : ""}${
                        client?.phone
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
              />
              <RequestRecords
                patientName={patient?.name as string}
                source="home"
                color="brown"
              />
            </>
          )}
          <ActionButton
            color="black"
            title="Edit Pet"
            iconName="pencil"
            onPress={() =>
              router.navigate({
                pathname: "/(app)/home/pet/edit",
                params: { id: patient?.id },
              })
            }
            style={
              pastPatientAppointments && pastPatientAppointments?.length > 0
                ? tw`sm:w-0.9/4`
                : tw`sm:ml-4`
            }
          />
        </Container>
      </View>
    </Screen>
  );
};

export default PetDetail;
