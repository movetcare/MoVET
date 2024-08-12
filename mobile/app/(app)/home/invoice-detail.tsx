import {
  initStripe,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import {
  ActionButton,
  BodyText,
  Container,
  HeadingText,
  Icon,
  ItalicText,
  Screen,
  SubHeadingText,
  View,
} from "components/themed";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import { firestore, functions } from "firebase-config";
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { AuthStore, ErrorStore, InvoicesStore } from "stores";
import type { Invoice } from "stores";
import tw from "tailwind";
import { isProductionEnvironment } from "utils/isProductionEnvironment";
import { isTablet } from "utils/isTablet";
import { Loader } from "components/Loader";
import * as Linking from "expo-linking";
import { getPlatformUrl } from "utils/getPlatformUrl";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  type: string;
}

const InvoiceDetail = () => {
  const { id } = useLocalSearchParams();
  const { invoices } = InvoicesStore.useState();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { user } = AuthStore.useState();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showUpcomingExpirationWarning, setShowUpcomingExpirationWarning] =
    useState(false);
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);
  const [paymentOptionsReady, setPaymentOptionsReady] =
    useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] =
    useState<Array<PaymentMethod> | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState<boolean>(false);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);

  useEffect(() => {
    if (id && invoices) {
      invoices.forEach((invoice: any) => {
        if (Number(invoice.id) === Number(id)) {
          setInvoice(invoice);
          if (invoice?.paymentStatus === "succeeded") setPaymentComplete(true);
        }
      });
    }
  }, [id, invoices]);

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
        handleError({ ...error, source: "unsubscribePaymentMethods" });
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
          if (paymentSheetError)
            handleError({ ...paymentSheetError, source: "paymentSheetError" });
          else setPaymentOptionsReady(true);
        }
      })
      .catch((error: any) =>
        handleError({ ...error, source: "getCustomerDetails" }),
      )
      .finally(() => setIsLoading(false));
  };

  const handleError = useCallback((error: any) => {
    setIsLoadingPayment(false);
    setPaymentOptionsReady(false);
    setIsLoading(false);
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });
  }, []);

  const loadPaymentOptions = useCallback(async () => {
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
          if (paymentSheetError)
            handleError({
              message: paymentSheetError?.message
                ? paymentSheetError.message
                : "Unable to retrieve payment information",
              source: "paymentSheetError",
            });
          const { error } = await presentPaymentSheet();
          if (error && error?.message !== "The payment has been canceled")
            handleError({ ...error, source: "presentPaymentSheet" });
        } else {
          const { error } = await presentPaymentSheet();
          if (error) handleError({ ...error, source: "presentPaymentSheet" });
        }
      })
      .catch((error: any) =>
        handleError({ ...error, source: "handleCustomerToken" }),
      )
      .finally(() => setIsLoading(false));
  }, [handleError]);

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

  const processInvoicePayment = async (paymentId: string) => {
    setIsLoadingPayment(true);
    const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");
    createPaymentIntent({
      invoice: invoice?.id,
      mode: "client",
      uid: user?.uid,
      paymentMethod: paymentId,
    })
      .then((result: any) => {
        const {
          failure_code,
          failure_message,
          process_payment_intent,
          status,
          type,
        }: any = result.data || {};
        if (
          result.data === true ||
          (failure_code === null &&
            failure_message === null &&
            process_payment_intent !== null &&
            status === "in_progress" &&
            type === "process_payment_intent")
        ) {
          setPaymentComplete(true);
        } else if (failure_code && failure_message) {
          handleError({
            code: failure_code,
            message: failure_message,
          });
          alert(
            "Payment could NOT be completed. Please try again or contact support for assistance",
          );
        }
      })
      .catch((error: any) => handleError(error))
      .finally(() => setIsLoadingPayment(false));
  };

  return (
    <Screen>
      {isLoadingPayment ? (
        <Loader description="Processing Payment..." />
      ) : (
        <View
          style={[
            tw`
              w-full flex-grow justify-center items-center bg-transparent
            `,
            isTablet ? tw`mb-8 px-16` : tw`mb-8 px-4`,
          ]}
          noDarkMode
        >
          <Icon name="clinic-alt" height={100} width={100} />
          {__DEV__ && <BodyText>#{invoice?.id}</BodyText>}
          <View style={tw`mb-4 w-full`}>
            {invoice &&
              invoice?.items.map((item: any, index: number) => (
                <View
                  key={index}
                  style={tw`w-full flex-row items-center justify-between${index !== invoice?.items.length - 1 ? " border-b-2 border-movet-gray/50" : ""}`}
                >
                  <BodyText style={tw`text-sm my-2`}>
                    {item?.name}
                    {item?.quantity > 1 && ` x ${item?.quantity}`}
                  </BodyText>
                  <BodyText style={tw`text-sm my-2`}>
                    ${item?.total?.toFixed(2)}
                  </BodyText>
                </View>
              ))}
            {invoice && (
              <>
                <View style={tw`flex-row items-center justify-between`}>
                  <ItalicText style={tw`text-sm mb-2 mt-4`}>
                    Subtotal
                  </ItalicText>
                  <ItalicText style={tw`text-sm mb-2 mt-4`}>
                    ${invoice?.amountDue?.toFixed(2)}
                  </ItalicText>
                </View>
                <View style={tw`flex-row items-center justify-between`}>
                  <ItalicText style={tw`text-sm mb-2`}>Tax</ItalicText>
                  <ItalicText style={tw`text-sm mb-2`}>
                    ${invoice?.taxDue?.toFixed(2)}
                  </ItalicText>
                </View>
                <View
                  style={tw`flex-row items-center justify-between${paymentComplete ? " border-t-2 border-movet-gray/50 pt-2" : ""}`}
                >
                  <SubHeadingText
                    style={tw`${paymentComplete ? "text-base" : "text-lg"}`}
                  >
                    Total
                    {paymentComplete
                      ? invoice?.payments[0]?.paymentMethod
                        ? ` Paid w/ ${invoice?.payments[0]?.paymentMethod}`
                        : " Paid"
                      : " Due"}
                  </SubHeadingText>
                  <SubHeadingText
                    style={tw`text-lg${paymentComplete ? " text-movet-green" : " text-movet-red"}`}
                    noDarkMode
                  >
                    ${invoice?.totalDue?.toFixed(2)}
                  </SubHeadingText>
                </View>
              </>
            )}
          </View>
          {paymentComplete ? (
            <Container
              style={tw`flex-col items-center justify-center w-full mt-8`}
            >
              <ItalicText style={tw`text-xl mb-2`}>
                How was your experience today?
              </ItalicText>
              <ItalicText style={tw`text-center mb-2 text-sm`}>
                Online reviews from great clients like you help others to feel
                confident about choosing MoVET and will help our business grow.
              </ItalicText>
              <ActionButton
                title="Leave a Review"
                color="black"
                iconName="star"
                onPress={() => {
                  Linking.canOpenURL(getPlatformUrl() + "/contact").then(
                    (supported) => {
                      if (supported)
                        Linking.openURL(
                          "https://g.page/r/CbtAdHSVgeMfEAE/review",
                        );
                    },
                  );
                }}
              />
            </Container>
          ) : (
            <>
              {!paymentMethods ? (
                <>
                  <Icon name="credit-card" size="xl" />
                  <ItalicText
                    style={tw`mb-4 mt-2 text-xl text-movet-red`}
                    noDarkMode
                  >
                    No Payment Methods on File...
                  </ItalicText>
                </>
              ) : (
                <>
                  {paymentMethods?.length > 1 && (
                    <ItalicText style={tw`text-xl my-2`}>
                      Choose a Payment Option
                    </ItalicText>
                  )}
                  {paymentMethods?.map(
                    (paymentMethod: PaymentMethod, index: number) =>
                      paymentMethod.expYear < new Date().getFullYear() ||
                      (paymentMethod.expMonth < new Date().getMonth() + 1 &&
                        paymentMethod.expYear <= new Date().getFullYear()) ? (
                        <></>
                      ) : (
                        <TouchableOpacity
                          style={tw`w-full`}
                          key={index}
                          onPress={() => {
                            processInvoicePayment(paymentMethod.id);
                          }}
                        >
                          <View
                            style={[
                              tw`pr-4 pt-2 pb-3 my-2 bg-movet-white rounded-full flex-col items-center border-2 dark:border-movet-white w-full`,
                              (paymentMethod.expMonth ===
                                new Date().getMonth() + 1 ||
                                paymentMethod.expMonth >=
                                  new Date().getMonth()) &&
                                paymentMethod.expYear ===
                                  new Date().getFullYear() &&
                                tw`bg-movet-yellow/50`,
                              (paymentMethod.expYear <
                                new Date().getFullYear() ||
                                (paymentMethod.expMonth <
                                  new Date().getMonth() + 1 &&
                                  paymentMethod.expYear <=
                                    new Date().getFullYear())) &&
                                tw`bg-movet-red/50`,
                            ]}
                            noDarkMode={
                              paymentMethod.expYear <
                                new Date().getFullYear() ||
                              (paymentMethod.expMonth <
                                new Date().getMonth() + 1 &&
                                paymentMethod.expYear <=
                                  new Date().getFullYear()) ||
                              ((paymentMethod.expMonth ===
                                new Date().getMonth() + 1 ||
                                paymentMethod.expMonth >=
                                  new Date().getMonth()) &&
                                paymentMethod.expYear ===
                                  new Date().getFullYear())
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
                              <Container
                                style={tw`flex-shrink flex-row items-center`}
                              >
                                <SubHeadingText
                                  style={[
                                    tw`mr-1`,
                                    isTablet ? tw`text-xl` : tw`text-lg`,
                                  ]}
                                >
                                  Pay with
                                </SubHeadingText>
                                <ItalicText
                                  style={[
                                    isTablet ? tw`text-2xl` : tw`text-xl`,
                                    tw`ml-0.5`,
                                  ]}
                                >
                                  {paymentMethod.brand?.toUpperCase()} -{" "}
                                  {paymentMethod.last4}
                                </ItalicText>
                              </Container>
                            </Container>
                          </View>
                        </TouchableOpacity>
                      ),
                  )}
                  <View style={tw`h-4`} />
                </>
              )}
              {showExpiredWarning && (
                <TouchableOpacity
                  onPress={async () => await loadPaymentOptions()}
                >
                  <View
                    style={tw`flex-row mb-8 shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent`}
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
                          One or more of your payment methods has expired.
                          Please add a new form of payment to avoid any delays
                          in service.
                        </BodyText>
                      </Container>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {showUpcomingExpirationWarning && (
                <TouchableOpacity
                  onPress={async () => await loadPaymentOptions()}
                >
                  <View
                    style={tw`flex-row mb-8 shadow-lg shadow-movet-black dark:shadow-movet-white rounded-xl bg-transparent`}
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
                          Please add a new form of payment to avoid any delays
                          in service.
                        </BodyText>
                      </Container>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              <ActionButton
                type="text"
                title={
                  !paymentMethods
                    ? "Add a Payment Method"
                    : "Edit Payment Methods"
                }
                loading={isLoading}
                iconName={!paymentMethods ? "plus" : "pencil"}
                onPress={async () => await loadPaymentOptions()}
                disabled={!paymentOptionsReady || isLoading}
                style={tw`-mt-4`}
                textStyle={tw`text-movet-black dark:text-movet-white`}
              />
            </>
          )}
        </View>
      )}
    </Screen>
  );
};

export default InvoiceDetail;
