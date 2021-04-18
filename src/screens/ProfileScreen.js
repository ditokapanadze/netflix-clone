import React, { useState, useRef } from "react";
import Nav from "../Nav.js";
import "./ProfileScreen.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth } from "../firebase.js";
import PlansScreen from "./PlansScreen";
import firebase from "firebase";

function ProfileScreen() {
  const user = useSelector(selectUser);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState(null);
  const inputFile = useRef(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      let src = URL.createObjectURL(e.target.files[0]);
      setPreview(src);
      console.log(src);
    }
  };

  const handleClick = () => {
    inputFile.current.click();
  };
  const uploadAvatar = (e) => {
    firebase
      .storage()
      .ref("users/" + user.uid + "/profile.jpg")
      .put(file)
      .then((res) => {
        console.log(res);
      });
  };

  console.log(user);
  return (
    <div className="profileScreen">
      <Nav />

      <div className="profileScreen_body">
        <h1>Edit profile</h1>

        <div className="profileScreen_info">
          <div className="avatar_container">
            <img
              className="avatar"
              src={preview ? preview : user.avatarUrl}
              alt=""
            />
            <input
              id="img"
              className="img-input"
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              // accept=".zip,.rar"
              ref={inputFile}
              onChange={handleChange}
            />
            <button
              className="upload_btn"
              onClick={preview ? uploadAvatar : handleClick}
            >
              {preview ? "upload" : "change avatar"}
            </button>
          </div>

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
