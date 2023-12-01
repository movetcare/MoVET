import { useEffect } from "react";
import { Loader } from "components/Loader";
import { signOut } from "services/Auth";
import { BodyText, View } from "components/themed";
import { ErrorStore } from "stores/ErrorStore";
import tw from "tailwind";

const Errors = () => {
  const { currentError, pastErrors } = ErrorStore.useState();
  console.log("currentError", currentError);
  console.log("pastErrors", pastErrors);

  useEffect(() => {
    const signOutUser = async () => await signOut();
    if (!__DEV__) signOutUser();
  }, []);

  return !__DEV__ ? (
    <Loader description={"Signing Out..."} />
  ) : (
    <View style={tw`p-4 flex-1`} noDarkMode>
      {currentError &&
        Array.isArray(currentError) &&
        currentError.length > 0 &&
        currentError?.map((error: any) => (
          <BodyText>{JSON.stringify(error)}</BodyText>
        ))}
      {pastErrors &&
        Array.isArray(pastErrors) &&
        pastErrors.length > 0 &&
        pastErrors?.map((error: any, index: number) => (
          <BodyText key={index}>
            {error?.toString() || JSON.stringify(error)}
          </BodyText>
        ))}
    </View>
  );
};
export default Errors;
