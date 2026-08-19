import {
  useState,
} from "react";

import HomePage
  from "./pages/HomePage";

import AuthPage
  from "./pages/AuthPage";

import {
  getUser,
  isLoggedIn,
  clearAuth,
} from "./utils/auth";


function App() {

  const [
    authenticated,
    setAuthenticated,
  ] = useState(
    isLoggedIn()
  );


  const [
    user,
    setUser,
  ] = useState(
    getUser()
  );


  // Successful login/register
  const handleAuthenticated = (
    loggedInUser
  ) => {

    setUser(
      loggedInUser
    );

    setAuthenticated(
      true
    );
  };


  // Logout
  const handleLogout = () => {

    clearAuth();

    setUser(null);

    setAuthenticated(
      false
    );
  };


  if (!authenticated) {

    return (
      <AuthPage
        onAuthenticated={
          handleAuthenticated
        }
      />
    );
  }


  return (
    <HomePage
      user={user}
      onLogout={
        handleLogout
      }
    />
  );
}


export default App;