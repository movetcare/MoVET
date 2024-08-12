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
import { functions } from "firebase-config";
import { ErrorStore } from "stores/ErrorStore";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";
import { Patient, PatientsStore } from "stores/PatientsStore";
import { Modal } from "./Modal";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import {
  AuthStore,
  Appointment,
  AppointmentsStore,
  InvoicesStore,
} from "stores";
import { getPlatformUrl } from "utils/getPlatformUrl";
import { useForm } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { openUrlInWebBrowser } from "utils/openUrlInWebBrowser";
import { PaymentMethodSummary } from "./home/PaymentMethodSummary";
import type { Invoice } from "stores";
import { CountdownTimer } from "./CountDownTimer";

export const AppointmentDetail = () => {
  const { id } = useLocalSearchParams();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const { client } = AuthStore.useState();
  const { patients: patientsData } = PatientsStore.useState();
  const { invoices } = InvoicesStore.useState();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const isDarkMode = useColorScheme() !== "light";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [didConfirm, setDidConfirm] = useState<boolean>(false);
  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);

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
    if (didConfirm && appointment) {
      setIsLoading(true);
      const updateAppointmentStatus = async () => {
        const updateAppointment = httpsCallable(functions, "updateAppointment");
        await updateAppointment({
          confirmed: true,
          id: appointment.id,
        })
          .then(async (result: any) => {
            if (!result.data)
              setError({
                message: "Failed to confirm appointment, please try again",
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
      updateAppointmentStatus();
    }
  }, [appointment, didConfirm]);

  useEffect(() => {
    if (
      mapCoordinates === null &&
      (appointment?.notes?.includes("Appointment Location:") ||
        appointment?.address)
    ) {
      setIsLoading(true);
      fetch(
        `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(
          appointment?.address ||
            appointment?.notes
              ?.split("-")[1]
              ?.split("|")[0]
              .split("(")[0]
              ?.trim(),
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
  }, [
    mapCoordinates,
    appointment?.notes,
    client.address,
    appointment?.locationType,
    appointment?.address,
  ]);

  useEffect(() => {
    if (id) {
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
          appointment?.patients?.forEach((patient: any) =>
            patientsData?.forEach((patientData: Patient) => {
              if (patientData?.id === patient.id) {
                appointmentPatients.push(patientData);
              }
            }),
          );
          setAppointment({
            ...appointment,
            patients: appointmentPatients,
          });
        }
      });
    }
  }, [id, pastAppointments, upcomingAppointments, patientsData]);

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

  useEffect(() => {
    if (appointment?.invoice && invoices) {
      invoices.forEach((invoice: any) => {
        if (Number(invoice.id) === Number(appointment?.invoice)) {
          setInvoice(invoice);
          if (invoice.paymentStatus === "succeeded") setPaymentComplete(true);
        }
      });
    }
  }, [appointment?.invoice, invoices]);

  return (
    <Screen>
      {appointment?.locationType === "Virtually" && (
        <Stack.Screen options={{ title: "Virtual Consultation" }} />
      )}
      {appointment?.start?.toDate() >= new Date() && (
        <Container style={tw`mt-4`}>
          <PaymentMethodSummary
            titleSize={"sm"}
            title="PAYMENT METHOD REQUIRED"
            message="Tap here to add a payment method to your account before your appointment begins."
          />
        </Container>
      )}
      {appointment?.status === "IN-ROUTE" && (
        <View
          style={[
            isTablet ? tw`px-16` : tw`px-4`,
            tw`flex-row rounded-xl bg-transparent`,
          ]}
          noDarkMode
        >
          <View
            style={[
              isLoading ? tw`bg-movet-black/60` : tw`bg-movet-yellow`,
              tw`pr-4 pt-2 pb-3 rounded-xl flex-row items-center dark:border-2 dark:border-movet-white w-full shadow-lg shadow-movet-black dark:shadow-movet-white`,
            ]}
            noDarkMode
          >
            <Container style={tw`px-4`}>
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={tw.color("movet-white")}
                />
              ) : (
                <Icon name="user-medical-message" size="sm" color="white" />
              )}
            </Container>
            <Container style={tw`flex-shrink`}>
              <HeadingText style={tw`text-movet-white text-base`} noDarkMode>
                We&apos;re on our way!
              </HeadingText>
              <BodyText style={tw`text-movet-white text-sm -mt-0.5`} noDarkMode>
                {appointment?.user?.name
                  ? appointment.user.name
                  : "a MoVET Expert"}
                {appointment?.additionalUsers[0]?.name
                  ? ` & ${appointment?.additionalUsers[0]?.name}`
                  : ""}{" "}
                is on their way to your location. See you soon!
              </BodyText>
            </Container>
          </View>
        </View>
      )}
      <View
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-grow items-center justify-center w-full bg-transparent`,
        ]}
        noDarkMode
      >
        <Container style={tw`p-3`}>
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
            height={100}
            width={100}
          />
        </Container>
        {__DEV__ && <BodyText>ID: {appointment?.id}</BodyText>}
        <HeadingText style={tw`text-center mb-1`}>
          {(appointment?.reason as string)?.includes("provet")
            ? "Exam"
            : (appointment?.reason as string)}
        </HeadingText>
        <SubHeadingText style={tw`text-lg mb-1`}>
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
        <SubHeadingText
          style={tw`text-center${appointment?.confirmed ? " mb-1" : " mb-4"}`}
        >
          with{" "}
          {appointment?.user?.name ? appointment.user.name : "a MoVET Expert"}
          {appointment?.additionalUsers[0]?.name
            ? ` & ${appointment?.additionalUsers[0]?.name}`
            : ""}
        </SubHeadingText>
        {appointment?.confirmed && (
          <>
            <View
              style={tw`flex-row items-center justify-center${
                appointment?.start?.toDate() >= new Date() &&
                appointment?.status === "PENDING"
                  ? ""
                  : " mb-4"
              }`}
            >
              <Icon name="check" size="xxs" />
              <ItalicText style={tw`text-center ml-0.5 text-sm`}>
                {appointment?.locationType === "Clinic"
                  ? "Checked In"
                  : (appointment?.locationType !== "Virtually"
                      ? "Appointment"
                      : "Consultation") + " Confirmed"}
              </ItalicText>
            </View>
            {appointment?.start?.toDate() >= new Date() &&
              appointment?.status === "PENDING" && (
                <View
                  style={tw`flex-row items-center justify-center mb-4`}
                  noDarkMode
                >
                  <CountdownTimer
                    targetDate={appointment?.start?.toDate()}
                    style={tw`text-movet-black dark:text-movet-white text-xs`}
                  />
                </View>
              )}
          </>
        )}
        {appointment?.notes?.includes("Appointment Location:") ? (
          <>
            <SubHeadingText style={tw`mt-2`}>
              APPOINTMENT LOCATION
            </SubHeadingText>
            <Container style={tw`mb-4`}>
              {appointment?.notes?.split("-")[1]?.split("|")[0]?.trim() && (
                <ItalicText style={tw`text-center`}>
                  {appointment?.notes
                    ?.split("-")[1]
                    ?.split("(")[0]
                    ?.trim()
                    ?.split("|")[0]
                    ?.trim()}
                </ItalicText>
              )}
              {appointment?.notes
                ?.split("-")[1]
                ?.split("|")[0]
                ?.trim()
                .split("(")[1]
                ?.split(")")[0]
                ?.trim() && (
                <ItalicText style={tw`text-center text-sm`}>
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
            </Container>
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
        ) : appointment?.locationType === "Home" && client?.address ? (
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
        ) : appointment?.locationType === "Home" && !client?.address ? (
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
        {appointment?.patients?.map((patient: Patient, index: number) => {
          const [month, day, year] = patient.birthday.split("-");
          const birthday = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
          );
          const yearsAgo = (date: Date) => {
            const now = new Date();
            const years = now.getFullYear() - date.getFullYear();

            if (
              now.getMonth() < date.getMonth() ||
              (now.getMonth() === date.getMonth() &&
                now.getDate() < date.getDate())
            ) {
              return years - 1;
            } else {
              return years;
            }
          };
          return (
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
                        patient?.species?.toLowerCase()?.includes("dog") ||
                        patient?.species?.toLowerCase()?.includes("canine")
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
                  </HeadingText>
                  <BodyText style={tw`text-movet-black text-sm -mt-0.5`}>
                    {patient.breed}
                  </BodyText>
                  <Container style={tw`flex-row items-center`}>
                    <Icon
                      name={
                        patient?.gender?.toLowerCase()?.includes("female") ||
                        patient?.gender?.toLowerCase()?.includes("female,")
                          ? "female"
                          : "male"
                      }
                      size="xxs"
                    />
                    <ItalicText style={tw`text-movet-black text-xs ml-1`}>
                      {yearsAgo(birthday)} Years Old
                    </ItalicText>
                  </Container>
                </Container>
              </View>
            </Container>
          );
        })}
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
        {invoice && (
          <>
            <SubHeadingText style={tw`mt-2`}>INVOICE SUMMARY</SubHeadingText>
            {__DEV__ && <BodyText>#{invoice?.id}</BodyText>}
          </>
        )}
        <View style={tw`mb-4 w-full`}>
          {invoice &&
            invoice?.items.map((item: any, index: number) => (
              <View
                key={index}
                style={tw`w-full flex-row items-center justify-between${index !== invoice?.items.length - 1 ? " border-b-2 border-movet-gray/50" : ""}`}
              >
                <BodyText style={tw`text-sm my-2`}>
                  {item.name}
                  {item.quantity > 1 && ` x ${item.quantity}`}
                </BodyText>
                <BodyText style={tw`text-sm my-2`}>
                  ${item.total?.toFixed(2)}
                </BodyText>
              </View>
            ))}
          {invoice && (
            <>
              <View style={tw`flex-row items-center justify-between`}>
                <ItalicText style={tw`text-sm mb-2 mt-4`}>Subtotal</ItalicText>
                <ItalicText style={tw`text-sm mb-2 mt-4`}>
                  ${invoice?.amountDue?.toFixed(2)}
                </ItalicText>
              </View>
              <View style={tw`flex-row items-center justify-between`}>
                <ItalicText style={tw`text-sm mb-2`}>Tax</ItalicText>
                <ItalicText style={tw`text-sm mb-2`}>
                  ${invoice?.taxDue?.toFixed(2)}
                </ItalicText>
              </View>
              <View
                style={tw`flex-row items-center justify-between${paymentComplete ? " border-t-2 border-movet-gray/50 pt-2" : ""}`}
              >
                <SubHeadingText
                  style={tw`${paymentComplete ? "text-base" : "text-lg"}`}
                >
                  Total
                  {paymentComplete
                    ? invoice?.payments[0]?.paymentMethod
                      ? ` Paid w/ ${invoice?.payments[0]?.paymentMethod}`
                      : " Paid"
                    : " Due"}
                </SubHeadingText>
                <SubHeadingText
                  style={tw`text-lg${paymentComplete ? " text-movet-green" : " text-movet-red"}`}
                  noDarkMode
                >
                  ${invoice?.totalDue?.toFixed(2)}
                </SubHeadingText>
              </View>
            </>
          )}
        </View>
        {paymentComplete && (
          <Container
            style={tw`flex-col items-center justify-center w-full mt-4`}
          >
            <ItalicText style={tw`text-xl mb-2`}>
              How was your experience?
            </ItalicText>
            <ItalicText style={tw`text-center mb-2 text-sm`}>
              Online reviews from great clients like you help others to feel
              confident about choosing MoVET and will help our business grow.
            </ItalicText>
            <ActionButton
              title="Leave a Review"
              color="black"
              iconName="star"
              onPress={() => {
                Linking.canOpenURL(getPlatformUrl() + "/contact").then(
                  (supported) => {
                    if (supported)
                      Linking.openURL(
                        "https://g.page/r/CbtAdHSVgeMfEAE/review",
                      );
                  },
                );
              }}
            />
          </Container>
        )}
        {appointment?.locationType === "Virtually" &&
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
              style={[isTablet ? tw`text-base` : tw`text-sm`, tw`text-center`]}
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
        {appointment &&
          !appointment.confirmed &&
          appointment?.start?.toDate() >= new Date() && (
            <ActionButton
              color="blue"
              title={
                appointment?.locationType === "Clinic"
                  ? "Check In"
                  : `Confirm ${
                      appointment?.locationType !== "Virtually"
                        ? "Appointment"
                        : "Consultation"
                    }`
              }
              iconName={"check"}
              onPress={() => setDidConfirm(!appointment.confirmed)}
              loading={isLoading}
            />
          )}
        {appointment?.locationType === "Clinic" &&
        appointment?.start?.toDate() >= new Date() &&
        appointment?.status === "PENDING" ? (
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
        ) : appointment?.locationType === "Virtually" &&
          appointment?.start?.toDate() >= new Date() ? (
          <Container
            style={
              appointment?.telemedicineUrl
                ? tw`flex-col sm:flex-row sm:flex-row-reverse justify-around w-full mt-4 mb-8`
                : tw`w-full flex-col items-center justify-center mt-4 mb-8`
            }
          >
            {appointment?.telemedicineUrl && (
              <ActionButton
                title="Start Consultation"
                iconName="paw"
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
            {appointment?.status === "PENDING" && (
              <ActionButton
                color="black"
                title="Cancel Consultation"
                iconName="cancel"
                onPress={() => setShowCancelModal(true)}
                style={tw`sm:w-2.75/6`}
              />
            )}
          </Container>
        ) : appointment?.start?.toDate() >= new Date() &&
          appointment?.status === "PENDING" ? (
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
