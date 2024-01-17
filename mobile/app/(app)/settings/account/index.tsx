import { useEffect, useState } from "react";
import { Loader } from "components/Loader";
import { AuthStore, ErrorStore } from "stores";
import { functions } from "firebase-config";
import { Modal } from "components/Modal";
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
  View,
  NameGroup,
  PhoneInput,
  AddressInput,
} from "components/themed";
import { useForm } from "react-hook-form";
import tw from "tailwind";
import { TouchableOpacity } from "react-native";
import { httpsCallable } from "firebase/functions";
import { router } from "expo-router";
import { isTablet } from "utils/isTablet";

const AccountSettings = () => {
  const { user, client } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showChangeEmailModal, setShowChangeEmailModal] =
    useState<boolean>(false);
  const [showAccountDeletionConfirmation, setShowAccountDeletionConfirmation] =
    useState<boolean>(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [zipcode, setZipcode] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (client) reset(client);
  }, [client, reset]);

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  useEffect(() => {
    if (client) reset(client);
  }, [client, reset]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const clientData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      location,
    };
    if (data?.address) {
      const address: Array<string> = data?.address.split(",").slice(0, 3);
      clientData.street = address[0].trim();
      clientData.city = address[1].trim();
      clientData.zip = address[2].split(" ")[2];
    }
    const updateClient = httpsCallable(functions, "updateClient");
    await updateClient(clientData)
      .then((result) => {
        if (!result.data)
          setError({
            message: "Failed to Save Updates",
            source: "updateClient",
          });
      })
      .catch((error: any) => setError({ ...error, source: "updateClient" }))
      .finally(() => setIsLoading(false));
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    const deleteMoVETAccount = httpsCallable(functions, "deleteAccount");
    await deleteMoVETAccount()
      .then((result) => {
        if (!result.data)
          setError({
            message: "Failed to Delete Account",
            source: "deleteMoVETAccount",
          });
        else router.navigate("/(app)/settings/sign-out");
      })
      .catch((error: any) =>
        setError({ ...error, source: "deleteMoVETAccount" }),
      )
      .finally(() => {
        setShowAccountDeletionConfirmation(false);
        setIsLoading(false);
      });
  };
  return (
    <Screen>
      {client === null ? (
        <Container style={tw`w-full flex-1`}><Loader description={"Loading Account Settings..."} /></Container>
      ) : (
        <>
          <Container
            style={[
              isTablet ? tw`px-16` : tw`px-4`,
              tw`flex-grow w-full items-center justify-center`,
            ]}
            >
            <Container style={tw`mt-4 mb-2 w-full`}>
              <SubHeadingText style={tw`self-start`}>Email</SubHeadingText>
              <TouchableOpacity onPress={() => setShowChangeEmailModal(true)}>
                <BodyText style={tw`text-center`}>{user.email}</BodyText>
              </TouchableOpacity>
              {!user.emailVerified && (
                <ItalicText
                  noDarkMode
                  style={tw`text-movet-red text-xs mt-1 text-center`}
                >
                  EMAIL ADDRESS VERIFICATION REQUIRED!
                </ItalicText>
              )}
            </Container>
            <Container style={tw`mt-4 mb-2 w-full`}>
              <SubHeadingText style={tw`self-start`}>Name</SubHeadingText>
              <NameGroup
                control={control}
                errors={errors}
                editable={!isLoading}
              />
            </Container>
            <Container style={tw`mt-4 mb-2 w-full`}>
              <SubHeadingText style={tw`self-start`}>Phone</SubHeadingText>
              <PhoneInput
                editable={!isLoading}
                control={control}
                error={(errors["phone"] as any)?.message as string}
                name="phone"
                defaultValue={client?.phone}
              />
            </Container>
            <Container style={tw`mt-4`}>
              <SubHeadingText style={tw`self-start mb-4`}>
                Address
              </SubHeadingText>
              <AddressInput
                editable={!isLoading}
                control={control}
                error={((errors as any)["address"] as any)?.message as string}
                name="address"
                setValue={setValue}
                watch={watch}
                defaultValue={client.address || ""}
                zip={zipcode}
                setZip={setZipcode}
                location={location}
                setLocation={setLocation}
              />
            </Container>
            <SubmitButton
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              disabled={!isDirty || isLoading}
              loading={isLoading}
              title={isLoading ? "Saving Changes..." : "Save Changes"}
              color="black"
              iconName="check"
              style={tw`mt-16`}
            />
            <TouchableOpacity
              style={tw`w-full mt-16 flex-row items-center justify-center mb-8`}
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
              <ActionButton
                title="Delete My Account"
                iconName="check"
                onPress={() => {
                  if (__DEV__)
                    alert("This feature is not available in development mode.");
                  else deleteAccount();
                }}
              />
            </View>
          </Modal>
          <Modal
            isVisible={showChangeEmailModal}
            onClose={() => {
              setShowChangeEmailModal(false);
            }}
            title="Further Action Required"
          >
            <View style={tw`flex-col items-center justify-center rounded-xl`}>
              <ItalicText>
                Please contact us if you need to change your email address.
              </ItalicText>
              <ActionButton
                title="Contact Us"
                iconName="arrow-right"
                onPress={() => {
                  setShowChangeEmailModal(false);
                  router.navigate({
                    pathname: "/(app)/settings/account/web-view",
                    params: {
                      path: "/contact",
                      queryString: `${
                        client?.firstName
                          ? `&firstName=${client?.firstName}`
                          : ""
                      }${
                        client?.lastName ? `&lastName=${client?.lastName}` : ""
                      }${client?.email ? `&email=${client?.email}` : ""}${
                        client?.phone
                          ? `&phone=${client?.phone
                              ?.replaceAll(" ", "")
                              ?.replaceAll("(", "")
                              ?.replaceAll(")", "")
                              ?.replaceAll("-", "")}`
                          : ""
                      }&message=I need to change the email address for my MoVET account. Please use <NEW_EMAIL_ADDRESS> going forward. Thanks!`
                        ?.replaceAll(")", "")
                        ?.replaceAll("(", ""),
                    },
                  });
                }}
              />
            </View>
          </Modal>
        </>
      )}
    </Screen>
  );
};
export default AccountSettings;
