import { UAParser } from "ua-parser-js";
import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useRef, useState } from "react";
import { Button, ErrorMessage, Loader, Modal } from "ui";
import {
  faArrowRight,
  faInfoCircle,
  faPlusCircle,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { array, object, string, lazy } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { capitalizeFirstLetter } from "utilities";
import getUrlQueryStringFromObject from "utilities/src/getUrlQueryStringFromObject";

export default function PetSelection() {
  const router = useRouter();
  const { mode, housecallRequest } = router.query || {};
  const isAppMode = mode === "app";
  const isHousecallRequest = Boolean(Number(housecallRequest));
  const cancelButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [pets, setPets] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [vcprRequiredError, setVcprRequiredError] = useState<boolean>(false);
  const [showVcprDescription, setShowVcprDescription] =
    useState<boolean>(false);
  const [establishCareExamRequired, setEstablishCareExamRequired] =
    useState<boolean>(false);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
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
      let vcprPetCount = 0;
      pets.forEach((pet: any) => {
        if (pet.vcprRequired) vcprPetCount++;
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
        setEstablishCareExamRequired(true);
      else setEstablishCareExamRequired(false);
      if (vcprPetCount > 0) setShowVcprDescription(true);
    }
  }, [selectedPets, pets]);

  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router) {
      setSession(
        JSON.parse(window.localStorage.getItem("bookingSession") as string),
      );
      if (isHousecallRequest) {
        const pets: any = [];
        JSON.parse(
          window.localStorage.getItem("bookingSession") as string,
        )?.patients.forEach((patient: any) => {
          if (patient.vcprRequired) pets.push(patient);
        });
        setPets(pets);
      } else
        setPets(
          JSON.parse(window.localStorage.getItem("bookingSession") as string)
            ?.patients,
        );
      setIsLoading(false);
    } else router.push("/schedule-an-appointment");
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
            "scheduleAppointment",
          )({
            petSelection: {
              ...data,
            },
            establishCareExamRequired,
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
                "bookingSession",
                JSON.stringify(result),
              );
              const queryString = getUrlQueryStringFromObject(router.query);
              if (result?.selectedPatients?.length > 0)
                if (result?.establishCareExamRequired)
                  router.push(
                    "/schedule-an-appointment/wellness-check" +
                      (queryString ? queryString : ""),
                  );
                else
                  router.push(
                    "/schedule-an-appointment/location-selection" +
                      (queryString ? queryString : ""),
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
              <div className="flex-col">
                <BookingHeader
                  isAppMode={isAppMode}
                  title={`Select ${pets.length > 1 ? "Your Pets" : "a Pet"}`}
                  description={`Which ${
                    pets.length > 1 ? "pets" : "pet"
                  } would you like to book an
              appointment for?`}
                />
                <legend className="mt-8 text-2xl font-medium mb-2 w-full text-center">
                  Your
                  {pets.length > 1 ? " Pets" : " Pet"}
                </legend>
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
                        {pet.vcprRequired ? (
                          <span className="text-xs italic text-movet-red ml-2 text-right grow font-extrabold">
                            * Requires Establish Care Exam
                          </span>
                        ) : (
                          <span className="text-xs italic text-movet-red ml-2 text-center grow">
                            {""}
                          </span>
                        )}
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
                {showVcprDescription && (
                  <>
                    <span
                      className="text-center text-gray mt-8 flex justify-center items-center text-xs cursor-pointer italic hover:text-movet-brown ease-in-out duration-500"
                      onClick={() => setShowExplainer(!showExplainer)}
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        size="lg"
                        className="mr-2 text-movet-brown -mt-1"
                      />
                      What are Establish Care Exams?
                    </span>
                  </>
                )}
                <Modal
                  showModal={showExplainer}
                  setShowModal={setShowExplainer}
                  cancelButtonRef={cancelButtonRef}
                  isLoading={isLoading}
                  error={error ? <Error message={error} /> : undefined}
                  content={
                    <>
                      <p>
                        Establish Care Exams are used to start a
                        Veterinarian-Client-Patient Relationship
                        (&quot;VCPR&quot;).
                      </p>
                      <p>
                        A VCPR is established only when your veterinarian
                        examines your pet in person, and is maintained by
                        regular veterinary visits as needed to monitor your
                        pet&apos;s health.
                      </p>
                      <p>
                        If a VCPR is established but your veterinarian does not
                        regularly see your pet afterward, the VCPR is no longer
                        valid and it would be illegal (and unethical) for your
                        veterinarian to dispense or prescribe medications or
                        recommend treatment without recently examining your pet.
                      </p>
                      <p>
                        A valid VCPR cannot be established online, via email, or
                        over the phone. However, once a VCPR is established, it
                        may be able to be maintained between medically necessary
                        examinations via telephone or other types of
                        consultations; but it&apos;s up to your
                        veterinarian&apos; discretion to determine if this is
                        appropriate and in the best interests of your pets&apos;
                        health.
                      </p>
                    </>
                  }
                  title="What are Establish Care Exams?"
                  icon={faStethoscope}
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
                          ? "/schedule-an-appointment/add-a-pet?mode=app"
                          : "/schedule-an-appointment/add-a-pet",
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
