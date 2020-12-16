import "firebase/firestore";
import NumberFormat from "react-number-format";
import "./UserBucket.scss";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "firebase/firestore";
import app from "../../firebase";
import firebase from "firebase";
import React from "react";
import close from "../../assets/icons/close.svg";

const UserBucket = ({ userData, mapBuckets }) => {
  // console.log(userData);
  const Collect = (e) => {
    if (e) {
      toast("Success! Your money will be deposited in 7 days", {
        type: "success",
      });
    }
  };

  const Delete = (e, id) => {
    const user = app.auth().currentUser;

    const db = firebase.firestore();
    db.collection("users")
      .doc(user.uid)
      .collection("buckets")
      .doc(id)
      .delete()
      .then(function () {
        toast(
          "Bucket Deleted, Any donations will be deposited within 7 days.",
          {
            type: "error",
          }
        );
        mapBuckets();
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  return (
    <section className="userbucket">
      <ul className="userbucket">
        {" "}
        {userData &&
          userData

            .sort((a, b) => b.buckets.timestamp - a.buckets.timestamp)
            .map((data) => {
              return (
                <li className="userbucket__list-item" key={data.buckets.id}>
                  <img
                    onClick={(e) => Delete(e, data.buckets.id)}
                    className="userbucket__list-cancel"
                    src={close}
                    alt="cancel-bucket"
                  />
                  <img
                    className="userbucket-img"
                    src={data.buckets.image}
                    alt=""
                  />

                  <div className="userbucket__list-wrapper">
                    <h1 className="userbucket__list-title">
                      {data.buckets.title}
                    </h1>
                    <p className="userbucket__list-desc">
                      {data.buckets.description}
                    </p>
                  </div>
                  <div className="userbucket__list-subwrapper">
                    <p className="userbucket__list-percent">
                      {(
                        (data.buckets.raised / data.buckets.goal) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                    <NumberFormat
                      className="userbucket__list-goal"
                      value={data.buckets.goal}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </div>
                  <div className="userbucket__list-progressbar">
                    <div
                      className="userbucket__list-filler"
                      style={{
                        width: `${
                          (data.buckets.raised / data.buckets.goal) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="userbucket__list-flex">
                    <p className="userbucket__list-txt">Raised</p>
                    <p className="userbucket__list-raised">
                      ${data.buckets.raised}
                    </p>
                  </div>
                  <button
                    className="userbucket-list__btn"
                    type="button"
                    onClick={Collect}
                  >
                    Collect
                  </button>
                </li>
              );
            })}
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
      </ul>
    </section>
  );
};

export default UserBucket;

// import "firebase/firestore";
// import NumberFormat from "react-number-format";
// import "./UserBucket.scss";
// import "react-toastify/dist/ReactToastify.css";
// import { toast, ToastContainer } from "react-toastify";
// import "firebase/firestore";
// import app from "../../firebase";
// import firebase from "firebase";
// import React from "react";

// const UserBucket = ({ userData, mapBuckets }) => {
//   console.log();
//   const Collect = (e) => {
//     if (e) {
//       toast("Success! Your money will be deposited in 7 days", {
//         type: "success",
//       });
//     }
//   };

//   const Delete = (e, id) => {
//     const user = app.auth().currentUser;

//     const db = firebase.firestore();
//     db.collection("users")
//       .doc(user.uid)
//       .collection("buckets")
//       .doc(id)
//       .delete()
//       .then(function () {
//         toast("Document successfully deleted!", {
//           type: "error",
//         });
//       })
//       .catch(function (error) {
//         console.error("Error removing document: ", error);
//       });
//     window.setTimeout(() => {
//       mapBuckets();
//     }, 5000);
//   };

//   return (
//     <section>
//       <ul className="userbucket">
//         {" "}
//         {userData &&
//           userData

//             .sort((a, b) => b.timestamp - a.timestamp)
//             .map((data) => {
//               return (
//                 <li className="userbucket__list-item" key={data.id}>
//                   <img className="userbucket-img" src={data.image} alt="" />
//                   <div className="userbucket__list-wrapper">
//                     <h1 className="userbucket__list-title">{data.title}</h1>
//                     <p className="userbucket__list-desc">{data.description}</p>
//                   </div>
//                   <div className="userbucket__list-subwrapper">
//                     <p className="userbucket__list-percent">
//                       {((data.raised / data.goal) * 100).toFixed(0)}%
//                     </p>
//                     <NumberFormat
//                       className="userbucket__list-goal"
//                       value={data.goal}
//                       displayType={"text"}
//                       thousandSeparator={true}
//                       prefix={"$"}
//                     />
//                   </div>
//                   <div className="userbucket__list-progressbar">
//                     <div
//                       className="userbucket__list-filler"
//                       style={{ width: `${(data.raised / data.goal) * 100}%` }}
//                     ></div>
//                   </div>
//                   <div className="userbucket__list-flex">
//                     <p className="userbucket__list-txt">Raised</p>
//                     <p className="userbucket__list-raised">${data.raised}</p>
//                   </div>
// {
//   data.raised == data.goal && (
//     <button className="userbucket-list__btn" type="button" onClick={Collect}>
//       Collect
//     </button>
//   );
// }
// {
//   !(data.raised == data.goal) && (
//     <button
//       className="userbucket-list__btn-cancel"
//       type="button"
//       onClick={(e) => Delete(e, data.id)}
//     >
//       CANCEL
//     </button>
//   );
// }
//                 </li>
//               );
//             })}
//         <ToastContainer
//           position="top-right"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />
//       </ul>
//     </section>
//   );
// };

// export default UserBucket;
