import { BodyText } from "./themed";

export const Debug = ({ object }: { object: any }) => (
  <BodyText>{JSON.stringify(object, null, 2)}</BodyText>
);
