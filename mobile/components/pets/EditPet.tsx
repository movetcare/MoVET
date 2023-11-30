import {
  Container,
  DateInput,
  Icon,
  NameInput,
  RadioInput,
  SelectInput,
  SubHeadingText,
  SubmitButton,
  View,
} from "components/themed";
import {
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as Linking from "expo-linking";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { functions, storage } from "firebase-config";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { isTablet } from "utils/isTablet";
import { sortDataBy } from "utils/sortDataBy";
import { AuthStore, ErrorStore } from "stores";
import { ErrorModal } from "components/Modal";
import { router } from "expo-router";

export const EditPet = ({ mode }: { mode: "add" | "edit" }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canineBreeds, setCanineBreeds] = useState<any>(null);
  const [felineBreeds, setFelineBreeds] = useState<any>(null);
  const { user } = AuthStore.useState();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
    watch,
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      name: null,
      species: null,
      gender: null,
      breed: null,
      birthday: null,
    },
  });
  const selectedSpecies = watch("species");

  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoading(true);
      const getBreeds = httpsCallable(functions, "getBreeds");
      await getBreeds()
        .then((result: any) => {
          if (!result.data) setError({ message: "Failed to Get Breeds" });
          else {
            setCanineBreeds(sortDataBy(result?.data[0]?.breeds, "title"));
            setFelineBreeds(sortDataBy(result?.data[1]?.breeds, "title"));
          }
        })
        .catch((error: any) => setError(error))
        .finally(() => setIsLoading(false));
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (petImage) setIsLoading(false);
  }, [petImage]);

  const uploadMedia = () => {
    setIsLoading(true);
    const options = ["Choose From Library", "Take Picture", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImageAsync();
            return;
          case 1:
            takePictureAsync();
            return;
          case 2:
            setIsLoading(false);
            return;
        }
      },
    );
  };

  const getPermissionAsync = async (
    permission: "mediaLibrary" | "camera" = "mediaLibrary",
  ) => {
    const { status } =
      permission === "mediaLibrary"
        ? await ImagePicker.requestMediaLibraryPermissionsAsync()
        : await ImagePicker.requestCameraPermissionsAsync();
    if (status === "denied") {
      Alert.alert(
        "Cannot be done 😞",
        `If you would like to use this feature, you'll need to enable the ${
          permission === "mediaLibrary" ? "Photo Library" : "Camera"
        } permission in your phone settings.`,
        [
          {
            text: "Let's go!",
            onPress: () => Linking.openURL("app-settings:"),
          },
          {
            text: "Nevermind",
            onPress: () => {
              setIsLoading(false);
            },
            style: "cancel",
          },
        ],
        { cancelable: true },
      );
      return false;
    }
    return true;
  };

  const pickImageAsync = async () => {
    try {
      await getPermissionAsync("mediaLibrary");
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaLibraryPermission.status !== "denied") {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        delete (result as any).cancelled;
        if (!result.canceled) {
          setPetImage(result.assets[0]?.uri);
          return result.assets[0]?.uri;
        } else setIsLoading(false);
      } else if (mediaLibraryPermission.status === "denied")
        await getPermissionAsync("mediaLibrary");
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  const takePictureAsync = async () => {
    try {
      await getPermissionAsync("camera");
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== "denied") {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        if (!result.canceled) {
          setPetImage(result.assets[0]?.uri);
          return result.assets[0]?.uri;
        } else setIsLoading(false);
      } else if (cameraPermission.status === "denied")
        await getPermissionAsync("camera");
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  const uploadImageAsync = async (uri: any, id: number) => {
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = (error: any) => {
        setIsLoading(false);
        setError(error);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, `clients/${user?.uid}/patients/${id}/profile`);
    await uploadBytes(fileRef, blob).catch((error) => {
      setIsLoading(false);
      setError(error);
    });
    blob.close();
    return await getDownloadURL(fileRef).catch((error) => {
      setIsLoading(false);
      setError(error);
    });
  };

  const modifyDateStringMDY = (date: string | null): string => {
    if (date !== null) {
      const dateArray = date.split("-");
      dateArray[0].length === 4
        ? dateArray.push(dateArray.splice(0, 1)[0])
        : dateArray.unshift(dateArray.splice(2, 1)[0]);
      return dateArray.join("-");
    } else return "";
  };

  const setError = (error: any) => {
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const patientData = {
      name: data.name,
      breed: data.breed ? data.breed : data.species === "Dog" ? "6714" : "6713",
      species: data.species,
      gender: data.gender,
      birthday: modifyDateStringMDY(data.birthday),
    };
    if (mode === "add") {
      try {
        const createPatient = httpsCallable(functions, "createPatient");
        await createPatient(patientData)
          .then(async (result: any) => {
            if (result.data) {
              if (petImage) {
                const photoUrl = await uploadImageAsync(petImage, result.data);
                const updatePatient = httpsCallable(functions, "updatePatient");
                await updatePatient({
                  id: result.data,
                  photoUrl,
                })
                  .then((result: any) => {
                    if (!result.data) setError("Failed to Update Pet Photo");
                  })
                  .catch((error: any) => setError(error));
              }
              setIsLoading(false);
              reset();
              setPetImage(null);
              router.back();
            } else setError("Unable to Add a Pet");
            setIsLoading(false);
          })
          .catch((error: any) => setError(error))
          .finally(() => setIsLoading(false));
      } catch (error: any) {
        setIsLoading(false);
        reset();
        setPetImage(null);
        setError(error);
      }
    } else if (mode === "edit") {
      console.log("DATA", data);
    }
  };
  return (
    <View
      style={[
        isTablet ? tw`px-16` : tw`px-4`,
        tw`flex-grow items-center justify-center w-full bg-transparent`,
      ]}
      noDarkMode
    >
      <TouchableOpacity onPress={() => uploadMedia()}>
        <View
          style={tw`w-40 h-40 bg-movet-gray/50 rounded-full mb-4 mt-8`}
          noDarkMode
        >
          {petImage ? (
            <Image
              source={{ uri: petImage }}
              style={tw`w-full h-full rounded-full`}
              alt="uploaded pet image"
            />
          ) : (
            <Container
              style={[
                tw`absolute`,
                isLoading ? tw`top-3.5 left-3.5` : tw`top-13.5 left-13.5`,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={tw.color("movet-white")}
                  style={tw`absolute top-12 left-12`}
                />
              ) : (
                <Icon name="plus" size="xl" color="white" />
              )}
            </Container>
          )}
        </View>
      </TouchableOpacity>
      <SubHeadingText>{petImage ? "Pet Photo" : "Add a Photo"}</SubHeadingText>
      <View style={tw`w-full mb-8`}>
        <SubHeadingText style={tw`mt-3`}>
          Name
          <SubHeadingText style={tw`text-movet-red`} noDarkMode>
            {" "}
            *
          </SubHeadingText>
        </SubHeadingText>
        <NameInput
          editable={!isLoading}
          control={control}
          error={(errors["name"] as any)?.message as string}
          name="name"
          placeholder="What do you call your pet?"
          textContentType="name"
          style={tw`flex bg-transparent mt-4`}
          required
        />
        <SubHeadingText style={tw`mt-6 mb-4`}>
          Type
          <SubHeadingText style={tw`text-movet-red`} noDarkMode>
            {" "}
            *
          </SubHeadingText>
        </SubHeadingText>
        <RadioInput
          editable={!isLoading}
          groupStyle={tw`flex-row`}
          buttonStyle={{
            normal: tw`flex-1 bg-movet-white dark:bg-movet-black dark:border-movet-white border-2 py-4 rounded-3xl text-center`,
            selected: tw`bg-movet-brown border-movet-brown`,
          }}
          buttonTextStyle={{
            normal: tw`text-center`,
            selected: tw`text-movet-white`,
          }}
          control={control}
          data={[
            {
              value: "Dog",
              icon: "dog",
            },
            {
              value: "Cat",
              icon: "cat",
            },
          ]}
          error={(errors["species"] as any)?.message as string}
          name="species"
        />
        <SubHeadingText style={tw`mt-6 mb-4`}>
          Gender
          <SubHeadingText style={tw`text-movet-red`} noDarkMode>
            {" "}
            *
          </SubHeadingText>
        </SubHeadingText>
        <RadioInput
          editable={!isLoading}
          groupStyle={tw`flex-row`}
          buttonStyle={{
            normal: tw`flex-1 bg-movet-white dark:bg-movet-black dark:border-movet-white border-2 py-4 rounded-3xl text-center`,
            selected: tw`bg-movet-brown border-movet-brown`,
          }}
          buttonTextStyle={{
            normal: tw`text-center`,
            selected: tw`text-movet-white`,
          }}
          control={control}
          data={[
            {
              value: "Female",
              icon: "female",
            },
            {
              value: "Male",
              icon: "male",
            },
          ]}
          error={(errors["gender"] as any)?.message as string}
          name="gender"
        />
        <SubHeadingText style={tw`mt-6`}>
          Breed
          <SubHeadingText style={tw`text-movet-red`} noDarkMode>
            {" "}
            *
          </SubHeadingText>
        </SubHeadingText>
        {canineBreeds && selectedSpecies === "Dog" && (
          <SelectInput
            defaultValue={{ id: "", title: "Select a Dog Breed..." }}
            editable={!isLoading}
            control={control}
            error={(errors["breed"] as any)?.message as string}
            name="breed"
            values={canineBreeds}
          />
        )}
        {felineBreeds && selectedSpecies === "Cat" && (
          <SelectInput
            defaultValue={{ id: "", title: "Select a Cat Breed..." }}
            editable={!isLoading}
            control={control}
            error={(errors["breed"] as any)?.message as string}
            name="breed"
            values={felineBreeds}
          />
        )}
        {!selectedSpecies && (
          <SubHeadingText style={tw`text-center text-xs my-6`}>
            Select a Type Above
          </SubHeadingText>
        )}
        <SubHeadingText style={tw`mt-6`}>
          Birthday
          <SubHeadingText style={tw`text-movet-red`} noDarkMode>
            {" "}
            *
          </SubHeadingText>
        </SubHeadingText>
        <DateInput
          editable={!isLoading}
          control={control}
          error={(errors["birthday"] as any)?.message as string}
          name="birthday"
        />
        <View style={tw`mb-8`} />
        <SubmitButton
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          disabled={!isDirty || isLoading}
          loading={isLoading}
          title={isLoading ? "SAVING PET..." : "CONTINUE"}
          color="black"
          iconName={"arrow-right"}
          style={tw`mx-auto`}
        />
      </View>
    </View>
  );
};
