import { BodyText, HeadingText, ItalicText } from "components/themed";
import { Container, View, Icon } from "components/themed";
import { router } from "expo-router";
import { firestore } from "firebase-config";
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { AuthStore, ErrorStore } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  type: string;
}

export const PaymentMethodSummary = ({
  message,
  title,
  titleSize = "md",
}: {
  message?: string;
  title?: string;
  titleSize?: "sm" | "md" | "lg";
}): ReactNode => {
  const { user } = AuthStore.useState();
  const [paymentMethods, setPaymentMethods] =
    useState<Array<PaymentMethod> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showUpcomingExpirationWarning, setShowUpcomingExpirationWarning] =
    useState(false);
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);
  const [customTitle, setCustomTitle] = useState<string>(
    "Add a Payment Method",
  );
  const [customMessage, setCustomMessage] = useState<string>(
    "Having a payment source on file allows you to receive expedited service and skip the checkout lines when visiting our clinic and boutique.",
  );

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribePaymentMethods = onSnapshot(
      query(
        collection(firestore, "clients", `${user?.uid}`, "payment_methods"),
        where("active", "==", true),
        orderBy("updatedOn", "desc"),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          setIsLoading(false);
          return;
        }
        const paymentMethods: Array<PaymentMethod> = [];
        querySnapshot.forEach((doc: DocumentData) => {
          if (doc.data().active)
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
        setError({ ...error, source: "unsubscribePaymentMethods" });
      },
    );
    return () => unsubscribePaymentMethods();
  }, [user?.uid]);

  useEffect(() => {
    if (paymentMethods) {
      let hasValidPaymentMethod = false;
      let hasExpiredPaymentMethod = false;
      let hasUpcomingExpirationPaymentMethod = false;
      paymentMethods.forEach((paymentMethod: PaymentMethod) => {
        if (
          paymentMethod.expYear < new Date().getFullYear() ||
          (paymentMethod.expMonth < new Date().getMonth() + 1 &&
            paymentMethod.expYear <= new Date().getFullYear())
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

  useEffect(() => {
    if (!paymentMethods || message || title) {
      setCustomTitle("Add a Payment Method");
      setCustomMessage(
        "Having a payment source on file allows you to receive expedited service and skip the checkout lines when visiting our clinic and boutique.",
      );
      if (title) setCustomTitle(title);
      if (message) setCustomMessage(message);
    } else if (showUpcomingExpirationWarning) {
      setCustomTitle("Payment Method Expiring Soon!");
      setCustomMessage(
        "One or more of your payment methods are expiring soon. Please  add a new form of payment to avoid any delays in service.",
      );
    } else if (showExpiredWarning) {
      setCustomTitle("Payment Method Expired!");
      setCustomMessage(
        " One or more of your payment methods has expired. Please add a new form of payment to avoid any delays in service.",
      );
    }
  }, [
    paymentMethods,
    showExpiredWarning,
    showUpcomingExpirationWarning,
    message,
    title,
  ]);

  const setError = (error: any) =>
    ErrorStore.update((s: any) => {
      s.currentError = error;
    });

  return !paymentMethods ||
    showUpcomingExpirationWarning ||
    showExpiredWarning ? (
    <TouchableOpacity
      onPress={() =>
        router.replace({
          pathname: `/(app)/settings/payment-methods/`,
          params: { autoOpen: true as any },
        })
      }
      style={tw`rounded-xl`}
    >
      <View
        style={[
          isTablet ? tw`px-16` : tw`px-4`,
          tw`flex-row rounded-xl bg-transparent`,
        ]}
        noDarkMode
      >
        <View
          style={[
            isLoading ? tw`bg-movet-black/60` : tw`bg-movet-yellow`,
            showExpiredWarning && tw`bg-movet-red`,
            tw`pr-4 pt-2 pb-3 rounded-xl flex-row items-center dark:border-2 dark:border-movet-white w-full shadow-lg shadow-movet-black dark:shadow-movet-white`,
          ]}
          noDarkMode
        >
          <Container style={tw`px-4`}>
            {isLoading ? (
              <ActivityIndicator size="small" color={tw.color("movet-white")} />
            ) : (
              <Icon name="credit-card" size="md" color="white" />
            )}
          </Container>
          <Container style={tw`flex-shrink`}>
            {isLoading ? (
              <>
                <ItalicText style={tw`text-movet-white text-base`} noDarkMode>
                  Loading Payment Methods...
                </ItalicText>
              </>
            ) : (
              <>
                <HeadingText
                  style={[
                    tw`text-movet-white`,
                    titleSize === "sm"
                      ? tw`text-sm`
                      : titleSize === "lg"
                        ? tw`text-lg`
                        : tw`text-base`,
                  ]}
                  noDarkMode
                >
                  {customTitle}
                </HeadingText>
                <BodyText
                  style={tw`text-movet-white text-sm -mt-0.5`}
                  noDarkMode
                >
                  {customMessage}
                </BodyText>
              </>
            )}
          </Container>
        </View>
      </View>
    </TouchableOpacity>
  ) : null;
};
