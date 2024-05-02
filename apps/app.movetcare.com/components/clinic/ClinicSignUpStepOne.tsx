import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import EmailInput from "components/inputs/EmailInput";
import { httpsCallable } from "firebase/functions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { functions } from "services/firebase";
import UAParser from "ua-parser-js";
import { Loader, Button, AppLinks } from "ui";
import { object, string } from "yup";
import { Error } from "components/Error";
import { ClinicConfig } from "types";

export const ClinicSignUpStepOne = ({ config }: { config: ClinicConfig }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isAppMode = mode === "app";
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
      }),
    ),
    defaultValues: {
      email: "",
    } as any,
  });
  const handleError = (error: any) => {
    setError(error);
    reset();
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage("Processing, Please Wait...");
    if (!window.localStorage.getItem("email"))
      window.localStorage.setItem(
        "email",
        data?.email?.toString()?.toLowerCase(),
      );
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleClinic",
          )({
            email: data.email?.toLowerCase(),
            device: JSON.parse(
              JSON.stringify(UAParser(), function (key: any, value: any) {
                if (value === undefined) return null;
                return value;
              }),
            ),
            token,
          });
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage(
              result?.client?.isExistingClient
                ? "Loading Your Account..."
                : "Starting Your Session...",
            );

            window.localStorage.setItem(
              "clinicBookingSession",
              JSON.stringify(result),
            );
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    } else
      handleError({ message: "SOMETHING WENT WRONG - Please Try Again..." });
  };
  return (
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
          {!isAppMode && (
            <h2 className="text-2xl font-extrabold tracking-tight text-center text-movet-blue font-parkinson">
              {config?.name}
            </h2>
          )}
          <p className="text-center mb-4 w-full mx-auto">
            {config?.description}
          </p>
          <form className="group grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 pb-4 mb-4 w-full sm:w-2/3 mx-auto">
            <div className="sm:col-span-2 my-2">
              <h3 className="-mb-5 text-xl text-movet-red text-center font-source-sans-pro">
                Reserve Your Spot Today
              </h3>
            </div>
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
                disabled={!isDirty}
                text="Start Booking"
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
  );
};
