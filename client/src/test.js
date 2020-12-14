import React, { Component } from "react";

import "./App.css";
import firebase, { auth, provider } from "./firebase.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref("items");
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email,
    };
    itemsRef.push(item);
    this.setState({
      currentItem: "",
      username: "",
    });
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
        });
      }
      this.setState({
        items: newState,
      });
    });
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null,
      });
    });
  }

  login() {
    auth.signInWithPopup(provider).then((result) => {
      const user = result.user;
      this.setState({
        user,
      });
    });
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
            {this.state.user ? (
              <button onClick={this.logout}>Log Out</button>
            ) : (
              <button onClick={this.login}>Log In</button>
            )}
          </div>
        </header>
        {this.state.user ? (
          <div>
            <div className="user-profile">
              <img src={this.state.user.photoURL} />
            </div>
          </div>
        ) : (
          <div className="wrapper">
            <p>
              You must be logged in to see the potluck list and submit to it.
            </p>
          </div>
        )}
      </div>
    );
  }
}
export default App;
