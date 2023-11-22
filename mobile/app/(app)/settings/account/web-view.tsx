import { Loader } from "components/Loader";
import { View } from "components/themed";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, Linking } from "react-native";
import { WebView as DefaultWebView } from "react-native-webview";
import tw from "tailwind";
import { ApplicationTypes, getPlatformUrl } from "utils/getPlatformUrl";

const WebView = () => {
  const { path, queryString, applicationSource } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log(queryString);
  return (
    <>
      {isLoading && (
        <View style={tw`h-screen -mt-12`}>
          <Loader />
        </View>
      )}
      <DefaultWebView
        source={{
          uri:
            getPlatformUrl(
              (applicationSource as ApplicationTypes) || "website",
            ) +
            path +
            "?mode=app" +
            (queryString as string),
        }}
        startInLoadingState
        onLoad={() => setTimeout(() => setIsLoading(false), 1500)}
        style={tw`${isLoading ? "hidden" : "flex-1"}`}
        onShouldStartLoadWithRequest={(event) => {
          if (
            event.url.slice(0, 4) === "http" && Platform.OS === "ios"
              ? event.navigationType === "click"
              : true
          ) {
            Linking.canOpenURL(event.url).then((supported) => {
              if (supported) Linking.openURL(event.url);
            });
            return false;
          }
          return true;
        }}
      />
    </>
  );
};

export default WebView;
