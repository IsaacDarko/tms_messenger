import React from "react";

const LogoutButton = ({ logout }) => {

  return (
    <button
      className="btn btn-danger btn-block"
      onClick={() =>
        logout()
      }
    >
      Log Out
    </button>
  );
};

export default LogoutButton;