import app from "../firebase";
import "./Profile.scss";
import firebase from "firebase";
import "firebase/firestore";
import React, { useState } from "react";
import "./Profile.scss";
import closeWindow from "../assets/icons/closeWindow.svg";

const Profile = ({ history, ...props }) => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const storage = firebase.storage();

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleProfile = (e) => {
    e.preventDefault();
    const { biography, location } = e.target.elements;

    const user = app.auth().currentUser;

    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            return url;
          })
          .then((url) => {
            if (user != null) {
              const userId = user.uid;
              const db = firebase.firestore();
              const bio = biography.value;
              const loc = location.value;
              db.collection("users")
                .doc(userId)
                .update({
                  biography: bio,
                  location: loc,
                  avatar: url,
                })
                .then(function () {
                  console.log("Document successfully written!");
                })
                .catch(function (error) {
                  console.error("Error writing document: ", error);
                });
              props.handleProfileDialogueExit();
            }
          });
      }
    );
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <img
          onClick={props.handleProfileDialogueExit}
          className="wallet-exit"
          src={closeWindow}
          alt=""
        />
        <h1 className="profile__title">My Profile</h1>
        <form className="profile-form" onSubmit={handleProfile}>
          <div className="profile-form__left-side">
            <div className="profile-form__container">
              {file && (
                <img
                  className="profile-form__user"
                  src={file}
                  alt="uploaded-img"
                />
              )}
              {!file && (
                <div className="profile-form__img">
                  <input
                    onChange={handleImageUpload}
                    type="file"
                    accept="image/*"
                    multiple={false}
                    required
                    id="profileImage"
                  />
                </div>
              )}
            </div>
            <span className="profile-form__label">Add Photo</span>
          </div>

          <div className="profile-form__wrapper">
            <label className="profile__labels">
              Bio
              <input
                className="profile__input"
                name="biography"
                type="biography"
                required
              />
            </label>
            <label className="profile__labels">
              Location
              <input
                className="profile__input"
                name="location"
                type="location"
                required
              />
            </label>

            <button className="profile__btn" type="submit">
              SAVE PROFILE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
