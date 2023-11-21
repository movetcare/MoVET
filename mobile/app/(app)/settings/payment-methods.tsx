import {
  initStripe,
  initPaymentSheet,
  presentPaymentSheet,
  PaymentMethod,
} from "@stripe/stripe-react-native";
import { ErrorModal } from "components/Modal";
import {
  View,
  Screen,
  ActionButton,
  BodyText,
  SubHeadingText,
  Icon,
  ItalicText,
  Container,
} from "components/themed";
import Constants from "expo-constants";
import { router } from "expo-router";
import { firestore, functions } from "firebase-config";
import {
  onSnapshot,
  query,
  DocumentData,
  QuerySnapshot,
  collection,
  where,
  orderBy,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useState, useEffect } from "react";
import { AuthStore } from "stores/AuthStore";
import tw from "tailwind";
import { isProductionEnvironment } from "utils/isProductionEnvironment";
import { isTablet } from "utils/isTablet";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  type: string;
}

const PaymentMethods = () => {
  const { user } = AuthStore.useState();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentOptionsReady, setPaymentOptionsReady] =
    useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] =
    useState<Array<PaymentMethod> | null>(null);

  useEffect(() => {
    initStripe({
      publishableKey: Constants?.expoConfig?.extra?.stripe_key || null,
      urlScheme: "movet",
      merchantIdentifier: "merchant.com.movetcare",
    });
    prepPaymentSheet();
    const unsubscribePaymentMethods = onSnapshot(
      query(
        collection(firestore, "clients", `${user?.uid}`, "payment_methods"),
        where("active", "==", true),
        orderBy("updatedOn", "desc"),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) return;
        const paymentMethods: Array<PaymentMethod> = [];
        querySnapshot.forEach((doc: DocumentData) => {
          paymentMethods.push({
            id: doc.id,
            brand: doc.data()?.card?.brand,
            last4: doc.data()?.card?.last4,
            expMonth: doc.data()?.card?.exp_month,
            expYear: doc.data()?.card?.exp_year,
            type: doc.data()?.type,
          });
        });
        if (paymentMethods.length > 0) setPaymentMethods(paymentMethods);
        setIsLoading(false);
      },
      (error: any) => {
        setPaymentMethods(null);
        setIsLoading(false);
        setError(error);
      },
    );
    return () => unsubscribePaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prepPaymentSheet = async () => {
    setIsLoading(true);
    const getCustomerDetails = httpsCallable(functions, "createCustomer");
    await getCustomerDetails()
      .then(async (result: any) => {
        console.log(" prepPaymentSheet result.data", result.data);
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
          console.log(" loadPaymentOptions result.data", result.data);
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
          } else router.replace("/settings/payment-methods");
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
      <View
        style={[
          tw`
              w-full flex-grow justify-center items-center bg-transparent px-4
            `,
          isTablet ? tw`mb-8` : tw`mb-4`,
        ]}
        noDarkMode
      >
        {!paymentMethods ? (
          <>
            <Icon name="credit-card" size="xl" />
            <SubHeadingText style={tw`mb-4 mt-2 text-lg`}>
              No Payment Methods on File
            </SubHeadingText>
            <BodyText style={tw`mb-8`}>
              Having a payment source on file allows you to receive expedited
              service and skip the checkout lines when visiting our clinic and
              boutique.
            </BodyText>
          </>
        ) : (
          <>
            <SubHeadingText style={tw`text-lg mb-2`}>
              Payment Methods on File
            </SubHeadingText>
            {paymentMethods.map(
              (paymentMethod: PaymentMethod, index: number) => (
                <View
                  key={index}
                  style={tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-col items-center border-2 dark:border-movet-white w-full`}
                >
                  <Container
                    style={tw`flex-row items-center justify-center w-full`}
                  >
                    <Container style={tw`px-3`}>
                      <Icon
                        name={"credit-card"}
                        size={isTablet ? "md" : "sm"}
                      />
                    </Container>
                    <Container style={tw`flex-shrink flex-row items-center`}>
                      <ItalicText
                        style={[
                          isTablet ? tw`text-2xl` : tw`text-xl`,
                          tw`ml-2`,
                        ]}
                      >
                        {paymentMethod.brand?.toUpperCase()} -{" "}
                        {paymentMethod.last4}
                      </ItalicText>
                      <BodyText
                        style={[
                          tw`ml-2`,
                          isTablet ? tw`text-base` : tw`text-xs`,
                        ]}
                      >
                        {paymentMethod.expMonth}/{paymentMethod.expYear}
                      </BodyText>
                    </Container>
                  </Container>
                </View>
              ),
            )}
            <View style={tw`h-16`} />
          </>
        )}
        <ActionButton
          title={
            !paymentMethods ? "Add a Payment Method" : "Update Payment Methods"
          }
          iconName={!paymentMethods ? "plus" : "credit-card"}
          onPress={async () => await loadPaymentOptions()}
          disabled={!paymentOptionsReady || isLoading}
        />
      </View>
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
