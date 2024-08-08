import {
  Container,
  Icon,
  ItalicText,
  SubHeadingText,
  View,
} from "components/themed";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import type { Invoice } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

export const UnpaidInvoiceNotice = ({
  unpaidInvoices,
}: {
  unpaidInvoices: Array<Invoice>;
}) => {
  return unpaidInvoices.map(({ id, totalDue }: Invoice) => (
    <TouchableOpacity
      key={id}
      onPress={() =>
        router.navigate({
          pathname: "/(app)/home/invoice-detail",
          params: {
            id,
          },
        })
      }
    >
      <View
        noDarkMode
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-row mb-4 rounded-xl bg-transparent`,
        ]}
      >
        <View
          style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full shadow-lg shadow-movet-black dark:shadow-movet-white bg-movet-red`}
          noDarkMode
        >
          <Container>
            <Icon
              name="user-medical-message"
              height={30}
              width={30}
              color="white"
            />
          </Container>
          <Container style={tw`pl-3 mr-6`}>
            <SubHeadingText style={tw`text-movet-white`} noDarkMode>
              OUTSTANDING INVOICE: ${totalDue.toFixed(2)}
            </SubHeadingText>
            <ItalicText style={tw`text-movet-white mb-2`} noDarkMode>
              Tap here to complete your payment...
            </ItalicText>
          </Container>
        </View>
      </View>
    </TouchableOpacity>
  ));
};
