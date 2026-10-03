import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./Banknifty.css";

const Banknifty = () => {

  const navigate = useNavigate();

  // ==========================================
  // BANK NIFTY DATA
  // ==========================================

  const [bankNiftyPrice, setBankNiftyPrice] =
    useState(58063.00);

  const [bankNiftyChange, setBankNiftyChange] =
    useState(323.35);

  const [bankNiftyPercentage, setBankNiftyPercentage] =
    useState(0.56);

  const [chartData, setChartData] =
    useState([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState("1D");


  // ==========================================
  // BANK NIFTY RELATED COMPANIES
  // ==========================================

  const initialStocks = [

    {
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      price: 2015.40
    },

    {
      symbol: "ICICIBANK",
      name: "ICICI Bank",
      price: 1425.80
    },

    {
      symbol: "SBIN",
      name: "State Bank of India",
      price: 875.65
    },

    {
      symbol: "AXISBANK",
      name: "Axis Bank",
      price: 1185.30
    },

    {
      symbol: "KOTAKBANK",
      name: "Kotak Mahindra Bank",
      price: 2045.20
    },

    {
      symbol: "INDUSINDBK",
      name: "IndusInd Bank",
      price: 985.40
    },

    {
      symbol: "BANKBARODA",
      name: "Bank of Baroda",
      price: 245.60
    },

    {
      symbol: "PNB",
      name: "Punjab National Bank",
      price: 118.75
    },

    {
      symbol: "CANBK",
      name: "Canara Bank",
      price: 118.40
    },

    {
      symbol: "IDFCFIRSTB",
      name: "IDFC First Bank",
      price: 78.50
    },

    {
      symbol: "FEDERALBNK",
      name: "Federal Bank",
      price: 198.30
    },

    {
      symbol: "AUBANK",
      name: "AU Small Finance Bank",
      price: 725.60
    },

    {
      symbol: "BANDHANBNK",
      name: "Bandhan Bank",
      price: 175.40
    },

    {
      symbol: "BANKINDIA",
      name: "Bank of India",
      price: 108.25
    },

    {
      symbol: "INDIANB",
      name: "Indian Bank",
      price: 620.50
    }

  ];


  const [stocks, setStocks] =
    useState(initialStocks);


  // ==========================================
  // GENERATE CHART DATA
  // ==========================================

  const generateChartData = (
    basePrice,
    period
  ) => {

    const data = [];

    let price = Number(basePrice);

    const points = 30;

    for (let i = 0; i < points; i++) {

      const movement =
        (Math.random() - 0.5) *
        (basePrice * 0.004);

      price =
        Math.max(
          1,
          price + movement
        );

      let label;

      if (period === "1D") {

        label =
          `${9 + Math.floor(i / 6)}:${String(
            (i * 10) % 60
          ).padStart(2, "0")}`;

      }

      else if (period === "1W") {

        label = `Day ${i + 1}`;

      }

      else if (period === "1M") {

        label = `Day ${i + 1}`;

      }

      else if (period === "6M") {

        label = `Month ${i + 1}`;

      }

      else if (period === "1Y") {

        label = `Month ${i + 1}`;

      }

      else {

        label = `Year ${i + 1}`;

      }


      data.push({

        time: label,

        price: Number(
          price.toFixed(2)
        )

      });

    }

    return data;
  };


  // ==========================================
  // INITIAL GRAPH
  // ==========================================

  useEffect(() => {

    setChartData(
      generateChartData(
        58063.00,
        "1D"
      )
    );

  }, []);


  // ==========================================
  // LIVE PRICE UPDATE
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        // ==============================
        // BANK NIFTY PRICE
        // ==============================

        setBankNiftyPrice(previous => {

          const movement =
            (Math.random() - 0.5) * 30;

          return Number(
            Math.max(
              1,
              previous + movement
            ).toFixed(2)
          );

        });


        // ==============================
        // CHANGE
        // ==============================

        setBankNiftyChange(previous => {

          const movement =
            (Math.random() - 0.5) * 5;

          return Number(
            (previous + movement)
              .toFixed(2)
          );

        });


        // ==============================
        // PERCENTAGE
        // ==============================

        setBankNiftyPercentage(previous => {

          const movement =
            (Math.random() - 0.5) * 0.03;

          return Number(
            (previous + movement)
              .toFixed(2)
          );

        });


        // ==============================
        // COMPANY PRICES
        // ==============================

        setStocks(previousStocks => {

          return previousStocks.map(stock => {

            const movement =
              (Math.random() - 0.5) *
              (stock.price * 0.002);

            const newPrice =
              Math.max(
                1,
                stock.price + movement
              );

            const change =
              (
                (newPrice - stock.price) /
                stock.price
              ) * 100;


            return {

              ...stock,

              price: Number(
                newPrice.toFixed(2)
              ),

              change: Number(
                change.toFixed(2)
              )

            };

          });

        });


        // ==============================
        // UPDATE GRAPH
        // ==============================

        setChartData(previousData => {

          const newPoint = {

            time:
              new Date()
                .toLocaleTimeString(),

            price:
              bankNiftyPrice

          };


          return [

            ...previousData,

            newPoint

          ].slice(-30);

        });


      }, 1000);


    return () => {

      clearInterval(interval);

    };

  }, [bankNiftyPrice]);


  // ==========================================
  // CHANGE PERIOD
  // ==========================================

  const changePeriod = (period) => {

    setSelectedPeriod(period);

    setChartData(
      generateChartData(
        bankNiftyPrice,
        period
      )
    );

  };


  // ==========================================
  // OPEN COMPANY
  // ==========================================

  const openStock = (symbol) => {

    navigate(
      `/stocks/${symbol}`
    );

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="banknifty-container">


      {/* =====================================
          MAIN BANK NIFTY CARD
      ===================================== */}

      <div className="banknifty-card">

        <div className="banknifty-header">

          <div>

            <h1>
              BANK NIFTY
            </h1>

            <p>
              NIFTY Bank Index
            </p>

          </div>


          <div className="live-badge">

            ● LIVE

          </div>

        </div>


        <h2>

          ₹
          {bankNiftyPrice.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}

        </h2>


        <p
          className={
            bankNiftyChange >= 0
              ? "green"
              : "red"
          }
        >

          {bankNiftyChange >= 0
            ? "+"
            : ""}

          {bankNiftyChange.toFixed(2)}

          {" "}

          (
          {bankNiftyPercentage >= 0
            ? "+"
            : ""}

          {bankNiftyPercentage.toFixed(2)}
          %)

        </p>


        {/* DETAILS */}

        <div className="banknifty-details">

          <div className="detail-box">

            <h3>
              Open
            </h3>

            <p>
              ₹57,850.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              High
            </h3>

            <p>
              ₹58,120.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Low
            </h3>

            <p>
              ₹57,690.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Previous Close
            </h3>

            <p>
              ₹57,739.65
            </p>

          </div>

        </div>

      </div>


      {/* =====================================
          GRAPH
      ===================================== */}

      <div className="banknifty-chart-card">

        <div className="chart-header">

          <div>

            <h2>
              BANK NIFTY Chart
            </h2>

            <p>
              {selectedPeriod} price movement
            </p>

          </div>


          <div className="chart-live">

            ● LIVE

          </div>

        </div>


        <div className="banknifty-chart">

          <ResponsiveContainer
            width="100%"
            height={450}
          >

            <LineChart
              data={chartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="time"
              />

              <YAxis
                domain={[
                  "auto",
                  "auto"
                ]}
              />

              <Tooltip />


              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
                animationDuration={300}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>


        {/* PERIOD BUTTONS */}

        <div className="period-buttons">

          {[
            "1D",
            "1W",
            "1M",
            "6M",
            "1Y",
            "5Y"
          ].map(period => (

            <button
              key={period}

              className={
                selectedPeriod === period
                  ? "active"
                  : ""
              }

              onClick={() =>
                changePeriod(period)
              }
            >

              {period}

            </button>

          ))}

        </div>

      </div>


      {/* =====================================
          BANK NIFTY COMPANIES
      ===================================== */}

      <div className="banknifty-stocks-card">

        <div className="stocks-header">

          <div>

            <h2>
              BANK NIFTY Related Companies
            </h2>

            <p>
              Banking companies and live prices
            </p>

          </div>


          <span>
            {stocks.length} Stocks
          </span>

        </div>


        <div className="banknifty-stock-list">

          {stocks.map(stock => (

            <div
              className="banknifty-stock-item"
              key={stock.symbol}

              onClick={() =>
                openStock(stock.symbol)
              }
            >


              {/* LOGO */}

              <div className="stock-logo">

                {stock.symbol.charAt(0)}

              </div>


              {/* NAME */}

              <div className="stock-name">

                <h3>
                  {stock.symbol}
                </h3>

                <p>
                  {stock.name}
                </p>

              </div>


              {/* PRICE */}

              <div className="stock-price">

                <span>
                  PRICE
                </span>

                <strong>

                  ₹
                  {stock.price.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }
                  )}

                </strong>

              </div>


              {/* CHANGE */}

              <div
                className={
                  stock.change >= 0
                    ? "stock-change green"
                    : "stock-change red"
                }
              >

                {stock.change >= 0
                  ? "+"
                  : ""}

                {(stock.change || 0).toFixed(2)}
                %

              </div>


              {/* VIEW BUTTON */}

              <button
                className="view-button"

                onClick={(e) => {

                  e.stopPropagation();

                  openStock(
                    stock.symbol
                  );

                }}
              >

                View

              </button>


            </div>

          ))}

        </div>

      </div>


    </div>

  );

};

export default Banknifty;