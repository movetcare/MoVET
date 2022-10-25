import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { httpsCallable } from "firebase/functions";
import Link from "next/link";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { functions } from "services/firebase";
import { string, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "ui";
import EmailInput from "./inputs/EmailInput";

export const SignUp = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean | null>(
    null
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
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (executeRecaptcha) {
      const token = await executeRecaptcha("mobileAppSignUp");
      const { data: didSucceed }: any = await httpsCallable(
        functions,
        "contact"
      )({ ...data, mobileAppSignUp: true, token });
      if (didSucceed) setSubmissionSuccess(true);
      else setSubmissionSuccess(false);
    } else setSubmissionSuccess(false);
    reset();
    setIsLoading(false);
  };
  return (
    <form className="flex flex-col justify-center items-center">
      <p className="font-abside text-2xl text-movet-white sm:text-movet-black mb-0">
        Join MoVET Today
      </p>
      {submissionSuccess ? (
        <p className="italic">
          Success! Check your email for a verification link.
        </p>
      ) : (
        <div className="group">
          <div className="flex flex-col md:flex-row my-4 items-center justify-center text-movet-black">
            <EmailInput
              required
              disabled={isLoading}
              name="email"
              errors={errors}
              control={control}
              placeholder={"Your Email Address"}
            />
            <Button
              type="submit"
              icon={faPaw}
              color="red"
              iconSize={"sm"}
              loading={isLoading}
              disabled={!isDirty || isLoading}
              text="Sign Up"
              className={"ml-0 md:ml-4 mt-4 md:mt-0"}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
          <div className="hidden group-hover:flex items-center justify-center text-center md:-mt-4 md:-mb-2">
            <p className="text-xs italic text-movet-white md:text-movet-black">
              By clicking the Sig Up button, you agree to the{" "}
              <Link href="/privacy-policy" passHref>
                <span className="font-medium text-movet-white md:text-movet-brown font-abside text-center md:text-left hover:underline ease-in-out duration-500 mb-2 cursor-pointer">
                  Privacy Policy{" "}
                </span>
              </Link>{" "}
              and{" "}
              <Link href="/terms-and-conditions" passHref>
                <span className="font-medium text-movet-white md:text-movet-brown font-abside text-center md:text-left hover:underline ease-in-out duration-500 mb-2 cursor-pointer">
                  Terms of Service{" "}
                </span>
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </form>
  );
};
