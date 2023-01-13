import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { AppLinks, Button, Loader } from "ui";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { EmailInput } from "ui/src/components/forms/inputs";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";

export default function ScheduleAnAppointment() {
  const router = useRouter();
  const { email, mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(
    "Loading, please wait..."
  );
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
        email: string()
          .email("Email must be a valid email address")
          .required("An email address is required"),
      })
    ),
    defaultValues: {
      email: "",
    },
  });
  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    reset();
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage("Processing, please wait...");
    if (!window.localStorage.getItem("email"))
      window.localStorage.setItem(
        "email",
        data?.email?.toString()?.toLowerCase()
      );
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment"
          )({
            email: data.email?.toLowerCase(),
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
              if (result?.step)
                router.push(`/schedule-an-appointment/${result.step}`);
              else if (result?.client?.requiresInfo)
                router.push("/schedule-an-appointment/contact-info");
              else if (result?.patients?.length === 0)
                router.push("/schedule-an-appointment/add-a-pet");
              else router.push("/schedule-an-appointment/pet-selection");
            } else handleError(result);
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    } else handleError({ message: "SOMETHING WENT WRONG" });
  };
  useEffect(() => {
    if ((window.localStorage.getItem("email") || email) && executeRecaptcha) {
      setIsLoading(true);
      if (email)
        onSubmit({
          email: (email as string)
            ?.toLowerCase()
            ?.replaceAll(" ", "+")
            ?.replaceAll("%20", "+")
            ?.replaceAll("%40", "@"),
        });
      else if (window.localStorage.getItem("email"))
        onSubmit({
          email: window.localStorage.getItem("email") as string,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, executeRecaptcha]);
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
              <Loader message={loadingMessage || "Loading, please wait..."} />
            ) : error ? (
              <Error error={error} isAppMode={isAppMode} />
            ) : (
              <>
                {!isAppMode && (
                  <h2 className="text-2xl font-extrabold tracking-tight text-center">
                    Schedule an Appointment
                  </h2>
                )}
                <p className="text-center mb-4 w-full sm:w-2/3 mx-auto">
                  Start scheduling an appointment by providing your email
                  address below.
                </p>
                <form className="group grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 pb-4 mb-4 w-full sm:w-2/3 mx-auto">
                  <div className="sm:col-span-2 my-2">
                    <EmailInput
                      autoFocus
                      required
                      label=""
                      name="email"
                      errors={errors}
                      control={control}
                      placeholder={"Your Email Address"}
                    />
                  </div>
                  <div className="flex justify-center items-center sm:col-span-2">
                    <Button
                      type="submit"
                      icon={faArrowRight}
                      iconSize={"lg"}
                      disabled={!isDirty && email === undefined}
                      text="Continue"
                      className={"w-full md:w-2/3"}
                      color="red"
                      onClick={handleSubmit(onSubmit)}
                    />
                  </div>
                  <div className="hidden group-hover:flex sm:col-span-2 -mt-0 mx-auto">
                    <div className="flex items-center justify-center text-center">
                      <p className="text-xs italic text-movet-black">
                        By clicking the &quot;Continue&quot; button above,
                        <br />
                        you agree to the{" "}
                        <span className="font-medium font-abside text-center md:text-left hover:underline  ease-in-out duration-500 mb-2">
                          <Link href="/privacy-policy?mode=app">
                            <span className="text-movet-brown hover:underline  ease-in-out duration-500 cursor-pointer">
                              privacy policy
                            </span>
                          </Link>
                        </span>{" "}
                        and{" "}
                        <span className="font-medium font-abside text-center md:text-left hover:underline  ease-in-out duration-500 mb-2">
                          <Link href="/terms-and-conditions?mode=app">
                            <span className="text-movet-brown hover:underline  ease-in-out duration-500 cursor-pointer">
                              terms of service
                            </span>
                          </Link>
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </form>
                {!isAppMode && (
                  <>
                    <hr className="border-movet-gray w-full sm:w-2/3 mx-auto" />
                    <div className="flex flex-row justify-center w-full mx-auto mt-8">
                      <AppLinks />
                    </div>
                    <p className="text-center mb-4 italic text-sm w-full sm:w-2/3 mx-auto">
                      You can also download our our mobile app to schedule
                      appointments, manage your pets, chat with us, and more!
                    </p>
                  </>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
