import React, { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import "./App.css";
import firebase from "firebase";
import Login from "./screens/LoginScreen";
import { useDispatch, useSelector } from "react-redux";
import { logout, login, selectUser } from "./features/userSlice";
import ProfileScreen from "./screens/ProfileScreen";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { auth } from "./firebase";
import MoviePage from "./screens/MoviePage";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [avatar, setAvatar] = useState("");

  // const test = firebase.auth().currentUser;
  const basicAvatar =
    "https://firebasestorage.googleapis.com/v0/b/netflix-89701.appspot.com/o/basicAvatar%2FhBEe3tdn_400x400.png?alt=media&token=ca1ac08e-fbda-417a-8a19-436afe650689";
  // useEffect(() => {
  //   auth.onAuthStateChanged((userAuth) => {
  //     if (userAuth) {
  //       firebase
  //         .storage()
  //         .ref("users/" + userAuth.uid + "/profile.jpg")
  //         .getDownloadURL()
  //         .then((url) => {
  //           setAvatar(url);
  //           console.log(url);
  //         })
  //         .then(() => {
  //           if (userAuth) {
  //             firebase
  //               .storage()
  //               .ref("basicAvatar/" + "/hBEe3tdn_400x400.png")
  //               .getDownloadURL()
  //               .then((imgUrl) => {
  //                 dispatch(
  //                   login({
  //                     uid: userAuth.uid,
  //                     email: userAuth.email,
  //                     avatarUrl: avatar,
  //                   })
  //                 );
  //               });
  //           } else {
  //             dispatch(logout());
  //           }
  //         });
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   firebase
  //     .storage()
  //     .ref("basicAvatar/" + "/hBEe3tdn_400x400.png")
  //     .getDownloadURL()
  //     .then((url) => {
  //       setBesicAvatar(url);
  //     });
  // }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        firebase
          .storage()
          .ref("users/" + userAuth.uid + "/profile.jpg")
          .getDownloadURL()
          .then((imgUrl) => {
            dispatch(
              login({
                uid: userAuth.uid,
                email: userAuth.email,
                avatarUrl: imgUrl,
              })
            );
          })
          .catch((error) => {
            console.log(error);
            localStorage.setItem("uid", userAuth.uid);
            localStorage.setItem("email", userAuth.email);
            localStorage.setItem("avatarUrl", basicAvatar);
            // dispatch(
            //   login({
            //     uid: userAuth.uid,
            //     email: userAuth.email,
            //     avatarUrl: basicAvatar,
            //   })
            // );
          });
      } else {
        dispatch(logout());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="app">
      <Router>
        {!user ? (
          <Login />
        ) : (
          <Switch>
            <Route path="/profile">
              <ProfileScreen />
            </Route>

            <Route path="/movie/:slug?">
              <MoviePage />
            </Route>

            <Route exact path="/">
              <HomeScreen />
            </Route>
          </Switch>
        )}
      </Router>
    </div>
  );
}

export default App;
