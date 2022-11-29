import { firestore } from "../firebase";
const DEBUG = false;
export const getAnnouncement = async () => {
  try {
    const announcement = await firestore
      .collection("alerts")
      .doc("banner")
      .get()
      .then((doc) => doc.data());
    const { color, message, title, link, isActive, icon } = announcement || {};
    if (DEBUG)
      console.log("(SSG) FIRESTORE QUERY -> getAnnouncement() =>", {
        color,
        message,
        title,
        link,
        isActive,
        icon,
      });
    return {
      color: color || null,
      message: message || null,
      title: title || null,
      link: link || null,
      isActive: isActive || false,
      icon: icon || null,
    };
  } catch (error) {
    console.error(error);
    return { error: (error as any)?.message || JSON.stringify(error) };
  }
};
