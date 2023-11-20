import { useEffect, useState } from "react";
import { Loader } from "components/Loader";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthStore } from "stores";
import { firestore } from "firebase-config";
import { ErrorModal } from "components/Modal";
import { router } from "expo-router";
import {
  BodyText,
  Container,
  HeadingText,
  Icon,
  Screen,
  SubHeadingText,
  SwitchInput,
  View,
} from "components/themed";
import { useForm } from "react-hook-form";
import tw from "tailwind";

const Notifications = () => {
  const { user } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [notificationSettings, setNotificationSettings] = useState<{
    sendSms: boolean;
    sendEmail: boolean;
    sendPush: boolean;
  } | null>(null);
  const [pushToken, setPushToken]: any = useState<string | null>(null);
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

  const emailStatus = watch("sendEmail");
  const smsStatus = watch("sendSms");
  const pushStatus = watch("sendPush");

  useEffect(() => {
    const unsubscribeNotificationSettings = onSnapshot(
      doc(firestore, "clients", user?.uid),
      (doc) => {
        if (doc.exists()) {
          reset({
            sendSms: doc.data()?.sendSms,
            sendEmail: doc.data()?.sendEmail,
            sendPush: doc.data()?.sendPush,
          });
          setIsLoading(false);
        } else {
          setNotificationSettings(null);
          setIsLoading(false);
          setError({ message: "MISSING CLIENT DATA" });
        }
      },
      (error: any) => {
        setIsLoading(false);
        setError(error);
      },
    );
    return () => unsubscribeNotificationSettings();
  }, [user?.uid, reset]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const clientData: any = {
      sendEmail: data.sendEmail,
      sendSms: data.sendSms,
      sendPush: data.sendPush,
    };
    // if (clientData.sendPush === true) {
    //   const pushToken = await getPushToken();
    //   if (!pushToken)
    //     await configurePushNotifications().then((token: any) => {
    //       if (token) {
    //         savePushToken(token);
    //         clientData.pushToken = token;
    //       } else clientData.pushToken = null;
    //     });
    // }

    // const { data: didUpdateClient } = await firebase
    //   .callFunction("updateClient", clientData)
    //   .catch((error: any) => setError(firebase, error?.message));

    // if (didUpdateClient) {
    //   navigation.navigate("Settings");
    // } else {
    //   setError(firebase, "Failed to Save Notification Settings");
    // }
    setIsLoading(false);
  };

  return (
    <Screen>
      {isLoading ? (
        <Loader description={"Loading Notification Settings..."} />
      ) : (
        <>
          {error ? (
            <Loader description="Something Went Wrong..." />
          ) : (
            <Container
              style={tw`flex-grow w-full items-center justify-center px-4`}
            >
              <View
                style={tw`w-full bg-transparent flex flex-row justify-between items-center mt-8`}
              >
                <Icon name="envelope" />
                <SubHeadingText>
                  Email Notifications: {emailStatus ? "ON" : "OFF"}
                </SubHeadingText>
                <SwitchInput control={control} name="sendEmail" />
              </View>
              <View
                style={tw`w-full bg-transparent flex flex-row justify-between items-center mt-8`}
              >
                <Icon name="sms" />
                <SubHeadingText>
                  SMS Notifications: {smsStatus ? "ON" : "OFF"}
                </SubHeadingText>
                <SwitchInput control={control} name="sendSms" />
              </View>
              <View
                style={tw`w-full bg-transparent flex flex-row justify-between items-center mt-8`}
              >
                <Icon name="bell" />
                <SubHeadingText>
                  Push Notifications: {pushStatus ? "ON" : "OFF"}
                </SubHeadingText>
                <SwitchInput control={control} name="sendPush" />
              </View>
            </Container>
          )}
          <ErrorModal
            isVisible={error !== null}
            onClose={() => router.back()}
            message={error?.code || error?.message || JSON.stringify(error)}
          />
        </>
      )}
    </Screen>
  );
};
export default Notifications;
