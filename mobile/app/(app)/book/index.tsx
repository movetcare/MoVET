import { Loader } from "components/Loader";
import { View } from "components/themed";
import { useEffect, useState } from "react";
import { AuthStore } from "stores/AuthStore";
import tw from "tailwind";
import { getPlatformUrl } from "utils/getPlatformUrl";
import { WebView as DefaultWebView } from "react-native-webview";
import { functions } from "firebase-config";
import { httpsCallable } from "firebase/functions";

const NewAppointment = () => {
  const { user, client } = AuthStore.useState();
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [isLoadingWeb, setIsLoadingWeb] = useState<boolean>(true);

  useEffect(() => {
    const clearExistingAppointmentBookingSessions = async () => {
      const clearAppointmentBookingSessions = httpsCallable(
        functions,
        "clearAppointmentBookingSessions",
      );
      await clearAppointmentBookingSessions().finally(() =>
        setIsLoadingSession(false),
      );
    };
    clearExistingAppointmentBookingSessions();
  }, []);

  return isLoadingSession ? (
    <View style={tw`h-screen -mt-12`}>
      <Loader />
    </View>
  ) : (
    <>
      {isLoadingWeb && (
        <View style={tw`h-screen -mt-20`}>
          <Loader />
        </View>
      )}
      <DefaultWebView
        source={{
          uri:
            getPlatformUrl() +
            "?mode=app&restartAvailable=true&email=" +
            user.email +
            `${client?.firstName ? `&firstName=${client?.firstName}` : ""}${
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
        incognito
        startInLoadingState
        onLoad={() => setTimeout(() => setIsLoadingWeb(false), 1500)}
        style={`flex-1`}
      />
    </>
  );
};

export default NewAppointment;
