import {
  SubHeadingText,
  HeadingText,
  Icon,
  View,
  ItalicText,
} from "components/themed";
import { router } from "expo-router";
import { TouchableOpacity, useColorScheme, Image } from "react-native";
import * as Linking from "expo-linking";
import tw from "tailwind";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { ErrorStore } from "stores";
import MapView, { Marker } from "react-native-maps";

const appointmentStatus: "pending" | "active" | "complete" = "pending";

export const TodaysAppointments = () => {
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
    <>
      <SubHeadingText style={tw`text-2xl w-full mb-2 text-center`}>
        Today&apos;s Appointment
      </SubHeadingText>
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
            style={tw`flex-row rounded-t-xl p-4 mt-2 items-center w-full bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"} justify-between`}
            noDarkMode
          >
            <View
              style={tw`bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"} flex-1 justify-center items-center`}
              noDarkMode
            >
              {/* {mapCoordinates !== null && !isLoading && (
                <View
                  style={tw`
              flex-row w-full h-60 self-center overflow-hidden border-2 border-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"}/50 dark:border-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"}/50 rounded-xl
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
              )} */}
              <View
                style={tw`my-4 flex-row items-center justify-center bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"}`}
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
                style={tw`my-4 flex-row items-center justify-center bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"}`}
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
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={tw`flex-row mx-4 items-center justify-center rounded-b-xl bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"}`}
          noDarkMode
        >
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:+17205077387`)}
            style={tw`w-4/12 pb-2`}
          >
            <View
              style={tw`flex-row px-4 py-2 items-center bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"} justify-center`}
              noDarkMode
            >
              <Icon name="phone" height={20} width={20} color="white" />
              <View
                style={tw`bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"} ml-4`}
                noDarkMode
              >
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
              style={tw`flex-row px-4 py-2 items-center bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"} justify-center `}
              noDarkMode
            >
              <Icon name="sms" height={20} width={20} color="white" />
              <View
                style={tw`bg-movet-${appointmentStatus === "pending" ? "blue" : appointmentStatus === "active" ? "green" : appointmentStatus === "complete" ? "red" : "black"} ml-4`}
                noDarkMode
              >
                <SubHeadingText style={tw`text-movet-white text-sm`} noDarkMode>
                  Text
                </SubHeadingText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
    </>
  );
};
