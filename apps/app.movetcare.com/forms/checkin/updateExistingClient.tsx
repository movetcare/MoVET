import {
  faCheckCircle,
  faCircleExclamation,
  faCreditCard,
  faPaw,
  faRedo,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "ui";
import PhoneInput from "components/inputs/PhoneInput";
import TextInput from "components/inputs/TextInput";
import { Loader, AppLinks } from "ui";
import { httpsCallable } from "firebase/functions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { functions } from "services/firebase";
import { formatPhoneNumber } from "utilities";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const UpdateExistingClient = () => {
  const router = useRouter();
  const { mode } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(
      object().shape({
        firstName: string().required("A first name is required"),
        lastName: string().required("A last name is required"),
        phone: string()
          .min(10, "Phone number must be 10 digits")
          .required("A phone number is required"),
      })
    ),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage) {
      const fetchClientData = async () => {
        setIsLoading(true);
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "checkIn"
          )({ id: sessionStorage.getItem("id"), token: true });
          if (result?.email) setEmail(result?.email?.replaceAll("+", "%2B"));
          reset({
            firstName: result?.firstName || "",
            lastName: result?.lastName || "",
            phone: result?.phone || "",
          });
          if (result?.firstName || result?.lastName || result?.phone) trigger();
        } catch (error: any) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchClientData();
    }
  }, [reset, trigger, email]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (executeRecaptcha) {
      const token = await executeRecaptcha("checkInInfo");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "checkIn"
          )({
            ...data,
            id:
              (typeof window !== "undefined" && sessionStorage.getItem("id")) ||
              null,
            token,
          });
          if (result) {
            if (
              typeof window !== "undefined" &&
              sessionStorage.getItem("session")
            )
              router.push(
                (typeof window !== "undefined" &&
                  sessionStorage.getItem("session")) ||
                  "/appointment-check-in/"
              );
            else {
              setSignUpSuccess(true);
              setClient(result?.client);
            }
          } else setSignUpSuccess(false);
        } catch (error) {
          console.error(error);
          setError(error);
          reset();
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  return (
    <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 mb-8 sm:p-8">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-movet-black sm:text-4xl font-parkinson mb-4">
            Whoops!
          </h2>
          <FontAwesomeIcon
            icon={faCircleExclamation}
            size="3x"
            color="#E76159"
          />
          <p className={"mt-4 text-lg leading-6 text-movet-black"}>
            We&apos;re sorry, but something went wrong. Please try again or ask
            the front desk for assistance.
          </p>
          <p>{JSON.stringify(error)}</p>
        </div>
      ) : (
        <>
          {signUpSuccess && client ? (
            <div className="text-center">
              <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#00A36C" />
              <h3 className="text-2xl tracking-tight text-movet-black font-parkinson mt-6">
                We&apos;ve got you checked in
                {client?.firstName
                  ? ` ${
                      client?.firstName.charAt(0).toUpperCase() +
                      client?.firstName.slice(1)
                    }`
                  : ""}
                .
              </h3>
              <p
                className={
                  "text-lg leading-6 text-movet-black font-source-sans-pro mt-4"
                }
              >
                We&apos;ll send you a text @{" "}
                <span className="italic">
                  {formatPhoneNumber(client?.phone)}
                </span>{" "}
                as soon as we are ready to begin your appointment.
              </p>
              <p
                className={
                  "mt-4 leading-6 text-movet-black font-source-sans-pro italic"
                }
              >
                Feel free to browse our shop and checkout our new mobile app
                which you can use to book future clinic, at home, and telehealth
                appointments!
              </p>
              <div className="flex flex-col justify-center items-center mt-6">
                <div className="flex justify-center">
                  <AppLinks />
                </div>
              </div>
              <h3 className="mt-4">Need to change your information?</h3>
              <div className="flex flex-row justify-center items-center">
                <div className="mx-2 flex flex-col justify-center items-center">
                  <Button
                    color="black"
                    icon={faUserEdit}
                    iconSize={"lg"}
                    text="Update Profile"
                    className={"mt-4"}
                    onClick={() => router.reload()}
                  />
                </div>
                {email && (
                  <div className="mx-2 flex flex-col justify-center items-center">
                    <Button
                      color="red"
                      icon={faCreditCard}
                      iconSize={"lg"}
                      text="Update Payment"
                      className={"mt-4"}
                      onClick={() =>
                        router.push(`/update-payment-method?email=${email}`)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p
                className={
                  "leading-6 text-movet-black font-source-sans-pro text-lg"
                }
              >
                {signUpSuccess === null
                  ? ""
                  : "Whoops! Something went wrong. Please try again later or ask the front desk for assistance if you continue having trouble."}
              </p>
              {signUpSuccess !== null && (
                <div className="flex flex-col justify-center items-center">
                  <Button
                    color="red"
                    icon={faRedo}
                    iconSize={"lg"}
                    text="Try Again"
                    className={"w-full md:w-1/3 mt-4"}
                    onClick={() => router.reload()}
                  />
                </div>
              )}
            </div>
          )}
          {signUpSuccess === null && (
            <div>
              <h1 className="text-xl text-center mb-2 normal-case">
                Contact Information
              </h1>
              <p className="italic text-center text-movet-black mb-6">
                Let us know how to reach you when it comes time for your
                appointment.
              </p>
              <form className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                <TextInput
                  required
                  autoFocus={!(mode !== "app")}
                  label="First Name"
                  name="firstName"
                  control={control}
                  errors={errors}
                  placeholder="First Name"
                  autoComplete="given-name"
                />
                <TextInput
                  required
                  label="Last Name"
                  name="lastName"
                  control={control}
                  errors={errors}
                  placeholder="Last Name"
                  autoComplete="family-name"
                />
                <div className="sm:col-span-2 my-2">
                  <PhoneInput
                    required
                    label="Phone Number"
                    name="phone"
                    control={control}
                    errors={errors}
                  />
                </div>
                <div className="flex justify-center items-center sm:col-span-2 my-4">
                  <Button
                    type="submit"
                    icon={faPaw}
                    iconSize={"lg"}
                    text="Submit"
                    className={"w-full md:w-1/3"}
                    color="black"
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default UpdateExistingClient;
