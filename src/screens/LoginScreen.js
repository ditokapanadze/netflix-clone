import React, { useState } from "react";
import "./LoginScreen.css";
import background from "../img/background.jpg";
import SignInScreen from "../screens/SignUpScreen";
function LoginScreen() {
  const [signIn, setSignIn] = useState(false);

  return (
    <div className="loginScreen">
      <div className="loginScreen_background">
        <img
          src=" http://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png"
          className="loginScreen_logo"
          alt=""
        />
        <button onClick={() => setSignIn(true)} className="loginScreen_button">
          Sign In
        </button>
        <div className="loginScreen_gradiant"></div>
      </div>
      <div className="loginScreen_body">
        {signIn ? (
          <SignInScreen />
        ) : (
          <>
            <h1 className="animated">
              Unlimited films, TV programes and more.
            </h1>
            <h2>Watch anywhere. Cancel at any time.</h2>
            <h3>
              Ready to watch? Enter your email to create or restart your
              membership
            </h3>

            <div className="loginScreen_input">
              <form>
                <input type="email" placeholder="Emaila Adress" />
                <button
                  onClick={() => setSignIn(true)}
                  className="loginScreen_getStarted"
                >
                  GET STARTED
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
