import { useEffect, useState } from "react";
import { Loader } from "components/Loader";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { AuthStore } from "stores";
import { firestore, functions } from "firebase-config";
import { ErrorModal } from "components/Modal";
import {
  ActionButton,
  Container,
  Icon,
  Screen,
  SubHeadingText,
  SubmitButton,
  SwitchInput,
  View,
} from "components/themed";
import { useForm } from "react-hook-form";
import tw from "tailwind";
import Constants from "expo-constants";
import {
  ActivityIndicator,
  Linking,
  Platform,
  useColorScheme,
} from "react-native";
import { isTablet } from "utils/isTablet";
import { httpsCallable } from "firebase/functions";

const AccountSettings = () => {
  const { user } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const isDarkMode = useColorScheme() !== "light";
  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    reset,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      sendEmail: true,
      sendSms: true,
      sendPush: true,
    },
  });

  useEffect(() => {
    const unsubscribeNotificationSettings = onSnapshot(
      doc(firestore, "clients", user?.uid),
      (doc) => {
        if (doc.exists()) {
          setIsLoading(false);
          setNotificationSettings({
            sendSms: doc.data()?.sendSms || false,
            sendEmail: doc.data()?.sendEmail || false,
            sendPush: doc.data()?.sendPush || false,
          });
        } else {
          setNotificationSettings(null);
          setIsLoading(false);
          setError({ message: "MISSING CLIENT DATA" });
        }
      },
      (error: any) => {
        setNotificationSettings(null);
        setIsLoading(false);
        setError(error);
      },
    );
    return () => unsubscribeNotificationSettings();
  }, [user, reset]);

  useEffect(() => {
    if (notificationSettings) reset(notificationSettings);
  }, [notificationSettings, reset]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const updateClient = httpsCallable(functions, "updateClient");
    await updateClient({
      sendEmail: data.sendEmail,
      sendSms: data.sendSms,
      sendPush: data.sendPush,
    })
      .then((result) => {
        if (!result.data) setError({ message: "Failed to Save Updates" });
      })
      .catch((error: any) => setError(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <Screen>
      {notificationSettings === null ? (
        <Loader description={"Loading Notification Settings..."} />
      ) : (
        <>
          <Container
            style={tw`flex-grow w-full items-center justify-center px-4`}
          >
            <View
              style={tw`w-full bg-transparent flex flex-row justify-between items-center mt-6`}
            >
              <Icon name="envelope" size={isTablet ? "md" : "sm"} />
              <SubHeadingText style={isTablet ? tw`text-lg` : tw`text-base`}>
                Email Notifications:
              </SubHeadingText>
              {isLoading ? (
                <ActivityIndicator
                  style={tw`mr-2`}
                  size="small"
                  color={
                    isDarkMode
                      ? tw.color("movet-white")
                      : tw.color("movet-black")
                  }
                />
              ) : (
                <SwitchInput control={control} name="sendEmail" />
              )}
            </View>
            <View
              style={tw`w-full bg-transparent flex flex-row justify-between items-center mt-6`}
            >
              <Icon name="sms" size={isTablet ? "md" : "sm"} />
              <SubHeadingText style={isTablet ? tw`text-lg` : tw`text-base`}>
                SMS Notifications:
              </SubHeadingText>
              {isLoading ? (
                <ActivityIndicator
                  style={tw`mr-2`}
                  size="small"
                  color={
                    isDarkMode
                      ? tw.color("movet-white")
                      : tw.color("movet-black")
                  }
                />
              ) : (
                <SwitchInput control={control} name="sendSms" />
              )}
            </View>
            <View
              style={tw`w-full bg-transparent flex flex-row justify-between items-center mt-6 mb-28`}
            >
              <Icon name="bell" size={isTablet ? "md" : "sm"} />
              <SubHeadingText style={isTablet ? tw`text-lg` : tw`text-base`}>
                Push Notifications:
              </SubHeadingText>
              {isLoading ? (
                <ActivityIndicator
                  style={tw`mr-2`}
                  size="small"
                  color={
                    isDarkMode
                      ? tw.color("movet-white")
                      : tw.color("movet-black")
                  }
                />
              ) : (
                <SwitchInput control={control} name="sendPush" />
              )}
            </View>
            {__DEV__ && (
              <View
                style={tw`w-full bg-transparent flex-col justify-center items-center`}
              >
                <SubHeadingText>Push Token: {pushToken}</SubHeadingText>
              </View>
            )}
            <SubmitButton
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              disabled={!isDirty || isLoading}
              loading={isLoading}
              title={isLoading ? "Saving Changes..." : "Save Changes"}
              color="red"
              iconName="check"
            />
          </Container>
          <ErrorModal
            isVisible={error !== null}
            onClose={() => setError(null)}
            message={error?.code || error?.message || JSON.stringify(error)}
          />
        </>
      )}
    </Screen>
  );
};
export default AccountSettings;
