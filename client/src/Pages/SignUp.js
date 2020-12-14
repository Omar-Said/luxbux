import React, { useCallback } from "react";
import { withRouter } from "react-router";
import app from "../firebase";
import firebase from "firebase";
import "firebase/firestore";
import "./SignUp.scss";

const SignUp = ({ history }) => {
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password, username, location } = event.target.elements;
      console.log(email, password, username, location);
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/dashboard");
        const user = app.auth().currentUser;

        if (user != null) {
          const userId = user.uid;
          const userEmail = user.email;
          const db = firebase.firestore();
          db.collection("users")
            .doc(userId)
            .set({
              email: userEmail,
              username: username.value,
            })
            .then(function () {
              console.log("Document successfully written!");
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            });
        }
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  return (
    <div className="signup">
      <form className="signup-form" onSubmit={handleSignUp}>
        <span className="signup-form__labels">Username</span>
        <input
          className="signup-form__fields"
          name="username"
          type="username"
          placeholder="User Name"
          required
        />
        <span className="signup-form__labels">Email</span>
        <input
          className="signup-form__fields"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <span className="signup-form__labels">Password</span>
        <input
          className="signup-form__fields login-form__fields-icon"
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button className="signup-form__btn" type="submit">
          Sign Up
        </button>
        <p className="signup-form__terms">
          By continuing, you agree to accept our Privacy Policy & Terms of
          Service.
        </p>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
