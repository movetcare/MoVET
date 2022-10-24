const app = require('./initApp');
const admin = app.initializeApp('admin', 'staging');
const publicIp = require('public-ip');

export const webhookHeartbeat = async () => {
  const ipv4 = await publicIp.v4();
  await admin
    .firestore()
    .collection('configuration')
    .doc('development')
    .collection('webhooks')
    .doc(`${ipv4}`)
    .set(
      {
        updatedOn: new Date(),
      },
      {merge: true}
    )
    .then(() => console.log('*** WEBHOOK HEARTBEAT SENT TO PROXY ***'))
    .catch((error: any) => console.error(error));
};
