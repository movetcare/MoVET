const fs = require('fs');
const semverIncrement = require('semver/functions/inc');

const jsonReader = (filePath, cb) => {
  fs.readFile(filePath, (error, fileData) => {
    if (error) {
      return cb && cb(error);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (error) {
      return cb && cb(error);
    }
  });
};

jsonReader('./version.json', (error, versions) => {
  if (error) {
    console.error('Error reading file:', error);
    return;
  }
  versions.buildVersion += 2;
  versions.appVersion = semverIncrement(versions.appVersion, 'patch');
  versions.appVersion = semverIncrement(versions.appVersion, 'patch');
  console.log('iOS & Android App Versions Updated To: ', versions);
  fs.writeFile('./version.json', JSON.stringify(versions), error => {
    if (error) console.error('Error writing file:', error);
  });
});
