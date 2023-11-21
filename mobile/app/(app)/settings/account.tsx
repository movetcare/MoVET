import { useEffect, useState } from "react";
import { Loader } from "components/Loader";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthStore } from "stores";
import { firestore, functions } from "firebase-config";
import { ErrorModal, Modal } from "components/Modal";
import {
  ActionButton,
  BodyText,
  ButtonText,
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
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { isTablet } from "utils/isTablet";
import { httpsCallable } from "firebase/functions";
import { router } from "expo-router";

const AccountSettings = () => {
  const { user } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const isDarkMode = useColorScheme() !== "light";
  const [accountSettings, setAccountSettings] = useState<any>(null);
  const [showAccountDeletionConfirmation, setShowAccountDeletionConfirmation] =
    useState<boolean>(false);
  const {
    control,
    handleSubmit,
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
    const unsubscribeAccountSettings = onSnapshot(
      doc(firestore, "clients", user?.uid),
      (doc) => {
        if (doc.exists()) {
          setIsLoading(false);
          setAccountSettings({
            sendSms: doc.data()?.sendSms || false,
            sendEmail: doc.data()?.sendEmail || false,
            sendPush: doc.data()?.sendPush || false,
          });
        } else {
          setAccountSettings(null);
          setIsLoading(false);
          setError({ message: "MISSING CLIENT DATA" });
        }
      },
      // (error: any) => {
      //   setAccountSettings(null);
      //   setIsLoading(false);
      //   setError(error);
      // }
    );
    return () => unsubscribeAccountSettings();
  }, [user]);

  useEffect(() => {
    if (accountSettings) reset(accountSettings);
  }, [accountSettings, reset]);

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

  const deleteAccount = async () => {
    setIsLoading(true);
    const deleteMoVETAccount = httpsCallable(functions, "deleteAccount");
    await deleteMoVETAccount()
      .then((result) => {
        if (!result.data) setError({ message: "Failed to Delete Account" });
        else router.push("/(app)/settings/sign-out");
      })
      .catch((error: any) => setError(error))
      .finally(() => {
        setShowAccountDeletionConfirmation(false);
        setIsLoading(false);
      });
  };
  return (
    <Screen>
      {accountSettings === null ? (
        <Loader description={"Loading Account Settings..."} />
      ) : (
        <>
          <Container
            style={tw`flex-grow w-full items-center justify-center px-4`}
          >
            <SubHeadingText style={tw`self-start`}>Email</SubHeadingText>
            <SubHeadingText style={tw`self-start`}>Name</SubHeadingText>
            <SubHeadingText style={tw`self-start`}>Phone</SubHeadingText>
            <BodyText>{user.email}</BodyText>
            <SubmitButton
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              disabled={!isDirty || isLoading}
              loading={isLoading}
              title={isLoading ? "Saving Changes..." : "Save Changes"}
              color="red"
              iconName="check"
            />
            <TouchableOpacity
              style={tw`w-full mt-16 flex-row items-center justify-center`}
              onPress={() => setShowAccountDeletionConfirmation(true)}
            >
              <Icon name="trash" height={14} width={14} />
              <ButtonText style={tw`text-xs ml-2`}>
                Delete My Account
              </ButtonText>
            </TouchableOpacity>
          </Container>
          <Modal
            isVisible={showAccountDeletionConfirmation}
            onClose={() => {
              setShowAccountDeletionConfirmation(false);
            }}
            title="Are You Sure...?"
          >
            <View style={tw`flex-col items-center justify-center rounded-xl`}>
              <ItalicText>
                Deleting your account will erase ALL of your data. This action
                can not be undone.
              </ItalicText>
              <Container
                style={tw`flex-row w-full items-center justify-around`}
              >
                <ActionButton
                  title="Cancel"
                  iconName="close"
                  color="black"
                  onPress={() => setShowAccountDeletionConfirmation(false)}
                  style={tw`w-1/2 mr-4`}
                />
                <ActionButton
                  title="Delete Account"
                  iconName="check"
                  onPress={() => {
                    if (__DEV__)
                      alert(
                        "This feature is not available in development mode.",
                      );
                    else deleteAccount();
                  }}
                  style={tw`w-1/2 ml-4`}
                />
              </Container>
            </View>
          </Modal>
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
