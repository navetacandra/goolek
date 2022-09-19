const {
  signInWithEmailAndPassword,
  getAuth,
} = require("firebase/auth");
require("dotenv").config();

function FirebaseSignIn() {
  const auth = getAuth();
  signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_AUTH_EMAIL,
    process.env.FIREBASE_AUTH_PASS
  )
    .then(() => {
      console.log(`Logged in to firebase as: <${process.env.FIREBASE_AUTH_EMAIL}>\n\n`);
    })
    .catch((err) => console.log(err));
};

module.exports = FirebaseSignIn;