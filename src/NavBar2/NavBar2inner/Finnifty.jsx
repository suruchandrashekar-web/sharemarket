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

import "./Finnifty.css";

const Finnifty = () => {

  const navigate = useNavigate();

  // ==========================================
  // FIN NIFTY DATA
  // ==========================================

  const [finniftyPrice, setFinniftyPrice] =
    useState(26638.00);

  const [finniftyChange, setFinniftyChange] =
    useState(19.65);

  const [finniftyPercentage, setFinniftyPercentage] =
    useState(0.07);

  const [chartData, setChartData] =
    useState([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState("1D");


  // ==========================================
  // FIN NIFTY RELATED COMPANIES
  // ==========================================

  const initialStocks = [

    {
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      price: 720.30
    },

    {
      symbol: "ICICIBANK",
      name: "ICICI Bank",
      price: 1422.80
    },

    {
      symbol: "SBIN",
      name: "State Bank of India",
      price: 985.50
    },

    {
      symbol: "BAJFINANCE",
      name: "Bajaj Finance",
      price: 9850.60
    },

    {
      symbol: "KOTAKBANK",
      name: "Kotak Mahindra Bank",
      price: 2045.20
    },

    {
      symbol: "AXISBANK",
      name: "Axis Bank",
      price: 1185.30
    },

    {
      symbol: "BAJAJFINSV",
      name: "Bajaj Finserv",
      price: 2050.45
    },

    {
      symbol: "SHRIRAMFIN",
      name: "Shriram Finance",
      price: 2650.75
    },

    {
      symbol: "SBILIFE",
      name: "SBI Life Insurance",
      price: 1785.40
    },

    {
      symbol: "CHOLAFIN",
      name: "Cholamandalam Investment",
      price: 1485.60
    },

    {
      symbol: "JIOFIN",
      name: "Jio Financial Services",
      price: 325.40
    },

    {
      symbol: "BSE",
      name: "BSE Limited",
      price: 2950.80
    },

    {
      symbol: "MUTHOOTFIN",
      name: "Muthoot Finance",
      price: 2485.50
    },

    {
      symbol: "HDFCLIFE",
      name: "HDFC Life Insurance",
      price: 735.60
    },

    {
      symbol: "PFC",
      name: "Power Finance Corporation",
      price: 450.25
    },

    {
      symbol: "RECLTD",
      name: "REC Limited",
      price: 385.40
    },

    {
      symbol: "ICICIGI",
      name: "ICICI Lombard",
      price: 1850.20
    },

    {
      symbol: "SBICARD",
      name: "SBI Cards",
      price: 920.30
    },

    {
      symbol: "MFSL",
      name: "Max Financial Services",
      price: 1250.60
    }

  ];


  const [stocks, setStocks] =
    useState(initialStocks);


  // ==========================================
  // GENERATE GRAPH
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
        26638.00,
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

        // FIN NIFTY PRICE

        setFinniftyPrice(previous => {

          const movement =
            (Math.random() - 0.5) * 20;

          return Number(
            Math.max(
              1,
              previous + movement
            ).toFixed(2)
          );

        });


        // CHANGE

        setFinniftyChange(previous => {

          const movement =
            (Math.random() - 0.5) * 2;

          return Number(
            (previous + movement)
              .toFixed(2)
          );

        });


        // PERCENTAGE

        setFinniftyPercentage(previous => {

          const movement =
            (Math.random() - 0.5) * 0.02;

          return Number(
            (previous + movement)
              .toFixed(2)
          );

        });


        // ==================================
        // UPDATE COMPANY PRICES
        // ==================================

        setStocks(previousStocks => {

          return previousStocks.map(
            stock => {

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

            }
          );

        });


        // ==================================
        // UPDATE GRAPH
        // ==================================

        setChartData(previousData => {

          const newPoint = {

            time:
              new Date()
                .toLocaleTimeString(),

            price: finniftyPrice

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

  }, [finniftyPrice]);


  // ==========================================
  // CHANGE PERIOD
  // ==========================================

  const changePeriod = (period) => {

    setSelectedPeriod(period);

    setChartData(
      generateChartData(
        finniftyPrice,
        period
      )
    );

  };


  // ==========================================
  // OPEN STOCK
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

    <div className="finnifty-container">


      {/* =====================================
          FIN NIFTY MAIN CARD
      ===================================== */}

      <div className="finnifty-card">

        <div className="finnifty-header">

          <div>

            <h1>
              FIN NIFTY
            </h1>

            <p>
              NIFTY Financial Services Index
            </p>

          </div>


          <div className="live-badge">

            ● LIVE

          </div>

        </div>


        <h2>

          {finniftyPrice.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}

        </h2>


        <p
          className={
            finniftyChange >= 0
              ? "green"
              : "red"
          }
        >

          {finniftyChange >= 0
            ? "+"
            : ""}

          {finniftyChange.toFixed(2)}

          {" "}

          (

          {finniftyPercentage >= 0
            ? "+"
            : ""}

          {finniftyPercentage.toFixed(2)}

          %)

        </p>


        {/* ==================================
            DETAILS
        ================================== */}

        <div className="finnifty-details">

          <div className="detail-box">

            <h3>
              Open
            </h3>

            <p>
              26,600.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              High
            </h3>

            <p>
              26,700.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Low
            </h3>

            <p>
              26,520.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Previous Close
            </h3>

            <p>
              26,618.35
            </p>

          </div>

        </div>

      </div>


      {/* =====================================
          GRAPH
      ===================================== */}

      <div className="finnifty-chart-card">

        <div className="chart-header">

          <div>

            <h2>
              FIN NIFTY Chart
            </h2>

            <p>
              {selectedPeriod} price movement
            </p>

          </div>


          <div className="chart-live">

            ● LIVE

          </div>

        </div>


        <div className="finnifty-chart">

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
          RELATED COMPANIES
      ===================================== */}

      <div className="finnifty-stocks-card">

        <div className="stocks-header">

          <div>

            <h2>
              FIN NIFTY Companies
            </h2>

            <p>
              Financial services companies
            </p>

          </div>


          <span>
            19 Companies
          </span>

        </div>


        <div className="finnifty-stock-list">

          {stocks.map(stock => (

            <div
              className="finnifty-stock-item"
              key={stock.symbol}
              onClick={() =>
                openStock(stock.symbol)
              }
            >


              {/* LOGO */}

              <div className="stock-logo">

                {stock.symbol.charAt(0)}

              </div>


              {/* COMPANY NAME */}

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
                  Price
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

export default Finnifty;