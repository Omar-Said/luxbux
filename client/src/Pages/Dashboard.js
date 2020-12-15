import React from "react";
import app from "../firebase";
import firebase from "firebase";
import "firebase/firestore";
import UserBucket from "../components/UserBucket/UserBucket.js";
import FriendBucket from "../components/FriendBucket/FriendBucket";
import FriendsList from "../components/FriendsList/FriendsList";
import "./Dashboard.scss";
import close from "../assets/icons/close.svg";

class Dashboard extends React.Component {
  state = {
    title: "",
    description: "",
    goal: "",
    image: "",
    url: "",
    buckets: [],
    users: [],
    friendsBucket: [],
  };

  componentDidMount() {
    this.baseState = this.state;
    this.fetchAll();
  }

  fetchAll = () => {
    this.mapBuckets();
    this.mapUsers();
    this.findFriendsBuckets();
  };

  resetState = () => {
    this.setState({
      ...this.baseState,
    });
    this.fetchAll();
  };

  handleBucket = (e) => {
    e.preventDefault();
    const { title, description, goal } = e.target.elements;
    console.log(title.value, description.value, goal.value);

    const user = app.auth().currentUser;
    const storage = firebase.storage();

    const uploadTask = storage
      .ref(`images/${this.state.image.name}`)
      .put(this.state.image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(this.state.image.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            this.setState({
              url: url,
            });
            return url;
          })
          .then((url) => {
            if (user != null) {
              const userId = user.uid;
              const db = firebase.firestore();
              const titleOk = title.value;
              const descriptionOk = description.value;
              const goalOk = goal.value;

              db.collection("users")
                .doc(userId)
                .collection("buckets")
                .add({
                  timestamp: Date.now(),
                  title: titleOk,
                  description: descriptionOk,
                  goal: goalOk,
                  raised: 0,
                  image: url,
                })
                .then((response) => {
                  console.log("Document successfully written!");
                  this.setState({
                    ...this.baseState,
                  });
                  this.mapBuckets();
                  this.mapUsers();
                  this.findFriendsBuckets();
                })
                .catch(function (error) {
                  console.error("Error writing document: ", error);
                });
            }
          });
      }
    );
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleImageUpload = (e) => {
    if (e.target.files[0]) {
      this.setState({
        image: e.target.files[0],
      });
      console.log(this.state.image);
    }
  };

  mapBuckets = () => {
    const user = app.auth().currentUser;
    const userId = user.uid;
    const db = firebase.firestore();

    db.collection("users")
      .doc(userId)
      .collection("buckets")
      .get()
      .then((querySnapshot) => {
        let arr = querySnapshot;
        let emptyArray = [];

        arr.forEach((item) => {
          emptyArray.push({
            buckets: { id: item.id, ...item.data() },
          });
        });
        this.setState({
          buckets: emptyArray,
        });
      });
  };

  mapUsers = () => {
    const db = firebase.firestore();

    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const emptyArr = [];
          emptyArr.forEach((doc) => {});
          this.setState({
            users: [...this.state.users, { id: doc.id, ...doc.data() }],
          });
        });
      });
  };

  mapUser = (friendId, friendUsername, avatar, location) => {
    const db = firebase.firestore();
    const user = app.auth().currentUser;
    const userId = user.uid;

    db.collection("users").doc(userId).collection("friends").add({
      friend: friendId,
      friendName: friendUsername,
      avatar: avatar,
      location: location,
    });
    console.log(friendId, friendUsername);
  };

  findFriendsBuckets = () => {
    const user = app.auth().currentUser;
    const userId = user.uid;
    const db = firebase.firestore();

    db.collection("users")
      .doc(userId)
      .collection("friends")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.mapFriendBucket(
            doc.data().friendName,
            doc.data().friend,
            doc.data().avatar,
            doc.data().location
          );
        });
      });
  };

  mapFriendBucket = (username, friendId, avatar, location) => {
    const db = firebase.firestore();

    db.collection("users")
      .doc(friendId)
      .collection("buckets")
      .get()
      .then((querySnapshot) => {
        let arr = querySnapshot;
        let emptyArr = [];

        arr.forEach((item) => {
          const findId = emptyArr.find(
            (emptyItem) => emptyItem.name === username
          );

          if (findId) {
            emptyArr[emptyArr.indexOf(findId)].buckets.push({
              id: item.id,
              ...item.data(),
            });
          } else {
            emptyArr.push({
              id: friendId,
              name: username,
              avatar: avatar,
              location: location,
              buckets: [{ id: item.id, ...item.data() }],
            });
          }
        });

        emptyArr.forEach((item) => {
          this.setState({
            friendsBucket: [
              ...this.state.friendsBucket,
              {
                id: friendId,
                bucket: item.buckets,
                name: item.name,
                avatar: avatar,
                location: location,
              },
            ],
          });
        });
      });
  };

  resetForm = (e) => {
    this.setState({
      title: "",
      description: "",
      goal: "",
      image: "",
    });
  };

  render() {
    return (
      <div className="dashboard">
        <h1 className="dashboard__header">MY BUCKETS</h1>
        <div className="dashboard__wrapper">
          <form className="dashboard-form" onSubmit={this.handleBucket}>
            <img
              onClick={this.resetForm}
              className="dashboard-form__cancel"
              src={close}
              alt="cancel-bucket"
            />
            <div className="dashboard-form__container">
              <div className="dashboard-form__wrapper">
                <input
                  onChange={this.handleImageUpload}
                  type="file"
                  accept="image/*"
                  multiple={false}
                  required
                />
              </div>
              <label className="dashboard-form__label">Add Photo</label>
            </div>
            <div className="dashboard-form__sub-wrapper">
              <input
                className="dashboard-form__title-label"
                name="title"
                type="title"
                placeholder="Title"
                onChange={this.onChange}
                value={this.state.title}
                required
                maxLength={20}
              />
              <input
                className="dashboard-form__description-label"
                name="description"
                onChange={this.onChange}
                value={this.state.description}
                type="description"
                placeholder="Description (Up to 2 lines)"
                required
                maxLength={45}
              />
              <label className="dashboard-form__goal-label">
                Goal
                <input
                  className="dashboard-form__goal-input dashboard-form__goal-input-icon"
                  name="goal"
                  type="number"
                  onChange={this.onChange}
                  value={this.state.goal}
                  placeholder="$0"
                  required
                />
              </label>
              <button className="dashboard-form__btn" type="submit">
                ADD NEW BUCKET
              </button>
            </div>
          </form>

          {this.state.buckets ? (
            <UserBucket
              userData={this.state.buckets}
              mapBuckets={this.mapBuckets}
            />
          ) : (
            <div>...Loading</div>
          )}
        </div>
        <div className="dashboard-child__container">
          {this.state.users ? (
            <FriendsList
              friendsData={this.state.users}
              mapUser={this.mapUser}
              resetState={this.resetState}
            />
          ) : (
            <div>...Loading</div>
          )}
          {this.state.buckets ? (
            <FriendBucket
              friendsBucket={this.state.friendsBucket}
              resetState={this.resetState}
              otherprops={this.props.otherprops}
            />
          ) : (
            <div>...Loading</div>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
