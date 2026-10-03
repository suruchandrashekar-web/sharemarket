
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Stocks.css";

function Stocks() {

  const [stocks, setStocks] = useState([]);

  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();


  // =========================================
  // FETCH STOCKS
  // =========================================

  const fetchStocks = () => {

    fetch( "https://sharemarket-da04.onrender.com/stocks")

      .then(response => {

        if (!response.ok) {
          throw new Error("Failed to fetch stocks");
        }

        return response.json();

      })

      .then(data => {

        const updatedData = data.map(stock => {

          const randomChange =
            (Math.random() - 0.5) * 10;

          const newPrice =
            Number(
              (stock.price + randomChange).toFixed(2)
            );

          const newPercentage =
            Number(
              (
                ((newPrice - stock.price) /
                  stock.price) *
                100
              ).toFixed(2)
            );

          return {
            ...stock,
            price: newPrice,
            percentage: newPercentage
          };

        });

        setStocks(updatedData);

      })

      .catch(error => {

        console.error(
          "API Error:",
          error
        );

      });

  };


  // =========================================
  // USE EFFECT
  // =========================================

  useEffect(() => {

    fetchStocks();

    const interval =
      setInterval(() => {

        fetchStocks();

      }, 1000);

    return () => {

      clearInterval(interval);

    };

  }, []);


  // =========================================
  // TOP GAINERS
  // =========================================

  const topGainers = [...stocks]
    .filter(stock => stock.percentage > 0)
    .sort(
      (a, b) =>
        b.percentage - a.percentage
    )
    .slice(0, 4);


  // =========================================
  // TOP LOSERS
  // =========================================

  const topLosers = [...stocks]
    .filter(stock => stock.percentage < 0)
    .sort(
      (a, b) =>
        a.percentage - b.percentage
    )
    .slice(0, 4);


  // =========================================
  // STOCK CARD
  // =========================================

  const StockCard = ({ stock }) => (

    <div
      className="stock-card"

      key={stock.symbol}

      onClick={() =>
        navigate(
          `/stocks/${stock.symbol}`
        )
      }
    >

      <div className="stock-top">

        <div className="stock-logo">

          {stock.symbol.substring(0, 1)}

        </div>

        <div>

          <h3>
            {stock.symbol}
          </h3>

          <p>
            {stock.name}
          </p>

        </div>

      </div>


      <div className="stock-price">

        ₹{stock.price.toFixed(2)}

      </div>


      <div>

        <span
          className={
            stock.percentage >= 0
              ? "change positive"
              : "change negative"
          }
        >

          {stock.percentage >= 0
            ? "+"
            : ""}

          {stock.percentage}%

        </span>

      </div>


      <div className="view-stock">

        View Details →

      </div>

    </div>

  );


  // =========================================
  // ALL STOCKS
  // =========================================

  const allStocksToShow = showAll
    ? stocks
    : stocks.slice(0, 8);


  // =========================================
  // RETURN
  // =========================================

  return (

    <div className="app">


      {/* =====================================
          HEADER
      ===================================== */}

      <header className="market-header">

        <div>

          <h1>
            📈 ShareMarket
          </h1>

          <p>
            Indian Stock Market
          </p>

        </div>


        <div className="market-status">

          <span className="status-dot"></span>

          Market Open

        </div>

      </header>



      {/* =====================================
          DASHBOARD
      ===================================== */}

      <div className="dashboard">

        <div className="dashboard-card">

          <span>
            Market Status
          </span>

          <strong>
            OPEN
          </strong>

        </div>


        <div className="dashboard-card">

          <span>
            Stocks
          </span>

          <strong>
            {stocks.length}
          </strong>

        </div>


        <div className="dashboard-card">

          <span>
            Live Updates
          </span>

          <strong>
            1 Sec
          </strong>

        </div>

      </div>



      {/* =====================================
          TOP GAINERS
      ===================================== */}

      <section className="stock-section">

        <div className="section-title">

          <div>

            <h2>
              🟢 Top Gainers
            </h2>

            <p>
              Best performing stocks
            </p>

          </div>

        </div>


        <div className="stock-container">

          {topGainers.map(stock => (

            <StockCard
              key={stock.symbol}
              stock={stock}
            />

          ))}

        </div>

      </section>



      {/* =====================================
          TOP LOSERS
      ===================================== */}

      <section className="stock-section">

        <div className="section-title">

          <div>

            <h2>
              🔴 Top Losers
            </h2>

            <p>
              Worst performing stocks
            </p>

          </div>

        </div>


        <div className="stock-container">

          {topLosers.map(stock => (

            <StockCard
              key={stock.symbol}
              stock={stock}
            />

          ))}

        </div>

      </section>



      {/* =====================================
          ALL STOCKS
      ===================================== */}

      <section className="stock-section">

        <div className="section-title">

          <div>

            <h2>
              📊 All Stocks
            </h2>

            <p>
              Browse all available stocks
            </p>

          </div>

        </div>


        <div className="stock-container">

          {allStocksToShow.map(stock => (

            <StockCard
              key={stock.symbol}
              stock={stock}
            />

          ))}

        </div>


        {/* =================================
            SHOW ALL BUTTON
        ================================= */}

        {stocks.length > 8 && (

          <div className="show-all-container">

            <button
              className="show-all-button"

              onClick={() =>
                setShowAll(!showAll)
              }
            >

              {showAll
                ? "Show Less ↑"
                : `Show All Stocks (${stocks.length}) ↓`}

            </button>

          </div>

        )}

      </section>


    </div>

  );

}

export default Stocks;

