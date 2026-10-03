
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./OTP.css";

function OTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOTP = (e) => {
    e.preventDefault();

    setMessage("");

    // -------------------------------------------------
    // EMPTY OTP
    // -------------------------------------------------

    if (!otp.trim()) {
      setMessage("Please enter the OTP.");
      return;
    }

    // -------------------------------------------------
    // OTP LENGTH
    // -------------------------------------------------

    if (otp.length !== 6) {
      setMessage("OTP must contain 6 digits.");
      return;
    }

    // -------------------------------------------------
    // GET SAVED OTP
    // -------------------------------------------------

    const savedOTP = localStorage.getItem("resetOTP");

    if (!savedOTP) {
      setMessage(
        "OTP not found. Please request a new OTP."
      );
      return;
    }

    // -------------------------------------------------
    // CHECK OTP EXPIRY
    // -------------------------------------------------

    const expiryTime = localStorage.getItem(
      "resetOTPExpiry"
    );

    if (
      expiryTime &&
      Date.now() > Number(expiryTime)
    ) {
      localStorage.removeItem("resetOTP");
      localStorage.removeItem("resetOTPExpiry");

      setMessage(
        "OTP expired. Please request a new OTP."
      );

      return;
    }

    // -------------------------------------------------
    // CHECK OTP
    // -------------------------------------------------

    if (otp !== savedOTP) {
      setMessage(
        "Invalid OTP. Please enter the correct OTP."
      );
      return;
    }

    // =================================================
    // OTP CORRECT
    // =================================================

    setLoading(true);

    setMessage(
      "✓ OTP verified successfully!"
    );

    // -------------------------------------------------
    // SAVE VERIFIED STATUS
    // -------------------------------------------------

    localStorage.setItem(
      "otpVerified",
      "true"
    );

    // -------------------------------------------------
    // REMOVE USED OTP
    // -------------------------------------------------

    localStorage.removeItem(
      "resetOTP"
    );

    localStorage.removeItem(
      "resetOTPExpiry"
    );

    // =================================================
    // GO TO PASSWORD PAGE
    // =================================================

    setTimeout(() => {
      navigate("/reset-password");
    }, 800);
  };

  // =====================================================
  // BACK TO LOGIN
  // =====================================================

  const handleBackToLogin = () => {
    localStorage.removeItem("resetOTP");
    localStorage.removeItem("resetOTPExpiry");
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("resetUserId");

    navigate("/login");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="otp-page">

      <div className="otp-card">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="otp-logo">
          Trade<span>X</span>
        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          Verify OTP
        </h1>

        {/* =================================================
            SUBTITLE
        ================================================= */}

        <p className="otp-subtitle">
          Enter the 6-digit OTP sent to your
          registered email address.
        </p>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleVerifyOTP}>

          {/* OTP INPUT */}

          <div className="otp-input-group">

            <label>
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              disabled={loading}
              onChange={(e) => {

                const value =
                  e.target.value.replace(/\D/g, "");

                setOtp(value);
                setMessage("");
              }}
            />

          </div>

          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div className="otp-message">
              {message}
            </div>
          )}

          {/* =================================================
              VERIFY BUTTON
          ================================================= */}

          <button
            type="submit"
            className="otp-verify-button"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <button
          type="button"
          className="back-login-button"
          onClick={handleBackToLogin}
          disabled={loading}
        >
          ← Back to Login
        </button>

        {/* =================================================
            DEMO
        ================================================= */}

        <p className="otp-demo">
          Demo Trading Platform
        </p>

      </div>

    </div>
  );
}

export default OTP;

