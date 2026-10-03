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

import "./Midcpnifty.css";

const Midcpnifty = () => {

  const navigate = useNavigate();

  // ==========================================
  // MIDCP NIFTY DATA
  // ==========================================

  const [midcapPrice, setMidcapPrice] =
    useState(14812.60);

  const [midcapChange, setMidcapChange] =
    useState(-67.75);

  const [midcapPercentage, setMidcapPercentage] =
    useState(-0.45);

  const [chartData, setChartData] =
    useState([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState("1D");


  // ==========================================
  // RELATED MIDCAP COMPANIES
  // ==========================================

  const initialStocks = [

    {
      symbol: "BSE",
      name: "BSE Limited",
      price: 2450.50
    },

    {
      symbol: "SUZLON",
      name: "Suzlon Energy",
      price: 68.25
    },

    {
      symbol: "HEROMOTOCO",
      name: "Hero MotoCorp",
      price: 5850.40
    },

    {
      symbol: "INDUSINDBK",
      name: "IndusInd Bank",
      price: 985.40
    },

    {
      symbol: "AUBANK",
      name: "AU Small Finance Bank",
      price: 765.30
    },

    {
      symbol: "POLICYBZR",
      name: "PB Fintech",
      price: 1825.60
    },

    {
      symbol: "LUPIN",
      name: "Lupin",
      price: 2150.75
    },

    {
      symbol: "INDUSTOWER",
      name: "Indus Towers",
      price: 420.30
    },

    {
      symbol: "PERSISTENT",
      name: "Persistent Systems",
      price: 5850.20
    },

    {
      symbol: "BHEL",
      name: "Bharat Heavy Electricals",
      price: 285.45
    },

    {
      symbol: "DIXON",
      name: "Dixon Technologies",
      price: 13550.80
    },

    {
      symbol: "COFORGE",
      name: "Coforge",
      price: 1685.40
    },

    {
      symbol: "CUMMINSIND",
      name: "Cummins India",
      price: 4250.60
    },

    {
      symbol: "HDFCAMC",
      name: "HDFC Asset Management",
      price: 4850.25
    },

    {
      symbol: "MAXHEALTH",
      name: "Max Healthcare",
      price: 1125.70
    },

    {
      symbol: "MPHASIS",
      name: "Mphasis",
      price: 3150.40
    },

    {
      symbol: "SRF",
      name: "SRF Limited",
      price: 2650.50
    },

    {
      symbol: "COLPAL",
      name: "Colgate-Palmolive",
      price: 2850.30
    },

    {
      symbol: "PAGEIND",
      name: "Page Industries",
      price: 42500.60
    },

    {
      symbol: "VOLTAS",
      name: "Voltas",
      price: 1250.40
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
        14812.60,
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

        // MIDCAP PRICE

        setMidcapPrice(previous => {

          const movement =
            (Math.random() - 0.5) * 15;

          return Number(
            Math.max(
              1,
              previous + movement
            ).toFixed(2)
          );

        });


        // CHANGE

        setMidcapChange(previous => {

          const movement =
            (Math.random() - 0.5) * 4;

          return Number(
            (previous + movement)
              .toFixed(2)
          );

        });


        // PERCENTAGE

        setMidcapPercentage(previous => {

          const movement =
            (Math.random() - 0.5) * 0.03;

          return Number(
            (previous + movement)
              .toFixed(2)
          );

        });


        // ==================================
        // UPDATE STOCK PRICES
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

            price:
              midcapPrice

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

  }, [midcapPrice]);


  // ==========================================
  // CHANGE GRAPH PERIOD
  // ==========================================

  const changePeriod = (period) => {

    setSelectedPeriod(period);

    setChartData(
      generateChartData(
        midcapPrice,
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

    <div className="midcpnifty-container">


      {/* ======================================
          MAIN CARD
      ====================================== */}

      <div className="midcpnifty-card">

        <div className="midcpnifty-header">

          <div>

            <h1>
              MIDCP NIFTY
            </h1>

            <p>
              Nifty Midcap Select Index
            </p>

          </div>


          <div className="live-badge">

            ● LIVE

          </div>

        </div>


        <h2>

          {midcapPrice.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}

        </h2>


        <p
          className={
            midcapChange >= 0
              ? "green"
              : "red"
          }
        >

          {midcapChange >= 0
            ? "+"
            : ""}

          {midcapChange.toFixed(2)}

          {" "}

          (

          {midcapPercentage >= 0
            ? "+"
            : ""}

          {midcapPercentage.toFixed(2)}

          %)

        </p>


        {/* DETAILS */}

        <div className="midcpnifty-details">

          <div className="detail-box">

            <h3>
              Open
            </h3>

            <p>
              14,860.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              High
            </h3>

            <p>
              14,905.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Low
            </h3>

            <p>
              14,780.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Previous Close
            </h3>

            <p>
              14,880.35
            </p>

          </div>

        </div>

      </div>


      {/* ======================================
          GRAPH
      ====================================== */}

      <div className="midcpnifty-chart-card">

        <div className="chart-header">

          <div>

            <h2>
              MIDCP NIFTY Chart
            </h2>

            <p>
              {selectedPeriod} price movement
            </p>

          </div>


          <div className="chart-live">

            ● LIVE

          </div>

        </div>


        <div className="midcpnifty-chart">

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


      {/* ======================================
          RELATED COMPANIES
      ====================================== */}

      <div className="midcpnifty-stocks-card">

        <div className="stocks-header">

          <div>

            <h2>
              MIDCP NIFTY Companies
            </h2>

            <p>
              Related Midcap Select companies
            </p>

          </div>


          <span>
            25 Stocks
          </span>

        </div>


        <div className="midcpnifty-stock-list">

          {stocks.map(stock => (

            <div
              className="midcpnifty-stock-item"
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

export default Midcpnifty;