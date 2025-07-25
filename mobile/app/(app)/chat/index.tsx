/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
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
import { AuthStore, ErrorStore } from "stores";
import {
  onSnapshot,
  doc,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  setDoc,
  arrayUnion,
  getDoc,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "firebase-config";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform, useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";
import { Icon, View, Screen, Container, ItalicText } from "components/themed";
import { isTablet } from "utils/isTablet";

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

const defaultMessages: IMessage[] = [
  {
    _id: 1,
    text: "Welcome to MoVET!\n\nPlease submit any questions you have for us using the text field below and a MoVET expert will get back to you shortly...",
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
  const [telehealthStatus, setTelehealthStatus] = useState<{
    isOnline: boolean;
    queueSize: number;
    waitTime: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const isDarkMode = useColorScheme() !== "light";

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token: any) => {
      const deviceInfo = JSON.parse(
        JSON.stringify(Device, (key: any, value: any) =>
          value === undefined ? null : value,
        ),
      );
      await setDoc(
        doc(firestore, "clients", user?.uid),
        {
          sendPush: true,
          updatedOn: serverTimestamp(),
        },
        { merge: true },
      );
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
        (error: any) => {
          setIsLoading(false);
          ErrorStore.update((s: any) => {
            s.currentError = error;
          });
        },
      );

      const unsubscribeAlerts = onSnapshot(
        query(collection(firestore, "alerts")),
        (querySnapshot: QuerySnapshot) => {
          if (querySnapshot.empty) {
            setIsLoading(false);
            return;
          }
          querySnapshot.forEach((doc: DocumentData) => {
            if (doc.id === "telehealth") setTelehealthStatus(doc.data());
          });
          setIsLoading(false);
        },
        (error: any) => {
          setIsLoading(false);
          ErrorStore.update((s: any) => {
            s.currentError = error;
          });
        },
      );
      return () => {
        unsubscribeChatLogDocuments();
        unsubscribeAlerts();
      };
    }
  }, [user?.uid]);

  useEffect(() => {
    if (messages && messages?.length === 0) setMessages(defaultMessages);
  }, [messages]);

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      await addDoc(collection(firestore, `telehealth_chat/${user?.uid}/log`), {
        ...messages[0],
        startNewThread: await getDoc(
          doc(firestore, "telehealth_chat", user?.uid),
        ).then((doc: any) => {
          if (doc.exists())
            return doc.data()?.status === "active" ? false : true;
          else return true;
        }),
      });
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
        setError({ ...error, source: "uploadImageAsync XMLHttpRequest" });
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, `clients/${user?.uid}/` + uuid());
    await uploadBytes(fileRef, blob).catch((error) => {
      setError({ ...error, source: "uploadImageAsync uploadBytes" });
    });
    blob.close();
    return await getDownloadURL(fileRef).catch((error) => {
      setError({ ...error, source: "uploadImageAsync getDownloadURL" });
    });
  };

  const onSendFromUser = useCallback(async (messages: IMessage[] = []) => {
    setMessages([
      ...messages,
      {
        _id: "1",
        text: "Uploading file, please wait...",
        createdAt: new Date(),
        system: true,
        user: {
          _id: "0",
          name: "system",
        },
      },
    ]);
    const messagesToUpload: any = messages.map((message) => ({
      ...message,
      user: {
        _id: `${user?.uid}`,
        name: user?.displayName,
        avatar: user?.photoURL,
      },
      createdAt: new Date(),
      _id: `${Math.round(Math.random() * 1000000)}`,
    }));
    const messagesUploaded: IMessage[] = [];
    await Promise.all(
      messagesToUpload.map(async (message: IMessage) => {
        messagesUploaded.push({
          ...message,
          image: (await uploadImageAsync(message?.image)) as string,
        });
      }),
    )
      .then(() => onSend(messagesUploaded))
      .catch((error) => setError({ ...error, source: "messagesToUpload" }));
  }, []);

  const renderCustomActions = useCallback(
    (props: any) => <CustomActions {...props} onSend={onSendFromUser} />,
    [onSendFromUser],
  );

  const renderSystemMessage = useCallback((props: any) => {
    return (
      <Container style={tw`flex-grow w-full`}>
        <Container style={tw`grow items-center justify-center w-full`}>
          <Icon
            name="telehealth"
            width={isTablet ? 150 : 100}
            height={isTablet ? 150 : 100} //style={tw`mt-20`}
          />
        </Container>
        <SystemMessage
          {...props}
          containerStyle={{
            marginBottom: 15,
            marginHorizontal: 14,
            //flex: 1,
          }}
          textStyle={{
            textAlign: "center",
            fontSize: isTablet ? 24 : 16,
            color: isDarkMode
              ? tw.color("movet-white")
              : tw.color("movet-black"),
            fontStyle: "italic",
          }}
        />
      </Container>
    );
  }, []);

  const renderSend = useCallback((props: SendProps<IMessage>) => {
    return (
      <Send {...props} containerStyle={{ justifyContent: "center" }}>
        <Icon name="plane" style={tw`mr-4 -mt-1`} noDarkMode />
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
            color: isDarkMode
              ? tw.color("movet-white")
              : tw.color("movet-black"),
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: isDarkMode
              ? tw.color("movet-white/80")
              : tw.color(`white/60`),
            borderColor: isDarkMode
              ? tw.color("movet-white/50")
              : tw.color("movet-black/50"),
            borderWidth: 0.5,
          },
          left: {
            backgroundColor: isDarkMode
              ? tw.color(`movet-red/70`)
              : tw.color(`movet-red/30`),
            borderColor: isDarkMode
              ? tw.color("movet-white/50")
              : tw.color("movet-black/50"),
            borderWidth: 0.5,
          },
        }}
      />
    );
  };
  return (
    <Screen withBackground="pets" noScroll>
      <View noDarkMode style={tw`flex-1 bg-transparent -mb-1 w-full`}>
        <View
          noDarkMode
          style={tw`${telehealthStatus?.isOnline ? "bg-movet-green" : "bg-movet-red"} px-4 py-1 flex flex-row items-center justify-center`}
        >
          <ItalicText style={tw`text-movet-white text-sm`} noDarkMode>
            MoVET is Currently{" "}
            {telehealthStatus?.isOnline ? "Online!" : "Offline..."}
          </ItalicText>
        </View>
        {telehealthStatus?.isOnline && telehealthStatus?.queueSize > 0 && (
          <View
            noDarkMode
            style={tw`bg-movet-yellow px-4 py-1 flex flex-row items-center justify-center`}
          >
            <ItalicText style={tw`text-movet-white text-xs`} noDarkMode>
              There{" "}
              {telehealthStatus?.queueSize === 1
                ? "is 1 person"
                : "are " + telehealthStatus?.queueSize + " people"}{" "}
              ahead of you.
            </ItalicText>
            <ItalicText style={tw`text-movet-white text-xs`} noDarkMode>
              Estimated response ~{telehealthStatus?.waitTime + " minutes"}
            </ItalicText>
          </View>
        )}
        {!telehealthStatus?.isOnline && (
          <View
            noDarkMode
            style={tw`bg-movet-yellow px-4 py-1 flex flex-row items-center justify-center`}
          >
            <ItalicText style={tw`text-movet-white text-xs`} noDarkMode>
              Leave us a message and we&apos;ll get back to you ASAP
            </ItalicText>
          </View>
        )}
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
          renderActions={renderCustomActions}
          renderSystemMessage={renderSystemMessage}
          renderSend={renderSend}
          keyboardShouldPersistTaps="never"
          timeTextStyle={{
            left: {
              color: isDarkMode
                ? tw.color(`movet-white/80`)
                : tw.color(`movet-black/80`),
              fontSize: 10,
              fontStyle: "italic",
            },
            right: {
              color: tw.color(`movet-black/80`),
              fontSize: 10,
              fontStyle: "italic",
            },
          }}
        />
      </View>
    </Screen>
  );
};

export default ChatIndex;
