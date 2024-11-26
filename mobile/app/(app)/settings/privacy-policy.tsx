import { Loader } from "components/Loader";
import { View } from "components/themed";
import { useState } from "react";
import { Platform, Linking } from "react-native";
import { WebView as DefaultWebView } from "react-native-webview";
import tw from "tailwind";
import { getPlatformUrl } from "utils/getPlatformUrl";

const PrivacyPolicy = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <>
      {isLoading && (
        <View style={tw`h-screen -mt-12`}>
          <Loader />
        </View>
      )}
      <DefaultWebView
        source={{
          uri: getPlatformUrl("website") + "/privacy-policy" + "?mode=app",
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

export default PrivacyPolicy;
