import { ErrorLayout } from "components/themed";

export default function NotFoundScreen() {
  return (
    <ErrorLayout message={"The screen you are looking for does not exist..."} />
  );
}
