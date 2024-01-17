import {
  ActionButton,
  BodyText,
  ButtonText,
  Container,
  DateInput,
  Icon,
  ItalicText,
  NameInput,
  NumberInput,
  RadioInput,
  SelectInput,
  SubHeadingText,
  SubmitButton,
  SwitchInput,
  TextInput,
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
import { useForm } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { isTablet } from "utils/isTablet";
import { sortDataBy } from "utils/sortDataBy";
import {
  Appointment,
  AppointmentsStore,
  AuthStore,
  ErrorStore,
  Patient,
  PatientsStore,
} from "stores";
import { router, useLocalSearchParams } from "expo-router";
import { addMethod, bool, object, string, lazy } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "components/Modal";
import { Loader } from "components/Loader";

addMethod(string as any, "isBeforeToday", function (errorMessage: string) {
  return (this as any).test(
    "test-before-today",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const today = new Date();
      const date = value?.split("-");
      const month = date[0];
      const day = date[1];
      const year = date[2];
      const valueAsDate = new Date(year, month - 1, day);
      return (
        today > valueAsDate || createError({ path, message: errorMessage })
      );
    },
  );
});

addMethod(string as any, "isValidDay", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-day",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const date = value?.split("-");
      const day = date[1];
      return (
        (day <= 31 && day >= 1) || createError({ path, message: errorMessage })
      );
    },
  );
});

addMethod(string as any, "isValidMonth", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-month",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      const date = value?.split("-");
      const month = date[0];
      return (
        (month <= 12 && month >= 1) ||
        createError({ path, message: errorMessage })
      );
    },
  );
});

addMethod(string as any, "isValidWeight", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-weight",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      return (
        (parseInt(value) >= 1 && parseInt(value) <= 300) ||
        createError({ path, message: errorMessage })
      );
    },
  );
});

export const EditPet = ({ mode = "add" }: { mode: "add" | "edit" }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { id } = useLocalSearchParams();
  const { patients } = PatientsStore.useState();
  const { client } = AuthStore.useState();
  const { pastAppointments } = AppointmentsStore.useState();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [petImage, setPetImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploadingPhoto, setIsUploadingPhotos] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [canineBreeds, setCanineBreeds] = useState<any>(null);
  const [felineBreeds, setFelineBreeds] = useState<any>(null);
  const [showPetDeletionConfirmation, setShowPetDeletionConfirmation] =
    useState<boolean>(false);
  const [pastPatientAppointments, setPastPatientAppointments] =
    useState<Array<Appointment> | null>(null);
  const { user } = AuthStore.useState();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, errors },
    watch,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object().shape(
        mode === "add"
          ? {
              name: string()
                .min(2, "Name must contain at least 2 characters")
                .max(80, "Name can not be more than 80 characters")
                .required("A name is required"),
              type: string().required("A type is required"),
              gender: string().required("A gender is required"),
              spayedOrNeutered: bool().nullable().default(false),
              breed: lazy((value: any) =>
                typeof value === "object" &&
                !Array.isArray(value) &&
                value !== null
                  ? object().shape({
                      label: string().trim().min(1, "A breed is required"),
                      value: string().trim().min(1, "A breed is required"),
                    })
                  : string()
                      .matches(/.*\d/, "A breed selection is required")
                      .required("A breed selection is required"),
              ),
              weight: (string() as any)
                .isValidWeight("Weight must be between 1 and 300 pounds")
                .required("A weight is required"),
              birthday: (string() as any)
                .isBeforeToday("Birthday must be before today")
                .isValidDay("Please enter valid day")
                .isValidMonth("Please enter a valid month")
                .required("A birthday is required"),
              aggressionStatus: lazy((value: any) =>
                typeof value === "object" &&
                !Array.isArray(value) &&
                value !== null
                  ? object().shape({
                      name: string()
                        .trim()
                        .min(1, "A selection is required..."),
                    })
                  : string().required("A selection is required!!"),
              ),
              vet: string(),
              notes: string(),
            }
          : {
              name: string()
                .min(2, "Name must contain at least 2 characters")
                .max(80, "Name can not be more than 80 characters")
                .required("A name is required"),
            },
      ),
    ),
    defaultValues:
      mode === "add"
        ? {
            name: "",
            type: "",
            gender: "",
            spayedOrNeutered: false,
            aggressionStatus: "",
            breed: "",
            birthday: "",
            weight: "",
            vet: "",
            notes: "",
          }
        : { name: "" },
  });

  const name = watch("name");
  const specie = watch("type");
  const isNonReproductive = watch("spayedOrNeutered");
  const gender = watch("gender");
  const vet = watch("vet");

  useEffect(() => {
    if (mode === "edit" && id && patients) {
      patients.forEach((patient: Patient) => {
        if (id === `${patient.id}`) {
          if (patient?.photoUrl) setPhotoUrl(patient?.photoUrl);
          reset({
            name: patient?.name || null,
          });
        }
      });
    }
  }, [id, patients, reset, mode]);

  useEffect(() => {
    if (id && pastAppointments && pastAppointments.length > 0) {
      const pastPatientAppointments: Array<Appointment> = [];
      pastAppointments.map((appointment: Appointment) => {
        appointment?.patients?.forEach((patientData: Patient) => {
          if (patientData.id === Number(id))
            pastPatientAppointments.push(appointment);
        });
      });
      if (pastPatientAppointments?.length > 0)
        setPastPatientAppointments(pastPatientAppointments);
    }
  }, [pastAppointments, id]);

  useEffect(() => {
    if (specie && isDirty) setValue("breed", "");
  }, [specie, isDirty, setValue]);

  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoading(true);
      const getBreeds = httpsCallable(functions, "getBreeds");
      await getBreeds()
        .then((result: any) => {
          if (!result.data)
            setError({ message: "Failed to Get Breeds", source: "getBreeds" });
          else {
            setCanineBreeds(sortDataBy(result?.data[0]?.breeds, "title"));
            setFelineBreeds(sortDataBy(result?.data[1]?.breeds, "title"));
          }
        })
        .catch((error: any) => setError({ ...error, source: "getBreeds" }))
        .finally(() => setIsLoading(false));
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (petImage) setIsUploadingPhotos(false);
  }, [petImage]);

  const uploadMedia = () => {
    setIsUploadingPhotos(true);
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
            setIsUploadingPhotos(false);
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
              setIsUploadingPhotos(false);
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
          setPhotoUrl(null);
          return result.assets[0]?.uri;
        } else setIsUploadingPhotos(false);
      } else if (mediaLibraryPermission.status === "denied")
        await getPermissionAsync("mediaLibrary");
    } catch (error: any) {
      setIsUploadingPhotos(false);
      setError({ ...error, source: "pickImageAsync" });
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
        } else setIsUploadingPhotos(false);
      } else if (cameraPermission.status === "denied")
        await getPermissionAsync("camera");
    } catch (error: any) {
      setIsUploadingPhotos(false);
      setError({ ...error, source: "takePictureAsync" });
    }
  };

  const uploadImageAsync = async (uri: any, id: number) => {
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = (error: any) => {
        setIsUploadingPhotos(false);
        setError({ ...error, source: "uploadImageAsync XMLHttpRequest" });
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const fileRef = ref(storage, `clients/${user?.uid}/patients/${id}/profile`);
    await uploadBytes(fileRef, blob).catch((error) => {
      setIsUploadingPhotos(false);
      setError({ ...error, source: "uploadImageAsync uploadBytes" });
    });
    blob.close();
    return await getDownloadURL(fileRef).catch((error) => {
      setIsUploadingPhotos(false);
      setError({ ...error, source: "uploadImageAsync getDownloadURL" });
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

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  const deletePet = async () => {
    setShowPetDeletionConfirmation(false);
    setIsDeleting(true);
    try {
      const updatePatient = httpsCallable(functions, "updatePatient");
      await updatePatient({ archived: true, id })
        .then(async (result: any) => {
          if (result.data) {
            setIsDeleting(false);
            router.replace("/(app)/pets");
          } else
            setError({
              message: "Unable to Delete Pet",
              source: "deletePet updatePatient",
            });
          setIsDeleting(false);
        })
        .catch((error: any) =>
          setError({ ...error, source: "deletePet updatePatient" }),
        )
        .finally(() => setIsDeleting(false));
    } catch (error: any) {
      setIsDeleting(false);
      setError({ ...error, source: "deletePet" });
    }
  };

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    const patientData: any = {
      name: data.name,
    };
    if (mode === "add") {
      try {
        patientData["breed"] = data.breed
          ? data.breed
          : data.species?.toLowerCase() === "dog"
            ? "6714"
            : "6713";
        patientData["species"] = data.type;
        patientData["gender"] = data.gender;
        patientData["birthday"] = modifyDateStringMDY(data.birthday);
        patientData["spayedOrNeutered"] = data.spayedOrNeutered;
        patientData["weight"] = data.weight;
        patientData["aggressionStatus"] = data.aggressionStatus;
        patientData["vet"] = data.vet;
        patientData["notes"] = data.notes;
        const createPatient = httpsCallable(functions, "createPatient");
        await createPatient(patientData)
          .then(async (result: any) => {
            if (result.data) {
              const updatePatient = httpsCallable(functions, "updatePatient");
              if (petImage) {
                const photoUrl = await uploadImageAsync(petImage, result.data);
                await updatePatient({
                  id: result.data,
                  photoUrl,
                })
                  .then((result: any) => {
                    if (!result.data)
                      setError({
                        message: "Failed to Update Pet Photo",
                        source: "onSubmit createPatient updatePatient photoUrl",
                      });
                  })
                  .catch((error: any) =>
                    setError({
                      ...error,
                      source: "onSubmit createPatient updatePatient photoUrl",
                    }),
                  );
              }
              await updatePatient({
                id: result.data,
                ...patientData,
              })
                .then((result: any) => {
                  if (!result.data)
                    setError({
                      message: "Failed to Update Pet Data",
                      source:
                        "onSubmit createPatient updatePatient patientData",
                    });
                })
                .catch((error: any) =>
                  setError({
                    ...error,
                    source: "onSubmit createPatient updatePatient patientData",
                  }),
                );
              setIsSaving(false);
              reset();
              setPetImage(null);
              router.back();
            } else
              setError({
                message: "Unable to Add a Pet",
                source: "onSubmit createPatient",
              });
            setIsSaving(false);
          })
          .catch((error: any) =>
            setError({ ...error, source: "onSubmit createPatient" }),
          )
          .finally(() => setIsSaving(false));
      } catch (error: any) {
        setIsSaving(false);
        reset();
        setPetImage(null);
        setError({ ...error, source: "onSubmit createPatient" });
      }
    } else if (mode === "edit") {
      try {
        patientData["id"] = id;
        if (petImage)
          patientData["photoUrl"] = await uploadImageAsync(
            petImage,
            Number(id),
          );
        const updatePatient = httpsCallable(functions, "updatePatient");
        await updatePatient(patientData)
          .then(async (result: any) => {
            if (result.data) {
              setIsSaving(false);
              router.back();
            } else
              setError({
                message: "Unable to Update a Pet",
                source: "onSubmit updatePatient",
              });
            setIsSaving(false);
          })
          .catch((error: any) =>
            setError({ ...error, source: "onSubmit updatePatient" }),
          )
          .finally(() => setIsSaving(false));
      } catch (error: any) {
        setIsSaving(false);
        reset();
        setPetImage(null);
        setError({ ...error, source: "onSubmit updatePatient" });
      }
    }
  };

  const petIsDead = async () => {
    setIsSaving(true);
    if (mode === "edit") {
      try {
        const patientData: any = {
        };
        patientData["id"] = id;
        patientData["deceased"] = true;
        const updatePatient = httpsCallable(functions, "updatePatient");
        await updatePatient(patientData)
          .then(async (result: any) => {
            if (result.data) {
              setIsSaving(false);
              router.back();
            } else
              setError({
                message: "Unable to Update a Pet",
                source: "onSubmit updatePatient",
              });
            setIsSaving(false);
            router.back();
          })
          .catch((error: any) =>
            setError({ ...error, source: "onSubmit updatePatient" }),
          )
          .finally(() => setIsSaving(false));
      } catch (error: any) {
        setIsSaving(false);
        reset();
        setPetImage(null);
        setError({ ...error, source: "onSubmit updatePatient" });
      }
    } else setIsSaving(false);
  };

  return isLoading || isSaving || isDeleting ? (
    <Container style={tw`flex-1 w-full`}>
      <Loader
        description={
          isSaving
            ? mode === "edit"
              ? `Updating ${name}'s Records...`
              : "Creating Your Pet..."
            : isDeleting
              ? `Deleting "${name}"...`
              : "Loading, Please Wait..."
        }
      />
    </Container>
  ) : (
    <View
      style={[
        isTablet ? tw`px-16` : tw`px-4`,
        tw`flex-grow items-center justify-center w-full bg-transparent`,
      ]}
      noDarkMode
    >
      <TouchableOpacity onPress={() => uploadMedia()}>
        <View
          style={tw`w-40 h-40 bg-movet-gray rounded-full mb-4 mt-8`}
          noDarkMode
        >
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={tw`w-full h-full rounded-full`}
              alt="uploaded pet image"
            />
          ) : petImage ? (
            <Image
              source={{ uri: petImage }}
              style={tw`w-full h-full rounded-full`}
              alt="uploaded pet image"
            />
          ) : (
            <Container
              style={[
                tw`absolute`,
                isUploadingPhoto
                  ? tw`top-3.5 left-3.5`
                  : tw`top-13.5 left-13.5`,
              ]}
            >
              {isUploadingPhoto ? (
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
      <SubHeadingText>
        {photoUrl ? "" : petImage ? "Pet Photo" : "Add a Photo"}
      </SubHeadingText>
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
        {mode === "add" && (
          <>
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
              error={(errors["type"] as any)?.message as string}
              name="type"
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
            <SubHeadingText style={tw`mt-6 mb-4`}>
              Reproductive Status
              <SubHeadingText style={tw`text-movet-red`} noDarkMode>
                {" "}
                *
              </SubHeadingText>
            </SubHeadingText>
            <Container style={tw`w-full flex-col justify-center items-center`}>
              <SwitchInput
                control={control}
                name="spayedOrNeutered"
                color="brown"
              />
              <SubHeadingText style={tw`mt-4`}>
                My pet{" "}
                <ItalicText style={tw`underline`}>
                  {isNonReproductive ? "IS" : "IS NOT"}
                </ItalicText>{" "}
                {gender === "male"
                  ? "neutered"
                  : gender === "female"
                    ? "spayed"
                    : "spayed / neutered"}
              </SubHeadingText>
            </Container>
            <SubHeadingText style={tw`mt-6 mb-4`}>
              Breed
              <SubHeadingText style={tw`text-movet-red`} noDarkMode>
                {" "}
                *
              </SubHeadingText>
            </SubHeadingText>
            {canineBreeds && specie === "Dog" && (
              <SelectInput
                defaultValue={{
                  id: "",
                  title: "Select a Dog Breed...",
                }}
                editable={!isLoading}
                control={control}
                error={(errors["breed"] as any)?.message as string}
                name="breed"
                values={canineBreeds}
              />
            )}
            {felineBreeds && specie === "Cat" && (
              <SelectInput
                defaultValue={{
                  id: "",
                  title: "Select a Cat Breed...",
                }}
                editable={!isLoading}
                control={control}
                error={(errors["breed"] as any)?.message as string}
                name="breed"
                values={felineBreeds}
              />
            )}
            {!specie && (
              <SubHeadingText style={tw`text-center text-xs my-6`}>
                Select a Type Above
              </SubHeadingText>
            )}
            <SubHeadingText style={tw`mt-6`}>
              Weight
              <SubHeadingText style={tw`text-movet-red`} noDarkMode>
                {" "}
                *
              </SubHeadingText>
            </SubHeadingText>
            <Container
              style={tw`flex-row items-center justify-center w-1.5/3 sm:w-1/3 mx-auto`}
            >
              <NumberInput
                control={control}
                name="weight"
                error={(errors["weight"] as any)?.message as string}
                editable={!isLoading}
                minDigits={1}
                maxDigits={3}
                plural={false}
                textContentType="none"
                keyboardType="number-pad"
                placeholder="# of Pounds"
              />
              <SubHeadingText style={tw`text-lg mt-2 ml-4`} noDarkMode>
                LBS
              </SubHeadingText>
            </Container>
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
            <SubHeadingText style={tw`mt-6 mb-4`}>Previous Vet</SubHeadingText>
            <TextInput
              editable={!isLoading}
              control={control}
              error={(errors["vet"] as any)?.message as string}
              name="vet"
              required={false}
              placeholder="Name of Previous Vet"
            />
            {vet !== "" && (
              <ItalicText
                style={tw`text-movet-yellow text-center font-extrabold px-4 mt-4`}
              >
                * Please contact your previous vet and have them forward your
                pet&apos;s medical records to{" "}
                  <ItalicText style={tw`text-movet-red font-extrabold`} noDarkMode>
                  info@movetcare.com
                  </ItalicText>
              </ItalicText>
            )}
            <SubHeadingText style={tw`mt-6 mb-4`}>
              Aggression Status
              <SubHeadingText style={tw`text-movet-red`} noDarkMode>
                *{" "}
              </SubHeadingText>
            </SubHeadingText>
            <BodyText>
              Aggression is defined as the threat of harm to another individual
              involving snarling, growling, snapping, biting, barking or
              lunging.
            </BodyText>
            <ItalicText style={tw`text-center my-4`}>
              Please select one:
            </ItalicText>
            <RadioInput
              editable={!isLoading}
              groupStyle={tw`flex-col`}
              buttonStyle={{
                normal: tw`flex-1 bg-movet-white dark:bg-movet-black dark:border-movet-white border-2 py-4 rounded-3xl text-center`,
                selected: tw`bg-movet-brown border-movet-brown`,
              }}
              buttonTextStyle={{
                normal: tw`text-center px-4`,
                selected: tw`text-movet-white px-4`,
              }}
              control={control}
              data={[
                {
                  value:
                    "I agree, to my knowledge, this pet has no history of aggression or aggressive tendencies.",
                  icon: null,
                },
                {
                  value:
                    "This pet DOES have had a history of aggression or aggressive tendencies.",
                  icon: null,
                },
              ]}
              error={(errors["aggressionStatus"] as any)?.message as string}
              name="aggressionStatus"
              required
            />
            <ItalicText style={tw`text-center text-xs mt-4`}>
              * Please note, this may not disqualify your pet from being seen.
              This information helps our team stay safe and prepare you and your
              pet for a successful appointment.
            </ItalicText>
            <SubHeadingText style={tw`mt-6 mb-4`}>Notes</SubHeadingText>
            <TextInput
              editable={!isLoading}
              control={control}
              error={(errors["notes"] as any)?.message as string}
              name="notes"
              required={false}
              multiline
              numberOfLines={4}
              placeholder="* Please let us know in advance of any favorite treat, scratching spot, or any behavioral issues you may have encountered with your pet previously. Are they food motivated, territorial, or aggressive towards humans or other pets?"
            />
          </>
        )}
        <View style={tw`mb-8`} />
        <SubmitButton
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          disabled={(!isDirty && !petImage) || isLoading}
          loading={isLoading}
          title={
            isLoading
              ? mode === "edit"
                ? "Saving Pet..."
                : "Saving New Pet..."
              : mode === "edit"
                ? "Save Changes"
                : "Add Pet"
          }
          color="black"
          iconName={mode === "edit" ? "check" : "plus"}
          style={tw`mx-auto`}
        />
        {mode === "edit" && (
          <TouchableOpacity
            style={tw`w-full mt-16 flex-row items-center justify-center pb-8`}
            onPress={() => setShowPetDeletionConfirmation(true)}
          >
            <Icon name="trash" height={14} width={14} />
              <ButtonText style={tw`text-xs ml-2`}>Remove Pet</ButtonText>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        isVisible={showPetDeletionConfirmation}
        onClose={() => {
          setShowPetDeletionConfirmation(false);
        }}
        title="Are You Sure...?"
      >
          <View style={tw`flex-col items-center justify-center rounded-xl mb-2`}>
          <ItalicText>
              Removing your pet will erase ALL of your pets data.
            {pastPatientAppointments && pastPatientAppointments?.length > 0
                ? " Please make sure you have requested a copy of your pets medical records before deleting their profile."
              : ""}
          </ItalicText>
            {pastPatientAppointments && pastPatientAppointments?.length > 0 && (
              <ActionButton
                color="black"
                title="Request Medical Records"
                iconName="folder-heart"
                onPress={() => {
                  setShowPetDeletionConfirmation(false);
                  router.navigate({
                    pathname: "/(app)/pets/detail/web-view",
                    params: {
                      path: "/contact",
                      queryString: `${client?.firstName ? `&firstName=${client?.firstName}` : ""
                        }${client?.lastName ? `&lastName=${client?.lastName}` : ""
                        }${client?.email ? `&email=${client?.email}` : ""}${client?.phone
                          ? `&phone=${client?.phone
                            ?.replaceAll(" ", "")
                            ?.replaceAll("(", "")
                            ?.replaceAll(")", "")
                            ?.replaceAll("-", "")}`
                        : ""
                        }&message=Please send a copy of ${name}'s full medical records to <EMAIL_ADDRESS>. Thanks!`
                        ?.replaceAll(")", "")
                        ?.replaceAll("(", ""),
                    },
                  })
                }}
              />
            )}
            <ActionButton
              color="brown"
              title={`"${name}" is Deceased...`}
              iconName="sad-face"
              onPress={() => petIsDead()}
            />
            <ActionButton
              title={`Delete "${name}"`}
            iconName="trash"
            onPress={() => deletePet()}
          />
        </View>
      </Modal>
    </View>
  );
};
