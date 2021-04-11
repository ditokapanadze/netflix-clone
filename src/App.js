import React, {useEffect} from 'react';
import HomeScreen from "./screens/HomeScreen"
import './App.css';
import Login from "./screens/LoginScreen"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { auth } from './firebase';


function App() {

  const user = null

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) =>{
      if(userAuth){
          console.log(userAuth);
      } else {

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
