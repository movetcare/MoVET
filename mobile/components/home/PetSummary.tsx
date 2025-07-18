import {
  ActionButton,
  BodyText,
  Container,
  View,
  Icon,
  HeadingText,
  ItalicText,
  SubHeadingText,
} from "components/themed";
import { router } from "expo-router";
import { Appointment, AppointmentsStore, Patient, PatientsStore } from "stores";
import tw from "tailwind";
import { isTablet } from "utils/isTablet";
import { Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { Modal } from "components/Modal";

export const PetSummary = () => {
  const { patients } = PatientsStore.useState();
  const { upcomingAppointments } = AppointmentsStore.useState();
  const [appointmentCounts, setAppointmentCounts] = useState<Array<{
    id: number;
    count: number;
  }> | null>(null);
  const [showVcprModal, setShowVcprModal] = useState<boolean>(false);
  const textStyles = [isTablet ? tw`text-lg` : tw`text-sm`, tw`mb-2`];

  useEffect(() => {
    if (patients) {
      const appointmentCounts: any = [];
      const appointmentsAfterToday = upcomingAppointments?.filter(
        (appointment: Appointment) =>
          appointment?.start?.toDate()?.setHours(0, 0, 0, 0) !=
          new Date().setHours(0, 0, 0, 0),
      );
      patients?.forEach((patient: Patient) => {
        let upcomingPatientAppointments = 0;
        if (appointmentsAfterToday) {
          appointmentsAfterToday.forEach((appointment: Appointment) => {
            appointment?.patients?.forEach((patientData: Patient) => {
              if (patientData.id === patient.id)
                upcomingPatientAppointments += 1;
            });
          });
          appointmentCounts.push({
            id: patient?.id,
            count: upcomingPatientAppointments,
          });
        }
      });
      if (appointmentCounts.length > 0) setAppointmentCounts(appointmentCounts);
    }
  }, [patients, upcomingAppointments]);

  return (
    <View
      noDarkMode
      style={[
        isTablet ? tw`px-16` : tw`px-4`,
        tw`flex-grow items-center justify-center w-full bg-transparent mt-2`,
      ]}
    >
      <View style={[tw`flex-col rounded-xl bg-transparent w-full`]} noDarkMode>
        {patients &&
          patients.length > 0 &&
          patients.map((patient: Patient, index: number) => {
            return (
              <View key={index} style={tw`bg-transparent`} noDarkMode>
                <View
                  style={tw`flex-row w-full items-center my-2 bg-transparent justify-between${index !== 0 ? " border-t-2 border-movet-gray pt-4" : ""}`}
                  noDarkMode
                >
                  <TouchableOpacity
                    style={tw`flex-row items-center`}
                    onPress={() =>
                      router.push({
                        pathname: `/(app)/home/pet/`,
                        params: { id: patient?.id },
                      })
                    }
                  >
                    {patient?.photoUrl ? (
                      <Image
                        source={{ uri: patient?.photoUrl }}
                        alt={patient?.name + "'s photo"}
                        height={50}
                        width={50}
                        style={tw`rounded-full`}
                      />
                    ) : (
                      <Icon
                        name={
                          patient?.species?.toLowerCase()?.includes("dog") ||
                          patient?.species?.toLowerCase()?.includes("canine")
                            ? "dog"
                            : "cat"
                        }
                        size="md"
                        style={tw`mx-2`}
                      />
                    )}
                    <HeadingText style={tw`ml-4 text-xl`}>
                      {patient.name}
                    </HeadingText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowVcprModal(true);
                    }}
                  >
                    {patient?.vcprRequired ? (
                      <View style={tw`flex-row items-center`}>
                        <ItalicText
                          noDarkMode
                          style={tw`text-movet-red text-sm`}
                        >
                          VCPR REQUIRED!
                        </ItalicText>
                      </View>
                    ) : (
                      <View style={tw`flex-row items-center`}>
                        <ItalicText
                          noDarkMode
                          style={tw`text-movet-green text-sm`}
                        >
                          VCPR ESTABLISHED
                        </ItalicText>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
                {
                  appointmentCounts &&
                    appointmentCounts?.map(
                      (patientAppointments: { count: number; id: number }) => {
                        if (
                          patientAppointments?.id === patient?.id &&
                          patientAppointments?.count > 0
                        ) {
                          return (
                            <SubHeadingText
                              style={tw`text-base w-full mb-2 text-center mt-1 mb-4`}
                              key={patientAppointments?.id}
                            >
                              Upcoming Appointment
                              {patientAppointments?.count > 1 && "s"}
                            </SubHeadingText>
                          );
                        } else return null;
                      },
                      //stop
                    ) // stop
                }
                {upcomingAppointments?.map(
                  (appointment: any, index: number) => (
                    <View key={index}>
                      {appointment?.patients?.map(
                        (appointmentPatient: any, index: number) => {
                          if (
                            appointmentPatient?.id === patient?.id &&
                            appointment?.start
                              ?.toDate()
                              ?.setHours(0, 0, 0, 0) !=
                              new Date().setHours(0, 0, 0, 0)
                          )
                            return (
                              <TouchableOpacity
                                onPress={() =>
                                  router.navigate({
                                    pathname: `/(app)/home/appointment-detail/`,
                                    params: { id: appointment?.id },
                                  })
                                }
                                key={index}
                                style={tw`p-2 bg-movet-white rounded-xl items-center border-2 dark:bg-movet-black dark:border-movet-white w-full shadow-lg shadow-movet-black dark:shadow-movet-white mb-4`}
                              >
                                <View style={tw`flex-row w-full items-center`}>
                                  <Icon
                                    name={
                                      appointment?.locationType === "Home"
                                        ? "mobile"
                                        : appointment?.locationType ===
                                            "Virtually"
                                          ? "telehealth"
                                          : "clinic-alt"
                                    }
                                    size="xl"
                                  />
                                  <View style={tw`flex-col ml-2`}>
                                    <SubHeadingText>
                                      {appointment.reason}
                                    </SubHeadingText>
                                    <BodyText>
                                      {appointment.start
                                        .toDate()
                                        .toLocaleString("en-US", {
                                          hour: "numeric",
                                          minute: "numeric",
                                          hour12: true,
                                        })}{" "}
                                      -{" "}
                                      {appointment.start
                                        .toDate()
                                        .toLocaleDateString("en-us", {
                                          weekday: "long",
                                          year: "2-digit",
                                          month: "numeric",
                                          day: "numeric",
                                        })}
                                    </BodyText>
                                    <ItalicText style={tw`text-sm`}>
                                      {appointment?.locationType === "Home"
                                        ? appointment?.address
                                            ?.split(",")
                                            ?.slice(0, 1)
                                            ?.join(",")
                                        : appointment?.locationType === "Clinic"
                                          ? "MoVET @ Belleview Station"
                                          : appointment?.locationType ===
                                              "Virtually"
                                            ? "Virtually - In App"
                                            : "MoVET @ Belleview Station"}
                                    </ItalicText>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                        },
                      )}
                    </View>
                  ),
                  // stop
                ) // stop
                }
                {index !== patients.length - 1 &&
                  upcomingAppointments?.length === 0 && (
                    <View style={tw`border-t-2 border-movet-gray my-4`} />
                  )}
              </View>
            );
          })}
      </View>
      <Container style={tw`flex-col sm:flex-row justify-around w-full`}>
        <ActionButton
          type="text"
          title="Add a Pet"
          iconName="plus"
          onPress={() => router.navigate("/(app)/home/new-pet")}
          style={tw`mt-0`}
          textStyle={tw`text-movet-black dark:text-movet-white`}
        />
      </Container>
      <Modal
        isVisible={showVcprModal}
        onClose={() => {
          setShowVcprModal(false);
        }}
        title="What is a VCPR?"
      >
        <>
          <BodyText style={textStyles}>
            A Veterinarian-Client-Patient Relationship (&quot;VCPR&quot;) is
            established only when your veterinarian examines your pet in person,
            and is maintained by regular veterinary visits as needed to monitor
            your pet&apos;s health.
          </BodyText>
          <BodyText style={textStyles}>
            If a VCPR is established but your veterinarian does not regularly
            see your pet afterward, the VCPR is no longer valid and it would be
            illegal (and unethical) for your veterinarian to dispense or
            prescribe medications or recommend treatment without recently
            examining your pet.
          </BodyText>
          <BodyText style={textStyles}>
            A valid VCPR cannot be established online, via email, or over the
            phone. However, once a VCPR is established, it may be able to be
            maintained between medically necessary examinations via telephone or
            other types of consultations; but it&apos;s up to your
            veterinarian&apos; discretion to determine if this is appropriate
            and in the best interests of your pets&apos; health.
          </BodyText>
          <Container
            style={[
              isTablet ? tw`mt-4` : tw``,
              tw`flex-row justify-center sm:mb-2`,
            ]}
          >
            <ActionButton
              title={
                (!upcomingAppointments && !appointmentCounts
                  ? "Request"
                  : "Schedule") + " an Appointment"
              }
              iconName="calendar-plus"
              onPress={() => {
                setShowVcprModal(false);
                router.navigate("/(app)/home/new-appointment");
              }}
            />
          </Container>
        </>
      </Modal>
    </View>
  );
};
export default PetSummary;
