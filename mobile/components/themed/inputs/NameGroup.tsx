import tw from "tailwind";
import { View } from "../View";
import { NameInput } from "./NameInput";

export const NameGroup = ({
  control,
  errors,
  defaultFirst = null,
  defaultLast = null,
  editable = false,
}: {
  control: any;
  errors: any;
  defaultFirst?: string | null;
  defaultLast?: string | null;
  editable?: boolean;
}) => (
  <View style={tw`flex-row w-full bg-transparent mt-4`}>
    <View style={tw`flex-col flex-1 bg-transparent`}>
      <NameInput
        editable={editable}
        control={control}
        error={(errors["firstName"] as any)?.message as string}
        name="firstName"
        placeholder="First Name"
        defaultValue={defaultFirst}
        textContentType="givenName"
      />
    </View>
    <View style={tw`m-2`} />
    <View style={tw`flex-col flex-1 bg-transparent`}>
      <NameInput
        editable={editable}
        control={control}
        error={(errors["lastName"] as any)?.message as string}
        name="lastName"
        placeholder="Last Name"
        defaultValue={defaultLast}
        textContentType="familyName"
      />
    </View>
  </View>
);
