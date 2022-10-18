import admin from "./firebase-admin";

export async function getAnnouncement() {
  try {
    const announcement = await admin
      .collection("alerts")
      .doc("banner")
      .get()
      .then((doc: any) => doc.data());
    const { color, message, title, link, isActive, icon, lastUpdated } =
      announcement || {};
    console.log("getAnnouncement()", {
      lastUpdated,
      color,
      message,
      title,
      link,
      isActive,
      icon,
    });
    return {
      lastUpdated,
      color,
      message,
      title,
      link,
      isActive,
      icon,
    };
  } catch (error) {
    return { error };
  }
}
