import {
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../api/auth.api";

import {
  saveAuth,
} from "../utils/auth";


function AuthPage({
  onAuthenticated,
}) {

  const [mode, setMode] =
    useState("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");

    try {

      setLoading(true);

      let data;


      // REGISTER
      if (mode === "register") {

        data =
          await registerUser({
            name,
            email,
            password,
          });

      }

      // LOGIN
      else {

        data =
          await loginUser({
            email,
            password,
          });

      }


      // Save actual backend user + JWT
      saveAuth({
        token: data.token,
        user: data.user,
      });


      onAuthenticated(
        data.user
      );


    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">

          <h1>
            Recall
          </h1>

          <p>
            A safe little place for
            things you don't want to forget.
          </p>

        </div>


        <div className="auth-tabs">

          <button
            type="button"
            className={
              mode === "login"
                ? "active"
                : ""
            }
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Sign in
          </button>


          <button
            type="button"
            className={
              mode === "register"
                ? "active"
                : ""
            }
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Create account
          </button>

        </div>


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {mode === "register" && (

            <label>

              Name

              <input
                type="text"
                placeholder="Your name"
                value={name}
                required
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
              />

            </label>

          )}


          <label>

            Email

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

          </label>


          <label>

            Password

            <input
              type="password"
              placeholder="Your password"
              value={password}
              required
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
            />

          </label>


          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}


          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Just a moment..."
              : mode === "register"
              ? "Create my Recall"
              : "Open my Recall"}

          </button>

        </form>


        <p className="auth-note">
          Your memories belong only to you.
        </p>

      </div>

    </main>
  );
}


export default AuthPage;