import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useRef, useState } from "react";
import { Button, ErrorMessage, Loader, Modal } from "ui";
import {
  faArrowRight,
  faCheck,
  faInfoCircle,
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
import { Transition } from "@headlessui/react";
import { capitalizeFirstLetter } from "utilities";
import { BookingFooter } from "components/BookingFooter";
import getUrlQueryStringFromObject from "utilities/src/getUrlQueryStringFromObject";

export default function WellnessCheck() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const cancelButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [pets, setPets] = useState<any>(null);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  const [session, setSession] = useState<any>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        illPets: lazy((val) =>
          Array.isArray(val)
            ? array()
                .max(3, "Only 3 pets are allowed per appointment")
                .of(string())
            : string().nullable(true)
        ),
      })
    ),
    defaultValues: {
      illPets: null,
    },
  });
  const selected = watch("illPets") as any;

  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router) {
      const sessionData = JSON.parse(
        window.localStorage.getItem("bookingSession") as string
      );
      const selectedPatientsData: any = [];
      sessionData?.selectedPatients?.forEach((patientId: string) => {
        sessionData?.patients?.forEach((patient: any) => {
          if (patient?.id === patientId) selectedPatientsData.push(patient);
        });
      });
      setSession(sessionData);
      setPets(selectedPatientsData);
      setIsLoading(false);
    } else router.push("/schedule-an-appointment");
  }, [router]);
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
      const queryString = getUrlQueryStringFromObject(router.query);
      if (data?.illPets === null)
        router.push(
          "/schedule-an-appointment/location-selection" +
            (queryString ? queryString : "")
        );
      else if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment"
          )({
            illPetSelection: {
              ...data,
            },
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

              if (result?.nextPatient)
                router.push(
                  "/schedule-an-appointment/illness-selection" +
                    (queryString ? queryString : "")
                );
              else handleError(result);
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
                message={loadingMessage || `Loading Wellness Check...`}
                isAppMode={isAppMode}
              />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                <BookingHeader
                  isAppMode={isAppMode}
                  title="Pet Wellness Check"
                  description={`${
                    pets.length > 1 ? "Are any of your pets " : "Is your pet "
                  }showing symptoms of minor illness?`}
                />
                <legend className="mt-4 text-xl font-medium mb-2 w-full text-center">
                  {pets.length > 1 ? "Your Pets" : " Your Pet"}
                </legend>
                {pets
                  .sort(
                    (item: any, nextItem: any) =>
                      nextItem.vcprRequired - item.vcprRequired
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
                            {...register("illPets")}
                            value={`${pet.id}`}
                            type="checkbox"
                            className="focus:ring-movet-brown h-6 w-6 text-movet-brown border-movet-gray rounded-full ease-in-out duration-500"
                          />
                        </div>
                      </label>
                    </div>
                  ))}
                <ErrorMessage
                  errorMessage={errors?.illPets?.message as string}
                />
                <span
                  className="text-center text-gray mt-8 flex justify-center items-center text-xs cursor-pointer italic hover:text-movet-brown ease-in-out duration-500"
                  onClick={() => setShowExplainer(!showExplainer)}
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    size="lg"
                    className="mr-2 text-movet-brown -mt-1"
                  />
                  What are symptoms of minor illness?
                </span>
                <Modal
                  showModal={showExplainer}
                  setShowModal={setShowExplainer}
                  cancelButtonRef={cancelButtonRef}
                  isLoading={isLoading}
                  error={error ? <Error message={error} /> : undefined}
                  content={
                    <ul className="list-disc ml-8 pb-2">
                      <li className="my-1">Behavioral Concerns</li>
                      <li className="my-1">Coughing</li>
                      <li className="my-1">Minor Cuts & Scrapes</li>
                      <li className="my-1">Ear Infection</li>
                      <li className="my-1">Eye Infection</li>
                      <li className="my-1">Orthopedic / Limping Concerns</li>
                      <li className="my-1">Lumps / Bumps / Bruises</li>
                      <li className="my-1">Skin / Itching</li>
                      <li className="my-1">
                        GI Concerns - Vomiting / Diarrhea
                      </li>
                    </ul>
                  }
                  title="Minor Illness Symptoms"
                  icon={faStethoscope}
                />
                <Transition
                  show={selected !== null && selected?.length > 0}
                  enter="transition ease-in duration-500"
                  leave="transition ease-out duration-300"
                  leaveTo="opacity-10"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leaveFrom="opacity-100"
                >
                  <>
                    <h2 className="text-center text-sm text-movet-red mt-8">
                      EMERGENCY CARE NOTICE
                    </h2>
                    <p className=" text-sm text-center">
                      Please note, as primary care providers, our clinic is not
                      set up for emergency care.
                      {isAppMode ? (
                        "Seek a veterinary hospital with emergency care for any of the following:"
                      ) : (
                        <span className="italic">
                          Seek a{" "}
                          <a href="/emergency" target="_blank">
                            veterinary hospital with emergency care
                          </a>{" "}
                          for any of the following:
                        </span>
                      )}
                    </p>
                    <ul className="list-none py-2 text-xs italic text-center">
                      <li className="my-1">Profuse Bleeding</li>
                      <li className="my-1">Breathing Difficulties</li>
                      <li className="my-1">Fainting / Collapse</li>
                      <li className="my-1">Discolored / pale gums</li>
                      <li className="my-1">Heat Stroke</li>
                      <li className="my-1">Choking / Excessive Coughing</li>
                      <li className="my-1">Bite Wounds</li>
                      <li className="my-1">Ingestion of Toxins</li>
                      <li className="my-1">Broken bones / Lacerations</li>
                      <li className="my-1">Allergic Reactions</li>
                      <li className="my-1">Snake Bites</li>
                    </ul>
                    <p className="text-center text-sm italic font-extrabold text-movet-brown mt-4 -mb-4">
                      Please confirm this is NOT an emergency
                    </p>
                  </>
                </Transition>
                <div className="flex flex-col justify-center items-center mt-8 mb-4">
                  <Button
                    type="submit"
                    icon={
                      selected !== null && selected?.length > 0
                        ? faCheck
                        : faArrowRight
                    }
                    iconSize={"sm"}
                    color="black"
                    text={
                      selected !== null && selected?.length > 0
                        ? `My ${
                            Array.isArray(selected) && selected?.length > 1
                              ? "Pets DO NOT"
                              : "Pet DOES NOT"
                          } need emergency care`
                        : "Skip"
                    }
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
                <BookingFooter />
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
