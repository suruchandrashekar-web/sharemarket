
import "./App.css";

import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// =====================================================
// NAVBARS
// =====================================================

import NavBar from "./NavBar/NavBar";
import NavBar2 from "./NavBar2/NavBar2";

// =====================================================
// FOOTER
// IMPORTANT:
// Footer only appears after successful login.
// =====================================================

import Footer from "./FooterPage/Footer";

// =====================================================
// LOGIN / SIGNUP / FORGOT / OTP / RESET PASSWORD
// =====================================================

import Login from "./Login/Login";
import Signup from "./Login/Sign";
import ForgotPassword from "./Login/Forget";
import OTP from "./Login/OTP";
import ResetPassword from "./Login/Password";

// =====================================================
// MAIN PAGES
// =====================================================

import Stocks from "./NavBar/Pages/Stocks";
import FO from "./NavBar/Pages/FO";
import Mutualfunds from "./NavBar/Pages/Mutualfunds";

// =====================================================
// INDEX PAGES
// =====================================================

import Bankex from "./NavBar2/NavBar2inner/Bankex";
import Banknifty from "./NavBar2/NavBar2inner/Banknifty";
import Finnifty from "./NavBar2/NavBar2inner/Finnifty";
import Midcpnifty from "./NavBar2/NavBar2inner/Midcpnifty";
import Nifty from "./NavBar2/NavBar2inner/Nifty";
import Sensex from "./NavBar2/NavBar2inner/Sensex";

// =====================================================
// OTHER PAGES
// =====================================================

import Explore from "./NavBar3/NavBar3inner/Explore";
import Holding from "./NavBar3/NavBar3inner/Holding";
import Order from "./NavBar3/NavBar3inner/Order";
import Positions from "./NavBar3/NavBar3inner/Positions";
import WatchList from "./NavBar3/NavBar3inner/WatchList";

// =====================================================
// DETAILS
// =====================================================

import StockDetails from "./NavBar/Pages/Stockdetails";
import MutualFundDetails from "./NavBar/Pages/Mutualsdetails";

// =====================================================
// ACCOUNT / REPORTS / SUPPORT
// =====================================================

import Account from "./NavBar/pages/Account";
import Reports from "./NavBar/pages/Report";
import Support from "./NavBar/pages/Support";

// =====================================================
// PROTECTED APPLICATION
// =====================================================

function ProtectedApp() {

  // ---------------------------------------------------
  // CHECK LOGIN
  // ---------------------------------------------------

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";


  // ---------------------------------------------------
  // USER NOT LOGGED IN
  // ---------------------------------------------------

  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ---------------------------------------------------
  // USER LOGGED IN
  // ---------------------------------------------------

  return (

    <div className="app-container">

      {/* =================================================
          NAVBAR
          Only after login
      ================================================= */}

      <NavBar />


      {/* =================================================
          NAVBAR 2
          Only after login
      ================================================= */}

      <NavBar2 />


      {/* =================================================
          APPLICATION ROUTES
      ================================================= */}

      <Routes>


        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Stocks />}
        />


        {/* =================================================
            STOCKS
        ================================================= */}

        <Route
          path="/stocks"
          element={<Stocks />}
        />


        {/* =================================================
            STOCK DETAILS
        ================================================= */}

        <Route
          path="/stocks/:symbol"
          element={<StockDetails />}
        />


        {/* =================================================
            F&O
        ================================================= */}

        <Route
          path="/fo"
          element={<FO />}
        />


        {/* =================================================
            MUTUAL FUNDS
        ================================================= */}

        <Route
          path="/mutual-funds"
          element={<Mutualfunds />}
        />


        {/* =================================================
            MUTUAL FUND DETAILS
        ================================================= */}

        <Route
          path="/mutual-funds/:symbol"
          element={<MutualFundDetails />}
        />


        {/* =================================================
            NIFTY
        ================================================= */}

        <Route
          path="/nifty"
          element={<Nifty />}
        />


        {/* =================================================
            SENSEX
        ================================================= */}

        <Route
          path="/sensex"
          element={<Sensex />}
        />


        {/* =================================================
            BANK NIFTY
        ================================================= */}

        <Route
          path="/banknifty"
          element={<Banknifty />}
        />


        {/* =================================================
            MIDCAP NIFTY
        ================================================= */}

        <Route
          path="/midcpnifty"
          element={<Midcpnifty />}
        />


        {/* =================================================
            FIN NIFTY
        ================================================= */}

        <Route
          path="/finnifty"
          element={<Finnifty />}
        />


        {/* =================================================
            BANKEX
        ================================================= */}

        <Route
          path="/bankex"
          element={<Bankex />}
        />


        {/* =================================================
            EXPLORE
        ================================================= */}

        <Route
          path="/explore"
          element={<Explore />}
        />


        {/* =================================================
            HOLDING
        ================================================= */}

        <Route
          path="/holding"
          element={<Holding />}
        />

        <Route
          path="/holdings"
          element={<Holding />}
        />


        {/* =================================================
            ORDERS
        ================================================= */}

        <Route
          path="/order"
          element={<Order />}
        />

        <Route
          path="/orders"
          element={<Order />}
        />


        {/* =================================================
            POSITIONS
        ================================================= */}

        <Route
          path="/positions"
          element={<Positions />}
        />

        <Route
          path="/position"
          element={<Positions />}
        />


        {/* =================================================
            WATCHLIST
        ================================================= */}

        <Route
          path="/watchlist"
          element={<WatchList />}
        />


        {/* =================================================
            ACCOUNT
        ================================================= */}

        <Route
          path="/account"
          element={<Account />}
        />


        {/* =================================================
            REPORTS
        ================================================= */}

        <Route
          path="/reports"
          element={<Reports />}
        />


        {/* =================================================
            24×7 CUSTOMER SUPPORT
        ================================================= */}

        <Route
          path="/support"
          element={<Support />}
        />


        {/* =================================================
            UNKNOWN APPLICATION URL
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>


      {/* =================================================
          FOOTER
          
          IMPORTANT:
          This Footer is inside ProtectedApp.
          Therefore it appears ONLY after login.
          
          Login / Signup / Forgot / OTP / Reset
          pages will NOT have this Footer.
      ================================================= */}

      <Footer />

    </div>

  );

}


// =====================================================
// MAIN APP
// =====================================================

function App() {

  return (

    <Routes>


      {/* =================================================
          ROOT URL

          http://localhost:5173/
          ↓
          /login
      ================================================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* =================================================
          LOGIN

          NO NAVBAR
          NO FOOTER
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =================================================
          SIGNUP

          NO NAVBAR
          NO FOOTER
      ================================================= */}

      <Route
        path="/signup"
        element={<Signup />}
      />


      {/* =================================================
          REGISTER

          NO NAVBAR
          NO FOOTER
      ================================================= */}

      <Route
        path="/register"
        element={<Signup />}
      />


      {/* =================================================
          FORGOT PASSWORD

          NO NAVBAR
          NO FOOTER
      ================================================= */}

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      {/* =================================================
          OTP

          NO NAVBAR
          NO FOOTER
      ================================================= */}

      <Route
        path="/otp"
        element={<OTP />}
      />


      {/* =================================================
          RESET PASSWORD

          NO NAVBAR
          NO FOOTER
      ================================================= */}

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =================================================
          PROTECTED APPLICATION

          LOGIN REQUIRED
          
          Navbar  ✅
          Navbar2 ✅
          Footer  ✅
      ================================================= */}

      <Route
        path="/*"
        element={<ProtectedApp />}
      />


    </Routes>

  );

}


export default App;

