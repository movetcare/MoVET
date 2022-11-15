import { admin, throwError, stripe, DEBUG, environment } from "./config";

export const configureTerminals = async (): Promise<boolean> => {
  console.log("STARTING TERMINAL CONFIGURATION");
  const locations: any = await stripe.terminal.locations.list();
  if (DEBUG) console.log("locations.data", locations.data);
  let readers: any = [];
  if (environment?.type !== "production") {
    const batch = admin.firestore().batch();
    await admin
      .firestore()
      .collection("configuration")
      .doc("pos")
      .collection("terminals")
      .listDocuments()
      .then((documents: any) => {
        documents.map((document: any) => {
          batch.delete(document);
        });
        batch.commit();
      });
    readers = await stripe.terminal.readers.list();
    if (DEBUG) {
      console.log("readers.data", readers?.data);
      console.log("readers?.data.length", readers?.data.length);
    }
    if (readers?.data.length > 0)
      await Promise.all(
        readers?.data.map(
          async (reader: any) =>
            await stripe.terminal.readers
              .del(reader.id)
              .then(
                (result: any) =>
                  DEBUG && console.log("READER DELETED: ", result)
              )
              .catch((error: any) => DEBUG && console.error(error))
        )
      ).catch((error: any) => DEBUG && console.error(error));
    readers = [
      await stripe.terminal.readers.create({
        registration_code: "simulated-wpe",
        label: "SIMULATOR",
        location: locations.data[0]?.id,
      }),
    ];
    if (readers?.length === 0)
      throwError("FAILED TO CREATE TERMINAL SIMULATOR...");
  } else {
    readers = await stripe.terminal.readers.list();
    if (DEBUG) console.log("readers.data", readers.data);
    readers = readers?.data.map(async (reader: any) => {
      if (DEBUG) console.log("READER", reader);
      if (reader?.label === "SIMULATOR") {
        if (DEBUG) console.log("DELETING SIMULATOR", reader?.id);
        await stripe.terminal.readers.del(reader.id);
      }
      return reader;
    });
    readers = await stripe.terminal.readers.list();
    if (readers === undefined || readers?.length === 0)
      throwError("NO PRODUCTION TERMINALS FOUND...");
  }

  if (DEBUG) console.log("readers", readers);

  if (readers.data)
    readers.data.forEach(
      async (reader: any) =>
        await admin
          .firestore()
          .collection("configuration")
          .doc("pos")
          .collection("terminals")
          .doc(`${reader?.id}`)
          .set({ ...reader, updatedOn: new Date() }, { merge: true })
          .catch(async (error: any) => throwError(error))
    );
  else
    readers.forEach(
      async (reader: any) =>
        await admin
          .firestore()
          .collection("configuration")
          .doc("pos")
          .collection("terminals")
          .doc(`${reader?.id}`)
          .set({ ...reader, updatedOn: new Date() }, { merge: true })
          .catch(async (error: any) => throwError(error))
    );

  return await admin
    .firestore()
    .collection("configuration")
    .doc("locations")
    .set(
      {
        locations: locations.data,
        updatedOn: new Date(),
      },
      { merge: true }
    )
    .then(() => true)
    .catch((error: any) => throwError(error));
};
