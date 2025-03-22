import { Button } from "./Button";
import { faDoorOpen, faPaw } from "@fortawesome/free-solid-svg-icons";

export const AppLinks = ({ size = "sm" }: { size?: "sm" | "lg" }) => (
  <>
    <Button
      color="red"
      onClick={() => {
        window.open("https://petportal.vet/movet/register", "_blank");
      }}
      text="Register"
      icon={faPaw}
      className="mr-1 shrink-0 ios-app-link"
    />
    <Button
      color="black"
      onClick={() => {
        window.open("https://petportal.vet/movet/login", "_blank");
      }}
      text="Login"
      icon={faDoorOpen}
      className="ml-1 shrink-0 ios-app-link"
    />
  </>
);
