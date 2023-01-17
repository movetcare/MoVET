import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { Button, Loader } from "ui";
import {
  faArrowRight,
  faCat,
  faDog,
  faMars,
  faTimes,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "ui/src/components/forms/inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { addMethod, bool, object, string, lazy } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import { DateInput } from "components/inputs/DateInput";
// import { FileUploadInput } from "components/inputs/FileUploadInput";
import { NumberInput } from "components/inputs/NumberInput";
import { PlacesInput } from "components/inputs/PlacesInput";
import { RadioInput } from "components/inputs/RadioInput";
import { SearchInput } from "components/inputs/SearchInput";
import SwitchInput from "components/inputs/SwitchInput";
import { ToggleInput } from "components/inputs/ToggleInput";
import getUrlQueryStringFromObject from "utilities/src/getUrlQueryStringFromObject";

addMethod(string, "isBeforeToday", function (errorMessage: string) {
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
    }
  );
});

addMethod(string, "isValidDay", function (errorMessage: string) {
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
    }
  );
});

addMethod(string, "isValidMonth", function (errorMessage: string) {
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
    }
  );
});

addMethod(string, "isValidWeight", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-weight",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      return (
        (parseInt(value) >= 1 && parseInt(value) <= 300) ||
        createError({ path, message: errorMessage })
      );
    }
  );
});

interface Breed {
  value: string;
  label: string;
}

export default function ContactInfo() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [breedsList, setBreedsList] = useState<Array<Breed>>();
  const [breedsData, setBreedsData] = useState<Array<Breed>>();
  // const [photo, setPhoto] = useState<string | null>(null);
  // const [records, setRecords] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [session, setSession] = useState<any>();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        name: string()
          .min(2, "Name must contain at least 2 characters")
          .max(80, "Name can not be more than 80 characters")
          .required("A name is required"),
        type: string().required("A type is required"),
        gender: string().required("A gender is required"),
        spayedOrNeutered: bool().nullable(true).default(false),
        breed: lazy((value: any) =>
          typeof value === "object" && !Array.isArray(value) && value !== null
            ? object().shape({
                label: string().trim().min(1, "A breed is required"),
                value: string().trim().min(1, "A breed is required"),
              })
            : string()
                .matches(/.*\d/, "A breed selection is required")
                .required("A breed selection is required")
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
          typeof value === "object" && !Array.isArray(value) && value !== null
            ? object().shape({
                name: string().trim().min(1, "A selection is required"),
              })
            : string()
                .matches(/.*\d/, "A selection is required")
                .required("A selection is required")
        ),
      })
    ),
    defaultValues: {
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
    },
  });
  const name = watch("name");
  const specie = watch("type");
  const isNonReproductive = watch("spayedOrNeutered");
  const gender = watch("gender");
  const vet = watch("vet");
  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router) {
      setSession(
        JSON.parse(window.localStorage.getItem("bookingSession") as string)
      );
      setIsLoading(false);
    } else router.push("/schedule-an-appointment");
  }, [router]);
  useEffect(() => {
    const fetchBreeds = async () => {
      const { data: result }: any = await httpsCallable(
        functions,
        "getBreedsData"
      )();
      if (result?.error !== true || result?.error === undefined)
        if (result[0].breeds !== false && result[1].breeds !== false)
          setBreedsData(
            result.map(
              (breed: {
                specie: "canine" | "feline";
                breeds: Array<{ title: string; id: string }>;
              }) => {
                return {
                  specie: breed.specie,
                  breeds: breed?.breeds.map(
                    ({ title, id }: { title: string; id: string }) => {
                      return { value: id, label: title };
                    }
                  ),
                };
              }
            )
          );
        else setError({ message: "FAILED TO GET BREEDS" });
      else setError(result);
    };
    fetchBreeds();
  }, []);
  useEffect(() => {
    if (
      specie !== undefined &&
      specie !== null &&
      specie !== "" &&
      breedsData
    ) {
      reset({ ...getValues(), breed: "" });
      if (specie === "dog") setBreedsList((breedsData[0] as any).breeds);
      else setBreedsList((breedsData[1] as any).breeds);
    } else return;
  }, [specie, getValues, reset, breedsData]);
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    reset();
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage(`Saving ${name}'s Info...`);
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment"
          )({
            addAPet: data,
            //{ ...data, records, photo },
            id: session?.id,
            device: navigator.userAgent,
            token,
          });
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage("Almost finished...");
            if (result?.client?.uid && result?.id) {
              window.localStorage.setItem(
                "bookingSession",
                JSON.stringify(result)
              );
              const queryString = getUrlQueryStringFromObject(router.query);
              if (result?.client?.requiresInfo)
                router.push(
                  "/schedule-an-appointment/contact-info" +
                    (queryString ? queryString : "")
                );
              else if (result?.patients?.length > 0)
                router.push(
                  "/schedule-an-appointment/pet-selection" +
                    (queryString ? queryString : "")
                );
              else if (result?.patients?.length === 0)
                router.push(
                  "/schedule-an-appointment/add-a-pet" +
                    (queryString ? queryString : "")
                );
            } else handleError(result);
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    } else handleError({ message: "FAILED CAPTCHA" });
  };
  return (
    <section className="w-full flex-1">
      <AppHeader />
      <div
        className={`flex items-center justify-center bg-white rounded-xl max-w-xl mx-auto${
          !isAppMode ? " p-4 mb-4 sm:p-8" : ""
        }`}
      >
        <div className={isAppMode ? "px-4 mb-8" : ""}>
          <section className="relative mx-auto">
            {isLoading ? (
              <Loader
                message={loadingMessage || "Loading, please wait..."}
                isAppMode={isAppMode}
              />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <div>
                <div className="text-center mt-4">
                  {session?.patients.length > 0 && (
                    <div
                      className="text-right cursor-pointer hover:text-movet-red mr-4 -mb-12 z-50 relative ease-in-out duration-500"
                      onClick={() => router.back()}
                    >
                      <FontAwesomeIcon icon={faTimes} size="2x" />
                    </div>
                  )}

                  <BookingHeader
                    isAppMode={isAppMode}
                    title={"Add a Pet"}
                    description={"Please tell us about your pet."}
                  />
                </div>
                <form className="grid grid-cols-1 text-left mt-8">
                  <div className="my-4">
                    <ToggleInput
                      options={[
                        { name: "dog", icon: faDog },
                        { name: "cat", icon: faCat },
                      ]}
                      label="Type of Pet"
                      control={control}
                      errors={errors}
                      name="type"
                      required
                    />
                  </div>
                  <div className="my-4">
                    <ToggleInput
                      options={[
                        { name: "male", icon: faMars },
                        { name: "female", icon: faVenus },
                      ]}
                      label="Gender"
                      control={control}
                      errors={errors}
                      name="gender"
                      required
                    />
                  </div>
                  <div className="my-4">
                    <SwitchInput
                      centered
                      title={"Reproductive Status"}
                      disabled={isLoading}
                      name="spayedOrNeutered"
                      control={control}
                      errors={errors}
                      label={
                        <p className="mt-4 -mb-4">
                          My pet{" "}
                          <b className="text-movet-brown italic underline">
                            {isNonReproductive ? "IS" : "IS NOT"}
                          </b>{" "}
                          {gender === "male"
                            ? "neutered"
                            : gender === "female"
                            ? "spayed"
                            : "spayed / neutered"}
                        </p>
                      }
                    />
                  </div>
                  <div className="my-4">
                    <TextInput
                      label="Name"
                      name="name"
                      control={control}
                      errors={errors}
                      placeholder="What is your pets name?"
                      autoComplete="given-name"
                      required
                    />
                    {/* <Transition
                      show={name !== ""}
                      enter="transition ease-in duration-500"
                      leave="transition ease-out duration-300"
                      leaveTo="opacity-10"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leaveFrom="opacity-100"
                    >
                      <FileUploadInput
                        previewImage
                        setValue={setPhoto}
                        isAppMode={isAppMode}
                        label="Photo"
                        fileTypes="PNG or JPG"
                        fileName="image"
                        successMessage="Photo Upload Complete!"
                        uploadPath={`/clients/${session?.client?.uid}/patients/new/photo`}
                      />
                    </Transition> */}
                  </div>
                  {specie !== undefined &&
                    specie !== null &&
                    specie !== "" &&
                    breedsList && (
                      <div className="my-4">
                        <SearchInput
                          label="Breed"
                          options={breedsList || []}
                          control={control}
                          errors={errors}
                          name="breed"
                          placeholder="Select a Breed"
                          required
                        />
                      </div>
                    )}
                  <div className="my-4">
                    <NumberInput
                      label="Weight"
                      name="weight"
                      errors={errors}
                      control={control}
                      suffix={" lbs"}
                      required
                    />
                  </div>
                  <div className="my-4">
                    <DateInput
                      label="Birthday"
                      name="birthday"
                      errors={errors}
                      control={control}
                      required
                    />
                  </div>
                  <div className="my-4">
                    <PlacesInput
                      label="Previous Vet"
                      name="vet"
                      placeholder="Search for a Vet"
                      errors={errors}
                      control={control}
                      required={false}
                      types={[
                        "veterinary_care",
                        "street_address",
                        "street_number",
                      ]}
                    />
                    <Transition
                      show={vet !== ""}
                      enter="transition ease-in duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                    >
                      <>
                        <p className="text-movet-yellow text-center font-extrabold px-4 mt-4">
                          * Please contact your previous vet and have them
                          forward your pet&apos;s medical records to{" "}
                          <span className="text-movet-red font-extrabold">
                            info@movetcare.com
                          </span>
                        </p>
                      </>
                    </Transition>
                    {/* <FileUploadInput
                      fileTypes="PDF"
                      setValue={setRecords}
                      isAppMode={isAppMode}
                      label="Previous Vet Records"
                      fileName={`previous-records`}
                      uploadPath={`/clients/${session?.client?.uid}/patients/new/records`}
                      successMessage="Previous Vet Record Uploaded!"
                    /> */}
                  </div>
                  <RadioInput
                    name="aggressionStatus"
                    errors={errors}
                    control={control}
                    label="Aggression Status"
                    description="Aggression is defined as the threat of harm to another individual involving snarling, growling, snapping, biting, barking or lunging. Please select one:"
                    items={[
                      {
                        name: "I agree, to my knowledge, this pet has no history of aggression or aggressive tendencies.",
                      },
                      {
                        name: "This pet DOES have had a history of aggression or aggressive tendencies.",
                      },
                    ]}
                    required
                  />
                  <p className="text-xs text-center italic px-4 sm:px-8">
                    Please note, this may not disqualify your pet from being
                    seen. This information helps our team stay safe and prepare
                    you and your pet for a successful appointment.
                  </p>
                  <div className="my-4">
                    <TextInput
                      multiline
                      numberOfLines={6}
                      label="Notes"
                      name="notes"
                      control={control}
                      errors={errors}
                      placeholder="* Please let us know in advance of any favorite treat, scratching
          spot, or any behavioral issues you may have encountered with your pet
          previously. Are they food motivated, territorial, or aggressive
          towards humans or other pets?"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row mt-8">
                    <Button
                      type="submit"
                      icon={faArrowRight}
                      iconSize={"sm"}
                      color="red"
                      text="Continue"
                      className={"w-full mx-auto mt-4 sm:mt-0"}
                      onClick={handleSubmit(onSubmit)}
                    />
                  </div>
                  {isSubmitted && errors && (
                    <p className="text-movet-red text-center mt-4 italic text-sm">
                      Please fix the errors highlighted above...
                    </p>
                  )}
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
