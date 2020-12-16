import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

const PrivateRoute = ({
  component: RouteComponent,
  otherprops,
  walletValue,
  ...rest
}) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        return !!currentUser ? (
          <RouteComponent
            {...routeProps}
            otherprops={otherprops}
            walletValue={walletValue}
          />
        ) : (
          <Redirect to={"/login"} />
        );
      }}
    />
  );
};

export default PrivateRoute;
