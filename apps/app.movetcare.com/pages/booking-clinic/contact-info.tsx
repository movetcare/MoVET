import { UAParser } from "ua-parser-js";
import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { Button, Loader } from "ui";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "ui/src/components/forms/inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import PhoneInput from "ui/src/components/forms/inputs/PhoneInput";
import { BookingFooter } from "components/BookingFooter";

export default function ContactInfo() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    control,
    handleSubmit,
    reset,
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
      }),
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    } as any,
  });
  useEffect(() => {
    if (window.localStorage.getItem("clinicBookingSession") !== null && router)
      setIsLoading(false);
    else setLoadingMessage("Invalid Data. Please try again...");
  }, [router]);

  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    reset();
    setIsLoading(false);
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage("Saving Contact Info...");
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const session = JSON.parse(
            window.localStorage.getItem("clinicBookingSession") as string,
          );
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleClinic",
          )({
            contactInfo: {
              ...data,
              uid: session?.client?.uid,
              requiresInfo: session?.client?.requiresInfo,
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
              if (result?.client?.requiresInfo)
                router.push(
                  "/booking-clinic/contact-info" +
                    (isAppMode ? "?mode=app" : ""),
                );
              else if (result?.patients?.length > 0)
                router.push(
                  "/booking-clinic/pet-selection" +
                    (isAppMode ? "?mode=app" : ""),
                );
              else if (result?.patients?.length === 0)
                router.push(
                  "/booking-clinic/add-a-pet" + (isAppMode ? "?mode=app" : ""),
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
        <div className={isAppMode ? "mb-8" : ""}>
          <section className="relative mx-auto">
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
                    : ""
                }
              >
                <div className="flex-col">
                  <BookingHeader
                    isAppMode={isAppMode}
                    title={"Contact Information"}
                    description={"Please let us know how to contact you."}
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
                      <div className="sm:col-span-2 my-2">
                        <PhoneInput
                          label="Phone Number"
                          name="phone"
                          control={control}
                          errors={errors}
                          required
                        />
                      </div>
                      <div className="group flex flex-col justify-center items-center sm:col-span-2 my-4">
                        <Button
                          type="submit"
                          icon={faArrowRight}
                          iconSize={"sm"}
                          disabled={!isDirty}
                          color="black"
                          text="Continue"
                          onClick={handleSubmit(onSubmit)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <BookingFooter isClinic />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
