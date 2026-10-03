
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

import "./Sensex.css";

const Sensex = () => {

  const navigate = useNavigate();

  // ==========================================
  // SENSEX
  // ==========================================

  const [sensexPrice, setSensexPrice] = useState(78954.76);

  const [sensexChange, setSensexChange] = useState(337.76);

  const [sensexPercentage, setSensexPercentage] = useState(0.48);

  const [selectedPeriod, setSelectedPeriod] = useState("1D");

  const [chartData, setChartData] = useState([]);


  // ==========================================
  // SENSEX RELATED COMPANIES
  // Demo prices
  // ==========================================

  const initialStocks = [

    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      price: 1385.50
    },

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
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 3245.60
    },

    {
      symbol: "INFY",
      name: "Infosys",
      price: 1510.70
    },

    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel",
      price: 1850.25
    },

    {
      symbol: "LT",
      name: "Larsen & Toubro",
      price: 3725.40
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
      symbol: "ITC",
      name: "ITC Limited",
      price: 410.50
    },

    {
      symbol: "M&M",
      name: "Mahindra & Mahindra",
      price: 2985.75
    },

    {
      symbol: "MARUTI",
      name: "Maruti Suzuki",
      price: 13250.60
    }

  ];


  const [stocks, setStocks] = useState(initialStocks);


  // ==========================================
  // GENERATE GRAPH
  // ==========================================

  const generateChartData = (basePrice, period) => {

    const data = [];

    let price = Number(basePrice);

    let points = 30;

    for (let i = 0; i < points; i++) {

      const movement =
        (Math.random() - 0.5) *
        (basePrice * 0.004);

      price = Math.max(
        1,
        price + movement
      );

      let label;

      if (period === "1D") {

        label =
          `${9 + Math.floor(i / 6)}:${String(
            (i * 10) % 60
          ).padStart(2, "0")}`;

      } else if (period === "1W") {

        label = `Day ${i + 1}`;

      } else if (period === "1M") {

        label = `Day ${i + 1}`;

      } else if (period === "6M") {

        label = `Month ${i + 1}`;

      } else if (period === "1Y") {

        label = `Month ${i + 1}`;

      } else {

        label = `Year ${i + 1}`;

      }


      data.push({
        time: label,
        price: Number(price.toFixed(2))
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
        78954.76,
        "1D"
      )
    );

  }, []);


  // ==========================================
  // FAKE LIVE PRICE UPDATE
  // ==========================================

  useEffect(() => {

    const interval = setInterval(() => {

      // -------------------------------
      // SENSEX PRICE
      // -------------------------------

      setSensexPrice(previousPrice => {

        const movement =
          (Math.random() - 0.5) * 30;

        return Number(
          Math.max(
            1,
            previousPrice + movement
          ).toFixed(2)
        );

      });


      // -------------------------------
      // CHANGE
      // -------------------------------

      setSensexChange(previousChange => {

        const movement =
          (Math.random() - 0.5) * 5;

        return Number(
          (previousChange + movement).toFixed(2)
        );

      });


      // -------------------------------
      // PERCENTAGE
      // -------------------------------

      setSensexPercentage(previousPercentage => {

        const movement =
          (Math.random() - 0.5) * 0.03;

        return Number(
          (previousPercentage + movement).toFixed(2)
        );

      });


      // -------------------------------
      // COMPANY PRICES
      // -------------------------------

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
            ((newPrice - stock.price) /
              stock.price) * 100;

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


      // -------------------------------
      // GRAPH
      // -------------------------------

      setChartData(previousData => {

        const lastPrice =
          previousData.length > 0
            ? previousData[
                previousData.length - 1
              ].price
            : 78954.76;


        const movement =
          (Math.random() - 0.5) * 30;


        const newPrice =
          Math.max(
            1,
            lastPrice + movement
          );


        const newPoint = {

          time:
            new Date().toLocaleTimeString(),

          price:
            Number(newPrice.toFixed(2))

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

  }, []);


  // ==========================================
  // CHANGE GRAPH PERIOD
  // ==========================================

  const changePeriod = (period) => {

    setSelectedPeriod(period);

    setChartData(
      generateChartData(
        sensexPrice,
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

    <div className="sensex-container">


      {/* ==================================
          SENSEX MAIN CARD
      ================================== */}

      <div className="sensex-card">

        <div className="sensex-header">

          <div>

            <h1>
              SENSEX
            </h1>

            <p>
              BSE SENSEX Index
            </p>

          </div>


          <div className="live-badge">

            ● LIVE

          </div>

        </div>


        <h2>

          ₹
          {sensexPrice.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}

        </h2>


        <p
          className={
            sensexChange >= 0
              ? "green"
              : "red"
          }
        >

          {sensexChange >= 0
            ? "+"
            : ""}

          {sensexChange.toFixed(2)}

          {" "}

          (
          {sensexPercentage >= 0
            ? "+"
            : ""}

          {sensexPercentage.toFixed(2)}
          %)

        </p>


        {/* ==================================
            DETAILS
        ================================== */}

        <div className="sensex-details">

          <div className="detail-box">

            <h3>
              Open
            </h3>

            <p>
              ₹78,700.50
            </p>

          </div>


          <div className="detail-box">

            <h3>
              High
            </h3>

            <p>
              ₹79,020.85
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Low
            </h3>

            <p>
              ₹78,610.40
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Previous Close
            </h3>

            <p>
              ₹78,617.00
            </p>

          </div>

        </div>

      </div>


      {/* ==================================
          GRAPH
      ================================== */}

      <div className="sensex-chart-card">

        <div className="chart-header">

          <div>

            <h2>
              SENSEX Chart
            </h2>

            <p>
              {selectedPeriod} price movement
            </p>

          </div>


          <div className="chart-live">

            ● LIVE

          </div>

        </div>


        <div className="sensex-chart">

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
          RELATED COMPANIES
      ================================== */}

      <div className="sensex-stocks-card">

        <div className="stocks-header">

          <div>

            <h2>
              SENSEX Related Companies
            </h2>

            <p>
              Selected companies for your demo
            </p>

          </div>


          <span>
            {stocks.length} Stocks
          </span>

        </div>


        {/* ==================================
            COMPANY LIST
        ================================== */}

        <div className="sensex-stock-list">

          {stocks.map(stock => (

            <div
              className="sensex-stock-item"
              key={stock.symbol}

              onClick={() =>
                openStock(stock.symbol)
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

                {(stock.change || 0).toFixed(2)}
                %

              </div>


              {/* VIEW */}

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

export default Sensex;
