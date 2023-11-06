import { Loader } from "components/Loader";
import { Ad } from "components/home/Ad";
import { Announcement } from "components/home/Announcement";
import { TelehealthStatus } from "components/home/TelehealthStatus";
import { Container, HeadingText, Icon, Screen } from "components/themed";
import { firestore } from "firebase-config";
import {
  collection,
  query,
  DocumentData,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import tw from "tailwind";

const DEBUG = false;

const Home = () => {
  const [isLoadingAlerts, setIsLoadingAlerts] = useState<boolean>(true);
  const [announcement, setAnnouncement] = useState<null | Announcement>(null);
  const [ad, setAd] = useState<null | Ad>(null);
  const [telehealthStatus, setTelehealthStatus] =
    useState<null | TelehealthStatus>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, "alerts")),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) return;
        querySnapshot.forEach((doc: DocumentData) => {
          switch (doc.id) {
            case "banner":
              if (DEBUG) console.log("DATA => ANNOUNCEMENT: ", doc.data());
              setAnnouncement(doc.data());
              break;
            case "pop_up_ad":
              if (DEBUG) console.log("DATA => AD: ", doc.data());
              setAd(doc.data());
              break;
            case "telehealth":
              if (DEBUG) console.log("DATA => TELEHEALTH STATUS: ", doc.data());
              setTelehealthStatus(doc.data());
              break;
            default:
              break;
          }
        });
        setIsLoadingAlerts(false);
      },
    );
    return () => unsubscribe();
  }, []);

  return isLoadingAlerts ? (
    <Loader />
  ) : (
    <Screen withBackground="pets">
      {(announcement?.isActiveMobile || ad?.isActive) && (
        <Container style={tw`flex-row justify-center items-center`}>
          <Icon name="mobile" size="xs" style={tw`mt-4`} />
          <HeadingText style={tw`mt-4 text-lg`}>
            Latest Announcements
          </HeadingText>
        </Container>
      )}
      {announcement?.isActiveMobile && (
        <Announcement announcement={announcement} />
      )}
      {ad?.isActive && <Ad content={ad} />}
      {telehealthStatus?.isOnline && (
        <TelehealthStatus status={telehealthStatus} />
      )}
    </Screen>
  );
};
export default Home;
