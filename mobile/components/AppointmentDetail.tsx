import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  ActionButton,
  BodyText,
  Container,
  HeadingText,
  Icon,
  ItalicText,
  Screen,
  SubHeadingText,
  SubmitButton,
  TextInput,
  View,
} from "./themed";
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import { firestore, functions } from "firebase-config";
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
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { AuthStore, Appointment, AppointmentsStore } from "stores";
import { getPlatformUrl } from "utils/getPlatformUrl";
import { useForm } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { openUrlInWebBrowser } from "utils/openUrlInWebBrowser";
import { PaymentMethodSummary } from "./home/PaymentMethodSummary";

export const AppointmentDetail = () => {
  const { id } = useLocalSearchParams();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const { client } = AuthStore.useState();
  const { patients: patientsData } = PatientsStore.useState();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [reasons, setReasons] = useState<Array<any> | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const isDarkMode = useColorScheme() !== "light";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      reasonId: 1,
      cancellationReason: null,
    },
  });

  useEffect(() => {
    if (
      mapCoordinates === null &&
      (appointment?.notes?.includes("Appointment Location:") || client?.address)
    ) {
      setIsLoading(true);
      fetch(
        `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(
          appointment?.notes?.split("-")[1]?.split("|")[0]?.trim() ||
            client?.address,
        )}&key=${Constants.expoConfig?.extra?.google_maps_geocode_key}`,
      )
        .then((response: any) => response.json())
        .then((json: any) => {
          setMapCoordinates(json.results[0].geometry.location);
        })
        .catch((error: any) =>
          setError({ ...error, source: "Google Geocode API" }),
        )
        .finally(() => setIsLoading(false));
    }
  }, [mapCoordinates, appointment?.notes, client?.address]);

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
        if (String(appointment?.id) === id) {
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
      (error: any) => setError({ ...error, source: "unsubscribeReasons" }),
    );
    return () => unsubscribeReasons();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const updateAppointment = httpsCallable(functions, "updateAppointment");
    await updateAppointment({
      cancellation_reason_text: data.cancellationReason,
      cancellation_reason: data.reasonId,
      active: 0,
      id,
    })
      .then(async (result: any) => {
        if (result.data) router.back();
        else
          setError({
            message: "Failed to cancel appointment, please try again",
            source: "updateAppointment",
          });
      })
      .catch((error: any) =>
        setError({ ...error, source: "updateAppointment" }),
      )
      .finally(() => {
        setShowCancelModal(false);
        setIsLoading(false);
      });
  };

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  return (
    <Screen>
      {appointment?.location === "TELEHEALTH" && (
        <Stack.Screen options={{ title: "Virtual Consultation" }} />
      )}
      {appointment?.start?.toDate() >= new Date() && (
        <PaymentMethodSummary
          titleSize={"sm"}
          title="PAYMENT METHOD REQUIRED"
          message="Tap here to add a payment method to your account before your appointment begins."
        />
      )}
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
        {appointment?.notes?.includes("Appointment Location:") ? (
          <>
            <SubHeadingText style={tw`mt-2`}>
              APPOINTMENT LOCATION
            </SubHeadingText>
            {appointment?.notes?.split("-")[1]?.split("|")[0]?.trim() && (
              <ItalicText style={tw`text-center`}>
                {appointment?.notes?.split("-")[1]?.split("(")[0]?.trim()}
              </ItalicText>
            )}
            {appointment?.notes
              ?.split("-")[1]
              ?.split("|")[0]
              ?.trim()
              .split("(")[1]
              ?.split(")")[0]
              ?.trim() && (
              <ItalicText style={tw`mb-4 text-center text-sm`}>
                *{" "}
                {appointment?.notes
                  ?.split("-")[1]
                  ?.split("|")[0]
                  ?.trim()
                  .split("(")[1]
                  ?.split(")")[0]
                  ?.trim()}
              </ItalicText>
            )}
            {isLoading || !mapCoordinates ? (
              <ActivityIndicator
                size={"large"}
                color={tw.color("movet-red")}
                style={tw`my-8`}
              />
            ) : (
              <View
                style={tw`
              flex-row w-full h-60 self-center overflow-hidden border-2 border-black dark:border-movet-white rounded-xl mb-4
            `}
              >
                <MapView
                  style={tw`flex-grow h-60`}
                  loadingEnabled={true}
                  loadingIndicatorColor={tw.color("movet-red")}
                  loadingBackgroundColor={"transparent"}
                  userInterfaceStyle={isDarkMode ? "dark" : "light"}
                  tintColor={tw.color("movet-red")}
                  region={{
                    latitude: mapCoordinates.lat,
                    longitude: mapCoordinates.lng,
                    latitudeDelta: 0.0055,
                    longitudeDelta: 0.0055,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: mapCoordinates.lat,
                      longitude: mapCoordinates.lng,
                    }}
                    title="Home"
                    tracksViewChanges={false}
                  />
                </MapView>
              </View>
            )}
          </>
        ) : appointment?.location === "HOUSECALL" && client?.address ? (
          <>
            <SubHeadingText style={tw`mt-2`}>
              APPOINTMENT LOCATION
            </SubHeadingText>
            <ItalicText style={tw`text-center mb-4`}>
              {client?.address}
            </ItalicText>
            {isLoading || !mapCoordinates ? (
              <ActivityIndicator
                size={"large"}
                color={tw.color("movet-red")}
                style={tw`my-8`}
              />
            ) : (
              <View
                style={tw`
              flex-row w-full h-60 self-center overflow-hidden border-2 border-black dark:border-movet-white rounded-xl mb-4
            `}
              >
                <MapView
                  style={tw`flex-grow h-60`}
                  loadingEnabled={true}
                  loadingIndicatorColor={tw.color("movet-red")}
                  loadingBackgroundColor={"transparent"}
                  userInterfaceStyle={isDarkMode ? "dark" : "light"}
                  tintColor={tw.color("movet-red")}
                  region={{
                    latitude: mapCoordinates.lat,
                    longitude: mapCoordinates.lng,
                    latitudeDelta: 0.0055,
                    longitudeDelta: 0.0055,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: mapCoordinates.lat,
                      longitude: mapCoordinates.lng,
                    }}
                    title="Home"
                    tracksViewChanges={false}
                  />
                </MapView>
              </View>
            )}
          </>
        ) : appointment?.location === "HOUSECALL" && !client?.address ? (
          <>
            <SubHeadingText style={tw`mt-2`}>
              APPOINTMENT LOCATION
            </SubHeadingText>
            <ItalicText
              style={tw`text-center mb-4 underline text-movet-red`}
              noDarkMode
            >
              UNKNOWN - Please contact us ASAP with the correct address for your
              housecall appointment.
            </ItalicText>
            {appointment?.start?.toDate() >= new Date() ? (
              <ActionButton
                title="Provide an Address"
                iconName="map"
                onPress={() => {
                  Linking.canOpenURL(getPlatformUrl() + "/contact").then(
                    (supported) => {
                      if (supported)
                        Linking.openURL(
                          `${getPlatformUrl()}/contact?${
                            client?.firstName
                              ? `&firstName=${client?.firstName}`
                              : ""
                          }${
                            client?.lastName
                              ? `&lastName=${client?.lastName}`
                              : ""
                          }${client?.email ? `&email=${client?.email}` : ""}${
                            client?.phone
                              ? `&phone=${client?.phone
                                  ?.replaceAll(" ", "")
                                  ?.replaceAll("(", "")
                                  ?.replaceAll(")", "")
                                  ?.replaceAll("-", "")}`
                              : ""
                          }&message=Please use <MY_APPOINTMENT_ADDRESS> as the location for my next housecall appointment. Thanks!`,
                        );
                    },
                  );
                }}
                style={tw`mb-8`}
              />
            ) : (
              <></>
            )}
          </>
        ) : null}
        <SubHeadingText>
          PET
          {appointment?.patients && appointment?.patients?.length > 1
            ? "S"
            : ""}
        </SubHeadingText>
        {appointment?.patients?.map((patient: Patient, index: number) => (
          <Container key={index} style={tw`flex-row`}>
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
                <HeadingText style={tw`text-movet-black text-lg`}>
                  {patient.name}
                  {__DEV__ && ` - #${patient.id}`}
                </HeadingText>
                <BodyText style={tw`text-movet-black text-sm -mt-0.5`}>
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
                  <ItalicText style={tw`text-movet-black text-xs ml-1`}>
                    {patient.birthday}
                  </ItalicText>
                </Container>
              </Container>
            </View>
          </Container>
        ))}
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
        {appointment?.illnessDetails && (
          <>
            <SubHeadingText style={tw`mt-2`}>ILLNESS REPORT</SubHeadingText>
            <ItalicText style={tw`mb-4`}>
              {appointment?.illnessDetails.trim().slice(0, -1)}
            </ItalicText>
          </>
        )}
        {appointment?.additionalNotes && (
          <>
            <SubHeadingText style={tw`mt-2`}>ADDITIONAL NOTES</SubHeadingText>
            <ItalicText style={tw`mb-4`}>
              {appointment?.additionalNotes}
            </ItalicText>
          </>
        )}
        {appointment?.location === "TELEHEALTH" &&
          appointment?.start?.toDate() >= new Date() && (
            <ItalicText style={tw`text-sm text-center mt-4`}>
              * Virtual Consultations are performed via a secure third party web
              application. A modern web browser with camera and microphone
              permissions enabled is required.
            </ItalicText>
          )}
        <Modal
          isVisible={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
          }}
          title={isLoading ? "Canceling Appointment" : "Cancel Appointment"}
        >
          {isLoading ? (
            <ItalicText
              style={[
                isTablet ? tw`text-sm` : tw`text-xs`,
                tw`mt-2 text-center`,
              ]}
            >
              We are canceling your appointment. Please wait...
            </ItalicText>
          ) : (
            <>
              <BodyText
                style={[isTablet ? tw`text-xl` : tw`text-lg`, tw`text-center`]}
              >
                Are you sure you want to cancel this appointment?
              </BodyText>
              <BodyText
                style={[
                  isTablet ? tw`text-lg` : tw`text-sm`,
                  tw`text-center mt-2 mb-4`,
                ]}
              >
                If so, please let us know why you are canceling:
              </BodyText>
              <TextInput
                editable={!isLoading}
                control={control}
                error={(errors["cancellationReason"] as any)?.message as string}
                name="cancellationReason"
                required={false}
                multiline
                numberOfLines={4}
                placeholder="Reason for Cancelation..."
              />
              <ItalicText
                style={[
                  isTablet ? tw`text-sm` : tw`text-xs`,
                  tw`mt-4 text-center`,
                ]}
              >
                * A $60 cancellation fee will be charged if cancellation occurs
                within 24 hours of your appointment.
              </ItalicText>
              <Container style={[tw`flex-row justify-center sm:mb-2 mt-4`]}>
                <SubmitButton
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  disabled={!isDirty || isLoading}
                  loading={isLoading}
                  title={
                    isLoading
                      ? "Canceling Appointment..."
                      : "Yes, Cancel My Appointment"
                  }
                  color="red"
                  iconName="check"
                />
              </Container>
            </>
          )}
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
        ) : appointment?.location === "TELEHEALTH" &&
          appointment?.start?.toDate() >= new Date() ? (
          <Container
            style={
              appointment?.telemedicineUrl
                ? tw`flex-col sm:flex-row justify-around w-full mt-4 mb-8`
                : tw`w-full flex-col items-center justify-center mt-4 mb-8`
            }
          >
            {appointment?.telemedicineUrl && (
              <ActionButton
                title="START CONSULTATION"
                iconName="arrow-right"
                onPress={() =>
                  openUrlInWebBrowser(
                    appointment?.telemedicineUrl as string,
                    isDarkMode,
                    {
                      dismissButtonStyle: "close",
                      enableBarCollapsing: true,
                      enableDefaultShareMenuItem: false,
                      readerMode: true,
                      showTitle: false,
                    },
                  )
                }
                style={tw`sm:w-2.75/6`}
              />
            )}
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
          <Container style={tw`my-4`} />
        )}
      </View>
    </Screen>
  );
};
