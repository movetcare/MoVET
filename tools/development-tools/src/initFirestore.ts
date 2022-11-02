#!/usr/bin/env node

const firestoreImport = require('./utils/initApp');
const fs = require('fs-extra');
const csv = require('csvtojson');

const admin = firestoreImport.initializeApp();
const batch = admin.firestore().batch();

const readCSV = (path: string) => {
  return new Promise(resolve => {
    csv()
      .fromFile(path)
      .then((jsonObj) => {
        console.log("JSON found", jsonObj);
        resolve(jsonObj);
      })
      .catch((error) => {
        console.error("Error importing CSV - %s", error);
        process.exit(1);
      });
  });
};

const addDocument = (data, colRef, recurred: boolean) => {
  const document = null;
  try {
    if (!Array.isArray(data)) {
      const temp = [data];
      data = temp;
    }

    for (let item of data) {
      let makeTimestamps = false;
      if (typeof item.addTimestamps !== "undefined") {
        makeTimestamps = item.addTimestamps;
      }
      delete item.addTimestamps;

      if (makeTimestamps) {
        item = Object.assign(item, {
          created: new Date(),
          updatedOn: new Date(),
        });
      }

      let id: string;
      if (document) {
        if (typeof item[document] !== "undefined") {
          id = item[document].toString();
          delete item[document];
        } else if (!recurred) {
          id = document;
        } else {
          id = colRef.doc().id;
        }
      } else {
        id = colRef.doc().id;
      }

      const docRef = colRef.doc(id);

      batch.set(docRef, item);
    }
  } catch (error) {
    console.error("Failed to add Data - Error:", error);
    console.error(data);
  }
};

const importFirestoreData = async () => {
  try {
    let data;
    const source = `${__dirname}/data`;
    if (source.includes(".json")) {
      data = await fs.readJSON(source);
    } else if (source.includes(".csv")) {
      data = await readCSV(source);
    } else {
      data = JSON.parse(source);
    }

    const colRef = admin.firestore().collection("configuration");

    addDocument(data, colRef, false);

    const response = await batch.commit();
    console.log("RESPONSE: ", JSON.stringify(response));
    process.exit(0);
  } catch (error) {
    console.error("Error ->", error);
    process.exit(1);
  }
};

importFirestoreData();
