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
import {
  ActionButton,
  BodyText,
  Container,
  Icon,
  ItalicText,
  Screen,
  SubHeadingText,
  SubmitButton,
  SwitchInput,
  View,
} from "components/themed";
import { useForm } from "react-hook-form";
import tw from "tailwind";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  ActivityIndicator,
  Linking,
  Platform,
  useColorScheme,
} from "react-native";
import { isTablet } from "utils/isTablet";
import { httpsCallable } from "firebase/functions";
import { ErrorStore } from "stores";

const NotificationSettings = () => {
  const { user } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDarkMode = useColorScheme() !== "light";
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

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return { data: "MISSING_PERMISSION" };
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas?.projectId,
      });
    } else return { data: "SIMULATOR_TOKEN" };
    if (Platform.OS === "android")
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: tw.color("movet-red"),
      });
    return token;
  };

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
          setError({
            message: "MISSING CLIENT DATA",
            source: "unsubscribeNotificationSettings",
          });
        }
      },
      (error: any) => {
        setNotificationSettings(null);
        setIsLoading(false);
        setError({ ...error, source: "unsubscribeNotificationSettings" });
      },
    );
    return () => unsubscribeNotificationSettings();
  }, [user, reset]);

  useEffect(() => {
    if (notificationSettings) reset(notificationSettings);
  }, [notificationSettings, reset]);

  useEffect(() => {
    if (pushStatus)
      registerForPushNotificationsAsync().then(async (token: any) => {
        setPushToken(token?.data);
        const deviceInfo = JSON.parse(
          JSON.stringify(Device, (key: any, value: any) =>
            value === undefined ? null : value,
          ),
        );
        // await setDoc(
        //   doc(firestore, "clients", user?.uid),
        //   {
        //     sendPush: true,
        //     updatedOn: serverTimestamp(),
        //   },
        //   { merge: true },
        // );
        let existingTokens: any[] = [];
        const tokenAlreadyExists = await getDoc(
          doc(firestore, "push_tokens", user?.uid),
        ).then((doc: any) => {
          if (doc.exists()) {
            existingTokens = doc.data().tokens;
            if (
              doc
                .data()
                .tokens.find(
                  (existingToken: any) => existingToken.token === token?.data,
                )
            )
              return true;
          } else return false;
        });
        if (tokenAlreadyExists === false)
          await setDoc(doc(firestore, "push_tokens", user?.uid), {
            tokens: [
              {
                token: token?.data,
                isActive: true,
                device: deviceInfo,
                createdOn: new Date(),
              },
            ],
            user: {
              displayName: user?.displayName,
              email: user?.email,
              emailVerified: user?.emailVerified,
              photoURL: user?.photoURL,
              uid: user?.uid,
              phoneNumber: user?.phoneNumber,
            },
            createdOn: serverTimestamp(),
          });
        else if (tokenAlreadyExists === undefined)
          await setDoc(
            doc(firestore, "push_tokens", user?.uid),
            {
              tokens: arrayUnion({
                token: token?.data,
                isActive: true,
                device: deviceInfo,
                createdOn: new Date(),
              }),
              user: {
                displayName: user?.displayName,
                email: user?.email,
                emailVerified: user?.emailVerified,
                photoURL: user?.photoURL,
                uid: user?.uid,
                phoneNumber: user?.phoneNumber,
              },
              updatedOn: serverTimestamp(),
            },
            { merge: true },
          );
        else if (tokenAlreadyExists) {
          const newTokenData = existingTokens.map((existingToken: any) => {
            if (existingToken?.token === token?.data) {
              return {
                token: token?.data,
                isActive: true,
                device: deviceInfo,
                updatedOn: new Date(),
                createdOn: existingToken?.createdOn,
              };
            } else return existingToken;
          });
          await setDoc(
            doc(firestore, "push_tokens", user?.uid),
            {
              tokens: newTokenData,
              user: {
                displayName: user?.displayName,
                email: user?.email,
                emailVerified: user?.emailVerified,
                photoURL: user?.photoURL,
                uid: user?.uid,
                phoneNumber: user?.phoneNumber,
              },
              updatedOn: serverTimestamp(),
            },
            { merge: true },
          );
        }
      });
  }, [pushStatus, user]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const updateClient = httpsCallable(functions, "updateClient");
    await updateClient({
      sendEmail: data?.sendEmail,
      sendSms: data?.sendSms,
      sendPush: data?.sendPush,
    })
      .then((result) => {
        if (!result.data)
          setError({ message: "Failed to Save Updates", source: "onSubmit" });
      })
      .catch((error: any) => setError({ ...error, source: "onSubmit" }))
      .finally(() => setIsLoading(false));
  };

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  return (
    <Screen>
      {notificationSettings === null ? (
        <Container style={tw`w-full flex-1`}><Loader description={"Loading Notification Settings..."} /></Container>
      ) : (
        <>
          <Container
            style={[
              isTablet ? tw`px-16` : tw`px-4`,
              tw`flex-grow w-full items-center justify-center`,
            ]}
          >
            <BodyText
              style={emailStatus ? tw`text-center mb-4` : tw`text-center`}
            >
              Use the toggles below to control which kind of notifications you
              receive.
            </BodyText>
            {!emailStatus && (
              <ItalicText style={tw`text-center my-4`}>
                * MoVET will always send you an appointment reminder
                notification to help make sure you never miss an appointment.
              </ItalicText>
            )}
            <View
              style={tw`w-full bg-transparent flex flex-row justify-between items-center mt-6`}
            >
              <Icon name="envelope" size={isTablet ? "md" : "sm"} />
              <SubHeadingText style={isTablet ? tw`text-lg` : tw`text-base`}>
                Email Notifications: {emailStatus ? "ON" : "OFF"}
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
                SMS Notifications: {smsStatus ? "ON" : "OFF"}
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
                Push Notifications: {pushStatus ? "ON" : "OFF"}
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
            <SubmitButton
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              disabled={!isDirty || isLoading}
              loading={isLoading}
              title={isLoading ? "Saving Changes..." : "Save Changes"}
              color="black"
              iconName="check"
            />
            <ActionButton
              type="text"
              iconName={"gear"}
              style={tw`text-center mt-0 w-full`}
              textStyle={tw`text-movet-black dark:text-movet-white`}
              title="Open System Setting"
              onPress={() => Linking.openSettings()}
            />
          </Container>
        </>
      )}
    </Screen>
  );
};
export default NotificationSettings;
