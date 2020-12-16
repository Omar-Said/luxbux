import React, { useState } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import Nav from "./components/Nav/Nav";
import Dashboard from "./Pages/Dashboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const walletContext = React.createContext();

const App = () => {
  const [walletValue, setWalletValue] = useState(0);
  toast.configure();

  const handleChangeWalletValue = (value) => {
    setWalletValue(value);
  };

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
            walletValue={walletValue}
          />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
