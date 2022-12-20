import React from "react";
import '../Styles/SignupButton.css'


const SignupButton = ({ setAuthType }) => {


  return (
    <div  className='sbutton__wrapper'>
      <button
        className="btn btn-primary btn-block"
        onClick={() => setAuthType('signup')}
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignupButton;