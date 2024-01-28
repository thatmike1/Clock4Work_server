var admin = require('firebase-admin');
require('dotenv').config();

var serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_KEY_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://attendance-4b37b-default-rtdb.europe-west1.firebasedatabase.app',
});

module.exports = admin;
