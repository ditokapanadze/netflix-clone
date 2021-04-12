import React, {useEffect} from 'react';
import HomeScreen from "./screens/HomeScreen"
import './App.css';
import Login from "./screens/LoginScreen"
import {useDispatch, useSelector} from "react-redux"
import {logout, login, selectUser} from "./features/userSlice"
import ProfileScreen from "./screens/ProfileScreen"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { auth } from './firebase';


function App() {

  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) =>{
      if(userAuth){
          console.log(userAuth);
          dispatch(login({
            uid: userAuth.uid,
            email: userAuth.email
          }))
      } else {
          dispatch(logout)
      }
    })
    return unsubscribe
  }, [])

  return (
    <div className="app">
      <Router>
        {!user ?  (
          <Login />
        ) : (
          <Switch>
            <Router path="/profile">
                <ProfileScreen />
            </Router>
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
