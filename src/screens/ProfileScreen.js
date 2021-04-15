import React from "react";
import Nav from "../Nav.js";
import "./ProfileScreen.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase.js";
import PlansScreen from "./PlansScreen";

function ProfileScreen() {
  const user = useSelector(selectUser);

  console.log("profile page");
  return (
    <div className="profileScreen">
      <Nav />
      <div className="profileScreen_body">
        <h1>Edit profile</h1>
        <div className="profileScreen_info">
          <img
            src="https://pbs.twimg.com/profile_images/1240119990411550720/hBEe3tdn_400x400.png"
            alt=""
          />
          <div className="profileScreen_deails">
            <h2>{user.email}</h2>
            <div className="profileScreen_plans">
              <div className="profileScreen_plans">
                <h3>Plans</h3>
              </div>
              <PlansScreen />
              <button
                onClick={() => auth.signOut()}
                className="profileScreen_signOut"
              >
                sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
