import app from "../../firebase";
import "firebase/firestore";
import "./FriendsList.scss";
import React, { useState } from "react";
import closeWindow from "../../assets/icons/closeWindow.svg";

const FriendsList = ({ friendsData, mapUser }) => {
  const [friendDialogue, setFriendDialogue] = useState(false);
  console.log(friendsData);
  // const [isActive, setisActive] = useState(false);

  const handleDialogue = () => {
    setFriendDialogue(true);
  };

  const handleExit = () => {
    setFriendDialogue(false);
  };

  // const onSelect = (e, username, avatar, location) => {
  //   addFriend(e, username, avatar, location);
  //   activeButton();
  // };

  // const activeButton = () => {
  //   setisActive(true);
  //   console.log(isActive);
  // };

  const user = app.auth().currentUser;
  const addFriend = (e, username, avatar, location) => {
    console.log(e.target.value);
    mapUser(e.target.value, username, avatar, location);
  };

  const filtered = friendsData.filter((friend) => friend.id !== user.uid);

  // const btn = isActive
  //   ? "friendDialogue-container__btn-active"
  //   : "friendDialogue-container__btn";

  return (
    <section className="friendlist">
      <h1 className="friendlist__header">FRIEND BUCKETS</h1>
      <div className="friendlist__container">
        <p className="friendlist__link" onClick={handleDialogue}>
          ADD FRIENDS
        </p>

        {friendDialogue && (
          <div className="friendDialogue">
            <ul className="friendDialogue-container">
              <img
                className="friendDialogue-exit"
                src={closeWindow}
                alt="Exit Window"
                onClick={handleExit}
              />
              <h1 className="friendDialogue-container__header">
                Add new friends
              </h1>
              <input
                className="friendDialogue-container__fields  friendDialogue-container__fields-icon"
                name="search"
                type="text"
                placeholder="Search for a friend"
              />
              <p className="friendDialogue-container__title">
                Suggested friends
              </p>{" "}
              {filtered
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((data) => {
                  return (
                    <li key={data.id}>
                      <div className="friendDialogue-container__wrapper">
                        <img
                          className="friendDialogue-container__avatar"
                          src={data.avatar}
                          alt=""
                        />
                        <div>
                          <p className="friendDialogue-container__name">
                            {data.username}
                          </p>
                          <p className="friendDialogue-container__loc">
                            {data.location}
                          </p>
                        </div>
                        <button
                          className="friendDialogue-container__btn"
                          onClick={(e) =>
                            addFriend(
                              e,
                              data.username,
                              data.avatar,
                              data.location
                            )
                          }
                          value={data.id}
                        >
                          ADD
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default FriendsList;

// onClick={
//   ((e) =>
//     addFriend(
//       e,
//       data.username,
//       data.avatar,
//       data.location
//     )
