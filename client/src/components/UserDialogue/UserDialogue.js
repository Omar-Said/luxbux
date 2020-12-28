import { useState } from "react";
import "./UserDialogue.scss";
import "../../Pages/LogIn";
import LogIn from "../../Pages/LogIn";
import SignUp from "../../Pages/SignUp";
import closeWindow from "../../assets/icons/closeWindow.svg";

function UserDialogue(props) {
  const [loginToggle, setloginToggle] = useState(true);
  const [signUpToggle, setsignUpToggle] = useState(false);

  const handleLogin = () => {
    setloginToggle(true);
    setsignUpToggle(false);
  };

  const handleSignUp = () => {
    setloginToggle(false);
    setsignUpToggle(true);
  };

  const toggleLogin = loginToggle
    ? "dialogue-container__headers"
    : "dialogue-container__headers-mod";

  const toggleSignUp = signUpToggle
    ? "dialogue-container__headers"
    : "dialogue-container__headers-mod";

  return (
    <div className="dialogue">
      <div className="dialogue-container">
        <img
          onClick={props.handleExit}
          className="dialogue-exit"
          src={closeWindow}
          alt=""
        />
        <div className="dialogue-container__title">
          <h1 onClick={handleLogin} className={toggleLogin}>
            LOGIN
          </h1>
          <h1 onClick={handleSignUp} className={toggleSignUp}>
            SIGN UP
          </h1>
        </div>

        {loginToggle && <LogIn handleSignUp={handleSignUp} />}
        {signUpToggle && <SignUp />}
      </div>
    </div>
  );
}

export default UserDialogue;
