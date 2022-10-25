import React from "react";
import { Widgets } from "@material-ui/icons";

const LoginButton = ({ ready, setReady, login, logs }) => {

  return (
    <button
      className="btn btn-primary btn-block"
      onMouseEnter={() => setReady(!ready)}
      onClick={() => login(logs)}
    >
      Log In
    </button>
  );
};

export default LoginButton;