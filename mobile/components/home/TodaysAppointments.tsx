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
      setTodaysAppointments(todaysAppointments);
    }
  }, [upcomingAppointments]);

  // useEffect(() => {
  //   if (todaysAppointments) console.log(todaysAppointments[0]?.patients);
  // }, [todaysAppointments]);

  return todaysAppointments && todaysAppointments.length > 0 ? (
    <>
      <SubHeadingText style={tw`text-2xl w-full mb-2 mt-4 text-center`}>
        Today&apos;s Appointment{todaysAppointments.length > 1 && "s"}
      </SubHeadingText>
      {todaysAppointments.map((appointment: Appointment, index: number) => (
        <Container key={index} style={tw`w-full`}>
          <UpcomingAppointment appointment={appointment} />
          {/* <InRouteAppointment appointment={appointment} />
            <InProgressAppointment appointment={appointment} />
            <InvoiceReady appointment={appointment} />
            <InvoicePaid appointment={appointment} /> */}
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
  }, [didConfirm]);

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
              style={tw`my-4 flex-row items-center justify-center bg-movet-blue`}
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
                    <SubHeadingText
                      noDarkMode
                      style={tw`text-movet-white mt-1 -mb-2`}
                    >
                      {patient.name}
                    </SubHeadingText>
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
            {appointment?.user?.picture && (
              <View
                style={tw`my-4 flex-row items-center justify-center bg-movet-blue`}
                noDarkMode
              >
                {/* <BodyText>{appointment?.user?.picture}</BodyText> */}
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
            )}
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
                style={tw`flex-row items-center justify-center bg-movet-blue mt-2`}
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
          </View>
        </View>
      </TouchableOpacity>
      {!appointment.confirmed && (
        <View
          style={tw`bg-movet-blue px-8 pb-4 flex-col items-center justify-center ${isTablet ? "mx-16" : "mx-4"}`}
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
              textStyle={tw`text-movet-white/50 text-sm`}
              style={tw`mt-2`}
            />
          )}
        </View>
      )}
      {appointment?.telemedicineUrl && (
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  useEffect(() => {
    if (mapCoordinates === null) {
      setIsLoading(true);
      fetch(
        `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(
          "4912 s Newport Street, Denver, CO 80202",
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
  }, [mapCoordinates]);

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
            params: { id: 4410 },
          })
        }
        style={tw`rounded-xl w-full px-4`}
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
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7383%2Fprofile?alt=media&token=7def96c7-1d02-44f4-a5cf-f9c3e8f0be0c",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7388%2Fprofile?alt=media&token=426012a2-42aa-4416-ba07-4d176c28e8c3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7383%2Fprofile?alt=media&token=7def96c7-1d02-44f4-a5cf-f9c3e8f0be0c",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              Exam - Medical / Sick
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              1:00PM @ 4246 Mcree Ave
            </SubHeadingText>
            <View
              style={tw`my-4 flex-row items-center justify-center bg-movet-yellow`}
              noDarkMode
            >
              <Image
                source={{
                  uri: "https://storage-us.provetcloud.com/provet/4285/users/2112c3c9a9544b3480f5350b9a9f17f0.jpeg?Expires=1720029050&Signature=UpvxoRrX6MRGbGV-xBbqsWGUGAbLfsNYAJBFiEHqGKENBnymrNWEbesHqMCupcUp4MKLc7EFWFWASMR8Mqzxqd~7amoThUcIYm1IS4gCwdqyRPoOjCpy1JE5f8-zhIqhZdaql1reuScUXRP03Pj7grcLi8jHhmpsRK8SgXesEXnG-KMmYLiYoIcgmlesm01Dvn8tef54VhaSKamhYvUKSUUCXCHINhueO~MrjfX8QIwnh6-eq5MFI7CJX8paungewySrbLKap7ZO8N-bL-hpY-~wkE8V9Uy6uOKEMoEvqM3pWrC66hIP6pe9apOIRiUHHtEpDhGKpnyzZf1cTiqubQ__&Key-Pair-Id=KU10BOFVSBLS3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "https://storage-us.provetcloud.com/provet/4285/users/5c312b4e179f48b2be77724fc1ff630b.jpeg?Expires=1720029050&Signature=Q2cDT9bfOziXQ4BoFuOFMvh0X~-xlRJ~3cXs14D8JH162B0cXQ7tNcYWLVj956~t1bjJuxgGFcvlCzAoTVfjt2pDGfZG5aGOnzLvwZrBq4IsWK929FhMuroz70A5bY4IUn2nZl1dF800Lo~zb4H7YtgnhDeJr0Z30jgGN1QyrhfQr4aIACqI9pr4jVl0h6O9tnF7ynsUfBue~oNXhULtU84~l1tJwkYuZ4fdhIXDqDu8SC9HHUOTJPDM9PIdl6VIO1VbjqE2h3MP9l9q-TSk~1sA4pH9FAcFMnuDUKcJabSAC2AtSDWKxNrciiL81GzrUcWmMlXP3aJEbQMWxaqkdw__&Key-Pair-Id=KU10BOFVSBLS3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
            </View>
            <SubHeadingText
              style={tw`text-movet-white text-center mb-4`}
              noDarkMode
            >
              with Barbra Caldwell & Dawn Brackpool
            </SubHeadingText>
            <View style={tw`my-2 border-t-2 border-movet-gray w-full`} />
            <SubHeadingText
              style={tw`text-movet-white text-center mt-2 text-lg`}
              noDarkMode
            >
              Current Status
            </SubHeadingText>
            <ItalicText style={tw`text-xl text-movet-white`} noDarkMode>
              IN ROUTE TO YOUR LOCATION...
            </ItalicText>
            <ItalicText style={tw`text-sm text-movet-white mb-4`} noDarkMode>
              Estimated Arrival Time ~15 Minutes
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
            <ItalicText
              style={tw`mt-2 text-movet-white text-center`}
              noDarkMode
            >
              &quot;Door Code is 4432 - Park in parking garage across the
              street&quot;
            </ItalicText>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={tw`flex-row mx-4 items-center justify-center rounded-b-xl bg-movet-yellow`}
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
            params: { id: 4410 },
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
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7383%2Fprofile?alt=media&token=7def96c7-1d02-44f4-a5cf-f9c3e8f0be0c",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7388%2Fprofile?alt=media&token=426012a2-42aa-4416-ba07-4d176c28e8c3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7383%2Fprofile?alt=media&token=7def96c7-1d02-44f4-a5cf-f9c3e8f0be0c",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              Exam - Medical / Sick
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              1:00PM @ 4246 Mcree Ave
            </SubHeadingText>
            <View
              style={tw`my-4 flex-row items-center justify-center bg-movet-green`}
              noDarkMode
            >
              <Image
                source={{
                  uri: "https://storage-us.provetcloud.com/provet/4285/users/2112c3c9a9544b3480f5350b9a9f17f0.jpeg?Expires=1720029050&Signature=UpvxoRrX6MRGbGV-xBbqsWGUGAbLfsNYAJBFiEHqGKENBnymrNWEbesHqMCupcUp4MKLc7EFWFWASMR8Mqzxqd~7amoThUcIYm1IS4gCwdqyRPoOjCpy1JE5f8-zhIqhZdaql1reuScUXRP03Pj7grcLi8jHhmpsRK8SgXesEXnG-KMmYLiYoIcgmlesm01Dvn8tef54VhaSKamhYvUKSUUCXCHINhueO~MrjfX8QIwnh6-eq5MFI7CJX8paungewySrbLKap7ZO8N-bL-hpY-~wkE8V9Uy6uOKEMoEvqM3pWrC66hIP6pe9apOIRiUHHtEpDhGKpnyzZf1cTiqubQ__&Key-Pair-Id=KU10BOFVSBLS3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "https://storage-us.provetcloud.com/provet/4285/users/5c312b4e179f48b2be77724fc1ff630b.jpeg?Expires=1720029050&Signature=Q2cDT9bfOziXQ4BoFuOFMvh0X~-xlRJ~3cXs14D8JH162B0cXQ7tNcYWLVj956~t1bjJuxgGFcvlCzAoTVfjt2pDGfZG5aGOnzLvwZrBq4IsWK929FhMuroz70A5bY4IUn2nZl1dF800Lo~zb4H7YtgnhDeJr0Z30jgGN1QyrhfQr4aIACqI9pr4jVl0h6O9tnF7ynsUfBue~oNXhULtU84~l1tJwkYuZ4fdhIXDqDu8SC9HHUOTJPDM9PIdl6VIO1VbjqE2h3MP9l9q-TSk~1sA4pH9FAcFMnuDUKcJabSAC2AtSDWKxNrciiL81GzrUcWmMlXP3aJEbQMWxaqkdw__&Key-Pair-Id=KU10BOFVSBLS3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
            </View>
            <SubHeadingText
              style={tw`text-movet-white text-center mb-2`}
              noDarkMode
            >
              with Barbra Caldwell & Dawn Brackpool
            </SubHeadingText>
            <View style={tw`my-2 border-t-2 border-movet-gray w-full`} />
            <SubHeadingText
              style={tw`text-movet-white text-center mt-2 text-lg`}
              noDarkMode
            >
              Current Status
            </SubHeadingText>
            <ItalicText style={tw`text-xl text-movet-white mb-4`} noDarkMode>
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
            pathname: `/(app)/home/appointment-detail/`,
            params: { id: 4410 },
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
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7383%2Fprofile?alt=media&token=7def96c7-1d02-44f4-a5cf-f9c3e8f0be0c",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7388%2Fprofile?alt=media&token=426012a2-42aa-4416-ba07-4d176c28e8c3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7383%2Fprofile?alt=media&token=7def96c7-1d02-44f4-a5cf-f9c3e8f0be0c",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              Exam - Medical / Sick
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              1:00PM @ 4246 Mcree Ave
            </SubHeadingText>
            {/* <View
                style={tw`my-4 flex-row items-center justify-center bg-movet-red`}
                noDarkMode
              >
                <Image
                  source={{
                    uri: "https://storage-us.provetcloud.com/provet/4285/users/2112c3c9a9544b3480f5350b9a9f17f0.jpeg?Expires=1720029050&Signature=UpvxoRrX6MRGbGV-xBbqsWGUGAbLfsNYAJBFiEHqGKENBnymrNWEbesHqMCupcUp4MKLc7EFWFWASMR8Mqzxqd~7amoThUcIYm1IS4gCwdqyRPoOjCpy1JE5f8-zhIqhZdaql1reuScUXRP03Pj7grcLi8jHhmpsRK8SgXesEXnG-KMmYLiYoIcgmlesm01Dvn8tef54VhaSKamhYvUKSUUCXCHINhueO~MrjfX8QIwnh6-eq5MFI7CJX8paungewySrbLKap7ZO8N-bL-hpY-~wkE8V9Uy6uOKEMoEvqM3pWrC66hIP6pe9apOIRiUHHtEpDhGKpnyzZf1cTiqubQ__&Key-Pair-Id=KU10BOFVSBLS3",
                  }}
                  alt={"'s photo"}
                  height={75}
                  width={75}
                  style={tw`rounded-full mx-2`}
                />
                <Image
                  source={{
                    uri: "https://storage-us.provetcloud.com/provet/4285/users/5c312b4e179f48b2be77724fc1ff630b.jpeg?Expires=1720029050&Signature=Q2cDT9bfOziXQ4BoFuOFMvh0X~-xlRJ~3cXs14D8JH162B0cXQ7tNcYWLVj956~t1bjJuxgGFcvlCzAoTVfjt2pDGfZG5aGOnzLvwZrBq4IsWK929FhMuroz70A5bY4IUn2nZl1dF800Lo~zb4H7YtgnhDeJr0Z30jgGN1QyrhfQr4aIACqI9pr4jVl0h6O9tnF7ynsUfBue~oNXhULtU84~l1tJwkYuZ4fdhIXDqDu8SC9HHUOTJPDM9PIdl6VIO1VbjqE2h3MP9l9q-TSk~1sA4pH9FAcFMnuDUKcJabSAC2AtSDWKxNrciiL81GzrUcWmMlXP3aJEbQMWxaqkdw__&Key-Pair-Id=KU10BOFVSBLS3",
                  }}
                  alt={"'s photo"}
                  height={75}
                  width={75}
                  style={tw`rounded-full mx-2`}
                />
              </View> */}
            <SubHeadingText
              style={tw`text-movet-white text-center mb-2`}
              noDarkMode
            >
              with Barbra Caldwell & Dawn Brackpool
            </SubHeadingText>
            <View style={tw`my-2 border-t-2 border-movet-gray w-full`} />
            <SubHeadingText
              style={tw`text-movet-white text-center mt-2 text-lg`}
              noDarkMode
            >
              Current Status
            </SubHeadingText>
            <ItalicText style={tw`text-xl text-movet-white`} noDarkMode>
              Appointment Complete
            </ItalicText>
            <ItalicText style={tw`text-movet-white`} noDarkMode>
              AWAITING PAYMENT
            </ItalicText>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={tw`flex-row mx-4 items-center justify-center rounded-b-xl bg-movet-red`}
        noDarkMode
      >
        <TouchableOpacity
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
        </TouchableOpacity>
        <View style={tw`w-2/12`} noDarkMode />
        <TouchableOpacity
          onPress={() => Linking.openURL(`sms:+17205077387`)}
          style={tw`w-4/12 pb-2`}
        >
          <View
            style={tw`flex-row px-4 py-2 items-center bg-movet-red justify-center `}
            noDarkMode
          >
            <Icon name="credit-card" height={20} width={20} color="white" />
            <View style={tw`bg-movet-red ml-4`} noDarkMode>
              <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                Approve Payment
              </SubHeadingText>
            </View>
          </View>
        </TouchableOpacity>
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
            params: { id: 4410 },
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
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7383%2Fprofile?alt=media&token=7def96c7-1d02-44f4-a5cf-f9c3e8f0be0c",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7388%2Fprofile?alt=media&token=426012a2-42aa-4416-ba07-4d176c28e8c3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "http://127.0.0.1:9199/v0/b/movet-care-staging.appspot.com/o/clients%2F5769%2Fpatients%2F7383%2Fprofile?alt=media&token=7def96c7-1d02-44f4-a5cf-f9c3e8f0be0c",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
            </View>
            <HeadingText
              style={tw`text-movet-white text-xl text-center`}
              noDarkMode
            >
              Exam - Medical / Sick
            </HeadingText>
            <SubHeadingText
              style={tw`text-movet-white text-lg text-center`}
              noDarkMode
            >
              1:00PM @ 4246 Mcree Ave
            </SubHeadingText>
            <View
              style={tw`my-4 flex-row items-center justify-center bg-movet-black`}
              noDarkMode
            >
              <Image
                source={{
                  uri: "https://storage-us.provetcloud.com/provet/4285/users/2112c3c9a9544b3480f5350b9a9f17f0.jpeg?Expires=1720029050&Signature=UpvxoRrX6MRGbGV-xBbqsWGUGAbLfsNYAJBFiEHqGKENBnymrNWEbesHqMCupcUp4MKLc7EFWFWASMR8Mqzxqd~7amoThUcIYm1IS4gCwdqyRPoOjCpy1JE5f8-zhIqhZdaql1reuScUXRP03Pj7grcLi8jHhmpsRK8SgXesEXnG-KMmYLiYoIcgmlesm01Dvn8tef54VhaSKamhYvUKSUUCXCHINhueO~MrjfX8QIwnh6-eq5MFI7CJX8paungewySrbLKap7ZO8N-bL-hpY-~wkE8V9Uy6uOKEMoEvqM3pWrC66hIP6pe9apOIRiUHHtEpDhGKpnyzZf1cTiqubQ__&Key-Pair-Id=KU10BOFVSBLS3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
              <Image
                source={{
                  uri: "https://storage-us.provetcloud.com/provet/4285/users/5c312b4e179f48b2be77724fc1ff630b.jpeg?Expires=1720029050&Signature=Q2cDT9bfOziXQ4BoFuOFMvh0X~-xlRJ~3cXs14D8JH162B0cXQ7tNcYWLVj956~t1bjJuxgGFcvlCzAoTVfjt2pDGfZG5aGOnzLvwZrBq4IsWK929FhMuroz70A5bY4IUn2nZl1dF800Lo~zb4H7YtgnhDeJr0Z30jgGN1QyrhfQr4aIACqI9pr4jVl0h6O9tnF7ynsUfBue~oNXhULtU84~l1tJwkYuZ4fdhIXDqDu8SC9HHUOTJPDM9PIdl6VIO1VbjqE2h3MP9l9q-TSk~1sA4pH9FAcFMnuDUKcJabSAC2AtSDWKxNrciiL81GzrUcWmMlXP3aJEbQMWxaqkdw__&Key-Pair-Id=KU10BOFVSBLS3",
                }}
                alt={"'s photo"}
                height={75}
                width={75}
                style={tw`rounded-full mx-2`}
              />
            </View>
            <SubHeadingText
              style={tw`text-movet-white text-center mb-2`}
              noDarkMode
            >
              with Barbra Caldwell & Dawn Brackpool
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
        <TouchableOpacity
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
        </TouchableOpacity>
        <View style={tw`w-2/12`} noDarkMode />
        <TouchableOpacity
          onPress={() => Linking.openURL(`sms:+17205077387`)}
          style={tw`w-4/12 pb-2`}
        >
          <View
            style={tw`flex-row px-4 py-2 items-center bg-movet-red justify-center `}
            noDarkMode
          >
            <Icon name="star" height={20} width={20} color="white" />
            <View style={tw`bg-movet-red ml-4`} noDarkMode>
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