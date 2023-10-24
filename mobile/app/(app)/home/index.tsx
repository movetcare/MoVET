import { FontAwesome5 } from "@expo/vector-icons";
import { Loader } from "components/Loader";
import { HeadingText, SubHeadingText, View } from "components/themed";
import { Container } from "components/themed/View";
import { Link } from "expo-router";
import { firestore } from "firebase-config";
import {
  collection,
  query,
  DocumentData,
  QuerySnapshot,
  onSnapshot,
} from "firebase/firestore";
import { ReactNode, useEffect, useState } from "react";
import tw from "tailwind";

const DEBUG = false;

interface Announcement {
  color: string;
  icon: "info-circle";
  isActiveMobile: boolean;
  link: string;
  message: string;
  title: string;
}
interface Ad {
  autoOpen: boolean;
  description: string;
  height: number;
  icon: "bullhorn";
  ignoreUrlPath: string;
  imagePath: string;
  isActive: boolean;
  title: string;
  urlRedirect: string;
  width: number;
}
interface TelehealthStatus {
  isOnline: boolean;
  message: string;
  queueSize: number;
  waitTime: number;
}

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [announcement, setAnnouncement] = useState<null | Announcement>(null);
  const [ad, setAd] = useState<null | Ad>(null);
  const [telehealthStatus, setTelehealthStatus] =
    useState<null | TelehealthStatus>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, "alerts")),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        querySnapshot.forEach((doc: DocumentData) => {
          switch (doc.id) {
            case "banner":
              if (DEBUG) console.log("ANNOUNCEMENT: ", doc.data());
              setAnnouncement(doc.data());
              break;
            case "pop_up_ad":
              if (DEBUG) console.log("AD: ", doc.data());
              setAd(doc.data());
              break;
            case "telehealth":
              if (DEBUG) console.log("TELEHEALTH STATUS: ", doc.data());
              setTelehealthStatus(doc.data());
              break;
            default:
              break;
          }
        });
        setIsLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <View withBackground="pets">
      {announcement?.isActiveMobile && (
        <Announcement announcement={announcement} />
      )}
      <Link href="/home/details">Go to Details</Link>
    </View>
  );
};
export default Home;

const Announcement = ({
  announcement,
}: {
  announcement: Announcement;
}): ReactNode => {
  const { icon, title, message, link } = announcement;
  const backgroundColor =
    announcement?.color === "#DAAA00"
      ? "bg-movet-yellow"
      : announcement?.color === "#2C3C72"
      ? "bg-movet-dark-blue"
      : announcement?.color === "#E76159"
      ? "bg-movet-red"
      : announcement?.color === "#232127"
      ? "bg-movet-black"
      : announcement?.color === "#00A36C"
      ? "bg-movet-green"
      : announcement?.color === "#A15643"
      ? "bg-movet-brown"
      : "bg-movet-dark-blue";

  return (
    <Link
      href={{
        pathname: "/(app)/home/web-view",
        params: { link },
      }}
      style={tw`mx-4 mt-4 bg-transparent`}
    >
      <View
        style={tw`p-4 ${backgroundColor} text-movet-white rounded-xl flex-row items-center`}
      >
        <Container>
          <FontAwesome5 name={icon} size={30} color={tw.color("movet-white")} />
        </Container>
        <Container style={tw`pl-4 mr-6`}>
          <HeadingText style={tw`text-movet-white text-lg`}>
            {title}
          </HeadingText>
          <SubHeadingText style={tw`text-movet-white text-xs`}>
            {message}
          </SubHeadingText>
        </Container>
      </View>
    </Link>
  );
};
