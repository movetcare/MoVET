import {
  initStripe,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { Loader } from "components/Loader";
import { ErrorModal } from "components/Modal";
import { View, Screen, Container, ActionButton } from "components/themed";
import Constants from "expo-constants";
import { router } from "expo-router";
import { functions } from "firebase-config";
import { httpsCallable } from "firebase/functions";
import { useState, useEffect } from "react";
import tw from "tailwind";
import { isProductionEnvironment } from "utils/isProductionEnvironment";
import { isTablet } from "utils/isTablet";

const PaymentMethods = () => {
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentOptionsReady, setPaymentOptionsReady] =
    useState<boolean>(false);

  useEffect(() => {
    initStripe({
      publishableKey: Constants?.expoConfig?.extra?.stripe_key || null,
      urlScheme: "movet",
      merchantIdentifier: "merchant.com.movetcare",
    });
    prepPaymentSheet();
  }, []);

  const prepPaymentSheet = async () => {
    setIsLoading(true);
    const getCustomerDetails = httpsCallable(functions, "createCustomer");
    await getCustomerDetails()
      .then(async (result: any) => {
        if (result.data) {
          const { error: paymentSheetError } = await initPaymentSheet({
            customerId: result.data?.customer,
            customerEphemeralKeySecret: result.data?.ephemeralKey,
            setupIntentClientSecret: result.data?.setupIntent,
            applePay: __DEV__,
            merchantCountryCode: "US",
            googlePay: true,
            merchantDisplayName: "MoVET",
            testEnv: isProductionEnvironment,
          } as any);
          if (paymentSheetError) handleError(paymentSheetError);
          else setPaymentOptionsReady(true);
        }
      })
      .catch((error: any) => handleError(error))
      .finally(() => setIsLoading(false));
  };

  const loadPaymentOptions = async () => {
    setIsLoading(true);
    const handleCustomerToken = httpsCallable(
      functions,
      "refreshCustomerToken",
    );
    await handleCustomerToken()
      .then(async (result: any) => {
        if (result) {
          const { error: paymentSheetError } = await initPaymentSheet({
            customerId: result.data?.customer,
            customerEphemeralKeySecret: result.data?.ephemeralKey,
            setupIntentClientSecret: result.data?.setupIntent,
            applePay: __DEV__,
            merchantCountryCode: "US",
            googlePay: true,
            merchantDisplayName: "MoVET",
            testEnv: !isProductionEnvironment,
          } as any);
          if (paymentSheetError) {
            handleError(
              paymentSheetError?.message
                ? paymentSheetError.message
                : "Unable to retrieve payment information",
            );
          }
          const { error } = await presentPaymentSheet();
          if (error && error?.message !== "The payment has been canceled") {
            handleError(error);
          }
        } else {
          const { error } = await presentPaymentSheet();
          if (error) handleError(error);
        }
      })
      .catch((error: any) => handleError(error))
      .finally(() => setIsLoading(false));
  };

  const handleError = (error: any) => {
    setError(error);
    setPaymentOptionsReady(false);
    setIsLoading(false);
  };

  return (
    <Screen>
      {isLoading ? (
        <Container style={tw`w-full flex-grow`}>
          <Loader description="Loading Payment Methods..." />
        </Container>
      ) : (
        <View
          style={[
            tw`
              w-full flex-grow justify-center items-center bg-transparent px-4
            `,
            isTablet ? tw`mb-8` : tw`mb-4`,
          ]}
          noDarkMode
        >
          <ActionButton
            title="Update Payment Method"
            iconName="credit-card"
            onPress={async () => await loadPaymentOptions()}
            disabled={!paymentOptionsReady}
          />
        </View>
      )}
      <ErrorModal
        isVisible={error !== null}
        onClose={() => {
          handleError(null);
          router.back();
        }}
        message={error?.code || error?.message || JSON.stringify(error)}
      />
    </Screen>
  );
};

export default PaymentMethods;
