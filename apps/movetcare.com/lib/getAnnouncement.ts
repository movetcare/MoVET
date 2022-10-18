import admin from "./firebase-admin";

export async function getAnnouncement() {
  try {
    const announcement = await admin
      .collection("alerts")
      .doc("banner")
      .get()
      .then((doc: any) => doc.data());
    const { color, message, title, link, isActive, icon } = announcement || {};
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
    return { error };
  }
}
