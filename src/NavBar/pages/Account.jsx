import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Account.css";

import {
  getAccount,
  resetAccount
} from "./acc";


const Account = () => {

  const navigate = useNavigate();


  // =====================================================
  // USER STATE
  // =====================================================

  const [user, setUser] = useState(null);


  // =====================================================
  // ACCOUNT STATE
  // =====================================================

  const [account, setAccount] = useState(
    getAccount()
  );


  // =====================================================
  // PROFILE PHOTO STATE
  // =====================================================

  const [profilePhoto, setProfilePhoto] = useState("");


  // =====================================================
  // LOAD LOGGED-IN USER
  // =====================================================

  useEffect(() => {

    const loadUser = () => {

      try {

        // -------------------------------------------------
        // NORMAL LOGIN USER
        // -------------------------------------------------

        const loggedInUser = JSON.parse(
          localStorage.getItem("loggedInUser") || "null"
        );


        if (loggedInUser) {

          setUser(loggedInUser);

          return;

        }


        // -------------------------------------------------
        // GOOGLE LOGIN USER
        // -------------------------------------------------

        const googleUser = JSON.parse(
          localStorage.getItem("googleUser") || "null"
        );


        if (googleUser) {

          setUser(googleUser);

          return;

        }


        // -------------------------------------------------
        // FALLBACK USER
        // -------------------------------------------------

        const email =
          localStorage.getItem("userEmail") || "";


        if (email) {

          setUser({

            name: "Demo Investor",

            email: email

          });

        }

        else {

          setUser(null);

        }

      }

      catch (error) {

        console.error(
          "User loading error:",
          error
        );

        setUser(null);

      }

    };


    // Load user immediately
    loadUser();


    // Same-tab user update
    window.addEventListener(
      "userUpdated",
      loadUser
    );


    // Other-tab storage update
    window.addEventListener(
      "storage",
      loadUser
    );


    return () => {

      window.removeEventListener(
        "userUpdated",
        loadUser
      );


      window.removeEventListener(
        "storage",
        loadUser
      );

    };

  }, []);


  // =====================================================
  // USER NAME
  // =====================================================

  const userName =
    user?.name ||
    "Demo Investor";


  // =====================================================
  // USER EMAIL
  // =====================================================

  const userEmail =
    user?.email ||
    "yourmail@gmail.com";


  // =====================================================
  // USER PHOTO KEY
  // =====================================================
  //
  // IMPORTANT:
  // Each user gets a separate localStorage key.
  //
  // Example:
  //
  // profilePhoto_user1@gmail.com
  // profilePhoto_user2@gmail.com
  //
  // =====================================================

  const getProfilePhotoKey = () => {

    const email =
      user?.email ||
      localStorage.getItem("userEmail") ||
      "";

    if (!email) {

      return null;

    }


    return `profilePhoto_${email
      .trim()
      .toLowerCase()}`;

  };


  // =====================================================
  // LOAD USER-SPECIFIC PROFILE PHOTO
  // =====================================================

  useEffect(() => {

    if (!user) {

      setProfilePhoto("");

      return;

    }


    const photoKey =
      getProfilePhotoKey();


    if (!photoKey) {

      setProfilePhoto("");

      return;

    }


    const savedPhoto =
      localStorage.getItem(photoKey) || "";


    setProfilePhoto(savedPhoto);

  }, [user]);


  // =====================================================
  // LOAD ACCOUNT BALANCE
  // =====================================================

  useEffect(() => {

    const loadAccount = () => {

      setAccount(
        getAccount()
      );

    };


    loadAccount();


    window.addEventListener(
      "accountUpdated",
      loadAccount
    );


    window.addEventListener(
      "storage",
      loadAccount
    );


    return () => {

      window.removeEventListener(
        "accountUpdated",
        loadAccount
      );


      window.removeEventListener(
        "storage",
        loadAccount
      );

    };

  }, []);


  // =====================================================
  // AVAILABLE BALANCE
  // =====================================================

  const demoBalance =
    Number(account?.balance) || 0;


  // =====================================================
  // PROFILE PHOTO CHANGE
  // =====================================================

  const handlePhotoChange = (e) => {

    const file =
      e.target.files?.[0];


    if (!file) {

      return;

    }


    // -------------------------------------------------
    // CHECK IMAGE
    // -------------------------------------------------

    if (!file.type.startsWith("image/")) {

      alert(
        "Please select a valid image file."
      );

      return;

    }


    // -------------------------------------------------
    // MAXIMUM 5 MB
    // -------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Photo size must be less than 5 MB."
      );

      return;

    }


    // -------------------------------------------------
    // USER PHOTO KEY
    // -------------------------------------------------

    const photoKey =
      getProfilePhotoKey();


    if (!photoKey) {

      alert(
        "Please login first."
      );

      return;

    }


    // -------------------------------------------------
    // READ IMAGE
    // -------------------------------------------------

    const reader =
      new FileReader();


    reader.onload = () => {

      const imageData =
        reader.result;


      // -------------------------------------------------
      // SAVE PHOTO FOR THIS USER ONLY
      // -------------------------------------------------

      localStorage.setItem(
        photoKey,
        imageData
      );


      // -------------------------------------------------
      // UPDATE UI
      // -------------------------------------------------

      setProfilePhoto(
        imageData
      );

    };


    reader.onerror = () => {

      alert(
        "Unable to load the selected photo."
      );

    };


    reader.readAsDataURL(file);

  };


  // =====================================================
  // REMOVE PROFILE PHOTO
  // =====================================================

  const handleRemovePhoto = () => {

    if (!profilePhoto) {

      return;

    }


    const confirmRemove =
      window.confirm(
        "Are you sure you want to remove your profile photo?"
      );


    if (!confirmRemove) {

      return;

    }


    // -------------------------------------------------
    // GET CURRENT USER PHOTO KEY
    // -------------------------------------------------

    const photoKey =
      getProfilePhotoKey();


    if (photoKey) {

      localStorage.removeItem(
        photoKey
      );

    }


    // -------------------------------------------------
    // CLEAR UI
    // -------------------------------------------------

    setProfilePhoto("");

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );


    if (!confirmLogout) {

      return;

    }


    // -------------------------------------------------
    // CLEAR LOGIN SESSION
    // -------------------------------------------------

    localStorage.removeItem(
      "isLoggedIn"
    );


    localStorage.removeItem(
      "userEmail"
    );


    localStorage.removeItem(
      "loggedInUser"
    );


    localStorage.removeItem(
      "googleUser"
    );


    localStorage.removeItem(
      "rememberMe"
    );


    // -------------------------------------------------
    // IMPORTANT
    // -------------------------------------------------
    //
    // DO NOT REMOVE PROFILE PHOTO HERE.
    //
    // Because photo belongs to that user.
    //
    // When the same user logs in again,
    // their photo will come back.
    //
    // -------------------------------------------------


    navigate(
      "/login",
      {
        replace: true
      }
    );

  };


  // =====================================================
  // RESET DEMO ACCOUNT
  // =====================================================

  const resetDemoAccount = () => {

    const confirmReset =
      window.confirm(
        "Are you sure you want to reset your demo account to ₹1,00,000?"
      );


    if (!confirmReset) {

      return;

    }


    resetAccount();


    alert(
      "Demo account reset successfully!"
    );


    window.location.reload();

  };


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (value) => {

    return Number(value).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="account-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="account-header">

        <div>

          <h1>
            My Account
          </h1>

          <p>
            Manage your demo trading account
          </p>

        </div>


        <button
          className="account-back"
          onClick={() =>
            navigate(-1)
          }
        >

          ← Back

        </button>

      </div>



      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="account-profile-card">


        {/* =================================================
            PROFILE PHOTO
        ================================================= */}

        <div className="profile-photo-section">


          <div className="profile-avatar">

            {profilePhoto ? (

              <img
                src={profilePhoto}
                alt="Profile"
                className="profile-image"
              />

            ) : (

              <div className="default-profile-icon">

                👤

              </div>

            )}

          </div>


          {/* =================================================
              PHOTO BUTTONS
          ================================================= */}

          <div className="photo-buttons">


            {/* CHANGE PHOTO */}

            <label
              htmlFor="profilePhotoInput"
              className="change-photo-button"
            >

              📷 Change Photo

            </label>


            <input
              id="profilePhotoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{
                display: "none"
              }}
            />


            {/* REMOVE PHOTO */}

            {profilePhoto && (

              <button
                type="button"
                className="remove-photo-button"
                onClick={handleRemovePhoto}
              >

                Remove

              </button>

            )}

          </div>

        </div>



        {/* =================================================
            USER INFORMATION
        ================================================= */}

        <div className="profile-information">

          <h2>

            {userName}

          </h2>


          <p className="profile-email">

            📧 {userEmail}

          </p>


          <span className="profile-account-type">

            Demo Trading Account

          </span>

        </div>



        {/* =================================================
            ACTIVE STATUS
        ================================================= */}

        <div className="account-status">

          ● Active

        </div>

      </div>



      {/* =================================================
          AVAILABLE BALANCE
      ================================================= */}

      <div className="account-balance-grid">

        <div className="balance-card">

          <span>
            Available Balance
          </span>


          <strong>

            ₹{formatMoney(demoBalance)}

          </strong>


          <small>

            Virtual Money

          </small>

        </div>

      </div>



      {/* =================================================
          ACCOUNT MENU
      ================================================= */}

      <div className="account-section">

        <h2>
          Account
        </h2>


        <div className="account-menu-grid">


          {/* ORDERS */}

          <div
            className="account-menu-card"
            onClick={() =>
              navigate("/order")
            }
          >

            <div className="menu-icon">
              📋
            </div>

            <div>

              <h3>
                All Orders
              </h3>

              <p>
                View all your buy and sell orders
              </p>

            </div>

            <span>
              →
            </span>

          </div>



          {/* HOLDINGS */}

          <div
            className="account-menu-card"
            onClick={() =>
              navigate("/holding")
            }
          >

            <div className="menu-icon">
              📊
            </div>

            <div>

              <h3>
                Holdings
              </h3>

              <p>
                View your stocks and investments
              </p>

            </div>

            <span>
              →
            </span>

          </div>



          {/* POSITIONS */}

          <div
            className="account-menu-card"
            onClick={() =>
              navigate("/positions")
            }
          >

            <div className="menu-icon">
              📈
            </div>

            <div>

              <h3>
                Positions
              </h3>

              <p>
                View open trading positions
              </p>

            </div>

            <span>
              →
            </span>

          </div>



          {/* REPORTS */}

          <div
            className="account-menu-card"
            onClick={() =>
              navigate("/reports")
            }
          >

            <div className="menu-icon">
              📑
            </div>

            <div>

              <h3>
                Reports
              </h3>

              <p>
                View trading and investment reports
              </p>

            </div>

            <span>
              →
            </span>

          </div>



          {/* WATCHLIST */}

          <div
            className="account-menu-card"
            onClick={() =>
              navigate("/watchlist")
            }
          >

            <div className="menu-icon">
              ⭐
            </div>

            <div>

              <h3>
                Watchlist
              </h3>

              <p>
                Manage your favourite stocks
              </p>

            </div>

            <span>
              →
            </span>

          </div>



          {/* CUSTOMER SUPPORT */}

          <div
            className="account-menu-card support-card"
            onClick={() =>
              navigate("/support")
            }
          >

            <div className="menu-icon">
              💬
            </div>

            <div>

              <h3>
                24×7 Customer Support
              </h3>

              <p>
                Get help with your account and orders
              </p>

            </div>

            <span>
              →
            </span>

          </div>


        </div>

      </div>



      {/* =================================================
          SECURITY
      ================================================= */}

      <div className="security-card">

        <div>

          <h2>
            Account Security
          </h2>

          <p>
            Your account is protected with secure login.
          </p>

        </div>


        <button
          type="button"
        >

          🔐 Secure Account

        </button>

      </div>



      {/* =================================================
          RESET ACCOUNT
      ================================================= */}

      <div className="reset-section">

        <button
          type="button"
          className="reset-demo-button"
          onClick={resetDemoAccount}
        >

          🔄 Reset Demo Account

        </button>

      </div>



      {/* =================================================
          LOGOUT
      ================================================= */}

      <div className="logout-section">

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >

          🚪 Logout

        </button>

      </div>



      {/* =================================================
          DEMO NOTICE
      ================================================= */}

      <div className="demo-notice">

        <strong>
          Demo Account
        </strong>


        <p>

          ₹1,00,000 is virtual demo money
          for your project. It does not
          represent real funds or real
          trading activity.

        </p>

      </div>


    </div>

  );

};


export default Account;