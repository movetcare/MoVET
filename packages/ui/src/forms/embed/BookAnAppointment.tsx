import { useState } from "react";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/Button";
import { EmailInput } from "../../components/inputs/EmailInput";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

export const BookAnAppointment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(false);
    window.open(
      `https://app.movetcare.com/book-an-appointment?email=${data.email
        ?.toLowerCase()
        ?.replaceAll("+", "%2B")}`,
      "_blank"
    );
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-top"
    >
      <EmailInput
        autoFocus
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
        iconSize={"lg"}
        disabled={!isDirty || isLoading}
        color="red"
        loading={isLoading}
        text=""
        className={"ml-2 mr-0 mt-1"}
        onClick={handleSubmit(onSubmit)}
      />
    </form>
  );
};
