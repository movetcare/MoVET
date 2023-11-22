import Constants from "expo-constants";
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Controller } from "react-hook-form";
import { isValidZipcode } from "utils/zipcodes/isValidZipcode";
import MapView, { Marker } from "react-native-maps";
import debounce from "lodash.debounce";
import tw from "tailwind";
import { BodyText, ItalicText } from "../Text";
import { FormFieldError } from "./InputFieldError";

export const AddressInput = ({
  control,
  error,
  placeholder = "Search for an Address",
  name,
  setValue,
  watch,
  editable = true,
  defaultValue = undefined,
  setLocation = null,
  location = null,
  setZip = null,
  zip = null,
}: {
  control: any;
  error: string;
  placeholder?: string;
  name: any;
  setValue: any;
  watch: any;
  editable?: boolean;
  defaultValue: string | undefined;
  setLocation: any;
  location: { lat: number; lng: number } | null;
  setZip: any;
  zip: string | null;
}) => {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [addressSelection, setAddressSelection] = useState<string | null>(null);
  const [dropdownHeight, setDropdownHeight] = useState<string>("mb-0");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [placeErrorText, setPlaceErrorText] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState<boolean>(false);
  const [zipcode, setZipcode] = useState<string | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(location ? location : null);
  const watchValue = watch(name);
  const isDarkMode = useColorScheme() !== "light";

const fetchData = async (callback: any) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${Constants.expoConfig?.extra?.google_api_key}&input=${watchValue}&components=country:us&types=address&location=39.6252378%2C-104.9067691&radius=160934`,
    {
      method: "POST",
    },
  )
    .then((response: any) => response.json())
    .then((json: any) => json.predictions)
    .catch((error: any) => {
      setPlaceErrorText(error?.message);
      setSearchResults(null);
      setAddressSelection(null);
      setShowDropdown(false);
      console.error(error);
    });
  callback(response);
};

const debouncedFetchData = debounce((callback: any) => {
  fetchData(callback);
}, 500);

useEffect(() => {
  console.log("defaultValue", defaultValue);
  if (defaultValue) {
    setIsLoadingMap(true);
    setMapCoordinates(location);
    setZipcode(zip);
    setAddressSelection(defaultValue);
    setPlaceErrorText(null);
    setValue(name, defaultValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsLoadingMap(false);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [defaultValue]);

useEffect(() => {
  if (searchResults) {
    setShowDropdown(true);
  }
}, [searchResults]);

useEffect(() => {
  if (addressSelection) {
    setShowDropdown(false);
    setSearchResults(null);
  }
}, [addressSelection]);

useEffect(() => {
  if (
    watchValue &&
    watchValue !== null &&
    watchValue !== undefined &&
    watchValue !== "" &&
    watchValue.length >= 6 &&
    !addressSelection
  ) {
    debouncedFetchData((result: any) => {
      setSearchResults(result);
    });
  }
  if (watchValue === "") {
    setSearchResults(null);
    setAddressSelection(null);
    setMapCoordinates(null);
    setLocation(null);
    setShowDropdown(false);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [watchValue, addressSelection]);

useEffect(() => {
  if (mapCoordinates === null && watchValue !== "" && addressSelection) {
    setIsLoadingMap(true);
    fetch(
      `https://maps.google.com/maps/api/geocode/json?address=${encodeURI(
        addressSelection,
      )}&key=${Constants.expoConfig?.extra?.google_maps_geocode_key}`,
    )
      .then((response: any) => response.json())
      .then((json: any) => {
        setMapCoordinates(json.results[0].geometry.location);
        setLocation(json.results[0].geometry.location);
        for (let i = 0; i < json.results[0].address_components.length; i++) {
          if (
            json.results[0].address_components[i].types[0] === "postal_code"
          ) {
            setZipcode(json.results[0].address_components[i].long_name);
            setZip(json.results[0].address_components[i].long_name);
          }
        }
        setValue(
          name,
          json.results[0].formatted_address.split(",").slice(0, 3).join(","),
          {
            shouldValidate: true,
          },
        );
      })
      .catch((error: any) => setPlaceErrorText(error?.message))
      .finally(() => setIsLoadingMap(false));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [mapCoordinates, watchValue, addressSelection]);

useEffect(() => {
  if (searchResults && searchResults.length && addressSelection === null) {
    switch (searchResults.length) {
      case 1:
        setDropdownHeight("mb-20");
        break;
      case 2:
        setDropdownHeight("mb-32");
        break;
      case 3:
        setDropdownHeight("mb-48");
        break;
      case 4:
        setDropdownHeight("mb-56");
        break;
      case 5:
        setDropdownHeight("mb-72");
        break;
      default:
        setDropdownHeight("mb-0");
        break;
    }
  } else setDropdownHeight("mb-0");
}, [searchResults, addressSelection]);

return (
  <>
    {mapCoordinates && watchValue !== "" && (
      <View
        style={[
          tw`
              flex-row w-full h-60 self-center overflow-hidden border-2 border-black dark:border-movet-white rounded-xl mb-8
            `,
          Boolean(error) &&
            addressSelection !== null &&
            isLoadingMap === false &&
            tw`border-movet-red`,
        ]}
      >
        {isLoadingMap ? (
          <ActivityIndicator
            size={"large"}
            color={tw.color("movet-red")}
            style={tw`my-8`}
          />
        ) : (
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
        )}
      </View>
    )}
    {error && addressSelection !== null && isLoadingMap === false && (
      <View style={tw`mb-4 -mt-8`}>
        <FormFieldError>{error}</FormFieldError>
      </View>
    )}
    <View style={tw`flex-row flex ${dropdownHeight} z-50`}>
      <Controller
        name={name}
        rules={{
          // required: "Address is required",
          minLength: {
            message: "Address is required",
            value: 1,
          },
          validate: () => {
            if (addressSelection === null) return true;
            if (placeErrorText) return placeErrorText;
            else if (zipcode !== null && !isValidZipcode(zipcode))
              return "MoVET does not yet service this area. Please provide a new address.";
            else if (zipcode === null)
              return "MoVET does not yet service this area. Please provide a new address.";
            else return true;
          },
        }}
        control={control}
        render={({ field: { onChange, value }, fieldState: { isDirty } }) => {
          return (
            <>
              <View style={tw`flex-col w-full z-50`}>
                {isDirty &&
                  showDropdown &&
                  searchResults &&
                  Platform.OS !== "ios" && (
                    <View style={tw`mb-4`}>
                      {searchResults.map((item: any, index: number) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            index === 0 && tw`border-t-2 rounded-t-xl`,
                            tw`bg-movet-white dark:bg-movet-black dark:border-movet-white border-l-2 border-r-2 w-full py-4 border-b z-50`,
                            searchResults.length - 1 === index &&
                              tw`border-b-2 rounded-b-xl`,
                          ]}
                          onPress={() => {
                            setIsLoadingMap(true);
                            Keyboard.dismiss();
                            setAddressSelection(item?.description);
                          }}
                        >
                          <BodyText
                            style={tw`text-movet-black dark:text-movet-white text-center`}
                          >
                            {item?.description.split(",").slice(0, 3).join(",")}
                          </BodyText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                {isDirty &&
                  searchResults &&
                  searchResults.length > 0 &&
                  Platform.OS !== "ios" && (
                    <ItalicText style={tw`text-xs text-center mb-3 font-bold`}>
                      Select an Option
                    </ItalicText>
                  )}
                {watchValue !== null &&
                  watchValue !== undefined &&
                  watchValue !== "" &&
                  watchValue.length <= 6 &&
                  Platform.OS !== "ios" && (
                    <>
                      <ActivityIndicator
                        size="small"
                        style={tw`mt-4`}
                        color={tw.color("movet-red")}
                      />
                      <ItalicText
                        style={tw`text-sm text-center mt-3 font-bold`}
                      >
                        Searching for an address...
                      </ItalicText>
                      <ItalicText
                        style={tw`text-xs mt-1 text-center font-bold mb-3`}
                      >
                        Keep typing!
                      </ItalicText>
                    </>
                  )}
                {isDirty &&
                  searchResults &&
                  searchResults.length < 1 &&
                  Platform.OS !== "ios" && (
                    <ItalicText
                      style={tw`text-base text-center mb-3 font-bold text-movet-red`}
                    >
                      No Locations Found...
                    </ItalicText>
                  )}
                <TextInput
                  onFocus={() => {
                    setShowDropdown(false);
                    setSearchResults(null);
                    setAddressSelection(null);
                    setValue(name, "", {
                      shouldValidate: false,
                    });
                  }}
                  scrollEnabled={false}
                  defaultValue={defaultValue}
                  inputAccessoryViewID="postal-address"
                  clearTextOnFocus={true}
                  caretHidden={false}
                  enablesReturnKeyAutomatically={true}
                  editable={editable}
                  placeholder={placeholder}
                  returnKeyType="search"
                  style={[
                    Boolean(error) &&
                      !showDropdown &&
                      addressSelection !== null &&
                      isLoadingMap === false &&
                      tw`border-movet-red`,
                    tw`border-2 py-4 px-5 w-full bg-movet-white dark:bg-movet-black dark:border-movet-white dark:text-movet-white rounded-xl z-50`,
                  ]}
                  placeholderTextColor={
                    isDarkMode
                      ? tw.color("movet-white")
                      : tw.color("movet-black")
                  }
                  onChangeText={(text: string) => onChange(text)}
                  value={value}
                />
                {isDirty &&
                  searchResults &&
                  searchResults.length > 0 &&
                  Platform.OS === "ios" && (
                    <ItalicText style={tw`text-xs text-center mt-3 font-bold`}>
                      Select an Option
                    </ItalicText>
                  )}
                {watchValue !== null &&
                  watchValue !== undefined &&
                  watchValue !== "" &&
                  watchValue.length <= 6 &&
                  Platform.OS === "ios" && (
                    <>
                      <ActivityIndicator
                        size="small"
                        style={tw`mt-4`}
                        color={tw.color("movet-red")}
                      />
                      <ItalicText
                        style={tw`text-sm text-center mt-3 font-bold`}
                      >
                        Searching for an address...
                      </ItalicText>
                      <ItalicText
                        style={tw`text-xs mt-1 text-center font-bold`}
                      >
                        Keep typing!
                      </ItalicText>
                    </>
                  )}
                {isDirty &&
                  searchResults &&
                  searchResults.length < 1 &&
                  Platform.OS === "ios" && (
                    <ItalicText
                      style={tw`text-base text-center mt-3 font-bold text-movet-red`}
                    >
                      No Locations Found...
                    </ItalicText>
                  )}
                {isDirty &&
                  showDropdown &&
                  searchResults &&
                  Platform.OS === "ios" && (
                    <View
                      style={[
                        {
                          top: 88,
                        },
                        tw`w-full absolute z-50`,
                      ]}
                    >
                      {searchResults.map((item: any, index: number) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            index === 0 && tw`border-t-2 rounded-t-xl`,
                            tw`bg-movet-white dark:bg-movet-black dark:border-movet-white border-l-2 border-r-2 w-full py-4 border-b z-50`,
                            searchResults.length - 1 === index &&
                              tw`border-b-2 rounded-b-xl`,
                          ]}
                          onPress={() => {
                            setIsLoadingMap(true);
                            Keyboard.dismiss();
                            setAddressSelection(item?.description);
                          }}
                        >
                          <BodyText
                            style={tw`text-movet-black dark:text-movet-white text-center`}
                          >
                            {item?.description.split(",").slice(0, 3).join(",")}
                          </BodyText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
              </View>
            </>
          );
        }}
      />
    </View>
  </>
);
};
