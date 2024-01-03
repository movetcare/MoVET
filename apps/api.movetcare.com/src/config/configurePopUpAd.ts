import { admin, throwError } from "./config";

export const configurePopUpAd = async (): Promise<boolean> => {
  const alreadyHasConfiguration = await admin
    .firestore()
    .collection("alerts")
    .doc("pop_up_ad")
    .get()
    .then((document: any) => (document.exists() ? true : false))
    .catch(() => false);

  if (alreadyHasConfiguration) {
    console.log(
      "alerts/pop_up_ad/ DOCUMENT DETECTED - SKIPPING POPUP AD CONFIGURATION...",
    );
    console.log(
      "DELETE THE alerts/pop_up_ad/ DOCUMENT AND RESTART TO REFRESH THE POPUP AD CONFIGURATION",
    );
    return true;
  } else {
    console.log("STARTING POPUP AD CONFIGURATION");
    return await admin
      .firestore()
      .collection("alerts")
      .doc("pop_up_ad")
      .set(
        {
          icon: "bullhorn",
          title:
            "Annual HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 29th at 1PM",
          autoOpen: true,
          description:
            "Join us at the Belleview Station Dog Park for this fun and FREE event! Enjoy a Photo Booth, Treats, and Belly Rubs. Dress your furry friend in their most adorable, scary, or hilarious costume. The more creative the better!",
          link: "/blog/howl-o-ween/",
          ignoreUrlPath: "/blog/howl-o-ween/",
          imagePath: "/images/blog/howl-o-ween-clip.png",
          isActive: true,
          height: 800,
          width: 800,
          updatedOn: new Date(),
        },
        { merge: true },
      )
      .then(() => true)
      .catch((error: any) => throwError(error));
  }
};
