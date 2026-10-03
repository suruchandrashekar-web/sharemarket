
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {

  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);


  // =====================================================
  // NORMAL EMAIL + PASSWORD LOGIN
  // =====================================================

  const handleLogin = (e) => {

    e.preventDefault();


    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    const emailValue =
      email.trim().toLowerCase();

    const passwordValue =
      password.trim();


    if (!emailValue || !passwordValue) {

      alert(
        "Please enter email and password."
      );

      return;
    }


    // ---------------------------------------------------
    // REMEMBER ME
    // ---------------------------------------------------

    if (!rememberMe) {

      alert(
        "Please select Remember me before login."
      );

      return;
    }


    // ---------------------------------------------------
    // GET USERS ARRAY
    // ---------------------------------------------------

    let users = [];

    try {

      users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

    }
    catch (error) {

      console.error(
        "Users loading error:",
        error
      );

      users = [];

    }


    // ---------------------------------------------------
    // GET SINGLE USER
    // ---------------------------------------------------

    let savedUser = null;

    try {

      savedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

    }
    catch (error) {

      console.error(
        "Saved user loading error:",
        error
      );

      savedUser = null;

    }


    // ---------------------------------------------------
    // FIND USER
    // ---------------------------------------------------

    let foundUser = null;


    // Search users array

    foundUser = users.find(
      (user) =>
        user?.email
          ?.trim()
          .toLowerCase() === emailValue &&
        user?.password === passwordValue
    );


    // Search single saved user

    if (!foundUser && savedUser) {

      if (
        savedUser?.email
          ?.trim()
          .toLowerCase() === emailValue &&
        savedUser?.password === passwordValue
      ) {

        foundUser = savedUser;

      }

    }


    // ===================================================
    // LOGIN SUCCESS
    // ===================================================

    if (foundUser) {


      // -------------------------------------------------
      // SAVE LOGIN STATUS
      // -------------------------------------------------

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );


      // -------------------------------------------------
      // SAVE USER EMAIL
      // -------------------------------------------------

      localStorage.setItem(
        "userEmail",
        foundUser.email
      );


      // -------------------------------------------------
      // SAVE COMPLETE LOGGED-IN USER
      // -------------------------------------------------

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(foundUser)
      );


      // -------------------------------------------------
      // SAVE REMEMBER ME
      // -------------------------------------------------

      localStorage.setItem(
        "rememberMe",
        "true"
      );


      // -------------------------------------------------
      // REMOVE GOOGLE USER
      // -------------------------------------------------

      localStorage.removeItem(
        "googleUser"
      );


      // -------------------------------------------------
      // IMPORTANT
      // DO NOT REMOVE PROFILE PHOTO HERE
      //
      // Account page will handle profile photo
      // -------------------------------------------------


      console.log(
        "Logged-in Email:",
        foundUser.email
      );


      // -------------------------------------------------
      // SUCCESS MESSAGE
      // -------------------------------------------------

      alert(
        `Login Successful!\n${foundUser.email}`
      );


      // =================================================
      // IMPORTANT
      // LOGIN → HOME
      // =================================================

      navigate(
        "/stocks",
        {
          replace: true
        }
      );

    }

    else {

      alert(
        "Invalid Email or Password"
      );

    }

  };


  // =====================================================
  // GOOGLE LOGIN RESPONSE
  // =====================================================

  const handleGoogleResponse = (response) => {

    console.log(
      "Google Response:",
      response
    );


    // ---------------------------------------------------
    // CHECK RESPONSE
    // ---------------------------------------------------

    if (
      !response ||
      !response.credential
    ) {

      alert(
        "Google Login Failed"
      );

      return;
    }


    try {


      // -------------------------------------------------
      // DECODE GOOGLE TOKEN
      // -------------------------------------------------

      const parts =
        response.credential.split(".");


      if (parts.length !== 3) {

        throw new Error(
          "Invalid Google credential"
        );

      }


      const base64Url =
        parts[1];


      const base64 =
        base64Url
          .replace(/-/g, "+")
          .replace(/_/g, "/");


      const payload =
        JSON.parse(
          window.atob(base64)
        );


      // -------------------------------------------------
      // GOOGLE USER INFORMATION
      // -------------------------------------------------

      const googleEmail =
        payload.email
          ?.trim()
          .toLowerCase() || "";


      const googleName =
        payload.name ||
        "Google User";


      const googlePicture =
        payload.picture ||
        "";


      // -------------------------------------------------
      // CHECK EMAIL
      // -------------------------------------------------

      if (!googleEmail) {

        alert(
          "Google email not found."
        );

        return;

      }


      // =================================================
      // GOOGLE LOGIN SUCCESS
      // =================================================


      // -------------------------------------------------
      // SAVE LOGIN STATUS
      // -------------------------------------------------

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );


      // -------------------------------------------------
      // SAVE EMAIL
      // -------------------------------------------------

      localStorage.setItem(
        "userEmail",
        googleEmail
      );


      // -------------------------------------------------
      // SAVE GOOGLE USER
      // -------------------------------------------------

      const googleUser = {

        name: googleName,

        email: googleEmail,

        picture: googlePicture

      };


      localStorage.setItem(
        "googleUser",
        JSON.stringify(
          googleUser
        )
      );


      // -------------------------------------------------
      // SAVE LOGGED-IN USER
      // -------------------------------------------------

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({

          name: googleName,

          email: googleEmail,

          picture: googlePicture,

          loginType: "google"

        })
      );


      console.log(
        "Google Logged-in Email:",
        googleEmail
      );


      // -------------------------------------------------
      // SUCCESS MESSAGE
      // -------------------------------------------------

      alert(
        `Google Login Successful!\n${googleEmail}`
      );


      // =================================================
      // IMPORTANT
      // GOOGLE LOGIN → HOME
      // =================================================

      navigate(
        "/stocks",
        {
          replace: true
        }
      );

    }

    catch (error) {

      console.error(
        "Google Login Error:",
        error
      );


      alert(
        "Unable to process Google Login."
      );

    }

  };


  // =====================================================
  // GOOGLE IDENTITY SERVICES
  // =====================================================

  useEffect(() => {

    let intervalId = null;

    let isMounted = true;


    const loadGoogleButton = () => {


      // -------------------------------------------------
      // CHECK GOOGLE SCRIPT
      // -------------------------------------------------

      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id
      ) {

        return false;

      }


      // -------------------------------------------------
      // GET GOOGLE BUTTON
      // -------------------------------------------------

      const googleButton =
        document.getElementById(
          "googleBtn"
        );


      if (!googleButton) {

        return false;

      }


      // -------------------------------------------------
      // CLEAR OLD BUTTON
      // -------------------------------------------------

      googleButton.innerHTML = "";


      // -------------------------------------------------
      // INITIALIZE GOOGLE
      // -------------------------------------------------

      window.google.accounts.id.initialize({

        client_id:
          "994655521297-l33lrkmbpr33oi8efhg6t8vj4mormmmt.apps.googleusercontent.com",

        callback:
          handleGoogleResponse,

        auto_select:
          false,

        cancel_on_tap_outside:
          true

      });


      // -------------------------------------------------
      // RENDER GOOGLE BUTTON
      // -------------------------------------------------

      window.google.accounts.id.renderButton(

        googleButton,

        {

          type: "standard",

          theme: "outline",

          size: "large",

          text: "continue_with",

          shape: "rectangular",

          width: 350,

          logo_alignment: "left"

        }

      );


      return true;

    };


    // ---------------------------------------------------
    // TRY IMMEDIATELY
    // ---------------------------------------------------

    if (!loadGoogleButton()) {

      intervalId =
        setInterval(() => {

          if (
            isMounted &&
            loadGoogleButton()
          ) {

            clearInterval(
              intervalId
            );

            intervalId = null;

          }

        }, 300);

    }


    // ---------------------------------------------------
    // CLEANUP
    // ---------------------------------------------------

    return () => {

      isMounted = false;


      if (intervalId) {

        clearInterval(
          intervalId
        );

      }

    };

  }, []);


  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword = () => {

    navigate(
      "/forgot-password"
    );

  };


  // =====================================================
  // CREATE ACCOUNT
  // =====================================================

  const handleCreateAccount = () => {

    navigate(
      "/register"
    );

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="login-page">


      {/* =================================================
          LOGIN CARD
      ================================================= */}

      <div className="login-card">


        {/* =================================================
            LOGO
        ================================================= */}

        <div className="login-logo">

          Trade<span>X</span>

        </div>


        {/* =================================================
            TITLE
        ================================================= */}

        <h1>

          Welcome Back

        </h1>


        <p className="login-subtitle">

          Login to your TradeX account

        </p>


        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form
          onSubmit={handleLogin}
        >


          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="login-input-group">

            <label>

              Email

            </label>


            <input

              type="email"

              placeholder="Enter your email"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

              autoComplete="email"

            />

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="login-input-group">

            <label>

              Password

            </label>


            <div className="login-password-wrapper">


              <input

                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                placeholder="Enter your password"

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                autoComplete="current-password"

              />


              {/* =================================================
                  SHOW / HIDE PASSWORD
              ================================================= */}

              <button

                type="button"

                className="login-eye-button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }

              >

                {
                  showPassword
                    ? "🙈"
                    : "👁️"
                }

              </button>


            </div>

          </div>


          {/* =================================================
              REMEMBER ME + FORGOT
          ================================================= */}

          <div className="login-options">


            {/* REMEMBER ME */}

            <label className="remember-label">

              <input

                type="checkbox"

                checked={rememberMe}

                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }

              />

              <span>

                Remember me

              </span>

            </label>


            {/* FORGOT PASSWORD */}

            <button

              type="button"

              className="forgot-btn"

              onClick={
                handleForgotPassword
              }

            >

              Forgot Password?

            </button>


          </div>


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button

            type="submit"

            className="login-button"

          >

            Login

          </button>


        </form>


        {/* =================================================
            OR
        ================================================= */}

        <div className="login-divider">

          <span></span>

          <p>

            OR

          </p>

          <span></span>

        </div>


        {/* =================================================
            GOOGLE LOGIN
        ================================================= */}

        <div className="google-login-wrapper">

          <div
            id="googleBtn"
          ></div>

        </div>


        {/* =================================================
            CREATE ACCOUNT
        ================================================= */}

        <button

          type="button"

          className="create-account-button"

          onClick={
            handleCreateAccount
          }

        >

          Create New Account

        </button>


        {/* =================================================
            DEMO
        ================================================= */}

        <p className="login-demo">

          Demo Trading Platform

        </p>


      </div>

    </div>

  );

}


export default Login;

