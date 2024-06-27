import { router } from "expo-router";
import { useState } from "react";
import tw from "tailwind";
import { ActionButton, Container } from "./themed";
import { AuthStore } from "stores";
import { Modal } from "./Modal";

export const RequestRecords = ({
  patientName = "",
  source = "pets",
  color = "black",
}: {
  patientName: string;
  source?: "pets" | "home";
  color?: "black" | "brown";
}) => {
  const { client } = AuthStore.useState();
  const [showRecordsRequestModal, setShowRecordsRequestModal] =
    useState<boolean>(false);
  return (
    <>
      <ActionButton
        color={color}
        title="Request Records"
        iconName="folder-heart"
        onPress={() => setShowRecordsRequestModal(true)}
        style={tw`sm:w-0.9/3`}
      />
      <Modal
        isVisible={showRecordsRequestModal}
        onClose={() => {
          setShowRecordsRequestModal(false);
        }}
        title="Request Pet Records"
      >
        <Container style={[tw`mb-4`]}>
          <ActionButton
            color="black"
            title="Vaccines Records Only"
            iconName="syringe"
            style={tw`w-full`}
            onPress={() => {
              setShowRecordsRequestModal(false);
              router.navigate({
                pathname:
                  source === "pets"
                    ? "/(app)/pets/detail/web-view"
                    : "/(app)/home/pet/web-view",
                params: {
                  path: "/contact",
                  queryString: `${
                    client?.firstName ? `&firstName=${client?.firstName}` : ""
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
                  }&message=Please send a copy of ${patientName}'s vaccine records to <EMAIL_ADDRESS>. Thanks!`
                    ?.replaceAll(")", "")
                    ?.replaceAll("(", ""),
                },
              });
            }}
          />
          <ActionButton
            style={tw`w-full`}
            title="Full Medical Records"
            iconName="folder-heart"
            onPress={() => {
              setShowRecordsRequestModal(false);
              router.navigate({
                pathname:
                  source === "pets"
                    ? "/(app)/pets/detail/web-view"
                    : "/(app)/home/pet/web-view/",
                params: {
                  path: "/contact",
                  queryString: `${
                    client?.firstName ? `&firstName=${client?.firstName}` : ""
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
                  }&message=Please send a copy of ${patientName}'s full medical records to <EMAIL_ADDRESS>. Thanks!`
                    ?.replaceAll(")", "")
                    ?.replaceAll("(", ""),
                },
              });
            }}
          />
        </Container>
      </Modal>
    </>
  );
};
