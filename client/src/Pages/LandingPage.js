import "firebase/firestore";
import "./LandingPage.scss";
import React, { useState } from "react";
import UserDialogue from "../components/UserDialogue/UserDialogue";

const LandingPage = () => {
  const [homeDialogue, setHomeDialogue] = useState(false);

  const handleDialogue = () => {
    setHomeDialogue(true);
  };

  const handleHomeExit = () => {
    setHomeDialogue(false);
  };

  return (
    <div className="landing-page">
      <div className="landing-page__container">
        <h1 className="landing-page__title">
          GIVE YOUR FRIENDS A HELPING HAND
        </h1>
        <h3 className="landing-page__sub-title">
          VBUCKS MAKES IT POSSIBLE FOR ANYONE TO DONATE TO THEIR FRIENDS SO THEY
          CAN ACHIEVE THEIR GOALS
        </h3>

        <button onClick={handleDialogue} className="landing-page__btn">
          START A VBUCKET
        </button>
      </div>
      <div className="test">
        {homeDialogue && <UserDialogue handleExit={handleHomeExit} />}
      </div>
    </div>
  );
};

export default LandingPage;
