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
    hasWallet: "",
    value: "",
    walletId: "",
  };

  componentDidMount() {
    this.baseState = this.state;
    this.mapUserWallet();
  }

  handleDonation = (e, userId, bucketId) => {
    e.preventDefault();

    const raisedValue = e.target.number;
    const currentWallet = this.state.value;
    console.log("Input: ", raisedValue.value);
    console.log("Wallet:", currentWallet);

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
                    ...this.baseState,
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
                hasWallet: true,
                value: doc.data().value,
                walletId: doc.id,
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
            console.log({ id: doc.id, ...doc.data() });
          });
          console.log(emptyArr[0].id);
          return emptyArr;
        })
        .then((querySnapshot) => {
          console.log(querySnapshot);
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
                ...this.baseState,
                value:
                  Number(querySnapshot[0].value) - Number(this.state.number),
              });
              this.mapUserWallet();
              this.props.otherprops(this.state.value);
            });
        })

        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  };

  render() {
    const { friendsBucket } = this.props;
    // console.log(friendsBucket);

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

// import { Fragment } from "react";
// import React from "react";
// import firebase from "../../firebase";
// import app from "../../firebase";
// import "firebase/firestore";
// import NumberFormat from "react-number-format";
// import "./FriendBucket.scss";

// class FriendBucket extends React.Component {
//   state = {
//     id: "",
//     raised: "",
//     number: 0,
//     hasWallet: "",
//     value: "",
//     walletId: "",
//   };

//   componentDidMount() {
//     this.baseState = this.state;
//     this.mapUserWallet();
//   }

//   handleDonation = (e, userId, bucketId) => {
//     e.preventDefault();
//     const raisedValue = e.target.number;

//     if (userId != null) {
//       const db = firebase.firestore();
//       this.setState({ number: raisedValue.value });
//       db.collection("users")
//         .doc(userId)
//         .collection("buckets")
//         .doc(bucketId)
//         .get()
//         .then((querySnapshot) => {
//           this.setState({
//             id: querySnapshot.id,
//             raised: querySnapshot.data().raised,
//           });
//           return querySnapshot;
//         })
//         .then((querySnapshot) => {
//           db.collection("users")
//             .doc(userId)
//             .collection("buckets")
//             .doc(this.state.id)
//             .set(
//               {
//                 raised:
//                   Number(this.state.number) +
//                   Number(querySnapshot.data().raised),
//               },
//               { merge: true }
//             )
//             .then((response) => {
//               console.log("Document successfully written!");
//               this.setState(
//                 {
//                   ...this.baseState,
//                   raised:
//                     Number(this.state.number) +
//                     Number(querySnapshot.data().raised),
//                 },
//                 () => {
//                   this.props.resetState();
//                 }
//               );
//             });
//         })
//         .catch(function (error) {
//           console.error("Error writing document: ", error);
//         });
//     }
//     this.addToWallet();
//     e.target.reset();
//   };

//   mapUserWallet = () => {
//     const db = firebase.firestore();
//     const user = app.auth().currentUser;
//     const userId = user.uid;

//     db.collection("users")
//       .doc(userId)
//       .collection("wallet")
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           if (doc.id) {
//             this.setState(
//               {
//                 hasWallet: true,
//                 value: doc.data().value,
//                 walletId: doc.id,
//               },
//               () => {
//                 this.props.otherprops(this.state.value);
//               }
//             );
//           }
//           // console.log({ id: doc.id, ...doc.data() });
//           // console.log(doc.data().value, this.state.walletId);
//         });
//       });
//   };

//   addToWallet = () => {
//     const user = app.auth().currentUser;

//     if (user != null) {
//       const userId = user.uid;
//       const db = firebase.firestore();

//       db.collection("users")
//         .doc(userId)
//         .collection("wallet")
//         .get()
//         .then((querySnapshot) => {
//           let emptyArr = [];
//           querySnapshot.forEach((doc) => {
//             emptyArr.push({ id: doc.id, ...doc.data() });
//             console.log({ id: doc.id, ...doc.data() });
//           });
//           console.log(emptyArr[0].id);
//           return emptyArr;
//         })
//         .then((querySnapshot) => {
//           console.log(querySnapshot);
//           db.collection("users")
//             .doc(userId)
//             .collection("wallet")
//             .doc(querySnapshot[0].id)
//             .set(
//               {
//                 value:
//                   Number(querySnapshot[0].value) - Number(this.state.number),
//               },
//               { merge: true }
//             )
//             .then((response) => {
//               console.log("Document successfully written!");
//               this.setState({
//                 ...this.baseState,
//                 value:
//                   Number(querySnapshot[0].value) - Number(this.state.number),
//               });
//               this.mapUserWallet();
//               this.props.otherprops(this.state.value);
//             });
//         })

//         .catch(function (error) {
//           console.error("Error writing document: ", error);
//         });
//     }
//   };

//   render() {
//     const { friendsBucket } = this.props;
//     // console.log(this.props);

//     return (
//       <section>
//         <ul>
//           {" "}
//           {friendsBucket &&
//             friendsBucket
//               .sort((a, b) => b.timestamp - a.timestamp)
//               .map((data) => {
//                 return (
//                   <li key={data.id}>
//                     <h1>{data.name}</h1>
//                     {data.bucket &&
//                       data.bucket.map((item, i) => {
//                         return (
//                           <Fragment key={i}>
//                             <h1>{item.title}</h1>
//                             <div className="friend-img">
//                               <img
//                                 className="friend-img"
//                                 src={item.image}
//                                 alt=""
//                               />
//                             </div>
//                             <p>{item.description}</p>
//                             <NumberFormat
//                               value={item.goal}
//                               displayType={"text"}
//                               thousandSeparator={true}
//                               prefix={"$"}
//                             />
//                             <p>
//                               {new Date(item.timestamp).toLocaleDateString()}
//                             </p>
//                             <form
//                               onSubmit={(e) => {
//                                 e.preventDefault();
//                                 this.handleDonation(e, data.id, item.id);
//                               }}
//                             >
//                               <p>${item.raised}</p>
//                               <input
//                                 name="number"
//                                 type="number"
//                                 placeholder="donation"
//                               />
//                               <button type="submit">Donate!</button>
//                             </form>
//                           </Fragment>
//                         );
//                       })}
//                   </li>
//                 );
//               })}
//         </ul>
//       </section>
//     );
//   }
// }

// export default FriendBucket;
