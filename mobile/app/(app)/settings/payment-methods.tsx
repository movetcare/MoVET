import {
  initStripe,
  initPaymentSheet,
  presentPaymentSheet,
  PaymentMethod,
} from "@stripe/stripe-react-native";
import {
  View,
  Screen,
  ActionButton,
  BodyText,
  SubHeadingText,
  Icon,
  ItalicText,
  Container,
  HeadingText,
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
import { TouchableOpacity } from "react-native";
import { AuthStore, ErrorStore } from "stores";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showUpcomingExpirationWarning, setShowUpcomingExpirationWarning] =
    useState(false);
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);
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

  const setError = (error: any) => {
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });
  };

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
          } else router.replace("/settings/payment-methods");
        } else {
          const { error } = await presentPaymentSheet();
          if (error) handleError(error);
        }
      })
      .catch((error: any) => handleError(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (paymentMethods) {
      let hasValidPaymentMethod = false;
      let hasExpiredPaymentMethod = false;
      let hasUpcomingExpirationPaymentMethod = false;
      paymentMethods.forEach((paymentMethod: PaymentMethod) => {
        if (
          paymentMethod.expMonth < new Date().getMonth() + 1 &&
          paymentMethod.expYear <= new Date().getFullYear()
        )
          hasExpiredPaymentMethod = true;
        else if (
          (paymentMethod.expMonth === new Date().getMonth() + 1 ||
            paymentMethod.expMonth >= new Date().getMonth()) &&
          paymentMethod.expYear === new Date().getFullYear()
        )
          hasUpcomingExpirationPaymentMethod = true;

        if (
          paymentMethod.expYear > new Date().getFullYear() ||
          (paymentMethod.expMonth > new Date().getMonth() + 1 &&
            paymentMethod.expYear === new Date().getFullYear())
        )
          hasValidPaymentMethod = true;
      });
      if (
        hasExpiredPaymentMethod &&
        !hasValidPaymentMethod &&
        !hasUpcomingExpirationPaymentMethod
      )
        setShowExpiredWarning(true);
      else setShowExpiredWarning(false);
      if (hasUpcomingExpirationPaymentMethod && !hasValidPaymentMethod)
        setShowUpcomingExpirationWarning(true);
      else setShowUpcomingExpirationWarning(false);
    }
  }, [paymentMethods]);

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
              w-full flex-grow justify-center items-center bg-transparent
            `,
          isTablet ? tw`mb-8 px-16` : tw`mb-4 px-4`,
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
            <SubHeadingText style={tw`text-lg mb-2 mt-4`}>
              Payment Methods on File
            </SubHeadingText>
            <TouchableOpacity
              style={tw`w-full`}
              onPress={async () => await loadPaymentOptions()}
            >
              {paymentMethods.map(
                (paymentMethod: PaymentMethod, index: number) => (
                  <View
                    key={index}
                    style={[
                      tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-xl flex-col items-center border-2 dark:border-movet-white w-full`,
                      (paymentMethod.expMonth === new Date().getMonth() + 1 ||
                        paymentMethod.expMonth >= new Date().getMonth()) &&
                        paymentMethod.expYear === new Date().getFullYear() &&
                        tw`bg-movet-yellow/50`,
                      paymentMethod.expMonth < new Date().getMonth() + 1 &&
                        paymentMethod.expYear <= new Date().getFullYear() &&
                        tw`bg-movet-red/50`,
                    ]}
                    noDarkMode={
                      (paymentMethod.expMonth < new Date().getMonth() + 1 &&
                        paymentMethod.expYear <= new Date().getFullYear()) ||
                      ((paymentMethod.expMonth === new Date().getMonth() + 1 ||
                        paymentMethod.expMonth >= new Date().getMonth()) &&
                        paymentMethod.expYear === new Date().getFullYear())
                    }
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
            </TouchableOpacity>
            <View style={tw`h-16`} />
          </>
        )}
        {showExpiredWarning && (
          <TouchableOpacity onPress={async () => await loadPaymentOptions()}>
            <View
              style={tw`flex-row mt-8 shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent`}
            >
              <View
                style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full bg-movet-red`}
                noDarkMode
              >
                <Container>
                  <Icon
                    name={"exclamation-circle"}
                    height={30}
                    width={30}
                    color="white"
                  />
                </Container>
                <Container style={tw`pl-3 mr-6`}>
                  <HeadingText
                    style={[
                      isTablet ? tw` text-lg` : tw` text-base`,
                      tw`text-movet-white`,
                    ]}
                    noDarkMode
                  >
                    Payment Method Expired!
                  </HeadingText>
                  <BodyText
                    style={[
                      isTablet ? tw` text-base` : tw` text-sm`,
                      tw`text-movet-white mb-2`,
                    ]}
                    noDarkMode
                  >
                    One or more of your payment methods has expired. Please add
                    a new form of payment to avoid any delays in service.
                  </BodyText>
                </Container>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {showUpcomingExpirationWarning && (
          <TouchableOpacity onPress={async () => await loadPaymentOptions()}>
            <View
              style={tw`flex-row mt-4 shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent`}
            >
              <View
                style={tw`px-4 py-2 text-movet-white rounded-xl flex-row items-center w-full bg-movet-yellow`}
                noDarkMode
              >
                <Container>
                  <Icon
                    name={"exclamation-circle"}
                    height={30}
                    width={30}
                    color="white"
                  />
                </Container>
                <Container style={tw`pl-3 mr-6`}>
                  <HeadingText
                    style={[
                      isTablet ? tw` text-lg` : tw` text-base`,
                      tw`text-movet-white`,
                    ]}
                    noDarkMode
                  >
                    Payment Method Expiring Soon
                  </HeadingText>
                  <BodyText
                    style={[
                      isTablet ? tw` text-base` : tw` text-sm`,
                      tw`text-movet-white mb-2`,
                    ]}
                    noDarkMode
                  >
                    One or more of your payment methods are expiring soon.
                    Please add a new form of payment to avoid any delays in
                    service.
                  </BodyText>
                </Container>
              </View>
            </View>
          </TouchableOpacity>
        )}
        {!user.emailVerified && (
          <ItalicText noDarkMode style={tw`text-movet-red text-xs mt-4`}>
            EMAIL ADDRESS VERIFICATION REQUIRED!
          </ItalicText>
        )}
        <ActionButton
          color="black"
          title={
            !paymentMethods ? "Add a Payment Method" : "Update Payment Methods"
          }
          loading={isLoading}
          iconName={!paymentMethods ? "plus" : "credit-card"}
          onPress={async () => await loadPaymentOptions()}
          disabled={!paymentOptionsReady || isLoading}
        />
      </View>
    </Screen>
  );
};

export default PaymentMethods;
