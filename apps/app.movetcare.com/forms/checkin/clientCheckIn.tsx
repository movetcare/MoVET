import {
  faCheckCircle,
  faCreditCard,
  faPaw,
  faRedo,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "ui";
import EmailInput from "components/inputs/EmailInput";
import { Loader, AppLinks } from "ui";
import { httpsCallable } from "firebase/functions";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { functions } from "services/firebase";
import { formatPhoneNumber } from "utilities";
import { Error } from "components/Error";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const ClientCheckIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean | null>(null);
  const [client, setClient] = useState<any>();
  const [email, setEmail] = useState<string | null>(null);
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
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (executeRecaptcha) {
      const token = await executeRecaptcha("checkIn");
      if (token) {
        try {
          const { data: result }: any = await httpsCallable(
            functions,
            "checkIn"
          )({ email: data.email.toLowerCase(), token });
          if (result && result?.client?.id) {
            if (result?.client?.email)
              setEmail(result?.client?.email?.replaceAll("+", "%2B"));
            sessionStorage.setItem("id", result?.client?.id);
            if (result?.session?.url)
              sessionStorage.setItem("session", result?.session?.url);
            if (
              result?.isNewClient ||
              !result?.client?.phone ||
              !result?.client?.firstName ||
              !result?.client?.lastName
            )
              router.push("/checkin/info/");
            else if (result?.session?.url) router.push(result?.session?.url);
            else {
              setClient(result.client);
              setSignUpSuccess(true);
            }
          } else {
            setSignUpSuccess(false);
          }
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
        <Error error={error} />
      ) : (
        <>
          {signUpSuccess && client ? (
            <div className="text-center">
              <FontAwesomeIcon icon={faCheckCircle} size="4x" color="#00A36C" />
              <h3 className="text-2xl font-extrabold tracking-tight text-movet-black font-parkinson mt-6">
                Welcome Back
                {client?.firstName
                  ? ` ${
                      client?.firstName.charAt(0).toUpperCase() +
                      client?.firstName.slice(1)
                    }`
                  : ""}
                !
              </h3>
              <h3 className="text-base tracking-tight text-movet-black font-parkinson mt-1">
                We&apos;ve got you checked in
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
                    onClick={() => router.push("/checkin/info/")}
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
                      onClick={() => router.push(`/payment?email=${email}`)}
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
            <>
              <h2 className="text-2xl font-extrabold tracking-tight text-center">
                Appointment Check-In
              </h2>
              <p className="text-center mb-4">
                Please check in for your appointment by submitting your email
                below
              </p>
              <p className="text-center mb-4 italic"></p>
              <form className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 mb-4">
                <div className="sm:col-span-2 my-2">
                  <EmailInput
                    autoFocus
                    required
                    label=""
                    name="email"
                    errors={errors}
                    control={control}
                    placeholder={"Your Email Address*"}
                  />
                </div>
                <div className="flex justify-center items-center sm:col-span-2">
                  <Button
                    color="red"
                    type="submit"
                    icon={faPaw}
                    iconSize={"lg"}
                    disabled={!isDirty}
                    text="Check In for Appointment"
                    className={"w-full md:w-2/3 bg-movet-red"}
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
                <div className="flex sm:col-span-2 -mt-0 mx-auto">
                  <div className="flex items-center justify-center text-center">
                    <p className="text-xs italic text-movet-black">
                      By clicking the &quot;Check In for Appointment&quot;
                      button above,
                      <br />
                      you agree to the{" "}
                      <span className="font-medium font-abside text-center md:text-left hover:underline  ease-in-out duration-500 mb-2">
                        <Link href="/privacy-policy?mode=app">
                          <span className="text-movet-brown hover:underline ease-in-out duration-500 cursor-pointer">
                            privacy policy
                          </span>
                        </Link>
                      </span>{" "}
                      and{" "}
                      <span className="font-medium font-abside text-center md:text-left hover:underline  ease-in-out duration-500 mb-2">
                        <Link href="/terms-and-conditions?mode=app">
                          <span className="text-movet-brown hover:underline ease-in-out duration-500 cursor-pointer">
                            terms of service
                          </span>
                        </Link>
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </section>
  );
};
