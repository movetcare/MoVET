import { admin } from "../config/config";

export const deleteCollection = async (
  collectionPath: string,
  batchSize = 10
): Prmise<void> => {
  const collectionRef = admin.firestore().collection(collectionPath);
  const query = collectionRef.limit(batchSize);
  return new Promise((resolve, reject) =>
    deleteQueryBatch(query, resolve).catch(reject)
  );
};

const deleteQueryBatch = async (query: any, resolve: any) => {
  const snapshot = await query.get();
  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }
  const batch = admin.firestore().batch();
  snapshot.docs.forEach((doc: any) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
};
