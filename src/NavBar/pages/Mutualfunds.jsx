
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Mutualfunds.css";

function Mutualfunds() {

  const navigate = useNavigate();

  const [funds, setFunds] = useState([]);

  // ==============================
  // FETCH MUTUAL FUNDS
  // ==============================

  const fetchFunds = () => {

    fetch("http://localhost:3000/mutualFunds")

      .then(response => {

        if (!response.ok) {
          throw new Error("Failed to fetch mutual funds");
        }

        return response.json();

      })

      .then(data => {

        const updatedFunds = data.map(fund => {

          const randomChange =
            (Math.random() - 0.5) * 2;

          const newPrice =
            Number(
              (fund.price + randomChange).toFixed(2)
            );

          const percentage =
            Number(
              (
                ((newPrice - fund.price) /
                  fund.price) *
                100
              ).toFixed(2)
            );

          return {
            ...fund,
            price: newPrice,
            change: percentage
          };

        });

        setFunds(updatedFunds);

      })

      .catch(error => {

        console.error(
          "Mutual Fund API Error:",
          error
        );

      });

  };


  // ==============================
  // LIVE PRICE
  // ==============================

  useEffect(() => {

    fetchFunds();

    const interval =
      setInterval(() => {

        fetchFunds();

      }, 1000);

    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==============================
  // OPEN FUND DETAILS
  // ==============================

  const openFund = (symbol) => {

    navigate(`/mutual-funds/${symbol}`);

  };


  return (

    <div className="mutual-page">

      {/* HEADER */}

      <div className="mutual-header">

        <div>

          <h1>
            📈 Mutual Funds
          </h1>

          <p>
            Invest in mutual funds
          </p>

        </div>

        <div className="live-badge">
          ● LIVE
        </div>

      </div>


      {/* FUND LIST */}

      <div className="fund-list">

        {funds.map(fund => (

          <div
            className="fund-card"
            key={fund.id}
            onClick={() =>
              openFund(fund.symbol)
            }
          >

            {/* LOGO */}

            <div className="fund-logo">

              {fund.symbol.charAt(0)}

            </div>


            {/* NAME */}

            <div className="fund-info">

              <h3>
                {fund.symbol}
              </h3>

              <p>
                {fund.name}
              </p>

            </div>


            {/* PRICE */}

            <div className="fund-price">

              <span>
                NAV
              </span>

              <strong>
                ₹{Number(fund.price).toFixed(2)}
              </strong>

            </div>


            {/* CHANGE */}

            <div
              className={
                fund.change >= 0
                  ? "fund-change positive"
                  : "fund-change negative"
              }
            >

              {fund.change >= 0 ? "+" : ""}
              {fund.change}%

            </div>


            {/* BUTTON */}

            <button
              onClick={(e) => {

                e.stopPropagation();

                openFund(fund.symbol);

              }}
            >
              View
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Mutualfunds;

