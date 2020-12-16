import React from "react";
import app from "../../firebase";
import "./Wallet.scss";
import firebase from "../../firebase";
import "firebase/firestore";
import NumberFormat from "react-number-format";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import closeWindow from "../../assets/icons/closeWindow.svg";

class Wallet extends React.Component {
  state = {
    value: 0,
    hasWallet: false,
    walletId: "",
    number: "",
  };

  componentDidMount() {
    this.baseState = this.state;
    this.mapUserWallet();
  }

  createWallet = () => {
    const user = app.auth().currentUser;
    if (user != null) {
      const userId = user.uid;
      const db = firebase.firestore();

      db.collection("users")
        .doc(userId)
        .collection("wallet")
        .add({
          value: 0,
        })
        .then((response) => {
          console.log("Document successfully written!");
          this.setState({
            ...this.baseState,
          });
          this.mapUserWallet();
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
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

  addToWallet = (e) => {
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
            .doc(this.state.walletId)
            .set(
              {
                value:
                  Number(this.state.number) * 0.965 +
                  Number(querySnapshot[0].value),
              },
              { merge: true }
            )
            .then((response) => {
              console.log("Document successfully written!");
              this.setState({
                ...this.baseState,
                value:
                  Number(this.state.number) * 0.965 +
                  Number(querySnapshot[0].value),
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

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleToken = async (token) => {
    const response = await axios.post("http://localhost:8080/checkout", {
      token,
      number: this.state.number,
    });
    const { status } = response.data;
    if (status === "success") {
      toast("Success! Check email for details", {
        type: "success",
      });
      this.addToWallet();
    } else {
      toast("Something went wrong!", {
        type: "error",
      });
    }
  };

  render() {
    return (
      <div className="wallet">
        <div className="wallet-container">
          <img
            onClick={this.props.handleWalletExit}
            className="wallet-exit"
            src={closeWindow}
            alt=""
          />
          <h1 className="wallet-title">My Wallet</h1>
          <div className="wallet-wrapper">
            <p className="wallet-subtitle">Your wallet balance:</p>
            {!this.state.hasWallet ? (
              <button className="wallet-create" onClick={this.createWallet}>
                Create A Wallet
              </button>
            ) : (
              <NumberFormat
                className="wallet-value"
                value={this.state.value.toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
            )}
          </div>
          <p className="wallet-subscript">Add more money to your wallet</p>
          <p className="wallet-subscript__amount">Amount to add</p>
          <input
            className="wallet-input"
            onChange={this.onChange}
            value={this.state.number}
            type="number"
            name="number"
            placeholder="$0"
            required
          />
          <StripeCheckout
            stripeKey="pk_test_51HwH3xISPVtQRRm6zc91nzfOGTY3UH1fNVMT6iuUr7DDGDgrgAiacqU2Ihe6ewZykqxrk5Nfr6n6WytLHv9hWUdK00ByyMcnVR"
            token={this.handleToken}
            billingAddress
            amount={Number(this.state.number * 100)}
          />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <p className="wallet-fineprint">
            Please note: A 3.5% fee will be added to your purchase.
          </p>
        </div>
      </div>
    );
  }
}

export default Wallet;
