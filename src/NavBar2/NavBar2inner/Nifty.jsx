
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

import "./Nifty.css";


const Nifty = () => {

  const navigate = useNavigate();


  // ==========================================
  // NIFTY
  // ==========================================

  const [niftyPrice, setNiftyPrice] =
    useState(24638.00);

  const [niftyChange, setNiftyChange] =
    useState(11.35);

  const [niftyPercentage, setNiftyPercentage] =
    useState(0.05);

  const [selectedPeriod, setSelectedPeriod] =
    useState("1D");

  const [chartData, setChartData] =
    useState([]);


  // ==========================================
  // NIFTY RELATED COMPANIES
  // ==========================================

  const initialStocks = [

    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      price: 1420.50
    },

    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 3450.20
    },

    {
      symbol: "INFY",
      name: "Infosys",
      price: 1650.75
    },

    {
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      price: 1780.30
    },

    {
      symbol: "ICICIBANK",
      name: "ICICI Bank",
      price: 1250.40
    },

    {
      symbol: "SBIN",
      name: "State Bank of India",
      price: 820.25
    },

    {
      symbol: "ITC",
      name: "ITC Limited",
      price: 465.80
    },

    {
      symbol: "LT",
      name: "Larsen & Toubro",
      price: 3620.50
    },

    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel",
      price: 1885.60
    },

    {
      symbol: "KOTAKBANK",
      name: "Kotak Mahindra Bank",
      price: 1920.45
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

    let price =
      Number(basePrice);

    const points = 30;


    for (let i = 0; i < points; i++) {

      const movement =
        (Math.random() - 0.5) *
        (basePrice * 0.004);


      price = Math.max(
        1,
        price + movement
      );


      let label;


      // -------------------------------
      // 1 DAY
      // -------------------------------

      if (period === "1D") {

        label =
          `${9 + Math.floor(i / 6)}:${String(
            (i * 10) % 60
          ).padStart(2, "0")}`;

      }


      // -------------------------------
      // 1 WEEK
      // -------------------------------

      else if (period === "1W") {

        label =
          `Day ${i + 1}`;

      }


      // -------------------------------
      // 1 MONTH
      // -------------------------------

      else if (period === "1M") {

        label =
          `Day ${i + 1}`;

      }


      // -------------------------------
      // 6 MONTHS
      // -------------------------------

      else if (period === "6M") {

        label =
          `Month ${i + 1}`;

      }


      // -------------------------------
      // 1 YEAR
      // -------------------------------

      else if (period === "1Y") {

        label =
          `Month ${i + 1}`;

      }


      // -------------------------------
      // 5 YEARS
      // -------------------------------

      else {

        label =
          `Year ${i + 1}`;

      }


      data.push({

        time: label,

        price:
          Number(
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
        24638,
        "1D"
      )
    );

  }, []);


  // ==========================================
  // FAKE LIVE PRICE UPDATE
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {


        // --------------------------------
        // NIFTY PRICE
        // --------------------------------

        setNiftyPrice(
          previousPrice => {

            const movement =
              (Math.random() - 0.5) *
              20;


            const newPrice =
              Math.max(
                1,
                previousPrice +
                movement
              );


            return Number(
              newPrice.toFixed(2)
            );

          }
        );


        // --------------------------------
        // NIFTY CHANGE
        // --------------------------------

        setNiftyChange(
          previousChange => {

            const movement =
              (Math.random() - 0.5) *
              3;


            return Number(
              (
                previousChange +
                movement
              ).toFixed(2)
            );

          }
        );


        // --------------------------------
        // NIFTY PERCENTAGE
        // --------------------------------

        setNiftyPercentage(
          previousPercentage => {

            const movement =
              (Math.random() - 0.5) *
              0.02;


            return Number(
              (
                previousPercentage +
                movement
              ).toFixed(2)
            );

          }
        );


        // --------------------------------
        // COMPANY PRICES
        // --------------------------------

        setStocks(
          previousStocks => {

            return previousStocks.map(
              stock => {

                const movement =
                  (Math.random() - 0.5) *
                  (stock.price * 0.002);


                const newPrice =
                  Math.max(
                    1,
                    stock.price +
                    movement
                  );


                const change =
                  (
                    (
                      newPrice -
                      stock.price
                    ) /
                    stock.price
                  ) * 100;


                return {

                  ...stock,

                  price:
                    Number(
                      newPrice.toFixed(2)
                    ),

                  change:
                    Number(
                      change.toFixed(2)
                    )

                };

              }
            );

          }
        );


        // --------------------------------
        // GRAPH UPDATE
        // --------------------------------

        setChartData(
          previousData => {

            const lastPrice =
              previousData.length > 0

                ? previousData[
                    previousData.length - 1
                  ].price

                : 24638;


            const movement =
              (Math.random() - 0.5) *
              20;


            const newPrice =
              Math.max(
                1,
                lastPrice +
                movement
              );


            const newPoint = {

              time:
                new Date()
                  .toLocaleTimeString(),

              price:
                Number(
                  newPrice.toFixed(2)
                )

            };


            return [

              ...previousData,

              newPoint

            ].slice(-30);

          }
        );


      }, 1000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // CHANGE GRAPH PERIOD
  // ==========================================

  const changePeriod = (
    period
  ) => {

    setSelectedPeriod(
      period
    );


    setChartData(
      generateChartData(
        niftyPrice,
        period
      )
    );

  };


  // ==========================================
  // OPEN COMPANY
  // ==========================================

  const openStock = (
    symbol
  ) => {

    navigate(
      `/stocks/${symbol}`
    );

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="nifty-container">


      {/* ==================================
          NIFTY MAIN CARD
      ================================== */}

      <div className="nifty-card">


        <div className="nifty-header">


          <div>

            <h1>
              NIFTY 50
            </h1>

            <p>
              NSE NIFTY 50 Index
            </p>

          </div>


          <div className="live-badge">

            ● LIVE

          </div>


        </div>


        {/* PRICE */}

        <h2>

          ₹
          {niftyPrice.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}

        </h2>


        {/* CHANGE */}

        <p
          className={
            niftyChange >= 0
              ? "green"
              : "red"
          }
        >

          {niftyChange >= 0
            ? "+"
            : ""}

          {niftyChange.toFixed(2)}

          {" "}

          (

          {niftyPercentage >= 0
            ? "+"
            : ""}

          {niftyPercentage.toFixed(2)}

          %)

        </p>


        {/* ==================================
            DETAILS
        ================================== */}

        <div className="nifty-details">


          <div className="detail-box">

            <h3>
              Open
            </h3>

            <p>
              24,610.25
            </p>

          </div>


          <div className="detail-box">

            <h3>
              High
            </h3>

            <p>
              24,690.80
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Low
            </h3>

            <p>
              24,580.40
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Previous Close
            </h3>

            <p>
              24,626.65
            </p>

          </div>


        </div>


      </div>


      {/* ==================================
          GRAPH
      ================================== */}

      <div className="nifty-chart-card">


        <div className="chart-header">


          <div>

            <h2>
              NIFTY 50 Chart
            </h2>

            <p>
              {selectedPeriod}
              {" "}
              price movement
            </p>

          </div>


          <div className="chart-live">

            ● LIVE

          </div>


        </div>


        {/* GRAPH */}

        <div className="nifty-chart">


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
                stroke="#16a34a"
                strokeWidth={3}
                dot={false}
                animationDuration={300}
              />


            </LineChart>


          </ResponsiveContainer>


        </div>


        {/* ==================================
            PERIOD BUTTONS
        ================================== */}

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


      {/* ==================================
          NIFTY RELATED COMPANIES
      ================================== */}

      <div className="nifty-stocks-card">


        <div className="stocks-header">


          <div>

            <h2>
              NIFTY 50 Related Companies
            </h2>

            <p>
              Selected companies for your demo
            </p>

          </div>


          <span>

            {stocks.length}
            {" "}
            Stocks

          </span>


        </div>


        {/* ==================================
            COMPANY LIST
        ================================== */}

        <div className="nifty-stock-list">


          {stocks.map(stock => (


            <div
              className="nifty-stock-item"
              key={stock.symbol}

              onClick={() =>
                openStock(
                  stock.symbol
                )
              }
            >


              {/* LOGO */}

              <div className="stock-logo">

                {stock.symbol.charAt(0)}

              </div>


              {/* COMPANY */}

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

                {(stock.change || 0)
                  .toFixed(2)}

                %

              </div>


              {/* ==================================
                  VIEW BUTTON
              ================================== */}

              <button
                className="view-button"

                onClick={(event) => {

                  event.stopPropagation();

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


export default Nifty;

