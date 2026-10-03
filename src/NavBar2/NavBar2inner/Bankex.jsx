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

import "./Bankex.css";

const Bankex = () => {

  const navigate = useNavigate();

  // ==========================================
  // BANKEX DATA
  // ==========================================

  const [bankexPrice, setBankexPrice] =
    useState(65838.00);

  const [bankexChange, setBankexChange] =
    useState(559.35);

  const [bankexPercentage, setBankexPercentage] =
    useState(0.89);

  const [chartData, setChartData] =
    useState([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState("1D");


  // ==========================================
  // BANKEX RELATED COMPANIES
  // ==========================================

  const initialCompanies = [

    {
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      price: 713.70
    },

    {
      symbol: "ICICIBANK",
      name: "ICICI Bank",
      price: 1424.15
    },

    {
      symbol: "SBIN",
      name: "State Bank of India",
      price: 1046.00
    },

    {
      symbol: "KOTAKBANK",
      name: "Kotak Mahindra Bank",
      price: 423.15
    },

    {
      symbol: "AXISBANK",
      name: "Axis Bank",
      price: 1260.60
    },

    {
      symbol: "FEDERALBNK",
      name: "Federal Bank",
      price: 343.00
    },

    {
      symbol: "INDUSINDBK",
      name: "IndusInd Bank",
      price: 988.20
    },

    {
      symbol: "AUBANK",
      name: "AU Small Finance Bank",
      price: 1077.70
    },

    {
      symbol: "BANKBARODA",
      name: "Bank of Baroda",
      price: 240.70
    },

    {
      symbol: "CANBK",
      name: "Canara Bank",
      price: 127.85
    },

    {
      symbol: "UNIONBANK",
      name: "Union Bank of India",
      price: 184.65
    },

    {
      symbol: "PNB",
      name: "Punjab National Bank",
      price: 115.10
    },

    {
      symbol: "IDFCFIRSTB",
      name: "IDFC First Bank",
      price: 83.34
    },

    {
      symbol: "YESBANK",
      name: "Yes Bank",
      price: 22.10
    }

  ];


  const [companies, setCompanies] =
    useState(initialCompanies);


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

      }

      else if (
        period === "1W" ||
        period === "1M"
      ) {

        label = `Day ${i + 1}`;

      }

      else if (
        period === "6M" ||
        period === "1Y"
      ) {

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
        65838,
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

        // BANKEX PRICE

        setBankexPrice(previous => {

          const movement =
            (Math.random() - 0.5) * 30;

          return Number(
            Math.max(
              1,
              previous + movement
            ).toFixed(2)
          );

        });


        // BANKEX CHANGE

        setBankexChange(previous => {

          const movement =
            (Math.random() - 0.5) * 5;

          return Number(
            (previous + movement)
              .toFixed(2)
          );

        });


        // BANKEX PERCENTAGE

        setBankexPercentage(previous => {

          const movement =
            (Math.random() - 0.5) * 0.03;

          return Number(
            (previous + movement)
              .toFixed(2)
          );

        });


        // COMPANY PRICES

        setCompanies(previousCompanies => {

          return previousCompanies.map(
            company => {

              const movement =
                (Math.random() - 0.5) *
                (company.price * 0.002);

              const newPrice =
                Math.max(
                  1,
                  company.price + movement
                );

              const change =
                (
                  (newPrice -
                    company.price) /
                  company.price
                ) * 100;

              return {

                ...company,

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


        // GRAPH UPDATE

        setChartData(previousData => {

          const newPoint = {

            time:
              new Date()
                .toLocaleTimeString(),

            price: bankexPrice

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

  }, [bankexPrice]);


  // ==========================================
  // CHANGE PERIOD
  // ==========================================

  const changePeriod = (period) => {

    setSelectedPeriod(period);

    setChartData(
      generateChartData(
        bankexPrice,
        period
      )
    );

  };


  // ==========================================
  // OPEN COMPANY
  // ==========================================

  const openCompany = (symbol) => {

    navigate(
      `/stocks/${symbol}`
    );

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="bankex-container">


      {/* ==================================
          BANKEX MAIN CARD
      ================================== */}

      <div className="bankex-card">

        <div className="bankex-header">

          <div>

            <h1>
              BANKEX
            </h1>

            <p>
              BSE BANKEX Index
            </p>

          </div>


          <div className="live-badge">

            ● LIVE

          </div>

        </div>


        <h2>

          ₹
          {bankexPrice.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }
          )}

        </h2>


        <p
          className={
            bankexChange >= 0
              ? "green"
              : "red"
          }
        >

          {bankexChange >= 0
            ? "+"
            : ""}

          {bankexChange.toFixed(2)}

          {" ("}

          {bankexPercentage >= 0
            ? "+"
            : ""}

          {bankexPercentage.toFixed(2)}

          %)

        </p>


        {/* DETAILS */}

        <div className="bankex-details">

          <div className="detail-box">

            <h3>
              Open
            </h3>

            <p>
              ₹65,400.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              High
            </h3>

            <p>
              ₹65,950.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Low
            </h3>

            <p>
              ₹65,220.00
            </p>

          </div>


          <div className="detail-box">

            <h3>
              Previous Close
            </h3>

            <p>
              ₹65,278.65
            </p>

          </div>

        </div>

      </div>


      {/* ==================================
          GRAPH
      ================================== */}

      <div className="bankex-chart-card">

        <div className="chart-header">

          <div>

            <h2>
              BANKEX Chart
            </h2>

            <p>
              {selectedPeriod} price movement
            </p>

          </div>


          <div className="chart-live">

            ● LIVE

          </div>

        </div>


        <div className="bankex-chart">

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


      {/* ==================================
          RELATED COMPANIES
      ================================== */}

      <div className="bankex-companies-card">

        <div className="companies-header">

          <div>

            <h2>
              BANKEX Related Companies
            </h2>

            <p>
              Banking companies related to BANKEX
            </p>

          </div>


          <span>
            {companies.length} Companies
          </span>

        </div>


        <div className="bankex-company-list">

          {companies.map(company => (

            <div
              className="bankex-company-item"
              key={company.symbol}
              onClick={() =>
                openCompany(
                  company.symbol
                )
              }
            >

              {/* LOGO */}

              <div className="company-logo">

                {company.symbol.charAt(0)}

              </div>


              {/* NAME */}

              <div className="company-name">

                <h3>
                  {company.symbol}
                </h3>

                <p>
                  {company.name}
                </p>

              </div>


              {/* PRICE */}

              <div className="company-price">

                <span>
                  Price
                </span>

                <strong>

                  ₹
                  {company.price.toLocaleString(
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
                  company.change >= 0
                    ? "company-change green"
                    : "company-change red"
                }
              >

                {company.change >= 0
                  ? "+"
                  : ""}

                {company.change?.toFixed(2) || "0.00"}%

              </div>


              {/* VIEW BUTTON */}

              <button
                className="view-button"
                onClick={(e) => {

                  e.stopPropagation();

                  openCompany(
                    company.symbol
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

export default Bankex;