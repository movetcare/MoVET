import { AppHeader } from "components/AppHeader";
import { useRouter } from "next/router";
import { Error } from "components/Error";
import { useEffect, useState } from "react";
import { Button, Loader } from "ui";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { lazy, object, string } from "yup";
import { httpsCallable } from "firebase/functions";
import { functions } from "services/firebase";
import { BookingHeader } from "components/BookingHeader";
import { BookingFooter } from "components/BookingFooter";
import { SearchInput } from "components/inputs/SearchInput";
import getUrlQueryStringFromObject from "utilities/src/getUrlQueryStringFromObject";

export default function ReasonSelection() {
  const router = useRouter();
  const { mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [reasons, setReasons] = useState<Array<any> | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: "all",
    resolver: yupResolver(
      object().shape({
        reason: lazy((value: any) =>
          typeof value === "object" && !Array.isArray(value) && value !== null
            ? object().shape({
                label: string().trim().min(1, "A selection is required"),
                value: string().trim().min(1, "A selection is required"),
              })
            : string()
                .matches(/.*\d/, "A selection selection is required")
                .required("A selection selection is required")
        ),
      })
    ),
    defaultValues: {
      reason: "",
    } as any,
  });
  useEffect(() => {
    if (window.localStorage.getItem("bookingSession") === null)
      router.push("/schedule-an-appointment");
  }, [router]);
  useEffect(() => {
    const fetchReasons = async () => {
      const { data: result }: any = await httpsCallable(
        functions,
        "getReasons"
      )({
        reasonGroup: JSON.parse(
          window.localStorage.getItem("bookingSession") as string
        )?.locationId,
      });
      if (result?.error !== true || result?.error === undefined) {
        setReasons(result);
        setIsLoading(false);
      } else handleError(result);
    };
    if (window.localStorage.getItem("bookingSession")) fetchReasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleError = (error: any) => {
    console.error(error);
    setError(error);
    reset();
    setIsLoading(false);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setLoadingMessage("Saving Selection...");
    if (executeRecaptcha) {
      const token = await executeRecaptcha("booking");
      if (token) {
        try {
          const session = JSON.parse(
            window.localStorage.getItem("bookingSession") as string
          );
          const { data: result }: any = await httpsCallable(
            functions,
            "scheduleAppointment"
          )({
            ...data,
            id: session?.id,
            device: navigator.userAgent,
            token,
          });
          if (result?.error !== true || result?.error === undefined) {
            setLoadingMessage("Almost Finished...");
            if (result?.client?.uid && result?.id) {
              window.localStorage.setItem(
                "bookingSession",
                JSON.stringify(result)
              );
              const queryString = getUrlQueryStringFromObject(router.query);
              if (result.staff)
                router.push(
                  "/schedule-an-appointment/staff-selection" +
                    (queryString ? queryString : "")
                );
              else
                router.push(
                  "/schedule-an-appointment/datetime-selection" +
                    (queryString ? queryString : "")
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
                  title={"Choose a Service"}
                  description={"What kind of service are you needing?"}
                />
                <div className="mt-8 px-1">
                  <form className="grid grid-cols-1 gap-y-8 text-left mt-8 z-50 relative mb-8 overflow-visible">
                    <SearchInput
                      label="Service"
                      options={reasons || []}
                      control={control}
                      errors={errors}
                      name="reason"
                      placeholder="Select a Service Type"
                      required
                    />
                    <Button
                      disabled={!isDirty || !isValid}
                      type="submit"
                      icon={faArrowRight}
                      iconSize={"sm"}
                      color="black"
                      text="Continue"
                      className={"w-full mx-auto mt-12"}
                      onClick={handleSubmit(onSubmit)}
                    />
                  </form>
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
