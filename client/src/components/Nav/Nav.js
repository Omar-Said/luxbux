import "./Nav.scss";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Auth";
import app from "../../firebase";
import firebase from "../../firebase";
import "firebase/firestore";
import settings from "../../assets/icons/settings.svg";
import dropDown from "../../assets/icons/arrow-down.svg";
import walletIcon from "../../assets/icons/wallet.svg";
import userIcon from "../../assets/icons/user.svg";
import UserDialogue from "../UserDialogue/UserDialogue";
import Wallet from "../../components/Wallet/Wallet";
import Profile from "../../Pages/Profile.js";
import logout from "../../assets/icons/logout.svg";
import logo from "../../assets/icons/logo.svg";

function Nav(props) {
  const user = app.auth().currentUser;
  const { currentUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [dialogue, setDialogue] = useState(false);
  const [walletDialogue, setWalletDialogue] = useState(false);
  const [profileDialogue, setProfileDialogue] = useState(false);
  const [logoutDialogue, setLogoutDialogue] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const userId = user.uid;
      const db = firebase.firestore();
      db.collection("users")
        .doc(userId)
        .collection("wallet")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.docs.length > 0) {
            let emptyArr = [];
            querySnapshot.forEach((doc) => {
              emptyArr.push({ id: doc.id, ...doc.data() });
            });
            props.otherprops(emptyArr[0].value);
          }
        });
    }
  }, [props, user, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userId = user.uid;
      const db = firebase.firestore();

      db.collection("users")
        .doc(userId)
        .get()
        .then((querySnapshot) => {
          setAvatar(querySnapshot.data().avatar);
          setUserName(querySnapshot.data().username);
        });
    }
  });

  const handleDialogue = () => {
    setDialogue(true);
  };

  const handleExit = () => {
    setDialogue(false);
  };

  const handleWalletDialogue = () => {
    setWalletDialogue(true);
  };

  const handleWalletExit = () => {
    setWalletDialogue(false);
  };

  const handleProfileDialogue = () => {
    setProfileDialogue(true);
  };

  const handleProfileDialogueExit = () => {
    setProfileDialogue(false);
  };

  const handleLogoutDialogue = () => {
    setLogoutDialogue(true);
  };

  // const handleLogoutDialogueExit = () => {
  //   setLogoutDialogue(false);
  // };

  const isValid = avatar ? "loggedIn" : "loggedOut";

  return (
    <header>
      {!currentUser && (
        <div className="nav">
          <Link className="nav__home-link" to="/">
            <img className="nav__home" src={logo} alt="luxbux logo" />
          </Link>
          <div className="nav__loggedout">
            <button onClick={handleDialogue} className="nav__loggedout-login">
              LOGIN
            </button>
            <button
              onClick={handleDialogue}
              className="nav__loggedout-signup-btn"
            >
              START A LUXBUCKET
            </button>
          </div>
          {dialogue && <UserDialogue handleExit={handleExit} />}
        </div>
      )}
      {currentUser && (
        <div className="nav-loggedin">
          <Link className="nav-loggedin__link" to="/">
            <img className="nav-loggedin__home" src={logo} alt="luxbux logo" />
          </Link>

          <div className="nav-loggedin__wrapper">
            {currentUser && (
              <p className="nav-loggedin__wallet">
                ${props.walletValue.toFixed(2)}
              </p>
            )}

            <div className="nav-loggedin__icons" onClick={handleWalletDialogue}>
              <img src={walletIcon} alt="settings" />
            </div>
            {walletDialogue && (
              <Wallet
                otherprops={props.otherprops}
                handleWalletExit={handleWalletExit}
              />
            )}

            <div
              className="nav-loggedin__icons"
              onClick={handleProfileDialogue}
            >
              <img src={userIcon} alt="settings" />
            </div>
            {profileDialogue && (
              <Profile handleProfileDialogueExit={handleProfileDialogueExit} />
            )}

            <div className="nav-loggedin__icons">
              <img src={settings} alt="settings" />
            </div>

            {currentUser && (
              <Link to="/dashboard">
                <img className={isValid} src={avatar} alt="" />
              </Link>
            )}

            <p className="nav-loggedin__username">{userName}</p>
            <img
              onClick={handleLogoutDialogue}
              className="nav-loggedin__arrowdown"
              src={dropDown}
              alt="settings"
            />

            {logoutDialogue && (
              <Link to="/">
                <img
                  onClick={() => {
                    props.otherprops(0);
                    return app.auth().signOut();
                  }}
                  src={logout}
                  className="tooltip"
                  alt="log out"
                />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Nav;
