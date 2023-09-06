/* eslint-disable react-hooks/exhaustive-deps */
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bubble,
  GiftedChat,
  IMessage,
  Send,
  SendProps,
  SystemMessage,
} from "react-native-gifted-chat";
import CustomActions from "components/chat/CustomActions";
import tw from "tailwind";
import { AuthStore } from "stores";
import {
  onSnapshot,
  doc,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "firebase-config";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Text, View, Button, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { ErrorBoundaryProps } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1 }}>
      <Text>{props.error.message}</Text>
      <Text>{JSON.stringify(props.error)}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </View>
  );
}

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
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants?.expoConfig?.extra?.eas?.projectId,
    });
    alert("PUSH TOKEN: " + token);
  } else alert("Must use physical device for Push Notifications");

  if (Platform.OS === "android")
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: tw.color("movet-red"),
    });

  return token;
};

const defaultMessages: IMessage[] = [
  {
    _id: 1,
    text: "Welcome to MoVET's Telehealth Chat!\n\nPlease submit a question via the field below to start your chat with a MoVET expert.",
    createdAt: new Date(),
    system: true,
    user: {
      _id: 0,
      name: "system",
    },
  },
];
const ChatIndex = () => {
  const { user } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any>(false);
  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) =>
      setExpoPushToken(token),
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        alert(JSON.stringify(notification));
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
        alert(JSON.stringify(response));
      });
    return () => {
      Notifications.removeNotificationSubscription(
        (notificationListener as any).current,
      );
      Notifications.removeNotificationSubscription(
        (responseListener as any).current,
      );
    };
  }, []);

  useEffect(() => {
    if (user?.uid) {
      const unsubscribeChatLogDocuments = onSnapshot(
        query(
          collection(firestore, `telehealth_chat/${user?.uid}/log`),
          orderBy("createdAt", "desc"),
          limit(1000),
        ),
        (querySnapshot) => {
          const previousMessages: IMessage[] = [];
          querySnapshot.forEach((doc) => {
            previousMessages.push({
              ...(doc?.data() as any),
              createdAt: doc?.data()?.createdAt.toDate(),
            });
          });
          setMessages(previousMessages);
          setIsLoading(false);
        },
      );
      return () => unsubscribeChatLogDocuments();
    }
  }, [user?.uid]);

  useEffect(() => {
    if (messages && messages?.length === 0) setMessages(defaultMessages);
  }, [messages]);

  async function sendPushNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      await addDoc(
        collection(firestore, `telehealth_chat/${user?.uid}/log`),
        messages[0],
      );
      if (messages[0].text)
        await setDoc(
          doc(firestore, "telehealth_chat", `${user?.uid}`),
          {
            updatedOn: new Date(),
            question: messages[0].text,
            status: "active",
          },
          { merge: true },
        );
    },
    [user?.uid],
  );

  const uploadImageAsync = async (uri: any) => {
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);

      xhr.onerror = (error: any) => {
        console.error(error);
        alert(error);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, `clients/${user?.uid}/` + uuid());
    await uploadBytes(fileRef, blob).catch((error) => {
      console.error(error);
      alert(error);
    });
    blob.close();
    return await getDownloadURL(fileRef).catch((error) => {
      console.error(error);
      alert(error);
    });
  };

  const onSendFromUser = useCallback(async (messages: IMessage[] = []) => {
    setMessages([
      ...messages,
      {
        _id: 1,
        text: "Uploading file, please wait...",
        createdAt: new Date(),
        system: true,
        user: {
          _id: 0,
          name: "system",
        },
      },
    ]);
    const messagesToUpload: any = messages.map((message) => ({
      ...message,
      user: {
        _id: user?.uid,
        name: user?.displayName,
        avatar: user?.photoURL,
      },
      createdAt: new Date(),
      _id: Math.round(Math.random() * 1000000),
    }));
    const messagesUploaded: IMessage[] = [];
    await Promise.all(
      messagesToUpload.map(async (message: IMessage) =>
        messagesUploaded.push({
          ...message,
          image: (await uploadImageAsync(message?.image)) as string,
        }),
      ),
    );
    onSend(messagesUploaded);
  }, []);

  const renderCustomActions = useCallback(
    (props: any) => <CustomActions {...props} onSend={onSendFromUser} />,
    [onSendFromUser],
  );

  const renderSystemMessage = useCallback((props: any) => {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
          marginHorizontal: 10,
        }}
        textStyle={{
          textAlign: "center",
          fontSize: 14,
          color: tw.color("movet-black"),
          fontStyle: "italic",
        }}
      />
    );
  }, []);

  const renderSend = useCallback((props: SendProps<IMessage>) => {
    return (
      <Send {...props} containerStyle={{ justifyContent: "center" }}>
        <MaterialIcons
          size={30}
          color={"tomato"}
          name={"send"}
          style={tw`mr-2`}
        />
      </Send>
    );
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: tw.color("movet-black"),
          },
          left: {
            color: tw.color("movet-black"),
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: tw.color(`movet-white`),
          },
          left: {
            backgroundColor: tw.color(`movet-red/20`),
          },
        }}
      />
    );
  };
  return (
    <View style={tw`flex-1 bg-white`}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text>Your expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text>
            Title: {notification && notification.request.content.title}{" "}
          </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>
            Data:{" "}
            {notification && JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            await sendPushNotification(expoPushToken as any);
          }}
        />
      </View>
      <GiftedChat
        infiniteScroll
        scrollToBottom
        messages={isLoading || user === null ? defaultMessages : messages}
        renderBubble={renderBubble}
        onSend={(messages: IMessage[]) => onSend(messages)}
        user={{
          _id: user?.uid,
          name: user?.displayName,
          avatar: user?.photoURL,
        }}
        renderAvatar={null}
        renderActions={renderCustomActions}
        renderSystemMessage={renderSystemMessage}
        renderSend={renderSend}
        keyboardShouldPersistTaps="never"
        timeTextStyle={{
          left: {
            color: tw.color(`movet-black/75`),
            fontSize: 10,
            fontStyle: "italic",
          },
          right: {
            color: tw.color(`movet-black/75`),
            fontSize: 10,
            fontStyle: "italic",
          },
        }}
      />
    </View>
  );
};

export default ChatIndex;
