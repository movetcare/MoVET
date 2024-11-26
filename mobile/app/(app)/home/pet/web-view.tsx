import { Loader } from "components/Loader";
import { View } from "components/themed";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Platform, Linking } from "react-native";
import { WebView as DefaultWebView } from "react-native-webview";
import tw from "tailwind";
import { ApplicationTypes, getPlatformUrl } from "utils/getPlatformUrl";

const WebView = () => {
  const { path, applicationSource, queryString, screenTitle } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <>
      {screenTitle && (
        <Stack.Screen options={{ title: screenTitle as string }} />
      )}
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
              queryString || "",
        }}
        incognito
        startInLoadingState
        onLoad={() => setTimeout(() => setIsLoading(false), 1500)}
        style={tw`flex-1`}
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
