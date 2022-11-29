import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { BookingHeader } from "components/booking/BookingHeader";
import { Button } from "ui";
import ErrorMessage from "components/inputs/ErrorMessage";
import { Loader } from "ui";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { firestore } from "services/firebase";
import { Booking } from "types/Booking";
import { object, string, lazy, array } from "yup";
import { Error } from "components/Error";
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
export const IllnessAssignment = ({
  session,
  isAppMode,
}: {
  session: Booking;
  isAppMode: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [pet, setPet] = useState<any>(null);
  useEffect(() => {
    setIsLoading(true);
    if (session && session?.patients) {
      if (session?.nextPatient) {
        session?.patients.forEach((patient: any) =>
          patient?.value === session?.nextPatient &&
          patient?.hasMinorIllness &&
          patient?.illnessDetails === undefined
            ? setPet(patient)
            : null
        );
        setIsLoading(false);
      } else {
        session?.patients.forEach((patient: any) =>
          patient?.hasMinorIllness && patient?.illnessDetails === undefined
            ? setPet(patient)
            : null
        );
        setIsLoading(false);
      }
    }
  }, [session]);
  const {
    handleSubmit,
    watch,
    control,
    register,
    reset,
    formState: { errors, isDirty, isSubmitting },
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
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await setDoc(
      doc(firestore, "bookings", `${session?.id}`),
      {
        illnessDetails: {
          symptoms: data.symptoms,
          id: pet?.value,
          notes: data.details,
        },
        updatedOn: serverTimestamp(),
      },
      { merge: true }
    )
      .catch((error: any) => {
        setIsLoading(false);
        setError(error);
      })
      .finally(() => reset());
  };
  return (
    <>
      {isLoading ? (
        <Loader
          message={
            isSubmitting
              ? "Saving Illness Selection..."
              : "Loading Illness Selection..."
          }
        />
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
                className="text-lg select-none font-source-sans-pro flex flex-row items-center py-2 w-full"
              >
                <p>{symptom?.name}</p>
                <span className="text-xs italic text-movet-red ml-2 text-center grow">
                  {""}
                </span>
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
          <ErrorMessage errorMessage={errors?.symptoms?.message as string} />
          <div className="mt-8">
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
                selected !== null && (selected as Array<string>)?.length > 0
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
    </>
  );
};
