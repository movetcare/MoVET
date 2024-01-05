import { Screen, ItalicText } from "components/themed";
import tw from "tailwind";
import Constants from "expo-constants";
import { isProductionEnvironment } from "utils/isProductionEnvironment";
import { signOut } from "services/Auth";
import { useEffect } from "react";
const versions = require("../version.json");

const Test = () => {
  useEffect(() => {
    const signOutUser = async () => await signOut();
    signOutUser();
  }, []);
  return (
    <Screen withBackground="pets">
      <ItalicText style={tw`text-xs mt-4`}>
        Version: {versions.appVersion.toString()}
      </ItalicText>
      {!isProductionEnvironment && (
        <ItalicText style={tw`text-xs`}>
          Environment: &quot;{Constants?.expoConfig?.extra?.environment}
          &quot;
        </ItalicText>
      )}
    </Screen>
  );
};
export default Test;
