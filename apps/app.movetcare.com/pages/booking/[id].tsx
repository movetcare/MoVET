import { faArrowRight, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppHeader } from "components/AppHeader";
import EmailInput from "components/inputs/EmailInput";
import { httpsCallable } from "firebase/functions";
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { getClinicConfig } from "server";
import { functions } from "services/firebase";
import type { ClinicConfig } from "types";
import UAParser from "ua-parser-js";
import { Loader, Button, AppLinks, Modal } from "ui";
import { object, string } from "yup";
import { Error } from "components/Error";

export const getStaticPaths = (async () => ({
  paths: (await getClinicConfig({ id: "all" })) || null,
  fallback: false,
})) satisfies GetStaticPaths;

export const getStaticProps = (async (context) => ({
  props: {
    clinicConfig:
      (await getClinicConfig({ id: context.params?.id as string })) || null,
  },
})) satisfies GetStaticProps<{
  clinicConfig: ClinicConfig;
}>;

export default function PopUpClinic({
  clinicConfig,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { email, mode } = router.query || {};
  const isAppMode = mode === "app";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const cancelButtonRef = useRef(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(
    "Loading, please wait...",
  );
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
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
    if (!window.localStorage.getItem("clinicEmail"))
      window.localStorage.setItem(
        "clinicEmail",
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
            clinic: clinicConfig,
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
            if (result?.step)
              router.push(
                `/booking-clinic/${result.step}` +
                  (isAppMode ? "?mode=app" : ""),
              );
            else if (result?.client?.requiresInfo)
              router.push(
                "/booking-clinic/contact-info" + (isAppMode ? "?mode=app" : ""),
              );
            else if (result?.patients?.length === 0)
              router.push(
                "/booking-clinic/add-a-pet" + (isAppMode ? "?mode=app" : ""),
              );
            else
              router.push(
                "/booking-clinic/pet-selection" +
                  (isAppMode ? "?mode=app" : ""),
              );
          } else handleError(result);
        } catch (error) {
          handleError(error);
        }
      }
    } else
      handleError({ message: "SOMETHING WENT WRONG - Please Try Again..." });
  };
  useEffect(() => {
    if (
      (window.localStorage.getItem("clinicEmail") || email) &&
      executeRecaptcha
    ) {
      setIsLoading(true);
      if (email) {
        setValue(
          "email",
          (email as string)
            ?.toLowerCase()
            ?.replaceAll(" ", "+")
            ?.replaceAll("%20", "+")
            ?.replaceAll("%40", "@"),
          {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          },
        );
        setIsLoading(false);
      } else if (window.localStorage.getItem("clinicEmail"))
        onSubmit({
          email: (
            window.localStorage.getItem("clinicEmail") as string
          )?.replaceAll("?mode=app", ""),
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, executeRecaptcha]);

  const formatTime = (time: string) =>
    time?.toString()?.length === 3 ? `0${time}` : `${time}`;

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
                <h2 className="text-2xl font-extrabold tracking-tight text-center text-movet-blue mb-0">
                  {clinicConfig?.name}
                </h2>
                <h3 className="text-lg text-center text-movet-blue font-source-sans-pro">
                  {clinicConfig?.address}
                </h3>
                <h3 className=" italic text-center text-movet-blue font-source-sans-pro">
                  {new Date(
                    "1970-01-01T" +
                      formatTime(clinicConfig?.schedule?.startTime).slice(
                        0,
                        2,
                      ) +
                      ":" +
                      formatTime(clinicConfig?.schedule?.startTime).slice(2) +
                      ":00Z",
                  ).toLocaleTimeString("en-US", {
                    timeZone: "UTC",
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(
                    "1970-01-01T" +
                      formatTime(clinicConfig?.schedule?.endTime).slice(0, 2) +
                      ":" +
                      formatTime(clinicConfig?.schedule?.endTime).slice(2) +
                      ":00Z",
                  ).toLocaleTimeString("en-US", {
                    timeZone: "UTC",
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  })}{" "}
                  on{" "}
                  {new Date(clinicConfig?.schedule?.date)?.toLocaleDateString(
                    "en-us",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </h3>
                {clinicConfig?.vcprRequired && (
                  <h4
                    onClick={() => setShowExplainer(!showExplainer)}
                    className="m-0 text-sm text-center text-movet-red uppercase font-source-sans-pro-italic hover:underline cursor-pointer"
                  >
                    * VCPR Required
                  </h4>
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
                <iframe
                  title="Google Map of MoVET @ Belleview Station"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?q=place_id:${clinicConfig?.placeId}&key=AIzaSyD-8-Mxe05Y1ySHD7XoDcumWt3vjA-URF0`}
                  className="w-full h-80 rounded-xl my-4"
                />
                {clinicConfig?.addressInfo && (
                  <p className="text-center italic text-xs">
                    {clinicConfig?.addressInfo}
                  </p>
                )}
                <div
                  className="text-center my-4 w-full mx-auto"
                  dangerouslySetInnerHTML={{
                    __html: clinicConfig?.description,
                  }}
                />
                {!email && (
                  <hr className="border-movet-gray w-full sm:w-2/3 mx-auto mb-2" />
                )}
                <form className="group grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 pb-4 mb-4 w-full sm:w-2/3 mx-auto">
                  <div className="sm:col-span-2 my-2">
                    <h3
                      className={`${email ? "" : "-mb-5"} text-xl text-movet-red text-center font-source-sans-pro`}
                    >
                      Reserve Your Spot Today
                    </h3>
                  </div>
                  {!email && (
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
                  )}
                  <div className="flex justify-center items-center sm:col-span-2">
                    <Button
                      type="submit"
                      icon={faArrowRight}
                      iconSize={"lg"}
                      disabled={!isDirty && email === undefined}
                      text="Sign Up"
                      className={"w-full md:w-2/3"}
                      color="red"
                      onClick={handleSubmit(onSubmit)}
                    />
                  </div>
                  {!email && (
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
                  )}
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
