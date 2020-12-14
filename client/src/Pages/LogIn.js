import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../firebase.js";
import { AuthContext } from "../Auth";
import "./Login.scss";

const LogIn = ({ history }) => {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/dashboard");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleLogin}>
        <span className="login-form__labels">Email</span>
        <input
          className="login-form__fields"
          name="email"
          type="email"
          required
        />
        <span className="login-form__labels">Password</span>
        <input
          className="login-form__fields  login-form__fields-icon"
          name="password"
          type="password"
          required
        />
        <button className="login-form__btn" type="submit">
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default withRouter(LogIn);
