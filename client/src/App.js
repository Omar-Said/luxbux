import React, { useState } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import Nav from "./components/Nav/Nav";
// import Profile from "./Pages/Profile";
import Dashboard from "./Pages/Dashboard";
// import Wallet from "./components/Wallet/Wallet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [walletValue, setWalletValue] = useState(0);
  toast.configure();

  const handleChangeWalletValue = (value) => {
    setWalletValue(value);
  };

  // commented out wallet private route and the import for wallet - going to attempt to pass it through nav

  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav walletValue={walletValue} otherprops={handleChangeWalletValue} />
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <PrivateRoute
            exact
            path="/dashboard"
            component={Dashboard}
            otherprops={handleChangeWalletValue}
          />
          {/* <PrivateRoute exact path="/profile" component={Profile} /> */}
          {/* <PrivateRoute
            exact
            path="/wallet"
            component={Wallet}
            otherprops={handleChangeWalletValue}
          /> */}
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

// import React, { useState } from "react";
// import "./App.scss";
// import { BrowserRouter, Route, Switch } from "react-router-dom";
// import LandingPage from "./Pages/LandingPage";
// import { AuthProvider } from "./Auth";
// import PrivateRoute from "./PrivateRoute";
// import Nav from "./components/Nav/Nav";
// import Profile from "./Pages/Profile";
// import Dashboard from "./Pages/Dashboard";
// import Wallet from "./components/Wallet/Wallet";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const App = () => {
//   const [walletValue, setWalletValue] = useState(0);
//   toast.configure();

//   const handleChangeWalletValue = (value) => {
//     setWalletValue(value);
//   };

//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Nav walletValue={walletValue} otherprops={handleChangeWalletValue} />
//         <Switch>
//           <Route exact path="/" component={LandingPage} />
//           <PrivateRoute
//             exact
//             path="/dashboard"
//             component={Dashboard}
//             otherprops={handleChangeWalletValue}
//           />
//           <PrivateRoute exact path="/profile" component={Profile} />
//           <PrivateRoute
//             exact
//             path="/wallet"
//             component={Wallet}
//             otherprops={handleChangeWalletValue}
//           />
//         </Switch>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;
