import { Loader } from "components/Loader";
import { View } from "components/themed";
import { useState } from "react";
import { WebView as DefaultWebView } from "react-native-webview";
import { AuthStore } from "stores/AuthStore";
import tw from "tailwind";
import { getPlatformUrl } from "utils/getPlatformUrl";

const New = () => {
  const { user } = AuthStore.useState();
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
          uri: getPlatformUrl() + "?mode=app&email=" + user.email,
        }}
        startInLoadingState
        onLoad={() => setTimeout(() => setIsLoading(false), 1500)}
        style={tw`${isLoading ? "hidden" : "flex-1"}`}
      />
    </>
  );
};

export default New;
