import { firestore } from "../firebase";
const DEBUG = false;
export const getAnnouncement = async () => {
  try {
    const announcement: any = await firestore
      .collection("alerts")
      .doc("banner_web")
      .get()
      .then((doc) => doc.data())
      .catch((error: any) => {
        console.log(error);
        return false;
      });
    const { color, message, title, link, isActive, isActiveMobile, icon } =
      (announcement as {
        color: string;
        message: string;
        title: string;
        link: string;
        isActive: boolean;
        isActiveMobile: boolean;
        icon: string;
      }) || {};
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
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.message || JSON.stringify(error) };
  }
};
