import { Loader } from "components/Loader";
import { View } from "components/themed";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { WebView as DefaultWebView } from "react-native-webview";
import tw from "tailwind";

const WebView = () => {
  const { link } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <>
      {isLoading && (
        <View style={tw`h-screen -mt-24`}>
          <Loader />
        </View>
      )}
      <DefaultWebView
        source={{ uri: "https://movetcare.com" + link + "?mode=app" }}
        //onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        style={
          isLoading ? { display: "none", visibility: "hidden" } : { flex: 1 }
        }
      />
    </>
  );
};

export default WebView;
