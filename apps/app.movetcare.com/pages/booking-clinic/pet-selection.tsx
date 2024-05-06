import { UAParser } from "ua-parser-js";
import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { Button, ErrorMessage, Loader } from "ui";
import { faArrowRight, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { array, object, string, lazy } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import { capitalizeFirstLetter } from "utilities";

export default function PetSelection() {
  const router = useRouter();
  const { mode, housecallRequest } = router.query || {};
  const isAppMode = mode === "app";
  const isHousecallRequest = Boolean(Number(housecallRequest));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [pets, setPets] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [vcprRequiredError, setVcprRequiredError] = useState<boolean>(false);
  const [vcprRequired, setVcprRequired] = useState<boolean>(false);
  const [session, setSession] = useState<any>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        pets: lazy((val) =>
          Array.isArray(val)
            ? array()
                .min(1, "A pet selection is required")
                .max(3, "Only 3 pets are allowed per appointment")
                .of(string())
                .required("A pet selection is required")
            : string()
                .matches(/.*\d/, "A pet selection is required")
                .required("A pet selection is required"),
        ),
      }),
    ),
    defaultValues: {
      pets: null,
    } as any,
  });
  const selectedPets: Array<string> | string | null = watch("pets") as any;
  useEffect(() => {
    if (pets?.length === 1)
      setValue("pets", pets[0].id as any, {
        shouldTouch: true,
        shouldDirty: true,
        shouldValidate: true,
      });
  }, [pets, setValue]);
  useEffect(() => {
    if (pets !== null && pets?.length > 0) {
      let vcprPetMatchCount = 0;
      pets.forEach((pet: any) => {
        if (selectedPets !== null) {
          if (Array.isArray(selectedPets))
            selectedPets.map((selectedPet: any) => {
              if (selectedPet === pet.id && pet.vcprRequired)
                vcprPetMatchCount++;
            });
        } else if (selectedPets === pet.id && pet.vcprRequired)
          vcprPetMatchCount++;
      });
      if (
        selectedPets !== null &&
        vcprPetMatchCount > 0 &&
        vcprPetMatchCount !== selectedPets.length
      )
        setVcprRequiredError(true);
      else setVcprRequiredError(false);
      if (
        (Array.isArray(selectedPets) &&
          selectedPets !== null &&
          vcprPetMatchCount > 0 &&
          vcprPetMatchCount === selectedPets.length) ||
        (selectedPets === pets[0].id && pets[0].vcprRequired)
      )
        setVcprRequired(true);
      else setVcprRequired(false);
    }
  }, [selectedPets, pets]);
  useEffect(() => {
    if (
      window.localStorage.getItem("clinicBookingSession") !== null &&
      router
    ) {
      setSession(
        JSON.parse(
          window.localStorage.getItem("clinicBookingSession") as string,
        ),
      );
      setPets(
        JSON.parse(
          window.localStorage.getItem("clinicBookingSession") as string,
        )?.patients,
      );
      setIsLoading(false);
    } else setLoadingMessage("Invalid Data. Please try again...");
  }, [router, isHousecallRequest]);
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    reset();
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage("Saving Your Selection...");
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleClinic",
          )({
            petSelection: {
              ...data,
            },
            vcprRequired,
            id: session?.id,
            device: JSON.parse(
              JSON.stringify(UAParser(), function (key: any, value: any) {
                if (value === undefined) return null;
                return value;
              }),
            ),
            token,
          });
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage("Almost Finished...");
            if (result?.client?.uid && result?.id) {
              window.localStorage.setItem(
                "clinicBookingSession",
                JSON.stringify(result),
              );
              if (result?.selectedPatients?.length > 0)
                router.push(
                  "/booking-clinic/datetime-selection" +
                    (isAppMode ? "?mode=app" : ""),
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
        className={`flex-1 items-center justify-center bg-white rounded-xl max-w-xl mx-auto`}
      >
        <section className={`relative mx-auto${isAppMode ? "" : " pb-8"}`}>
          {isLoading ? (
            <Loader
              message={loadingMessage || "Loading, please wait..."}
              isAppMode={isAppMode}
            />
          ) : error ? (
            <Error error={error} isAppMode={isAppMode} />
          ) : (
            <div
              className={
                isAppMode
                  ? "flex flex-grow items-center justify-center min-h-screen"
                  : "px-6"
              }
            >
              <div className="flex-col w-full mx-2">
                <BookingHeader
                  isAppMode={isAppMode}
                  title={`Select ${pets.length > 1 ? "Your Pets" : "a Pet"}`}
                  description={`Which ${
                    pets.length > 1 ? "pets" : "pet"
                  } would you like to book the clinic for?`}
                />
                {pets
                  .sort(
                    (item: any, nextItem: any) =>
                      nextItem.vcprRequired - item.vcprRequired,
                  )
                  .map((pet: any, index: number) => (
                    <div
                      key={index}
                      className={
                        index === pets.length - 1
                          ? "w-full"
                          : "w-full border-b border-movet-gray divide-y divide-movet-gray"
                      }
                    >
                      <label
                        htmlFor={`${pet.name}`}
                        className="text-lg select-none font-source-sans-pro flex flex-row items-center py-2 w-full"
                      >
                        {/* {petPhotos &&
                      petPhotos.map(
                        ({ patient, url }: { url: string; patient: number }) =>
                          `${patient}` === pet.id ? (
                            <Image
                              src={`${url}`}
                              height={20}
                              width={20}
                              alt={`${pet.names} Photo`}
                              className="mr-2 h-8 w-8 text-movet-brown flex-none"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={pet.species.includes("Dog") ? faDog : faCat}
                              size={"lg"}
                              className="mr-2 h-8 w-8 text-movet-brown flex-none"
                            />
                          )
                      )} */}
                        {/* <FontAwesomeIcon
                          icon={pet.species.includes("Dog") ? faDog : faCat}
                          size={"lg"}
                          className="mr-2 h-8 w-8 text-movet-brown flex-none"
                        /> */}
                        <p>
                          {pet.species.includes("Dog") ? "🐶" : "🐱"}{" "}
                          {capitalizeFirstLetter(pet.name)}
                        </p>
                        <span className="text-xs italic text-movet-red ml-2 text-center grow">
                          {""}
                        </span>
                        <div className="ml-3 flex items-center h-5 flex-none">
                          <input
                            id={`${pet.name}`}
                            {...register("pets")}
                            value={`${pet.id}`}
                            type="checkbox"
                            className="focus:ring-movet-brown h-6 w-6 text-movet-brown border-movet-gray rounded-full ease-in-out duration-500"
                          />
                        </div>
                      </label>
                    </div>
                  ))}
                <ErrorMessage
                  errorMessage={
                    vcprRequiredError
                      ? "Only pets that require an Establish Care Exam may be selected"
                      : (errors?.pets?.message as string)
                  }
                />
                <div className="flex flex-col sm:flex-row mt-12 mb-6">
                  <Button
                    icon={faPlusCircle}
                    iconSize={"sm"}
                    color="black"
                    text="Add a Pet"
                    className={"w-full sm:w-1/2 mr-0 sm:mr-4"}
                    onClick={() => {
                      setIsLoading(true);
                      router.push(
                        isAppMode
                          ? "/booking-clinic/add-a-pet?mode=app"
                          : "/booking-clinic/add-a-pet",
                      );
                    }}
                  />
                  <Button
                    type="submit"
                    icon={faArrowRight}
                    iconSize={"sm"}
                    disabled={!isDirty || !isValid || vcprRequiredError}
                    color="red"
                    text="Continue"
                    className={"w-full sm:w-1/2 ml-0 sm:ml-4 mt-4 sm:mt-0"}
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
