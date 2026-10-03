import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavBar = () => {

  const location = useLocation();
  const navigate = useNavigate();

  // ==============================
  // SEARCH
  // ==============================

  const [searchText, setSearchText] = useState("");
  const [stocks, setStocks] = useState([]);
  const [mutualFunds, setMutualFunds] = useState([]);

  // ==============================
  // FETCH STOCKS
  // ==============================

  useEffect(() => {

    fetch("http://localhost:3000/stocks")
      .then(response => response.json())
      .then(data => {
        setStocks(data);
      })
      .catch(error => {
        console.error("Stock API Error:", error);
      });

  }, []);

  // ==============================
  // FETCH MUTUAL FUNDS
  // ==============================

  useEffect(() => {

    fetch("http://localhost:3000/mutualFunds")
      .then(response => response.json())
      .then(data => {
        setMutualFunds(data);
      })
      .catch(error => {
        console.error("Mutual Fund API Error:", error);
      });

  }, []);

  // ==============================
  // SEARCH RESULTS
  // ==============================

  const searchResults = [

    ...stocks.map(stock => ({
      ...stock,
      type: "stock"
    })),

    ...mutualFunds.map(fund => ({
      ...fund,
      type: "mutualFund"
    }))

  ].filter(item => {

    const text = searchText.toLowerCase().trim();

    if (!text) {
      return false;
    }

    return (
      item.name?.toLowerCase().includes(text) ||
      item.symbol?.toLowerCase().includes(text)
    );

  }).slice(0, 8);

  // ==============================
  // OPEN SEARCH RESULT
  // ==============================

  const openSearchResult = (item) => {

    setSearchText("");

    if (item.type === "stock") {

      navigate(`/stocks/${item.symbol}`);

    } else {

      navigate(`/mutual-funds/${item.symbol}`);

    }

  };

  // ==============================
  // OPEN ACCOUNT
  // ==============================

  const openAccount = () => {

    navigate("/account");

  };

  return (

    <nav className="navbar">

      {/* =========================
          LEFT SIDE
      ========================== */}

      <div className="navbar-left">

        <h1 className="logo">
         TradeX
        </h1>

        <Link to="/stocks">
          Stocks
        </Link>

        <Link to="/fo">
          F&O
        </Link>

        <Link to="/mutual-funds">
          Mutual Funds
        </Link>

      </div>


      {/* =========================
          CENTER SEARCH
      ========================== */}

      <div className="navbar-center">

        <div className="search-container">

          <input
            type="text"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
            placeholder="Search stocks, mutual funds..."
          />


          {/* =========================
              SEARCH RESULTS
          ========================== */}

          {searchText.trim() !== "" &&
            searchResults.length > 0 && (

              <div className="search-results">

                {searchResults.map(item => (

                  <div
                    key={`${item.type}-${item.id}`}
                    className="search-result-item"
                    onClick={() =>
                      openSearchResult(item)
                    }
                  >

                    {/* SYMBOL */}

                    <div className="search-logo">

                      {item.symbol?.charAt(0)}

                    </div>


                    {/* NAME */}

                    <div className="search-info">

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.symbol}
                      </span>

                    </div>


                    {/* TYPE */}

                    <small>

                      {item.type === "stock"
                        ? "Stock"
                        : "Mutual Fund"}

                    </small>

                  </div>

                ))}

              </div>

            )}


          {/* =========================
              NO RESULT
          ========================== */}

          {searchText.trim() !== "" &&
            searchResults.length === 0 && (

              <div className="search-results no-result">

                No stock or mutual fund found

              </div>

            )}

        </div>

      </div>


      {/* =========================
          RIGHT SIDE
      ========================== */}

      <div className="navbar-right">


        {/* =========================
            F&O
        ========================== */}

        {location.pathname === "/fo" && (

          <>

            <Link to="/explore">
              Explore
            </Link>

            <Link to="/order">
              Order
            </Link>

            <Link to="/position">
              Positions
            </Link>

          </>

        )}


        {/* =========================
            STOCKS
        ========================== */}

        {location.pathname === "/stocks" && (

          <>

            <Link to="/explore">
              Explore
            </Link>

            <Link to="/holding">
              Holding
            </Link>

            <Link to="/order">
              Order
            </Link>

            <Link to="/position">
              Positions
            </Link>

            <Link to="/watchlist">
              WatchList
            </Link>

          </>

        )}


        {/* =========================
            MUTUAL FUNDS
        ========================== */}

        {location.pathname === "/mutual-funds" && (

          <>

            <Link to="/explore">
              Explore
            </Link>

            <Link to="/holding">
              Dashboard
            </Link>

            <Link to="/order">
              Orders
            </Link>

            <Link to="/watchlist">
              WatchList
            </Link>

          </>

        )}


        {/* =========================
            PROFILE / ACCOUNT
        ========================== */}

        <div
          className="profile"
          onClick={openAccount}
          title="My Account"
        >

          👤

        </div>


      </div>

    </nav>

  );

};

export default NavBar;