import { Modal as DefaultModal, TouchableOpacity } from "react-native";
import { BodyText, HeadingText, Icon, ItalicText, View } from "./themed";
import tw from "tailwind";

export const Modal = ({
  isVisible,
  onClose,
  title = "Missing Title...",
  message,
  children,
}: {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message?: string | undefined;
  children?: React.ReactNode;
}) => (
  <DefaultModal animationType="fade" transparent={true} visible={isVisible}>
    <View
      style={tw`flex-grow px-[6%] py-[6%] items-center justify-center bg-movet-black/50`}
      noDarkMode
    >
      <View
        style={tw`rounded-t-xl px-6 py-2 flex-row items-center justify-between w-full border-2 border-movet-white bg-movet-black`}
        noDarkMode
      >
        <HeadingText style={tw`text-base text-movet-white`} noDarkMode>
          {title}
        </HeadingText>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" height={22} width={22} color="white" />
        </TouchableOpacity>
      </View>
      <View
        style={tw`w-full border-2 border-movet-white border-t-0 rounded-b-xl flex-col items-center justify-center`}
      >
        {children ? (
          <View style={tw`p-4`}>{children}</View>
        ) : (
          <BodyText
            style={tw`text-movet-black dark:text-movet-white px-4 text-center`}
            noDarkMode
          >
            {message}
          </BodyText>
        )}
      </View>
    </View>
  </DefaultModal>
);

export const ErrorModal = ({
  isVisible,
  onClose,
  message = "Something went wrong...",
}: {
  isVisible: boolean;
  onClose?: () => void;
  message: string | null;
}) => {
  let parsedMessage = message;
  if (typeof message === "string" && message?.includes("auth/"))
    parsedMessage = message.split("auth/")[1].replaceAll("-", " ");
  parsedMessage = (parsedMessage as any)?.toUpperCase();
  return (
    <View style={tw`bg-movet-black/50`} noDarkMode>
      <DefaultModal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        presentationStyle="overFullScreen"
      >
        <View style={tw`h-[15%] w-full rounded-t-xl absolute bottom-0`}>
          <TouchableOpacity onPress={onClose} style={tw`flex-1`}>
            <View
              style={tw`h-[46%] rounded-t-xl px-6 flex-row items-center justify-between w-full border-2 border-movet-white bg-movet-red`}
              noDarkMode
            >
              <ItalicText style={tw`text-xl text-movet-white`} noDarkMode>
                Something Went Wrong...
              </ItalicText>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" height={30} width={30} color="white" />
              </TouchableOpacity>
            </View>
            <View
              style={tw`w-full border-2 border-movet-white border-t-0 h-full flex-1 items-center justify-center`}
            >
              <ItalicText style={tw`text-movet-red`} noDarkMode>
                {parsedMessage}
              </ItalicText>
            </View>
          </TouchableOpacity>
        </View>
      </DefaultModal>
    </View>
  );
};
