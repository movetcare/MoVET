import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useRef, useState } from "react";
import { Button, ErrorMessage, Loader } from "ui";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { array, object, string, lazy } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/booking/BookingHeader";

import { BookingFooter } from "components/booking/BookingFooter";
import TextInput from "components/inputs/TextInput";

const symptoms = [
  { name: "Behavioral Concerns", value: "behavioral-concerns" },
  { name: "Coughing", value: "coughing" },
  { name: "Minor Cuts / Scrapes", value: "cuts-and-scrapes" },
  { name: "Ear Infection", value: "ear-infection" },
  { name: "Eye Infection", value: "eye-infection" },
  { name: "Orthopedic / Limping Concerns", value: "orthopedic-limping" },
  { name: "Lumps / Bumps / Growths", value: "lumps-bumps-growths" },
  { name: "Skin / Itching", value: "skin-itching" },
  { name: "GI Concerns - Vomiting / Diarrhea", value: "gi-concerns" },
  { name: "Other", value: "other" },
];
export default function IllnessSelection() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [session, setSession] = useState<any>();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [pet, setPet] = useState<any>(null);
  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") !== null && router) {
      setSession(
        JSON.parse(window.localStorage.getItem("bookingSession") as string)
      );
      setIsLoading(false);
    } else router.push("/schedule-an-appointment");
  }, [router]);
  useEffect(() => {
    setIsLoading(true);
    console.log(session);
    if (session?.nextPatient) {
      session?.patients.forEach((patient: any) =>
        patient?.id === session?.nextPatient &&
        patient?.illnessDetails === undefined
          ? setPet(patient)
          : null
      );
      setIsLoading(false);
    }
  }, [session]);
  const {
    handleSubmit,
    watch,
    control,
    register,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        symptoms: lazy((val) =>
          Array.isArray(val)
            ? array()
                .min(1, "A symptom selection is required")
                .of(string())
                .required("A symptom selection is required")
            : string()
                .nullable()
                .matches(/.*\d/, "A symptom selection is required")
                .required("A symptom selection is required")
        ),
        details: string().nullable().required("Please tell us more..."),
      })
    ),
    defaultValues: {
      symptoms: null,
      details: "",
    },
  });
  const selected = watch("symptoms");

  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    reset();
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    console.log("data", data);
    setIsLoading(true);
    setLoadingMessage("Saving Your Selection...");
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          console.log("session", session);
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment"
          )({
            illnessDetails: {
              symptoms: data.symptoms,
              id: pet?.id,
              notes: data.details,
            },
            id: session?.id,
            device: navigator.userAgent,
            token,
          });
          console.log("result", result);
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage("Almost finished...");
            if (result?.client?.uid && result?.id) {
              window.localStorage.setItem(
                "bookingSession",
                JSON.stringify(result)
              );
              if (result?.nextPatient)
                router.push("/schedule-an-appointment/illness-selection");
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
              <Loader message={loadingMessage || `Loading Wellness Check...`} />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                <BookingHeader
                  isAppMode={isAppMode}
                  title="Minor Illness"
                  description={`We're sorry to hear ${
                    pet?.name
                  } is not feeling well. What symptom(s) is ${
                    pet?.gender?.includes("Female") ? "she" : "he"
                  } experiencing?`}
                />
                <legend className="mt-4 text-xl font-medium mb-2 w-full text-center">
                  Symptoms
                </legend>
                {symptoms.map((symptom: any, index: number) => (
                  <div
                    key={index}
                    className={
                      index === symptoms.length - 1
                        ? "w-full"
                        : "w-full border-b border-movet-gray divide-y divide-movet-gray"
                    }
                  >
                    <label
                      htmlFor={`${symptom?.name}`}
                      className="text-base select-none font-source-sans-pro flex flex-row items-center py-2 w-full"
                    >
                      <p>{symptom?.name}</p>
                      <span className="text-xs italic text-movet-red ml-2 text-center grow"></span>
                      <div className="ml-3 flex items-center h-5 flex-none">
                        <input
                          id={`${symptom?.name}`}
                          {...register("symptoms")}
                          value={`${symptom?.name}`}
                          type="checkbox"
                          className="focus:ring-movet-brown h-6 w-6 text-movet-brown border-movet-gray rounded-full ease-in-out duration-500"
                        />
                      </div>
                    </label>
                  </div>
                ))}
                <ErrorMessage
                  errorMessage={errors?.symptoms?.message as string}
                />
                <div className="mt-4">
                  <TextInput
                    label="Tell Us More"
                    control={control}
                    errors={errors}
                    required
                    name="details"
                    multiline
                    numberOfLines={3}
                    placeholder="Please provide as much detail as possible"
                  />
                </div>
                <div className="flex flex-col justify-center items-center mt-8 mb-4">
                  <Button
                    type="submit"
                    icon={
                      selected !== null &&
                      (selected as Array<string>)?.length > 0
                        ? faCheck
                        : faArrowRight
                    }
                    disabled={!isDirty}
                    iconSize={"sm"}
                    color="black"
                    text="Continue"
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
                <BookingFooter session={session} />
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
