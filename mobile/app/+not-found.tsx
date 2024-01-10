import { ErrorLayout } from "components/themed";
import { useLocalSearchParams } from "expo-router";

export default function NotFoundScreen() {
  return (
    <ErrorLayout
      message={" The screen you are looking for does not exist..."}
      details={JSON.stringify(useLocalSearchParams())}
    />
  );
}
