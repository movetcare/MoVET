import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { Fragment, useEffect, useRef, useState } from "react";
import { Button, Loader, Modal } from "ui";
import {
  faCheck,
  faHospital,
  faHouseMedical,
  faInfoCircle,
  faLaptopMedical,
  faLink,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "ui/src/components/forms/inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { addMethod, object, string } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import PhoneInput from "ui/src/components/forms/inputs/PhoneInput";
import { NumberInput } from "components/inputs/NumberInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToggleInput } from "components/inputs/ToggleInput";
import type { WinterMode as WinterModeType } from "types";
import { getWinterMode } from "server";
import Calendar from "react-calendar";
import { Transition } from "@headlessui/react";
import React from "react";

const appointmentAvailability = [
  "No Time Preference",
  "First Available",
  "Morning - AM",
  "Afternoon - PM",
  "Specific Time Preference",
];
addMethod(string, "isValidPetCount", function (errorMessage: string) {
  return (this as any).test(
    "test-valid-weight",
    errorMessage,
    function (this: any, value: any) {
      const { path, createError } = this as any;
      return (
        (parseInt(value) >= 1 && parseInt(value) <= 10) ||
        createError({ path, message: errorMessage })
      );
    }
  );
});

addMethod(
  string,
  "isValidPetMinorIllnessCount",
  function (errorMessage: string) {
    return (this as any).test(
      "test-valid-weight",
      errorMessage,
      function (this: any, value: any) {
        const { path, createError } = this as any;
        return (
          (parseInt(value) >= 0 && parseInt(value) <= 10) ||
          createError({ path, message: errorMessage })
        );
      }
    );
  }
);

export async function getStaticProps() {
  return {
    props: {
      winterMode: (await getWinterMode()) || null,
    },
  };
}

export default function RequestAnAppointment({
  winterMode,
}: {
  winterMode: WinterModeType;
}) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const router = useRouter();
  const { email, mode }: any = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hideFormSection, setHideFormSection] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  const [reasonGroups, setReasonGroups] = useState<any>(false);
  const [options, setOptions] = useState<Array<{
    name: string;
    icon: any;
    id: number;
  }> | null>(null);
  const [selectedDate, onDateChange] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState<string>(
    appointmentAvailability[0]
  );
  const cancelButtonRef = useRef(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object().shape({
        firstName: string().required("A first name is required"),
        lastName: string().required("A last name is required"),
        phone: string()
          .min(10, "Phone number must be 10 digits")
          .required("A phone number is required"),
        email: string()
          .email("Please enter a valid email address")
          .required("An email address is required"),
        numberOfPets: (string() as any)
          .isValidPetCount("Number of pets must be between 1 and 10")
          .required("A pet count is required"),
        numberOfPetsWithMinorIllness: (string() as any)
          .isValidPetMinorIllnessCount(
            "Number of pets must be between 0 and 10"
          )
          .required("A minor illness pet count is required"),
        locationType: string().required("A location type is required"),
        specificTime: string(),
      })
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: email || "",
      numberOfPets: "1",
      numberOfPetsWithMinorIllness: "0",
      locationType: "Clinic",
      notes: "",
      specificTime: "",
    } as any,
  });
  const locationSelection = watch("locationType");
  const firstNameSelection = watch("firstName");
  const lastNameSelection = watch("lastName");
  const phoneNumberSelection = watch("phone");
  const emailSelection = watch("email");

  useEffect(() => {
    if (
      window.localStorage.getItem("email") === null ||
      window.localStorage.getItem("bookingSession") === null
    ) {
      localStorage.removeItem("email");
      localStorage.removeItem("bookingSession");
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data: result }: any = await httpsCallable(
        functions,
        "getAppointmentLocations"
      )();
      if (result?.error !== true || result?.error === undefined) {
        setReasonGroups(result);
      } else setError(result);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    setValue(
      "email",
      (email as string) || window.localStorage.getItem("email") || ""
    );
  }, [email, setValue]);

  useEffect(() => {
    if (reasonGroups) {
      const items: Array<{
        name: string;
        icon: any;
        id: number;
      }> = [];
      reasonGroups.map(({ label, id }: { label: string; id: number }) => {
        if (label.toLowerCase().includes("clinic")) {
          items.push({ name: "Clinic", icon: faHospital, id });
        } else if (label.toLowerCase().includes("housecall")) {
          if (winterMode?.isActive && winterMode?.isActiveOnWebApp) {
            if (winterMode?.enableForNewPatientsOnly)
              console.log("WINTER MODE ACTIVE FOR NEW PATIENTS");
            else if (!winterMode?.enableForNewPatientsOnly)
              console.log("WINTER MODE ACTIVE FOR ALL PATIENTS");
            else
              items.push({
                name: "Home",
                icon: faHouseMedical,
                id,
              });
          } else
            items.push({
              name: "Home",
              icon: faHouseMedical,
              id,
            });
        } else if (label.toLowerCase().includes("virtual")) {
          items.push({ name: "Virtually", icon: faLaptopMedical, id });
        }
      });
      setOptions(
        items.sort((a, b) => {
          return a.name.localeCompare(b.name);
        })
      );
      setIsLoading(false);
    }
  }, [reasonGroups, winterMode]);

  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    reset();
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage("Submitting Your Appointment Request...");
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "requestAppointment"
          )({
            ...data,
            selectedDate,
            selectedTime,
            id:
              JSON.parse(
                window.localStorage.getItem("bookingSession") as string
              )?.id || null,
            device: navigator.userAgent,
            token,
          });
          if (result) router.push("/request-an-appointment/success");
          else
            handleError({
              message:
                JSON.stringify(result) +
                " - Your Request Was Not Submitted. Please Try Again.",
            });
        } catch (error) {
          handleError(error);
        }
      }
    } else handleError({ message: "FAILED CAPTCHA" });
  };

  useEffect(() => {
    const saveContactInfo = async () => {
      if (executeRecaptcha) {
        const token = await executeRecaptcha("booking");
        if (token) {
          try {
            await httpsCallable(
              functions,
              "requestAppointment"
            )({
              firstName: firstNameSelection,
              lastName: lastNameSelection,
              phone: phoneNumberSelection,
              saveInfo: true,
              email: emailSelection,
              id:
                JSON.parse(
                  window.localStorage.getItem("bookingSession") as string
                )?.id || null,
              device: navigator.userAgent,
              token,
            });
          } catch (error) {
            console.error(error);
          }
        }
      } else console.error({ message: "FAILED CAPTCHA" });
    };
    if (
      emailSelection &&
      phoneNumberSelection &&
      phoneNumberSelection.length === 10
    ) {
      setHideFormSection(false);
      saveContactInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumberSelection, executeRecaptcha, emailSelection]);

  const Divider = () => <hr className="my-4 border-movet-brown/50" />;
  // eslint-disable-next-line react/display-name
  const FormPartTwo = React.forwardRef((props, forwardedRef) => {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <div ref={forwardedRef} className="sm:col-span-2">
        <Divider />
        <div className="my-8">
          <NumberInput
            label="Number of Pets"
            name="numberOfPets"
            errors={errors}
            control={control}
            required
          />
        </div>

        <NumberInput
          label="Pets with Minor Illness"
          name="numberOfPetsWithMinorIllness"
          errors={errors}
          control={control}
          required
        />

        <p
          className={`-mb-2 text-center text-gray flex justify-center items-center text-xs cursor-pointer italic hover:text-movet-brown ease-in-out duration-500${
            errors && errors["numberOfPetsWithMinorIllness"]?.message
              ? " mt-6"
              : " mt-2"
          }`}
          onClick={() => setShowExplainer(!showExplainer)}
        >
          <FontAwesomeIcon
            icon={faInfoCircle}
            size="lg"
            className="mr-2 text-movet-brown"
          />
          What are symptoms of minor illness?
        </p>
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
              <li className="my-1">GI Concerns - Vomiting / Diarrhea</li>
            </ul>
          }
          title="Minor Illness Symptoms"
          icon={faStethoscope}
        />
        <TextInput
          className="mb-10 mt-4"
          multiline
          numberOfLines={5}
          label="Notes"
          name="notes"
          control={control}
          errors={errors}
          placeholder="* Please let us know in advance of any favorite treat, scratching
          spot, or any behavioral issues you may have encountered with your pet(s)
          previously. Are they food motivated, territorial, or aggressive
          towards humans or other pets?"
        />
        <Divider />
        <div className="my-8">
          {options && (
            <ToggleInput
              options={options}
              control={control}
              errors={errors}
              name="locationType"
              label="Where would you like to have your appointment?"
              required
            />
          )}
        </div>
        <label className="block text-sm font-medium text-movet-black font-abside mb-4 mt-10 sm:text-center">
          What day and time would you like to have your appointment?{" "}
          <span className="text-movet-red">*</span>
        </label>
        <Calendar
          onChange={(value: any) => onDateChange(value)}
          value={selectedDate}
          minDate={today}
          minDetail="month"
          className="flex-1 justify-center items-center my-8 w-full mx-auto"
        />
        <ul>
          {appointmentAvailability?.map(
            (appointmentSlot: string, index: number) =>
              index <= appointmentAvailability.length ? (
                <li
                  key={index}
                  className={`flex flex-row items-center justify-center py-2 px-2 my-4 mx-2 rounded-xl cursor-pointer hover:bg-movet-brown hover:text-white duration-300 ease-in-out${
                    selectedTime === appointmentSlot
                      ? " bg-movet-red text-white border-movet-white"
                      : " bg-movet-gray/20"
                  }`}
                  onClick={() => setSelectedTime(appointmentSlot)}
                >
                  <p>{appointmentSlot}</p>
                </li>
              ) : null
          )}
        </ul>
        {selectedTime === appointmentAvailability[4] && (
          <div className="flex flex-col justify-center items-center">
            <TextInput
              className="mt-4 w-full"
              name="specificTime"
              label="Specific Time"
              placeholder=""
              type="text"
              errors={errors}
              control={control}
            />
            <a
              href="https://movetcare.com/hours"
              target="_blank"
              className="text-xs hover:underline text-movet-brown mt-4"
            >
              Our Hours of Operation{" "}
              <FontAwesomeIcon icon={faLink} size="sm" className="ml-1" />
            </a>
          </div>
        )}
        <div className="group flex flex-col justify-center items-center sm:col-span-2 mb-4 mt-10">
          <Button
            type="submit"
            icon={faCheck}
            iconSize={"sm"}
            disabled={!isDirty || locationSelection === ""}
            color="black"
            text="Request Appointment"
            onClick={handleSubmit(onSubmit)}
          />
          {errors && Object.keys(errors).length ? (
            <p className="text-xs italic text-movet-red mt-4">
              Please fix all of the errors above...
            </p>
          ) : null}
        </div>
      </div>
    );
  });
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
              <>
                <BookingHeader
                  isAppMode={isAppMode}
                  title={"Welcome to MoVET!"}
                  description={
                    "Please submit the form below to start booking your first appointment with us."
                  }
                />
                <div className="mt-8 px-1">
                  <form className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 text-left">
                    <TextInput
                      autoFocus
                      label="First Name"
                      name="firstName"
                      control={control}
                      errors={errors}
                      placeholder="Your First Name"
                      autoComplete="given-name"
                      required
                    />
                    <TextInput
                      label="Last Name"
                      name="lastName"
                      control={control}
                      errors={errors}
                      placeholder="Your Last Name"
                      autoComplete="family-name"
                      required
                    />
                    <div
                      className={`sm:col-span-2 my-2${
                        hideFormSection ? " mb-8" : ""
                      }`}
                    >
                      <PhoneInput
                        label="Phone Number"
                        name="phone"
                        control={control}
                        errors={errors}
                        required
                      />
                    </div>
                    <Transition
                      show={!hideFormSection}
                      enter="transition ease-in duration-500"
                      leave="transition ease-out duration-64"
                      leaveTo="opacity-10"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leaveFrom="opacity-100"
                      as={Fragment}
                    >
                      <FormPartTwo />
                    </Transition>
                  </form>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
