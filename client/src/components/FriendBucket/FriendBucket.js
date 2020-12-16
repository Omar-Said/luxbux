import { Fragment } from "react";
import React from "react";
import firebase from "../../firebase";
import app from "../../firebase";
import "firebase/firestore";
import NumberFormat from "react-number-format";
import "./FriendBucket.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class FriendBucket extends React.Component {
  state = {
    id: "",
    raised: "",
    number: 0,
    value: 0,
  };

  componentDidMount() {
    this.setState({
      ...this.state,
      value: this.props.walletValue,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.walletValue !== prevProps.walletValue) {
      this.setState({
        ...this.state,
        value: this.props.walletValue,
      });
    }
  }

  handleDonation = (e, userId, bucketId) => {
    e.preventDefault();

    const raisedValue = e.target.number;
    const currentWallet = this.state.value;

    if (currentWallet < raisedValue.value) {
      toast("Add Money To Your Wallet!", {
        type: "error",
      });
    } else {
      if (userId != null) {
        const db = firebase.firestore();
        this.setState({ number: raisedValue.value });
        db.collection("users")
          .doc(userId)
          .collection("buckets")
          .doc(bucketId)
          .get()
          .then((querySnapshot) => {
            this.setState({
              id: querySnapshot.id,
              raised: querySnapshot.data().raised,
            });
            return querySnapshot;
          })
          .then((querySnapshot) => {
            db.collection("users")
              .doc(userId)
              .collection("buckets")
              .doc(this.state.id)
              .set(
                {
                  raised:
                    Number(this.state.number) +
                    Number(querySnapshot.data().raised),
                },
                { merge: true }
              )
              .then((response) => {
                console.log("Document successfully written!");
                this.setState(
                  {
                    ...this.state,
                    number: 0,
                    raised:
                      Number(this.state.number) +
                      Number(querySnapshot.data().raised),
                  },
                  () => {
                    this.props.resetState();
                  }
                );
              });
          })
          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      }

      this.addToWallet();
      e.target.reset();
      toast("Success! Donation Processed!", {
        type: "success",
      });
    }
  };

  mapUserWallet = () => {
    const db = firebase.firestore();
    const user = app.auth().currentUser;
    const userId = user.uid;

    db.collection("users")
      .doc(userId)
      .collection("wallet")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id) {
            this.setState(
              {
                value: doc.data().value,
              },
              () => {
                this.props.otherprops(this.state.value);
              }
            );
          }
        });
      });
  };

  addToWallet = () => {
    const user = app.auth().currentUser;

    if (user != null) {
      const userId = user.uid;
      const db = firebase.firestore();

      db.collection("users")
        .doc(userId)
        .collection("wallet")
        .get()
        .then((querySnapshot) => {
          let emptyArr = [];
          querySnapshot.forEach((doc) => {
            emptyArr.push({ id: doc.id, ...doc.data() });
          });
          return emptyArr;
        })
        .then((querySnapshot) => {
          db.collection("users")
            .doc(userId)
            .collection("wallet")
            .doc(querySnapshot[0].id)
            .set(
              {
                value:
                  Number(querySnapshot[0].value) - Number(this.state.number),
              },
              { merge: true }
            )
            .then((response) => {
              console.log("Document successfully written!");
              this.setState({
                ...this.state,
                number: 0,
                value:
                  Number(querySnapshot[0].value) - Number(this.state.number),
              });
              this.mapUserWallet();
            });
        })

        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  };

  render() {
    const { friendsBucket } = this.props;

    if (friendsBucket && friendsBucket.length) {
      return (
        <section>
          <ul className="friendsbucket">
            {" "}
            {friendsBucket &&
              friendsBucket
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((data) => {
                  return (
                    <li key={data.id} className="friendsbucket__list-item">
                      <div className="friendsbucket__user-wrapper">
                        <img
                          src={data.avatar}
                          className="friendsbucket__user-img"
                          alt=""
                        />
                        <div>
                          <h1 className="friendsbucket__user">{data.name}</h1>
                          <p className="friendsbucket__location">
                            {data.location}
                          </p>
                        </div>
                      </div>
                      {data.bucket &&
                        data.bucket.map((item, i) => {
                          return data.bucket.length ? (
                            <Fragment key={i}>
                              <div className="friendsbucket__container">
                                <img
                                  className="friendsbucket__img"
                                  src={item.image}
                                  alt=""
                                />
                                <div className="friendsbucket__wrapper">
                                  <h1 className="friendsbucket__title">
                                    {item.title}
                                  </h1>
                                  <p className="friendsbucket__desc">
                                    {item.description}
                                  </p>
                                </div>
                                <div className="friendsbucket__subwrapper">
                                  <p className="friendsbucket__perc">
                                    {((item.raised / item.goal) * 100).toFixed(
                                      0
                                    )}
                                    %
                                  </p>
                                  <NumberFormat
                                    className="friendsbucket__goal"
                                    value={item.goal}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                  />
                                </div>
                                <div className="friendsbucket__progressbar">
                                  <div
                                    className="friendsbucket__list-filler"
                                    style={{
                                      width: `${
                                        (item.raised / item.goal) * 100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="friendsbucket__flex">
                                  <p className="friendsbucket__txt">Raised</p>
                                  <NumberFormat
                                    className="friendsbucket__raised"
                                    value={item.raised}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                  />
                                </div>
                                <div className="friendsbucket__form">
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      this.handleDonation(e, data.id, item.id);
                                    }}
                                  >
                                    <label className="friendsbucket__amount">
                                      Amount
                                      <input
                                        className="friendsbucket__input friendsbucket__input-icon"
                                        name="number"
                                        type="number"
                                        min={1}
                                        placeholder="$0"
                                        required
                                      />
                                    </label>
                                    <button
                                      className="friendsbucket__btn"
                                      type="submit"
                                    >
                                      Donate!
                                    </button>
                                  </form>
                                </div>
                              </div>
                            </Fragment>
                          ) : (
                            <div>Your friend has no buckets!</div>
                          );
                        })}
                    </li>
                  );
                })}
          </ul>
        </section>
      );
    } else {
      return <p className="friendsbucket__none">Add some new friends!</p>;
    }
  }
}

export default FriendBucket;
