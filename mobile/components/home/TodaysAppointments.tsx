import {
  SubHeadingText,
  HeadingText,
  Icon,
  View,
  ItalicText,
  Container,
  BodyText,
  ActionButton,
  SubmitButton,
  TextInput,
} from "components/themed";
import { router } from "expo-router";
import {
  TouchableOpacity,
  useColorScheme,
  Image,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import tw from "tailwind";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { Appointment, AppointmentsStore, ErrorStore } from "stores";
import MapView, { Marker } from "react-native-maps";
import { isTablet } from "utils/isTablet";
import { functions } from "firebase-config";
import { httpsCallable } from "firebase/functions";
import { useForm } from "react-hook-form";
import { Modal } from "components/Modal";
import { openUrlInWebBrowser } from "utils/openUrlInWebBrowser";
import { getPlatformUrl } from "utils/getPlatformUrl";
import { CountdownTimer } from "components/CountDownTimer";

export const TodaysAppointments = () => {
  const { upcomingAppointments }: any = AppointmentsStore.useState();
  const [todaysAppointments, setTodaysAppointments] =
    useState<Array<Appointment> | null>(null);

  useEffect(() => {
    if (upcomingAppointments && upcomingAppointments.length > 0) {
      const todaysAppointments: Array<Appointment> = [];
      upcomingAppointments.map((appointment: Appointment) => {
        if (
          new Date((appointment.start as any)?.toDate()).toDateString() ===
          new Date().toDateString()
        )
          todaysAppointments.push(appointment);
      });
      console.log(todaysAppointments);
      setTodaysAppointments(todaysAppointments);
    }
  }, [upcomingAppointments]);

  return todaysAppointments && todaysAppointments.length > 0 ? (
    <>
      <SubHeadingText style={tw`text-2xl w-full mb-2 text-center`}>
        Today&apos;s Appointment{todaysAppointments.length > 1 && "s"}
      </SubHeadingText>
      {todaysAppointments.map((appointment: Appointment, index: number) => (
        <Container key={index} style={tw`w-full`}>
          {appointment?.status === "PENDING" ||
          appointment?.status === undefined ? (
            <UpcomingAppointment appointment={appointment} />
          ) : appointment?.status === "IN-ROUTE" ? (
            <InRouteAppointment appointment={appointment} />
          ) : appointment?.status === "IN-PROGRESS" ? (
            <InProgressAppointment appointment={appointment} />
          ) : appointment?.status === "AWAITING-PAYMENT" ? (
            <InvoiceReady appointment={appointment} />
          ) : appointment?.status === "COMPLETE" ? (
            <InvoicePaid appointment={appointment} />
          ) : null}
        </Container>
      ))}
    </>
  ) : (
    <></>
  );
};

const UpcomingAppointment = ({ appointment }: { appointment: Appointment }) => {
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [didConfirm, setDidConfirm] = useState<boolean>(false);
  const isDarkMode = useColorScheme() !== "light";
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
    if (didConfirm) {
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
  }, [appointment.id, didConfirm]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const updateAppointment = httpsCallable(functions, "updateAppointment");
    await updateAppointment({
      cancellation_reason_text: data.cancellationReason,
      cancellation_reason: data.reasonId,
      active: 0,
      id: appointment.id,
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
    <View noDarkMode style={tw`mb-4`}>
      <TouchableOpacity
        onPress={() =>
          router.navigate({
            pathname: `/(app)/home/appointment-detail/`,
            params: { id: appointment.id },
          })
        }
        style={tw`rounded-xl w-full ${isTablet ? "px-16" : "px-4"}`}
      >
        <View
          style={tw`flex-row rounded-t-xl p-4 mt-2 items-center w-full bg-movet-blue justify-between`}
          noDarkMode
        >
          <View
            style={tw`bg-movet-blue flex-1 justify-center items-center`}
            noDarkMode
          >
            <View
              style={tw`my-4 flex-row justify-center bg-movet-blue`}
              noDarkMode
            >
              {appointment.patients.map((patient: any, index: number) =>
                patient.photoUrl ? (
                  <Image
                    key={index}
                    source={{
                      uri: patient.photoUrl,
                    }}
                    alt={`${patient.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : (
                  <View
                    key={index}
                    style={tw`flex-col items-center justify-center bg-transparent`}
                    noDarkMode
                  >
                    <View
                      style={tw`bg-movet-white/90 rounded-full p-4 mx-2`}
                      noDarkMode
                    >
                      <Icon key={index} name="dog" size="lg" noDarkMode />
                    </View>
                    <ItalicText
                      noDarkMode
                      style={tw`text-movet-white mt-1 -mb-2`}
                    >
                      {patient.name}
                    </ItalicText>
                  </View>
                ),
              )}
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              {appointment.reason as any}
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              {appointment?.start?.toDate()?.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
              {appointment?.locationType === "Home"
                ? ` @ ${appointment?.address?.split(",")?.slice(0, 1)?.join(",")}`
                : appointment?.locationType === "Clinic"
                  ? " @ Belleview Station"
                  : ""}
            </SubHeadingText>
            {/* {appointment?.user?.picture && (
              <View
                style={tw`my-4 flex-row items-center justify-center bg-movet-blue`}
                noDarkMode
              >
                {appointment?.user?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.user?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
                {appointment?.additionalUsers &&
                appointment?.additionalUsers[0]?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.additionalUsers[0]?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
              </View>
            )} */}
            <SubHeadingText style={tw`text-movet-white text-center`} noDarkMode>
              with{" "}
              {appointment?.user?.name
                ? appointment.user.name
                : "a MoVET Expert"}
              {appointment?.additionalUsers[0]?.name
                ? ` & ${appointment?.additionalUsers[0]?.name}`
                : ""}
            </SubHeadingText>
            {appointment.confirmed && (
              <>
                <View
                  style={tw`flex-row items-center justify-center bg-movet-blue mt-2`}
                  noDarkMode
                >
                  <Icon name="check" size="xxs" color="white" />
                  <ItalicText
                    style={tw`text-movet-white text-center ml-0.5 text-sm`}
                    noDarkMode
                  >
                    {appointment?.locationType === "Clinic"
                      ? "Checked In"
                      : (appointment?.locationType !== "Virtually"
                          ? "Appointment"
                          : "Consultation") + " Confirmed"}
                  </ItalicText>
                </View>
                <View
                  style={tw`flex-row items-center justify-center bg-movet-blue`}
                  noDarkMode
                >
                  <CountdownTimer
                    targetDate={appointment?.start?.toDate()}
                    style={tw`text-movet-white text-xs`}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
      {!appointment.confirmed && (
        <View
          style={tw`bg-movet-blue px-8 pb-4 flex-col items-center justify-center ${isTablet ? "mx-16" : "mx-4"}`}
          noDarkMode
        >
          <ActionButton
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
            color={"red"}
            onPress={() => setDidConfirm(!appointment.confirmed)}
            loading={isLoading}
          />
          {!appointment.confirmed && (
            <ActionButton
              type="text"
              title={`Cancel ${
                appointment?.locationType !== "Virtually"
                  ? "Appointment"
                  : "Consultation"
              }`}
              iconName="cancel"
              onPress={() => setShowCancelModal(true)}
              textStyle={tw`text-movet-white/50 text-sm`}
              style={tw`mt-2`}
            />
          )}
        </View>
      )}
      {appointment.confirmed && appointment?.telemedicineUrl && (
        <View
          style={tw`bg-movet-blue px-8 pb-4 flex-col items-center justify-center ${isTablet ? "mx-16" : "mx-4"}`}
          noDarkMode
        >
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
        </View>
      )}
      <View
        style={tw`flex-row items-center justify-center rounded-b-xl bg-movet-blue ${isTablet ? "mx-16" : "mx-4"}`}
        noDarkMode
      >
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:+17205077387`)}
          style={tw`w-4/12 pb-2`}
        >
          <View
            style={tw`flex-row px-4 py-2 items-center bg-movet-blue justify-center`}
            noDarkMode
          >
            <Icon name="phone" height={20} width={20} color="white" />
            <View style={tw`bg-movet-blue ml-4`} noDarkMode>
              <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                Call
              </SubHeadingText>
            </View>
          </View>
        </TouchableOpacity>
        {appointment?.locationType !== "Clinic" && (
          <View style={tw`w-2/12`} noDarkMode />
        )}
        <TouchableOpacity
          onPress={() => Linking.openURL(`sms:+17205077387`)}
          style={tw`w-4/12 pb-2`}
        >
          <View
            style={tw`flex-row px-4 py-2 items-center bg-movet-blue justify-center `}
            noDarkMode
          >
            <Icon name="sms" height={20} width={20} color="white" />
            <View style={tw`bg-movet-blue ml-4`} noDarkMode>
              <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                Text
              </SubHeadingText>
            </View>
          </View>
        </TouchableOpacity>
        {appointment?.locationType === "Clinic" && (
          <TouchableOpacity
            onPress={() => {
              const scheme = Platform.select({
                ios: "maps:0,0?q=",
                android: "geo:0,0?q=",
              });
              const latLng = "39.6252378,-104.9067691";
              const label = "MoVET Clinic - 4912 S Newport St Denver, CO 80237";
              const url: any = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`,
              });
              Linking.canOpenURL(url).then((supported) => {
                if (supported) Linking.openURL(url);
              });
            }}
            style={tw`w-4/12 pb-2`}
          >
            <View
              style={tw`flex-row px-4 py-2 items-center bg-movet-blue justify-center `}
              noDarkMode
            >
              <Icon name="map" height={20} width={20} color="white" />
              <View style={tw`bg-movet-blue ml-4`} noDarkMode>
                <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                  Map
                </SubHeadingText>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
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
                isTablet ? tw`text-base` : tw`text-sm`,
                tw`mt-4 text-center text-movet-red`,
              ]}
              noDarkMode
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
    </View>
  );
};

const InRouteAppointment = ({ appointment }: { appointment: Appointment }) => {
  const isDarkMode = useColorScheme() !== "light";
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [didConfirm, setDidConfirm] = useState<boolean>(false);
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
      (appointment?.address ||
        appointment?.notes?.split("-")[1]?.split("|")[0]?.split("(")[0]?.trim())
    ) {
      setIsLoading(true);
      fetch(
        `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(
          appointment?.address ||
            appointment?.notes
              ?.split("-")[1]
              ?.split("|")[0]
              ?.split("(")[0]
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
  }, [appointment?.address, appointment?.notes, mapCoordinates]);

  useEffect(() => {
    if (didConfirm) {
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
  }, [appointment.id, didConfirm]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const updateAppointment = httpsCallable(functions, "updateAppointment");
    await updateAppointment({
      cancellation_reason_text: data.cancellationReason,
      cancellation_reason: data.reasonId,
      active: 0,
      id: appointment.id,
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
    <View noDarkMode style={tw`mb-4`}>
      <TouchableOpacity
        onPress={() =>
          router.navigate({
            pathname: `/(app)/home/appointment-detail/`,
            params: { id: appointment.id },
          })
        }
        style={tw`rounded-xl w-full ${isTablet ? "px-16" : "px-4"}`}
      >
        <View
          style={tw`flex-row rounded-t-xl p-4 mt-2 items-center w-full bg-movet-yellow justify-between`}
          noDarkMode
        >
          <View
            style={tw`bg-movet-yellow flex-1 justify-center items-center`}
            noDarkMode
          >
            <View
              style={tw`my-4 flex-row items-center justify-center bg-movet-yellow`}
              noDarkMode
            >
              {appointment.patients.map((patient: any, index: number) =>
                patient.photoUrl ? (
                  <Image
                    key={index}
                    source={{
                      uri: patient.photoUrl,
                    }}
                    alt={`${patient.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : (
                  <View
                    key={index}
                    style={tw`flex-col items-center justify-center bg-transparent`}
                    noDarkMode
                  >
                    <View
                      style={tw`bg-movet-white/90 rounded-full p-4`}
                      noDarkMode
                    >
                      <Icon key={index} name="dog" size="lg" />
                    </View>
                    <ItalicText
                      noDarkMode
                      style={tw`text-movet-white mt-1 -mb-2`}
                    >
                      {patient.name}
                    </ItalicText>
                  </View>
                ),
              )}
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              {appointment.reason as any}
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              {appointment?.start?.toDate()?.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
              {appointment?.locationType === "Home"
                ? ` @ ${appointment?.address?.split(",")?.slice(0, 1)?.join(",")}`
                : appointment?.locationType === "Clinic"
                  ? " @ Belleview Station"
                  : ""}
            </SubHeadingText>
            {/* {appointment?.user?.picture && (
              <View
                style={tw`my-4 flex-row items-center justify-center bg-movet-yellow`}
                noDarkMode
              >
                {appointment?.user?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.user?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
                {appointment?.additionalUsers &&
                appointment?.additionalUsers[0]?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.additionalUsers[0]?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
              </View>
            )} */}
            <SubHeadingText style={tw`text-movet-white text-center`} noDarkMode>
              with{" "}
              {appointment?.user?.name
                ? appointment.user.name
                : "a MoVET Expert"}
              {appointment?.additionalUsers[0]?.name
                ? ` & ${appointment?.additionalUsers[0]?.name}`
                : ""}
            </SubHeadingText>
            {appointment.confirmed && (
              <View
                style={tw`flex-row items-center justify-center bg-movet-yellow mt-2 mb-4`}
                noDarkMode
              >
                <Icon name="check" size="xxs" color="white" />
                <ItalicText
                  style={tw`text-movet-white text-center ml-0.5 text-sm`}
                  noDarkMode
                >
                  {appointment?.locationType !== "Virtually"
                    ? "Appointment"
                    : "Consultation"}{" "}
                  Confirmed
                </ItalicText>
              </View>
            )}
            <View style={tw`my-2 border-t-2 border-movet-gray w-full`} />
            <SubHeadingText
              style={tw`text-movet-white text-center mt-2 text-lg`}
              noDarkMode
            >
              Current Status
            </SubHeadingText>
            <ItalicText style={tw`text-lg text-movet-white mb-2`} noDarkMode>
              IN ROUTE TO YOUR LOCATION...
            </ItalicText>
            {mapCoordinates !== null && !isLoading && (
              <View
                style={tw`
              flex-row w-full h-60 self-center overflow-hidden border-2 border-movet-yellow/50 rounded-xl
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
            {appointment?.notes
              ?.split("-")[1]
              ?.split("|")[0]
              ?.trim()
              .split("(")[1]
              ?.split(")")[0]
              ?.trim() && (
              <ItalicText
                style={tw`mt-2 text-movet-white text-center`}
                noDarkMode
              >
                &quot;
                {appointment?.notes
                  ?.split("-")[1]
                  ?.split("|")[0]
                  ?.trim()
                  .split("(")[1]
                  ?.split(")")[0]
                  ?.trim()}
                &quot;
              </ItalicText>
            )}
          </View>
        </View>
      </TouchableOpacity>
      {!appointment.confirmed && (
        <View
          style={tw`bg-movet-yellow px-8 pb-4 flex-col items-center justify-center ${isTablet ? "mx-16" : "mx-4"}`}
          noDarkMode
        >
          <ActionButton
            title={`Confirm ${
              appointment?.locationType !== "Virtually"
                ? "Appointment"
                : "Consultation"
            }`}
            iconName={"paw"}
            color={"red"}
            onPress={() => setDidConfirm(!appointment.confirmed)}
            loading={isLoading}
          />
          {!appointment.confirmed && (
            <ActionButton
              type="text"
              title={`Cancel ${
                appointment?.locationType !== "Virtually"
                  ? "Appointment"
                  : "Consultation"
              }`}
              iconName="cancel"
              onPress={() => setShowCancelModal(true)}
              textStyle={tw`text-movet-white/90 text-sm`}
              style={tw`mt-2`}
            />
          )}
        </View>
      )}
      <View
        style={tw`flex-row items-center justify-center rounded-b-xl bg-movet-yellow ${isTablet ? "mx-16" : "mx-4"}`}
        noDarkMode
      >
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:+17205077387`)}
          style={tw`w-4/12 pb-2`}
        >
          <View
            style={tw`flex-row px-4 py-2 items-center bg-movet-yellow justify-center`}
            noDarkMode
          >
            <Icon name="phone" height={20} width={20} color="white" />
            <View style={tw`bg-movet-yellow ml-4`} noDarkMode>
              <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                Call
              </SubHeadingText>
            </View>
          </View>
        </TouchableOpacity>
        <View style={tw`w-2/12`} noDarkMode />
        <TouchableOpacity
          onPress={() => Linking.openURL(`sms:+17205077387`)}
          style={tw`w-4/12 pb-2`}
        >
          <View
            style={tw`flex-row px-4 py-2 items-center bg-movet-yellow justify-center `}
            noDarkMode
          >
            <Icon name="sms" height={20} width={20} color="white" />
            <View style={tw`bg-movet-yellow ml-4`} noDarkMode>
              <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                Text
              </SubHeadingText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
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
                isTablet ? tw`text-base` : tw`text-sm`,
                tw`mt-4 text-center text-movet-red`,
              ]}
              noDarkMode
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
    </View>
  );
};

const InProgressAppointment = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  return (
    <View noDarkMode style={tw`mb-4`}>
      <TouchableOpacity
        onPress={() =>
          router.navigate({
            pathname: `/(app)/home/appointment-detail/`,
            params: { id: appointment.id },
          })
        }
        style={tw`rounded-xl w-full px-4`}
      >
        <View
          style={tw`flex-row rounded-xl p-4 mt-2 items-center w-full bg-movet-green justify-between`}
          noDarkMode
        >
          <View
            style={tw`bg-movet-green flex-1 justify-center items-center`}
            noDarkMode
          >
            <View
              style={tw`my-4 flex-row items-center justify-center bg-movet-green`}
              noDarkMode
            >
              {appointment.patients.map((patient: any, index: number) =>
                patient.photoUrl ? (
                  <Image
                    key={index}
                    source={{
                      uri: patient.photoUrl,
                    }}
                    alt={`${patient.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : (
                  <View
                    key={index}
                    style={tw`flex-col items-center justify-center bg-transparent`}
                    noDarkMode
                  >
                    <View
                      style={tw`bg-movet-white/90 rounded-full p-4 mx-2`}
                      noDarkMode
                    >
                      <Icon key={index} name="dog" size="lg" noDarkMode />
                    </View>
                    <ItalicText
                      noDarkMode
                      style={tw`text-movet-white mt-1 -mb-2`}
                    >
                      {patient.name}
                    </ItalicText>
                  </View>
                ),
              )}
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              {appointment.reason as any}
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              {appointment?.start?.toDate()?.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
              {appointment?.locationType === "Home"
                ? ` @ ${appointment?.address?.split(",")?.slice(0, 1)?.join(",")}`
                : appointment?.locationType === "Clinic"
                  ? " @ Belleview Station"
                  : ""}
            </SubHeadingText>
            {/* {appointment?.user?.picture && (
              <View
                style={tw`my-4 flex-row items-center justify-center bg-movet-green`}
                noDarkMode
              >
                {appointment?.user?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.user?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
                {appointment?.additionalUsers &&
                appointment?.additionalUsers[0]?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.additionalUsers[0]?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
              </View>
            )} */}
            <SubHeadingText
              style={tw`text-movet-white text-center mb-2`}
              noDarkMode
            >
              with{" "}
              {appointment?.user?.name
                ? appointment.user.name
                : "a MoVET Expert"}
              {appointment?.additionalUsers[0]?.name
                ? ` & ${appointment?.additionalUsers[0]?.name}`
                : ""}
            </SubHeadingText>
            <View style={tw`my-2 border-t-2 border-movet-gray w-full`} />
            <SubHeadingText
              style={tw`text-movet-white text-center mt-2 text-lg`}
              noDarkMode
            >
              Current Status
            </SubHeadingText>
            <ItalicText style={tw`text-xl text-movet-white mb-2`} noDarkMode>
              Appointment in Progress...
            </ItalicText>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const InvoiceReady = ({ appointment }: { appointment: Appointment }) => {
  return (
    <View noDarkMode style={tw`mb-4`}>
      <TouchableOpacity
        onPress={() =>
          router.navigate({
            pathname: `/(app)/home/invoice-detail/`,
            params: { id: appointment.invoice },
          })
        }
        style={tw`rounded-xl w-full px-4`}
      >
        <View
          style={tw`flex-row rounded-t-xl p-4 mt-2 items-center w-full bg-movet-red justify-between`}
          noDarkMode
        >
          <View
            style={tw`bg-movet-red flex-1 justify-center items-center`}
            noDarkMode
          >
            <View
              style={tw`my-4 flex-row items-center justify-center bg-movet-red`}
              noDarkMode
            >
              {appointment.patients.map((patient: any, index: number) =>
                patient.photoUrl ? (
                  <Image
                    key={index}
                    source={{
                      uri: patient.photoUrl,
                    }}
                    alt={`${patient.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : (
                  <View
                    key={index}
                    style={tw`flex-col items-center justify-center bg-transparent`}
                    noDarkMode
                  >
                    <View
                      style={tw`bg-movet-white/90 rounded-full p-4 mx-2`}
                      noDarkMode
                    >
                      <Icon key={index} name="dog" size="lg" noDarkMode />
                    </View>
                    <ItalicText
                      noDarkMode
                      style={tw`text-movet-white mt-1 -mb-2`}
                    >
                      {patient.name}
                    </ItalicText>
                  </View>
                ),
              )}
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              {appointment.reason as any}
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              {appointment?.start?.toDate()?.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
              {appointment?.locationType === "Home"
                ? ` @ ${appointment?.address?.split(",")?.slice(0, 1)?.join(",")}`
                : appointment?.locationType === "Clinic"
                  ? " @ Belleview Station"
                  : ""}
            </SubHeadingText>
            {/* {appointment?.user?.picture && (
              <View
                style={tw`my-4 flex-row items-center justify-center bg-movet-red`}
                noDarkMode
              >
                {appointment?.user?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.user?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
                {appointment?.additionalUsers &&
                appointment?.additionalUsers[0]?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.additionalUsers[0]?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
              </View>
            )} */}
            <SubHeadingText
              style={tw`text-movet-white text-center mb-2`}
              noDarkMode
            >
              with{" "}
              {appointment?.user?.name
                ? appointment.user.name
                : "a MoVET Expert"}
              {appointment?.additionalUsers[0]?.name
                ? ` & ${appointment?.additionalUsers[0]?.name}`
                : ""}
            </SubHeadingText>
            <View style={tw`my-2 border-t-2 border-movet-gray w-full`} />
            <SubHeadingText
              style={tw`text-movet-white text-center my-2 text-lg`}
              noDarkMode
            >
              Current Status
            </SubHeadingText>
            <SubHeadingText style={tw`text-movet-white`} noDarkMode>
              APPOINTMENT COMPLETE
            </SubHeadingText>
            <ItalicText style={tw`text-movet-white -mb-4`} noDarkMode>
              AWAITING PAYMENT...
            </ItalicText>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={tw`flex-row mx-4 items-center justify-center rounded-b-xl bg-movet-red`}
        noDarkMode
      >
        <View style={tw`bg-movet-red mb-6`} noDarkMode>
          <ActionButton
            title="Review & Pay Invoice"
            iconName={"folder-heart"}
            color={"black"}
            onPress={() =>
              router.navigate({
                pathname: `/(app)/home/invoice-detail/`,
                params: { id: appointment.invoice },
              })
            }
          />
        </View>
      </View>
    </View>
  );
};

const InvoicePaid = ({ appointment }: { appointment: Appointment }) => {
  return (
    <View noDarkMode style={tw`mb-4`}>
      <TouchableOpacity
        onPress={() =>
          router.navigate({
            pathname: `/(app)/home/appointment-detail/`,
            params: { id: appointment.id },
          })
        }
        style={tw`rounded-xl w-full px-4`}
      >
        <View
          style={tw`flex-row rounded-t-xl p-4 mt-2 items-center w-full bg-movet-black justify-between`}
          noDarkMode
        >
          <View
            style={tw`bg-movet-black flex-1 justify-center items-center`}
            noDarkMode
          >
            <View
              style={tw`my-4 flex-row items-center justify-center bg-movet-black`}
              noDarkMode
            >
              {appointment.patients.map((patient: any, index: number) =>
                patient.photoUrl ? (
                  <Image
                    key={index}
                    source={{
                      uri: patient.photoUrl,
                    }}
                    alt={`${patient.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : (
                  <View
                    key={index}
                    style={tw`flex-col items-center justify-center bg-transparent`}
                    noDarkMode
                  >
                    <View
                      style={tw`bg-movet-white/90 rounded-full p-4 mx-2`}
                      noDarkMode
                    >
                      <Icon key={index} name="dog" size="lg" noDarkMode />
                    </View>
                    <ItalicText
                      noDarkMode
                      style={tw`text-movet-white mt-1 -mb-2`}
                    >
                      {patient.name}
                    </ItalicText>
                  </View>
                ),
              )}
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              {appointment.reason as any}
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              {appointment?.start?.toDate()?.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
              {appointment?.locationType === "Home"
                ? ` @ ${appointment?.address?.split(",")?.slice(0, 1)?.join(",")}`
                : appointment?.locationType === "Clinic"
                  ? " @ Belleview Station"
                  : ""}
            </SubHeadingText>
            {/* {appointment?.user?.picture && (
              <View
                style={tw`my-4 flex-row items-center justify-center bg-movet-black`}
                noDarkMode
              >
                {appointment?.user?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.user?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
                {appointment?.additionalUsers &&
                appointment?.additionalUsers[0]?.picture ? (
                  <Image
                    source={{
                      uri: appointment?.additionalUsers[0]?.picture,
                    }}
                    alt={`${appointment?.user?.name}'s photo`}
                    height={75}
                    width={75}
                    style={tw`rounded-full mx-2`}
                  />
                ) : null}
              </View>
            )} */}
            <SubHeadingText
              style={tw`text-movet-white text-center mb-2`}
              noDarkMode
            >
              with{" "}
              {appointment?.user?.name
                ? appointment.user.name
                : "a MoVET Expert"}
              {appointment?.additionalUsers[0]?.name
                ? ` & ${appointment?.additionalUsers[0]?.name}`
                : ""}
            </SubHeadingText>
            <View style={tw`my-2 border-t-2 border-movet-gray w-full`} />
            <SubHeadingText
              style={tw`text-movet-white text-center mt-2 text-lg`}
              noDarkMode
            >
              Current Status
            </SubHeadingText>
            <ItalicText style={tw`text-xl text-movet-white`} noDarkMode>
              PAYMENT RECEIVED
            </ItalicText>
            <ItalicText style={tw`text-movet-white`} noDarkMode>
              No further action is required
            </ItalicText>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={tw`flex-row mx-4 items-center justify-center rounded-b-xl bg-movet-red`}
        noDarkMode
      >
        {/* <TouchableOpacity
          onPress={() => Linking.openURL(`tel:+17205077387`)}
          style={tw`w-4/12 pb-2`}
        >
          <View
            style={tw`flex-row px-4 py-2 items-center bg-movet-red justify-center`}
            noDarkMode
          >
            <Icon
              name="clipboard-medical"
              height={20}
              width={20}
              color="white"
            />
            <View style={tw`bg-movet-red ml-4`} noDarkMode>
              <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                Review Invoice
              </SubHeadingText>
            </View>
          </View>
        </TouchableOpacity> */}
        {/* <View style={tw`w-2/12 h-2`} noDarkMode /> */}
        <TouchableOpacity
          onPress={() => {
            Linking.canOpenURL(getPlatformUrl() + "/contact").then(
              (supported) => {
                if (supported)
                  Linking.openURL("https://g.page/r/CbtAdHSVgeMfEAE/review");
              },
            );
          }}
          // style={tw`w-4/12 pb-2`}
          style={tw`w-full p-2`}
        >
          <View
            style={tw`flex-row px-4 py-2 items-center bg-movet-red justify-center `}
            noDarkMode
          >
            <Icon name="star" height={20} width={20} color="white" />
            <View style={tw`bg-movet-red ml-2`} noDarkMode>
              <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                Leave a Review
              </SubHeadingText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};