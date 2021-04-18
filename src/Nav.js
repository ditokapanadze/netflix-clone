import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import "./Nav.css";

function Nav() {
  const [show, handleShow] = useState(false);
  const history = useHistory();
  const user = useSelector(selectUser);
  const transtionNavBar = () => {
    if (window.scrollY > 100) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", transtionNavBar);
    return () => window.removeEventListener("scroll", transtionNavBar);
  }, []);

  return (
    <div className={`nav ${show && "nav_black"}`}>
      <div className="nav_contents">
        <img
          onClick={() => history.push("/")}
          className="nav_logo"
          src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png"
          alt=" netflixLogo"
        />
        <img
          onClick={() => history.push("/profile")}
          className="nav_avatar"
          src={user.avatarUrl}
          alt="Avatar"
        />
      </div>
    </div>
  );
}

export default Nav;
