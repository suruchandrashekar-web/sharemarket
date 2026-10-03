
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sign.css";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // =====================================================
  // PASSWORD VALIDATION
  // =====================================================

  const validatePassword = (password) => {

    if (password.length < 8) {
      return "Password must contain at least 8 characters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least 1 uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least 1 lowercase letter";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least 1 number";
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least 1 special character";
    }

    return "";
  };


  // =====================================================
  // SIGNUP
  // =====================================================

  const handleSignup = (e) => {

    e.preventDefault();


    // Check empty fields
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {

      alert("Please fill all fields");

      return;
    }


    // =================================================
    // EMAIL VALIDATION
    // =================================================

    const emailValue = email.trim().toLowerCase();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue)) {

      alert("Please enter a valid email address");

      return;
    }


    // =================================================
    // PASSWORD VALIDATION
    // =================================================

    const passwordError = validatePassword(password);

    if (passwordError) {

      alert(passwordError);

      return;
    }


    // =================================================
    // CONFIRM PASSWORD
    // =================================================

    if (password !== confirmPassword) {

      alert("Passwords do not match");

      return;
    }


    // =================================================
    // GET USERS FROM LOCAL STORAGE
    // =================================================

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );


    // =================================================
    // CHECK EMAIL ALREADY EXISTS
    // =================================================

    const existingUser = users.find(
      (user) =>
        user.email?.toLowerCase() === emailValue
    );


    if (existingUser) {

      alert("This email is already registered");

      return;
    }


    // =================================================
    // CREATE USER
    // =================================================

    const newUser = {

      id: Date.now(),

      name: name.trim(),

      email: emailValue,

      password: password

    };


    // =================================================
    // ADD USER
    // =================================================

    users.push(newUser);


    // =================================================
    // SAVE USERS IN LOCAL STORAGE
    // =================================================

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );


    // Save latest user
    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );


    // =================================================
    // SUCCESS
    // =================================================

    alert("Account created successfully!");


    // Clear form
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setShowPassword(false);
    setShowConfirmPassword(false);


    // Go to Login
    navigate("/login");

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="signup-page">

      <div className="signup-card">


        {/* LOGO */}

        <div className="signup-logo">

          Trade<span>X</span>

        </div>


        {/* TITLE */}

        <h1>Create Account</h1>

        <p className="signup-subtitle">

          Create your TradeX demo trading account

        </p>


        {/* FORM */}

        <form onSubmit={handleSignup}>


          {/* =================================================
              FULL NAME
          ================================================= */}

          <div className="signup-input-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="signup-input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="signup-input-group">

            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? "🙈" : "👁️"}

              </button>

            </div>

          </div>


          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="signup-input-group">

            <label>Confirm Password</label>

            <div className="password-wrapper">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}

              </button>

            </div>

          </div>


          {/* =================================================
              CREATE ACCOUNT BUTTON
          ================================================= */}

          <button
            type="submit"
            className="signup-button"
          >

            Create Account

          </button>

        </form>


        {/* =================================================
            LOGIN
        ================================================= */}

        <div className="signup-login">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >

            Login

          </button>

        </div>


        {/* =================================================
            DEMO
        ================================================= */}

        <p className="signup-demo">

          Demo Trading Platform

        </p>

      </div>

    </div>

  );
}

export default Signup;

