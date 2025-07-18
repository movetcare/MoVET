import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { Button } from "../../elements";
import { EmailInput } from "../inputs";
import { environment } from "utilities";

export const BookAnAppointmentForm = () => {
  const {
    control,
    handleSubmit,
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
  const onSubmit = async (data: any) => {
    window.open(
      (environment === "production"
        ? "https://app.movetcare.com"
        : window.location.hostname === "localhost"
          ? `http://localhost:3001`
          : "https://stage.app.movetcare.com") +
        `?email=${data.email?.toLowerCase()?.replaceAll("+", "%2B")}`,
      "_blank",
    );
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center items-top"
    >
      <EmailInput
        autoFocus={false}
        required
        name="email"
        errors={errors}
        control={control}
        placeholder={"Your Email Address"}
      />
      <Button
        title="Book an Appointment"
        type="submit"
        icon={faPaw}
        iconSize={"lg"}
        disabled={!isDirty}
        color="red"
        text=""
        className={"ml-2 mr-0 mt-1"}
        onClick={handleSubmit(onSubmit)}
      />
    </form>
  );
};
