import React from "react";


const SignupButton = ({ signup }) => {


  return (
    <button
      className="btn btn-primary btn-block"
      onClick={() =>
        signup({
          screen_hint: "signup",
        })
      }
    >
      Sign Up
    </button>
  );
};

export default SignupButton;