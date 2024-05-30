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
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { array, object, string, lazy } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import { capitalizeFirstLetter } from "utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BookingFooter } from "components/BookingFooter";

export default function PetSelection() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [pets, setPets] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [vcprRequired, setVcprRequired] = useState<boolean | null>(null);
  const [vcprCount, setVcprCount] = useState<number | null>(null);
  const [showVcprDescription, setShowVcprDescription] =
    useState<boolean>(false);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  const [clinicRequiresVcpr, setClinicRequiresVcpr] = useState<boolean | null>(
    null,
  );
  const cancelButtonRef = useRef(null);
  const [session, setSession] = useState<any>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isValid, errors, isSubmitting },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        pets: lazy((val) =>
          Array.isArray(val)
            ? array()
                .min(1, "A pet selection is required")
                .max(
                  1,
                  "Only 1 pet is allowed per appointment. Please schedule multiple appointments or contact us if you would like to have more than one pet attend the clinic.",
                )
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
            id: session?.id,
            device: JSON.parse(
              JSON.stringify(UAParser(), (_key: any, value: any) => {
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

  useEffect(() => {
    if (clinicRequiresVcpr) {
      if (
        pets &&
        vcprRequired === false &&
        vcprCount &&
        vcprCount < pets.length
      ) {
        setValue(
          "pets",
          pets?.find((pet: any) => pet?.vcprRequired === false)?.id as any,
          {
            shouldTouch: true,
            shouldDirty: true,
            shouldValidate: true,
          },
        );
      } else if (
        pets &&
        pets.length === 1 &&
        vcprCount === 0 &&
        vcprRequired === false &&
        !isSubmitting &&
        executeRecaptcha
      ) {
        setValue("pets", pets[0].id as any, {
          shouldTouch: true,
          shouldDirty: true,
          shouldValidate: true,
        });
        handleSubmit(onSubmit)();
      }
      if (vcprCount && pets && vcprCount === pets.length)
        setShowExplainer(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pets,
    vcprRequired,
    setValue,
    vcprCount,
    clinicRequiresVcpr,
    executeRecaptcha,
  ]);

  useEffect(() => {
    if (clinicRequiresVcpr && pets !== null && pets?.length > 0) {
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
          else if (selectedPets === pet.id && pet.vcprRequired)
            vcprPetMatchCount++;
        } else if (selectedPets === pet.id && pet.vcprRequired)
          vcprPetMatchCount++;
      });
      if (
        (Array.isArray(selectedPets) &&
          selectedPets !== null &&
          vcprPetMatchCount > 0 &&
          vcprPetMatchCount === selectedPets.length) ||
        (selectedPets === pets[0].id && pets[0].vcprRequired)
      )
        setVcprRequired(true);
      else setVcprRequired(false);
      if (vcprPetCount > 0) setShowVcprDescription(true);
      setVcprCount(vcprPetCount);
    }
  }, [selectedPets, pets, clinicRequiresVcpr]);

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
      setClinicRequiresVcpr(
        JSON.parse(
          window.localStorage.getItem("clinicBookingSession") as string,
        )?.clinic?.vcprRequired,
      );
      setIsLoading(false);
    } else setLoadingMessage("Invalid Data. Please try again...");
  }, [router]);

  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    reset();
    setIsLoading(false);
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
            <Error error={error} type="clinic" />
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
                  title={`Select Your Pet`}
                  description={`Which  pet
                         would you like to book the clinic for?`}
                />
                <p className="text-center text-xs m-0 italic text-movet-black/60 sm:w-2/3 mx-auto">
                  * Please schedule multiple appointments or{" "}
                  <a
                    href="/contact"
                    target="_blank"
                    className="underline hover:text-movet-red text-movet-black/60 cursor-pointer"
                  >
                    contact us
                  </a>{" "}
                  if you would like to have more than one pet attend the clinic.
                </p>
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
                        {!clinicRequiresVcpr ? (
                          <>
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
                          </>
                        ) : (
                          <>
                            {pet.vcprRequired ? (
                              <>
                                <p className="text-movet-black/50 cursor-not-allowed">
                                  {pet.species.includes("Dog") ? "🐶" : "🐱"}{" "}
                                  {capitalizeFirstLetter(pet.name)}
                                </p>
                                <span className="text-xs italic text-movet-red/70 ml-2 text-right grow font-extrabold cursor-not-allowed">
                                  * Requires Establish Care Exam
                                </span>
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  size={"lg"}
                                  className="ml-2 h-8 w-8 text-movet-red/70 flex-none cursor-not-allowed"
                                />
                              </>
                            ) : (
                              <>
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
                              </>
                            )}
                          </>
                        )}
                      </label>
                    </div>
                  ))}
                <ErrorMessage errorMessage={errors?.pets?.message as string} />
                {showVcprDescription && (
                  <>
                    <span
                      className="text-center text-gray mt-4 flex justify-center items-center text-xs cursor-pointer italic hover:text-movet-brown ease-in-out duration-500"
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
                      <h2 className="m-0 italic text-base">
                        Only pets that have completed an Establish Care Exam may
                        attend this clinic.
                      </h2>
                      <hr className="border-movet-gray w-full my-4" />
                      <p>
                        Establish Care Exams are used to start a
                        Veterinarian-Client-Patient Relationship
                        (&quot;VCPR&quot;). A VCPR is established only when your
                        veterinarian examines your pet in person, and is
                        maintained by regular veterinary visits as needed to
                        monitor your pet&apos;s health.
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
                      <hr className="border-movet-gray w-full my-4" />
                      <p className="italic text-movet-black text-sm">
                        * Please{" "}
                        <a
                          href="/contact"
                          target="_blank"
                          className="underline hover:text-movet-red text-movet-black cursor-pointer"
                        >
                          contact us
                        </a>{" "}
                        if you believe there is an error and your pet has
                        completed an establish care exam.
                      </p>
                    </>
                  }
                  title="VCPR is Required for this Clinic"
                  icon={faStethoscope}
                />
                {clinicRequiresVcpr ? (
                  <>
                    {vcprCount && pets && vcprCount === pets.length ? (
                      <div className="flex flex-col sm:flex-row mt-12 mb-6">
                        <Button
                          icon={faArrowRight}
                          iconSize={"sm"}
                          color="black"
                          text="Continue"
                          disabled
                          className={"w-full sm:w-1/2 mr-0 sm:mr-4"}
                        />
                        <Button
                          type="submit"
                          icon={faStethoscope}
                          iconSize={"sm"}
                          color="red"
                          text="Establish VCPR"
                          className={
                            "w-full sm:w-1/2 ml-0 sm:ml-4 mt-4 sm:mt-0"
                          }
                          onClick={() => {
                            window.localStorage.setItem(
                              "email",
                              window.localStorage.getItem(
                                "clinicEmail",
                              ) as string,
                            );
                            router.push("/schedule-an-appointment");
                          }}
                        />
                      </div>
                    ) : vcprCount && pets && vcprCount < pets.length ? (
                      <div className="flex flex-col sm:flex-row mt-12 mb-6">
                        <Button
                          icon={faStethoscope}
                          iconSize={"sm"}
                          color="black"
                          text="Establish VCPR"
                          className={"w-full sm:w-1/2 mr-0 sm:mr-4"}
                          onClick={() => {
                            window.localStorage.setItem(
                              "email",
                              window.localStorage.getItem(
                                "clinicEmail",
                              ) as string,
                            );
                            router.push("/schedule-an-appointment");
                          }}
                        />
                        <Button
                          type="submit"
                          icon={faArrowRight}
                          iconSize={"sm"}
                          disabled={!isValid}
                          color="red"
                          text="Continue"
                          onClick={handleSubmit(onSubmit)}
                          className={
                            "w-full mt-4 sm:mt-0 sm:w-1/2 ml-0 sm:ml-4"
                          }
                        />
                      </div>
                    ) : (
                      <div className="mt-12 mb-6">
                        <Button
                          type="submit"
                          icon={faArrowRight}
                          iconSize={"sm"}
                          disabled={!isValid}
                          color="red"
                          text="Continue"
                          onClick={handleSubmit(onSubmit)}
                        />
                      </div>
                    )}
                  </>
                ) : (
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
                      disabled={!isValid}
                      color="red"
                      text="Continue"
                      className={"w-full sm:w-1/2 ml-0 sm:ml-4 mt-4 sm:mt-0"}
                      onClick={handleSubmit(onSubmit)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mt-8">
            <BookingFooter isClinic />
          </div>
        </section>
      </div>
    </section>
  );
}
