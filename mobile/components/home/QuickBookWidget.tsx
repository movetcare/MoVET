import { HeadingText, Icon, SubHeadingText, View } from "components/themed";
import { router } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";
import { AuthStore } from "stores/AuthStore";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";
import * as Linking from "expo-linking";

export const QuickBookWidget = () => {
  const { client } = AuthStore.useState();
  return (
    <View
      style={[
        isTablet ? tw`px-16` : tw`px-4`,
        tw`flex-col my-4 rounded-xl bg-transparent mx-auto w-full`,
      ]}
    >
      <View
        style={tw`flex-row bg-movet-black/90 rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white p-2 w-full`}
        noDarkMode
      >
        <HeadingText
          style={tw`text-movet-white text-lg w-full text-center`}
          noDarkMode
        >
          Book an Appointment
        </HeadingText>
      </View>
      <View noDarkMode style={tw`sm:flex-row sm:w-1/3 items-center`}>
        <View noDarkMode style={tw`sm:mr-2`}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: `/(app)/home/quick-book-appointment/`,
                params: { location: "belleview-station" },
              })
            }
            style={tw`rounded-xl`}
          >
            <View
              style={tw`flex-row rounded-t-xl p-4 mt-2 items-center w-full bg-movet-red justify-between`}
              noDarkMode
            >
              <View style={tw`bg-movet-red flex-1 justify-start`} noDarkMode>
                <HeadingText
                  style={tw`text-movet-white text-lg w-full`}
                  noDarkMode
                >
                  Clinic @ Belleview Station
                </HeadingText>
                <SubHeadingText noDarkMode style={tw`text-movet-white`}>
                  4912 S Newport Street, Denver
                </SubHeadingText>
              </View>
              <View
                style={tw`bg-movet-black/50 items-center justify-center ml-4 py-4 pl-4 pr-3 rounded-xl`}
                noDarkMode
              >
                <Icon
                  name="calendar-plus"
                  height={30}
                  width={30}
                  color="white"
                />
              </View>
            </View>
          </TouchableOpacity>
          <View
            style={tw`flex-row items-center justify-center rounded-b-xl bg-movet-red`}
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
                <Icon name="phone" height={20} width={20} color="white" />
                <View style={tw`bg-movet-red ml-4`} noDarkMode>
                  <SubHeadingText
                    style={tw`text-movet-white text-sm`}
                    noDarkMode
                  >
                    Call
                  </SubHeadingText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL(`sms:+17205077387`)}
              style={tw`w-4/12 pb-2`}
            >
              <View
                style={tw`flex-row px-4 py-2 items-center bg-movet-red justify-center `}
                noDarkMode
              >
                <Icon name="sms" height={20} width={20} color="white" />
                <View style={tw`bg-movet-red ml-4`} noDarkMode>
                  <SubHeadingText
                    style={tw`text-movet-white text-sm`}
                    noDarkMode
                  >
                    Text
                  </SubHeadingText>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
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
              style={tw`w-4/12 pb-2`}
            >
              <View
                style={tw`flex-row px-4 py-2 items-center bg-movet-red justify-center `}
                noDarkMode
              >
                <Icon name="map" height={20} width={20} color="white" />
                <View style={tw`bg-movet-red ml-4`} noDarkMode>
                  <SubHeadingText
                    style={tw`text-movet-white text-sm`}
                    noDarkMode
                  >
                    Map
                  </SubHeadingText>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/(app)/home/quick-book-appointment/`,
              params: { location: "housecall" },
            })
          }
          style={tw`rounded-xl sm:ml-2`}
        >
          <View
            style={tw`flex-row bg-movet-blue rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white p-4 mt-2 items-center w-full justify-between`}
            noDarkMode
          >
            <View style={tw`bg-movet-blue flex-1 justify-start`} noDarkMode>
              <HeadingText
                style={tw`text-movet-white text-lg w-full`}
                noDarkMode
              >
                Housecall Appointment
              </HeadingText>
              <SubHeadingText noDarkMode style={tw`text-movet-white`}>
                {client?.address
                  ? client?.address.split(",", 2).join(",")
                  : "at the location of your choosing"}
              </SubHeadingText>
            </View>
            <View
              style={tw`bg-movet-black/50 items-center justify-center ml-4 py-4 pl-4 pr-3 rounded-xl`}
              noDarkMode
            >
              <Icon name="calendar-plus" height={30} width={30} color="white" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/(app)/home/quick-book-appointment/`,
              params: { location: "virtually" },
            })
          }
          style={tw`rounded-xl sm:ml-2`}
        >
          <View
            style={tw`flex-row bg-movet-yellow rounded-xl shadow-lg shadow-movet-black dark:shadow-movet-white p-4 mt-2 items-center w-full justify-between`}
            noDarkMode
          >
            <View style={tw`bg-movet-yellow flex-1 justify-start`} noDarkMode>
              <HeadingText
                style={tw`text-movet-white text-lg w-full`}
                noDarkMode
              >
                Virtual Consultation
              </HeadingText>
              <SubHeadingText noDarkMode style={tw`text-movet-white`}>
                Video Chat with a MoVET Expert!
              </SubHeadingText>
            </View>
            <View
              style={tw`bg-movet-black/50 items-center justify-center ml-4 py-4 pl-4 pr-3 rounded-xl`}
              noDarkMode
            >
              <Icon name="calendar-plus" height={30} width={30} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
