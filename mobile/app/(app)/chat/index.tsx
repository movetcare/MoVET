import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { View } from "react-native";
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
import { onSnapshot, doc } from "firebase/firestore";
import { firestore } from "firebase-config";

enum ActionKind {
  SEND_MESSAGE = "SEND_MESSAGE",
}

function reducer(
  state: {
    messages: any[];
    step: number;
  },
  action: {
    type: ActionKind;
    payload?: any;
  }
) {
  switch (action.type) {
    case ActionKind.SEND_MESSAGE: {
      return {
        ...state,
        step: state.step + 1,
        messages: action.payload,
      };
    }
  }
}

const ChatIndex = () => {
  const { user } = AuthStore.useState();
  const [chatUser, setChatUser] = useState<any>();
  const [state, dispatch] = useReducer(reducer, {
    messages: [],
    step: 0,
  });

  useEffect(() => {
    const unsubscribeChatRootDocument = onSnapshot(
      doc(firestore, "telehealth_chat", `${user?.uid}`),
      (doc) => {
        console.log("Current data: ", doc.data());
        alert(JSON.stringify(doc.data()));
      }
    );
    return () => unsubscribeChatRootDocument();
  }, []);

  useEffect(() => {
    if (user)
      setChatUser({
        _id: user?.uid,
        name: user.displayName,
      });
  }, [user]);

  useEffect(() => {
    if (state.messages && state.messages.length === 0)
      dispatch({
        type: ActionKind.SEND_MESSAGE,
        payload: GiftedChat.append(
          [
            {
              _id: 1,
              text: "Welcome to MoVET's Telehealth Chat!\n\nPlease submit a question via the field below to start your chat with a MoVET expert...",
              createdAt: new Date(),
              system: true,
              user: {
                _id: 0,
                name: "system",
              },
            },
          ],
          [],
          true
        ),
      });
  }, [state]);

  const onSend = useCallback(
    (messages: any[]) => {
      const sentMessages = [{ ...messages[0] }];
      const newMessages = GiftedChat.append(state.messages, sentMessages, true);
      dispatch({ type: ActionKind.SEND_MESSAGE, payload: newMessages });
    },
    [dispatch, state.messages]
  );

  const onSendFromUser = useCallback(
    (messages: IMessage[] = []) => {
      console.log("messages", messages);
      const createdAt = new Date();
      const messagesToUpload = messages.map((message) => ({
        ...message,
        user,
        createdAt,
        _id: Math.round(Math.random() * 1000000),
      }));
      onSend(messagesToUpload);
    },
    [onSend]
  );

  const renderCustomActions = useCallback(
    (props: any) => <CustomActions {...props} onSend={onSendFromUser} />,
    [onSendFromUser]
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
        <MaterialIcons size={30} color={"tomato"} name={"send"} />
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
            backgroundColor: tw.color(`movet-white`),
          },
        }}
      />
    );
  };
  return (
    <View style={tw`flex-1 bg-white`}>
      <GiftedChat
        infiniteScroll
        scrollToBottom
        messages={state.messages}
        renderBubble={renderBubble}
        onSend={onSend}
        user={chatUser}
        renderActions={renderCustomActions}
        renderSystemMessage={renderSystemMessage}
        renderSend={renderSend}
        keyboardShouldPersistTaps="never"
        timeTextStyle={{
          left: { color: tw.color(`movet-black`) },
          right: { color: tw.color(`movet-black`) },
        }}
      />
    </View>
  );
};

export default ChatIndex;
