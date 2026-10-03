
import React from "react";
import { useNavigate } from "react-router-dom";

import "./Explore.css";

const Explore = () => {

  const navigate = useNavigate();

  return (

    <div className="explore">

      <h1>Explore</h1>

      <p>
        Discover Stocks, Mutual Funds, ETFs, IPOs and more.
      </p>


      <div className="explore-cards">


        {/* ==============================
            STOCKS
        ============================== */}

        <div
          className="card"
          onClick={() => navigate("/stocks")}
        >

          <h3>
            Stocks
          </h3>

          <p>
            Explore top-performing stocks.
          </p>

        </div>


        {/* ==============================
            MUTUAL FUNDS
        ============================== */}

        <div
          className="card"
          onClick={() => navigate("/mutual-funds")}
        >

          <h3>
            Mutual Funds
          </h3>

          <p>
            Invest in the best mutual funds.
          </p>

        </div>


        {/* ==============================
            ETFs
        ============================== */}

        <div
          className="card"
          onClick={() => alert("ETF page coming soon")}
        >

          <h3>
            ETFs
          </h3>

          <p>
            Low-cost exchange traded funds.
          </p>

        </div>


        {/* ==============================
            IPO
        ============================== */}

        <div
          className="card"
          onClick={() => alert("IPO page coming soon")}
        >

          <h3>
            IPOs
          </h3>

          <p>
            Check the latest IPO listings.
          </p>

        </div>


      </div>

    </div>

  );

};

export default Explore;

