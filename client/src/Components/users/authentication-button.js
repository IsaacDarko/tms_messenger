import React, { useState, useEffect, useContext} from "react";
import { GlobalContext } from "../Contexts/GlobalContext";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";



const AuthenticationButton = () => {
  const { isAuthenticated } = useContext(GlobalContext)

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

export default AuthenticationButton;