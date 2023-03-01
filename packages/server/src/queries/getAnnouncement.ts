import { firestore } from "../firebase";
const DEBUG = false;
export const getAnnouncement = async () => {
  try {
    const announcement = await firestore
      .collection("alerts")
      .doc("banner")
      .get()
      .then((doc) => doc.data());
    const { color, message, title, link, isActive, isActiveMobile, icon } =
      announcement as {
        color: string;
        message: string;
        title: string;
        link: string;
        isActive: boolean;
        isActiveMobile: boolean;
        icon: string;
      };
    if (DEBUG)
      console.log("(SSG) FIRESTORE QUERY -> getAnnouncement() =>", {
        color,
        message,
        title,
        link,
        isActive,
        isActiveMobile,
        icon,
      });
    return {
      color: color || null,
      message: message || null,
      title: title || null,
      link: link || null,
      isActive: isActive || false,
      isActiveMobile: isActiveMobile || false,
      icon: icon || null,
    };
  } catch (error: { message: string }) {
    console.error(error);
    return { error: error?.message || JSON.stringify(error) };
  }
};
