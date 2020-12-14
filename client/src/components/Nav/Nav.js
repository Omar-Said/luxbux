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

function Nav(props) {
  const user = app.auth().currentUser;
  const { currentUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [dialogue, setDialogue] = useState(false);
  const [walletDialogue, setWalletDialogue] = useState(false);
  const [profileDialogue, setProfileDialogue] = useState(false);

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

  const isValid = avatar ? "loggedIn" : "loggedOut";

  return (
    <header>
      {!currentUser && (
        <div className="nav">
          <Link className="nav__home-link" to="/">
            <h1 className="nav__home">vBucks</h1>
          </Link>
          <div className="nav__loggedout">
            <button onClick={handleDialogue} className="nav__loggedout-login">
              LOGIN
            </button>
            <button
              onClick={handleDialogue}
              className="nav__loggedout-signup-btn"
            >
              START A VBUCKET
            </button>
          </div>
          {dialogue && <UserDialogue handleExit={handleExit} />}
        </div>
      )}
      {currentUser && (
        <div className="nav-loggedin">
          <Link className="nav-loggedin__link" to="/">
            <h1 className="nav-loggedin__home">vBucks</h1>
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
              className="nav-loggedin__arrowdown"
              src={dropDown}
              alt="settings"
            />
            <Link to="/">
              <button onClick={() => app.auth().signOut()}>Log Out</button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Nav;

// import "./Nav.scss";
// import React, { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../Auth";
// import app from "../../firebase";
// import firebase from "../../firebase";
// import "firebase/firestore";
// import settings from "../../assets/icons/settings.svg";
// import dropDown from "../../assets/icons/arrow-down.svg";
// import walletIcon from "../../assets/icons/wallet.svg";
// import userIcon from "../../assets/icons/user.svg";
// import UserDialogue from "../UserDialogue/UserDialogue";

// function Nav(props) {
//   const user = app.auth().currentUser;
//   const { currentUser } = useContext(AuthContext);
//   const [avatar, setAvatar] = useState("");
//   const [userName, setUserName] = useState("");
//   const [dialogue, setDialogue] = useState(false);

//   useEffect(() => {
//     if (currentUser) {
//       const userId = user.uid;
//       const db = firebase.firestore();
//       db.collection("users")
//         .doc(userId)
//         .collection("wallet")
//         .get()
//         .then((querySnapshot) => {
//           if (querySnapshot.docs.length > 0) {
//             let emptyArr = [];
//             querySnapshot.forEach((doc) => {
//               emptyArr.push({ id: doc.id, ...doc.data() });
//             });
//             props.otherprops(emptyArr[0].value);
//           }
//         });
//     }
//   }, [props, user, currentUser]);

//   useEffect(() => {
//     if (currentUser) {
//       const userId = user.uid;
//       const db = firebase.firestore();

//       db.collection("users")
//         .doc(userId)
//         .get()
//         .then((querySnapshot) => {
//           setAvatar(querySnapshot.data().avatar);
//           setUserName(querySnapshot.data().username);
//         });
//     }
//   });

//   const handleDialogue = () => {
//     setDialogue(true);
//   };

//   const handleExit = () => {
//     setDialogue(false);
//   };

//   const isValid = avatar ? "loggedIn" : "loggedOut";

//   return (
//     <header>
//       {!currentUser && (
//         <div className="nav">
//           <Link className="nav__home-link" to="/">
//             <h1 className="nav__home">vBucks</h1>
//           </Link>
//           <div className="nav__loggedout">
//             <button onClick={handleDialogue} className="nav__loggedout-login">
//               LOGIN
//             </button>
//             <button
//               onClick={handleDialogue}
//               className="nav__loggedout-signup-btn"
//             >
//               START A VBUCKET
//             </button>
//           </div>
//           {dialogue && <UserDialogue handleExit={handleExit} />}
//         </div>
//       )}
//       {currentUser && (
//         <div className="nav-loggedin">
//           <Link className="nav-loggedin__link" to="/">
//             <h1 className="nav-loggedin__home">vBucks</h1>
//           </Link>

//           <div className="nav-loggedin__wrapper">
//             {currentUser && (
//               <p className="nav-loggedin__wallet">${props.walletValue}</p>
//             )}

//             <Link to="/wallet">
//               <div className="nav-loggedin__icons">
//                 <img src={walletIcon} alt="settings" />
//               </div>
//             </Link>

//             <div className="nav-loggedin__icons">
//               <Link to="/dashboard">
//                 <img src={userIcon} alt="settings" />
//               </Link>
//             </div>
//             <div className="nav-loggedin__icons">
//               <Link to="/profile">
//                 <img src={settings} alt="settings" />
//               </Link>
//             </div>

//             {currentUser && <img className={isValid} src={avatar} alt="" />}

//             <p className="nav-loggedin__username">{userName}</p>
//             <img
//               className="nav-loggedin__arrowdown"
//               src={dropDown}
//               alt="settings"
//             />
//             <Link to="/">
//               <button onClick={() => app.auth().signOut()}>Log Out</button>
//             </Link>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Nav;
