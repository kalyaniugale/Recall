import {
  useEffect,
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


  // ==========================================
  // SUCCESSFUL LOGIN / REGISTER
  // ==========================================

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


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    clearAuth();

    setUser(null);

    setAuthenticated(
      false
    );

  };


  // ==========================================
  // EXPIRED / INVALID SESSION
  // ==========================================

  useEffect(() => {

    const handleUnauthorized = () => {

      clearAuth();

      setUser(null);

      setAuthenticated(
        false
      );

    };


    window.addEventListener(
      "recall:unauthorized",
      handleUnauthorized
    );


    return () => {

      window.removeEventListener(
        "recall:unauthorized",
        handleUnauthorized
      );

    };

  }, []);


  // ==========================================
  // AUTH PAGE
  // ==========================================

  if (!authenticated) {

    return (
      <AuthPage
        onAuthenticated={
          handleAuthenticated
        }
      />
    );

  }


  // ==========================================
  // HOME
  // ==========================================

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