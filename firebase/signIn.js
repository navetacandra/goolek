const {
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} = require("firebase/auth");
require("dotenv").config();

module.exports = function signIn(cb) {
  const auth = getAuth();
  signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_AUTH_EMAIL,
    process.env.FIREBASE_AUTH_PASS
  )
    .then(() => {
      console.log(`Logged in as: <${process.env.FIREBASE_AUTH_EMAIL}>`);
      cb();
      signOut(auth)
        .then(() =>
          console.log(`Logged out from: <${process.env.FIREBASE_AUTH_EMAIL}>`)
        )
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
