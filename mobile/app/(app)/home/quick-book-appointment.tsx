import { Loader } from "components/Loader";
import { View } from "components/themed";
import { useState } from "react";
import { AuthStore } from "stores/AuthStore";
import tw from "tailwind";
import { getPlatformUrl } from "utils/getPlatformUrl";
import { WebView as DefaultWebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";

const QuickBookAppointment = () => {
  const { location } = useLocalSearchParams();
  const { user, client } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <>
      {isLoading && (
        <View style={tw`h-screen -mt-20`}>
          <Loader />
        </View>
      )}
      <DefaultWebView
        source={{
          uri:
            getPlatformUrl() +
            "?mode=app&email=" +
            user.email +
            `${location ? `&location=${client?.location}` : ""}
            ${client?.firstName ? `&firstName=${client?.firstName}` : ""}${
              client?.lastName ? `&lastName=${client?.lastName}` : ""
            }${
              client?.phone
                ? `&phone=${client?.phone
                    ?.replaceAll(" ", "")
                    ?.replaceAll("(", "")
                    ?.replaceAll(")", "")
                    ?.replaceAll("-", "")}`
                : ""
            }`,
        }}
        startInLoadingState
        onLoad={() => setTimeout(() => setIsLoading(false), 1500)}
        style={tw`${isLoading ? "hidden" : "flex-1"}`}
      />
    </>
  );
};

export default QuickBookAppointment;
