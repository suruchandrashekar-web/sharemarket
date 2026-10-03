import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import "./Mutualdetals.css";

import {
  getAccount,
  addHolding,
  updateHoldingPrice,
  sellHolding
} from "./acc";


function MutualFundDetails() {

  const { symbol } = useParams();

  const navigate =
    useNavigate();


  // =====================================================
  // STATES
  // =====================================================

  const [fund, setFund] =
    useState(null);

  const [chartData, setChartData] =
    useState([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState("1D");

  const [investment, setInvestment] =
    useState(10);

  const [sellUnits, setSellUnits] =
    useState("");

  const [calculation, setCalculation] =
    useState(null);

  const [sellCalculation, setSellCalculation] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [isWatchlisted, setIsWatchlisted] =
    useState(false);


  // =====================================================
  // GENERATE CHART
  // =====================================================

  const generateChartData = (
    price,
    period
  ) => {

    const data = [];

    let currentPrice =
      Number(price);

    const points = 30;

    for (
      let i = 0;
      i < points;
      i++
    ) {

      const movement =
        (Math.random() - 0.5) *
        (Number(price) * 0.04);

      currentPrice =
        Math.max(
          1,
          currentPrice + movement
        );

      let label = "";

      if (period === "1D") {

        const totalMinutes =
          9 * 60 +
          15 +
          i * 10;

        const hours =
          Math.floor(
            totalMinutes / 60
          );

        const minutes =
          totalMinutes % 60;

        label =
          `${String(hours).padStart(2, "0")}:${String(
            minutes
          ).padStart(2, "0")}`;

      } else if (period === "1W") {

        label =
          `Day ${i + 1}`;

      } else if (period === "1M") {

        label =
          `Day ${i + 1}`;

      } else if (period === "6M") {

        label =
          `Month ${i + 1}`;

      } else if (period === "1Y") {

        label =
          `Month ${i + 1}`;

      } else if (period === "5Y") {

        label =
          `Year ${i + 1}`;
      }

      data.push({
        time: label,
        price:
          Number(
            currentPrice.toFixed(2)
          )
      });
    }

    return data;
  };


  // =====================================================
  // CHECK WATCHLIST
  // =====================================================

  const checkWatchlist = () => {

    const savedWatchlist =
      JSON.parse(
        localStorage.getItem(
          "watchlist"
        ) || "[]"
      );

    const exists =
      savedWatchlist.some(
        item =>
          item.symbol === symbol &&
          item.type === "MUTUAL_FUND"
      );

    setIsWatchlisted(exists);
  };


  // =====================================================
  // TOGGLE WATCHLIST
  // =====================================================

  const toggleWatchlist = () => {

    if (!fund) {
      return;
    }

    const savedWatchlist =
      JSON.parse(
        localStorage.getItem(
          "watchlist"
        ) || "[]"
      );

    const alreadyExists =
      savedWatchlist.some(
        item =>
          item.symbol === fund.symbol &&
          item.type === "MUTUAL_FUND"
      );

    if (alreadyExists) {

      const updatedWatchlist =
        savedWatchlist.filter(
          item =>
            !(
              item.symbol ===
                fund.symbol &&
              item.type ===
                "MUTUAL_FUND"
            )
        );

      localStorage.setItem(
        "watchlist",
        JSON.stringify(
          updatedWatchlist
        )
      );

      setIsWatchlisted(false);

      setMessage(
        `${fund.symbol} removed from watchlist`
      );

      return;
    }

    const watchlistFund = {

      id: fund.id,

      symbol: fund.symbol,

      name: fund.name,

      price:
        Number(fund.price),

      change:
        Number(fund.change),

      type:
        "MUTUAL_FUND"
    };

    const updatedWatchlist = [
      ...savedWatchlist,
      watchlistFund
    ];

    localStorage.setItem(
      "watchlist",
      JSON.stringify(
        updatedWatchlist
      )
    );

    setIsWatchlisted(true);

    setMessage(
      `${fund.symbol} added to watchlist`
    );
  };


  // =====================================================
  // GET CURRENT HOLDING
  // =====================================================

  const getCurrentHolding = () => {

    const account =
      getAccount();

    if (!account) {
      return null;
    }

    return account.holdings.find(
      item =>
        item.symbol === symbol &&
        String(item.type).toUpperCase() ===
          "MUTUAL_FUND"
    );
  };


  // =====================================================
  // UPDATE INVESTMENT CALCULATION
  // =====================================================

  const updateInvestmentCalculation = (
    currentNAV
  ) => {

    const account =
      getAccount();

    if (!account) {
      return;
    }

    const holding =
      account.holdings.find(
        item =>
          item.symbol === symbol &&
          String(item.type).toUpperCase() ===
            "MUTUAL_FUND"
      );

    if (!holding) {
      return;
    }

    const totalInvestment =
      Number(
        holding.investedAmount || 0
      );

    const totalUnits =
      Number(
        holding.quantity || 0
      );

    const currentValue =
      totalUnits *
      Number(currentNAV);

    const profitLoss =
      currentValue -
      totalInvestment;

    const profitLossPercentage =
      totalInvestment > 0
        ? (
            profitLoss /
            totalInvestment
          ) * 100
        : 0;

    setCalculation({

      amount:
        totalInvestment,

      nav:
        Number(
          holding.averagePrice || 0
        ),

      units:
        totalUnits,

      currentNAV:
        Number(currentNAV),

      currentValue:
        currentValue,

      profitLoss:
        profitLoss,

      profitLossPercentage:
        profitLossPercentage,

      isPreview:
        false
    });
  };


  // =====================================================
  // UPDATE WATCHLIST PRICE
  // =====================================================

  const updateWatchlistPrice = (
    newPrice,
    change
  ) => {

    const savedWatchlist =
      JSON.parse(
        localStorage.getItem(
          "watchlist"
        ) || "[]"
      );

    const updatedWatchlist =
      savedWatchlist.map(
        item => {

          if (
            item.symbol === symbol &&
            item.type === "MUTUAL_FUND"
          ) {

            return {

              ...item,

              price:
                Number(newPrice),

              change:
                Number(change)
            };
          }

          return item;
        }
      );

    localStorage.setItem(
      "watchlist",
      JSON.stringify(
        updatedWatchlist
      )
    );
  };


  // =====================================================
  // FETCH MUTUAL FUND
  // =====================================================

  const fetchFund = async () => {

    try {

      const response =
        await fetch(
         "https://sharemarket-da04.onrender.com/mutualFunds"
        );

      if (!response.ok) { 

        throw new Error(
          "Failed to fetch mutual funds"
        );
      }

      const data =
        await response.json();

      if (!Array.isArray(data)) {
        return;
      }

      const foundFund =
        data.find(
          item =>
            item.symbol === symbol
        );

      if (!foundFund) {

        console.error(
          "Mutual fund not found:",
          symbol
        );

        return;
      }

      const oldPrice =
        Number(
          foundFund.price
        );

      const randomMovement =
        (Math.random() - 0.5) *
        (oldPrice * 0.02);

      const newPrice =
        Math.max(
          1,
          Number(
            (
              oldPrice +
              randomMovement
            ).toFixed(2)
          )
        );

      const change =
        oldPrice > 0
          ? Number(
              (
                (
                  (newPrice -
                    oldPrice) /
                  oldPrice
                ) * 100
              ).toFixed(2)
            )
          : 0;

      const updatedFund = {

        ...foundFund,

        price:
          newPrice,

        change:
          change
      };

      setFund(
        updatedFund
      );

      updateHoldingPrice(
        symbol,
        newPrice,
        "MUTUAL_FUND"
      );

      updateInvestmentCalculation(
        newPrice
      );

      updateWatchlistPrice(
        newPrice,
        change
      );

      setChartData(
        previousData => {

          const newPoint = {

            time:
              new Date().toLocaleTimeString(),

            price:
              newPrice
          };

          if (
            selectedPeriod ===
            "1D"
          ) {

            if (
              previousData.length === 0
            ) {

              return generateChartData(
                newPrice,
                "1D"
              );
            }

            return [
              ...previousData,
              newPoint
            ].slice(-30);
          }

          return previousData;
        }
      );

    } catch (error) {

      console.error(
        "Mutual Fund API Error:",
        error
      );
    }
  };


  // =====================================================
  // INITIAL LOAD + LIVE UPDATE
  // =====================================================

  useEffect(() => {

    checkWatchlist();

    fetchFund();

    const interval =
      setInterval(
        fetchFund,
        1000
      );

    return () => {

      clearInterval(
        interval
      );
    };

  }, [
    symbol,
    selectedPeriod
  ]);


  // =====================================================
  // CHANGE PERIOD
  // =====================================================

  const changePeriod = (
    period
  ) => {

    setSelectedPeriod(
      period
    );

    if (fund) {

      const data =
        generateChartData(
          fund.price,
          period
        );

      setChartData(
        data
      );
    }
  };


  // =====================================================
  // CALCULATE BUY INVESTMENT
  // =====================================================

  const calculateInvestment = () => {

    if (!fund) {
      return;
    }

    const amount =
      Number(investment);

    const nav =
      Number(fund.price);

    if (
      !amount ||
      amount < 10
    ) {

      setMessage(
        "Minimum investment amount is ₹10"
      );

      setCalculation(null);

      return;
    }

    if (nav <= 0) {

      setMessage(
        "Invalid NAV"
      );

      setCalculation(null);

      return;
    }

    const account =
      getAccount();

    if (
      amount >
      Number(account.balance)
    ) {

      setMessage(
        `Insufficient balance. Available balance is ₹${Number(
          account.balance
        ).toFixed(2)}`
      );

      setCalculation(null);

      return;
    }

    const units =
      amount / nav;

    setCalculation({

      amount:
        amount,

      nav:
        nav,

      units:
        units,

      currentNAV:
        nav,

      currentValue:
        amount,

      profitLoss:
        0,

      profitLossPercentage:
        0,

      isPreview:
        true
    });

    setMessage("");
  };


  // =====================================================
  // BUY MUTUAL FUND
  // =====================================================

  const buyFund = () => {

    if (!fund) {
      return;
    }

    const amount =
      Number(investment);

    const nav =
      Number(fund.price);

    if (
      !amount ||
      amount < 10
    ) {

      setMessage(
        "Minimum investment amount is ₹10"
      );

      return;
    }

    if (nav <= 0) {

      setMessage(
        "Invalid NAV"
      );

      return;
    }

    const account =
      getAccount();

    if (
      amount >
      Number(account.balance)
    ) {

      setMessage(
        `Insufficient balance. Available balance is ₹${Number(
          account.balance
        ).toFixed(2)}`
      );

      return;
    }

    const units =
      amount / nav;

    const updatedAccount =
      addHolding(

        {

          id:
            fund.id,

          symbol:
            fund.symbol,

          name:
            fund.name,

          type:
            "MUTUAL_FUND",

          category:
            "MUTUAL FUND",

          price:
            nav
        },

        units,

        nav,

        "MUTUAL_FUND"
      );

    if (!updatedAccount) {

      setMessage(
        "Unable to complete investment. Please check your balance."
      );

      return;
    }

    // ===================================================
    // CREATE BUY ORDER
    // ===================================================

    const oldOrders =
      JSON.parse(
        localStorage.getItem(
          "orders"
        ) || "[]"
      );

    const newOrder = {

      id:
        Date.now(),

      symbol:
        fund.symbol,

      name:
        fund.name,

      type:
        "BUY",

      category:
        "MUTUAL FUND",

      quantity:
        Number(
          units.toFixed(4)
        ),

      price:
        Number(
          nav.toFixed(2)
        ),

      amount:
        Number(
          amount.toFixed(2)
        ),

      status:
        "COMPLETED",

      date:
        new Date().toLocaleString()
    };

    const updatedOrders = [
      newOrder,
      ...oldOrders
    ];

    localStorage.setItem(
      "orders",
      JSON.stringify(
        updatedOrders
      )
    );

    setMessage(
      `Successfully invested ₹${amount.toFixed(
        2
      )} in ${fund.symbol}.`
    );

    setCalculation(null);

    setTimeout(() => {

      navigate(
        "/holdings"
      );

    }, 800);
  };


  // =====================================================
  // CALCULATE SELL
  // =====================================================

  const calculateSell = () => {

    if (!fund) {
      return;
    }

    const holding =
      getCurrentHolding();

    if (!holding) {

      setMessage(
        `You don't have any ${fund.symbol} units to sell.`
      );

      setSellCalculation(null);

      return;
    }

    const units =
      Number(sellUnits);

    const availableUnits =
      Number(
        holding.quantity || 0
      );

    const nav =
      Number(fund.price);

    if (
      !units ||
      units <= 0
    ) {

      setMessage(
        "Please enter valid units to sell."
      );

      setSellCalculation(null);

      return;
    }

    if (
      units >
      availableUnits
    ) {

      setMessage(
        `You can sell maximum ${availableUnits.toFixed(
          4
        )} units.`
      );

      setSellCalculation(null);

      return;
    }

    const sellAmount =
      units * nav;

    const originalCost =
      units *
      Number(
        holding.averagePrice || 0
      );

    const profitLoss =
      sellAmount -
      originalCost;

    const returnPercentage =
      originalCost > 0
        ? (
            profitLoss /
            originalCost
          ) * 100
        : 0;

    setSellCalculation({

      units:
        units,

      nav:
        nav,

      amount:
        sellAmount,

      profitLoss:
        profitLoss,

      returnPercentage:
        returnPercentage
    });

    setMessage("");
  };


  // =====================================================
  // SELL MUTUAL FUND
  // =====================================================

  const sellFund = () => {

    if (!fund) {
      return;
    }

    const units =
      Number(sellUnits);

    const holding =
      getCurrentHolding();

    if (!holding) {

      setMessage(
        `You don't have any ${fund.symbol} units to sell.`
      );

      return;
    }

    const availableUnits =
      Number(
        holding.quantity || 0
      );

    const nav =
      Number(fund.price);

    if (
      !units ||
      units <= 0
    ) {

      setMessage(
        "Please enter valid units to sell."
      );

      return;
    }

    if (
      units >
      availableUnits
    ) {

      setMessage(
        `You can sell maximum ${availableUnits.toFixed(
          4
        )} units.`
      );

      return;
    }

    const sellAmount =
      units * nav;

    const confirmSell =
      window.confirm(
        `Sell ${units.toFixed(
          4
        )} units of ${fund.symbol} for ₹${sellAmount.toFixed(
          2
        )}?`
      );

    if (!confirmSell) {
      return;
    }

    // ===================================================
    // SELL HOLDING
    // ===================================================

    const updatedAccount =
      sellHolding(
        fund.symbol,
        units,
        nav,
        "MUTUAL_FUND"
      );

    if (!updatedAccount) {

      setMessage(
        "Unable to sell units. Please try again."
      );

      return;
    }

    // ===================================================
    // CREATE SELL ORDER
    // ===================================================

    const oldOrders =
      JSON.parse(
        localStorage.getItem(
          "orders"
        ) || "[]"
      );

    const newOrder = {

      id:
        Date.now(),

      symbol:
        fund.symbol,

      name:
        fund.name,

      type:
        "SELL",

      category:
        "MUTUAL FUND",

      quantity:
        Number(
          units.toFixed(4)
        ),

      price:
        Number(
          nav.toFixed(2)
        ),

      amount:
        Number(
          sellAmount.toFixed(2)
        ),

      status:
        "COMPLETED",

      date:
        new Date().toLocaleString()
    };

    const updatedOrders = [
      newOrder,
      ...oldOrders
    ];

    localStorage.setItem(
      "orders",
      JSON.stringify(
        updatedOrders
      )
    );

    // ===================================================
    // SUCCESS
    // ===================================================

    setMessage(
      `Successfully sold ${units.toFixed(
        4
      )} units of ${fund.symbol} for ₹${sellAmount.toFixed(
        2
      )}.`
    );

    setSellUnits("");

    setSellCalculation(null);

    // Refresh account-related components
    window.dispatchEvent(
      new Event("accountUpdated")
    );

    setTimeout(() => {

      navigate(
        "/holdings"
      );

    }, 1000);
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (!fund) {

    return (

      <div className="mf-details-loading">

        Loading Mutual Fund...

      </div>
    );
  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="mf-details-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="mf-details-header">

        <button
          onClick={() =>
            navigate(
              "/mutual-funds"
            )
          }
        >
          ← Back
        </button>


        <div>

          <h1>
            📈 {fund.symbol}
          </h1>

          <p>
            {fund.name}
          </p>

        </div>


        <div className="mf-header-actions">

          <button
            className={
              isWatchlisted
                ? "watch-active"
                : "watch-button"
            }
            onClick={
              toggleWatchlist
            }
          >

            {isWatchlisted
              ? "★ Watching"
              : "☆ Watchlist"}

          </button>


          <button
            onClick={() =>
              navigate(
                "/orders"
              )
            }
          >
            📋 Orders
          </button>


          <button
            onClick={() =>
              navigate(
                "/watchlist"
              )
            }
          >
            ⭐ WatchList
          </button>


          <button
            onClick={() =>
              navigate(
                "/holdings"
              )
            }
          >
            💼 Holdings
          </button>

        </div>

      </header>


      <div className="mf-details-container">


        {/* =================================================
            PRICE CARD
        ================================================= */}

        <div className="mf-price-card">

          <div>

            <span>
              Current NAV
            </span>

            <h2>
              ₹
              {Number(
                fund.price
              ).toFixed(2)}
            </h2>

          </div>


          <div
            className={
              Number(fund.change) >= 0
                ? "mf-positive"
                : "mf-negative"
            }
          >

            {Number(fund.change) >= 0
              ? "+"
              : ""}

            {Number(
              fund.change
            ).toFixed(2)}

            %

          </div>


          <div className="mf-live">

            <span></span>

            LIVE

          </div>

        </div>


        {/* =================================================
            CHART
        ================================================= */}

        <div className="mf-chart-card">

          <div className="mf-chart-header">

            <div>

              <h2>
                {fund.symbol} NAV Chart
              </h2>

              <p>
                {selectedPeriod} NAV movement
              </p>

            </div>

            <div className="mf-chart-live">
              ● LIVE
            </div>

          </div>


          <div className="mf-chart">

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
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={false}
                  animationDuration={300}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>


          <div className="mf-period-buttons">

            {[
              "1D",
              "1W",
              "1M",
              "6M",
              "1Y",
              "5Y"
            ].map(
              period => (

                <button
                  key={period}

                  className={
                    selectedPeriod ===
                    period
                      ? "active"
                      : ""
                  }

                  onClick={() =>
                    changePeriod(
                      period
                    )
                  }
                >
                  {period}
                </button>

              )
            )}

          </div>

        </div>


        {/* =================================================
            BUY CARD
        ================================================= */}

        <div className="mf-investment-card">

          <div className="mf-investment-header">

            <div>

              <h2>
                💰 Invest in {fund.symbol}
              </h2>

              <p>
                Start your investment from ₹10
              </p>

            </div>

            <div className="minimum-investment">
              Minimum ₹10
            </div>

          </div>


          <div className="investment-input-section">

            <label>
              Investment Amount
            </label>

            <div className="investment-input">

              <span>
                ₹
              </span>

              <input
                type="number"
                min="10"
                value={investment}
                onChange={e =>
                  setInvestment(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="quick-invest-buttons">

              {[
                10,
                100,
                500,
                1000,
                5000,
                10000
              ].map(
                amount => (

                  <button
                    key={amount}
                    onClick={() =>
                      setInvestment(
                        amount
                      )
                    }
                  >
                    ₹{amount}
                  </button>

                )
              )}

            </div>

          </div>


          <div className="investment-actions">

            <button
              className="calculate-investment-btn"
              onClick={
                calculateInvestment
              }
            >
              🧮 Calculate
            </button>


            <button
              className="buy-investment-btn"
              onClick={
                buyFund
              }
            >
              🛒 BUY
            </button>

          </div>


          {message && (

            <div className="investment-message">
              {message}
            </div>

          )}


          {calculation && (

            <div className="investment-result">

              <h3>
                📊 Investment Summary
              </h3>

              <div className="calculation-grid">

                <div className="calculation-item">

                  <span>
                    Investment
                  </span>

                  <strong>
                    ₹
                    {Number(
                      calculation.amount
                    ).toFixed(2)}
                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    NAV
                  </span>

                  <strong>
                    ₹
                    {Number(
                      calculation.nav
                    ).toFixed(2)}
                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Units
                  </span>

                  <strong>
                    {Number(
                      calculation.units
                    ).toFixed(4)}
                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Current NAV
                  </span>

                  <strong>
                    ₹
                    {Number(
                      fund.price
                    ).toFixed(2)}
                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Current Value
                  </span>

                  <strong>
                    ₹
                    {Number(
                      calculation.currentValue
                    ).toFixed(2)}
                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Profit / Loss
                  </span>

                  <strong
                    className={
                      Number(
                        calculation.profitLoss
                      ) >= 0
                        ? "mf-profit"
                        : "mf-loss"
                    }
                  >

                    {Number(
                      calculation.profitLoss
                    ) >= 0
                      ? "+"
                      : ""}

                    ₹
                    {Number(
                      calculation.profitLoss
                    ).toFixed(2)}

                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Return
                  </span>

                  <strong
                    className={
                      Number(
                        calculation.profitLossPercentage
                      ) >= 0
                        ? "mf-profit"
                        : "mf-loss"
                    }
                  >

                    {Number(
                      calculation.profitLossPercentage
                    ) >= 0
                      ? "+"
                      : ""}

                    {Number(
                      calculation.profitLossPercentage
                    ).toFixed(2)}

                    %

                  </strong>

                </div>

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            SELL CARD
        ================================================= */}

        <div className="mf-investment-card sell-card">

          <div className="mf-investment-header">

            <div>

              <h2>
                💸 Sell {fund.symbol}
              </h2>

              <p>
                Sell your available mutual fund units
              </p>

            </div>

            <div className="minimum-investment">
              Current NAV ₹
              {Number(
                fund.price
              ).toFixed(2)}
            </div>

          </div>


          {/* AVAILABLE UNITS */}

          <div className="available-units">

            <span>
              Available Units
            </span>

            <strong>

              {getCurrentHolding()
                ? Number(
                    getCurrentHolding()
                      .quantity || 0
                  ).toFixed(4)
                : "0.0000"}

            </strong>

          </div>


          {/* SELL INPUT */}

          <div className="investment-input-section">

            <label>
              Units to Sell
            </label>

            <div className="investment-input">

              <span>
                📦
              </span>

              <input
                type="number"
                min="0"
                step="0.0001"
                value={sellUnits}
                placeholder="Enter units"
                onChange={e =>
                  setSellUnits(
                    e.target.value
                  )
                }
              />

            </div>


            {/* SELL QUICK BUTTONS */}

            <div className="quick-invest-buttons">

              <button
                onClick={() => {

                  const holding =
                    getCurrentHolding();

                  if (holding) {

                    setSellUnits(
                      Number(
                        holding.quantity
                      ).toFixed(4)
                    );
                  }

                }}
              >
                SELL ALL
              </button>

              <button
                onClick={() => {

                  const holding =
                    getCurrentHolding();

                  if (holding) {

                    setSellUnits(
                      (
                        Number(
                          holding.quantity
                        ) / 2
                      ).toFixed(4)
                    );
                  }

                }}
              >
                50%
              </button>

              <button
                onClick={() =>
                  setSellUnits("1")
                }
              >
                1 Unit
              </button>

              <button
                onClick={() =>
                  setSellUnits("5")
                }
              >
                5 Units
              </button>

            </div>

          </div>


          {/* SELL ACTIONS */}

          <div className="investment-actions">

            <button
              className="calculate-investment-btn"
              onClick={
                calculateSell
              }
            >
              🧮 Calculate Sell
            </button>


            <button
              className="sell-investment-btn"
              onClick={
                sellFund
              }
            >
              💸 SELL
            </button>

          </div>


          {/* SELL CALCULATION */}

          {sellCalculation && (

            <div className="investment-result">

              <h3>
                📊 Sell Summary
              </h3>


              <div className="calculation-grid">

                <div className="calculation-item">

                  <span>
                    Units
                  </span>

                  <strong>
                    {Number(
                      sellCalculation.units
                    ).toFixed(4)}
                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Sell NAV
                  </span>

                  <strong>
                    ₹
                    {Number(
                      sellCalculation.nav
                    ).toFixed(2)}
                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Amount Received
                  </span>

                  <strong>
                    ₹
                    {Number(
                      sellCalculation.amount
                    ).toFixed(2)}
                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Profit / Loss
                  </span>

                  <strong
                    className={
                      Number(
                        sellCalculation.profitLoss
                      ) >= 0
                        ? "mf-profit"
                        : "mf-loss"
                    }
                  >

                    {Number(
                      sellCalculation.profitLoss
                    ) >= 0
                      ? "+"
                      : ""}

                    ₹
                    {Number(
                      sellCalculation.profitLoss
                    ).toFixed(2)}

                  </strong>

                </div>


                <div className="calculation-item">

                  <span>
                    Return
                  </span>

                  <strong
                    className={
                      Number(
                        sellCalculation.returnPercentage
                      ) >= 0
                        ? "mf-profit"
                        : "mf-loss"
                    }
                  >

                    {Number(
                      sellCalculation.returnPercentage
                    ) >= 0
                      ? "+"
                      : ""}

                    {Number(
                      sellCalculation.returnPercentage
                    ).toFixed(2)}

                    %

                  </strong>

                </div>

              </div>

            </div>

          )}

        </div>


        {/* =================================================
            FUND INFORMATION
        ================================================= */}

        <div className="mf-info-card">

          <h2>
            Mutual Fund Information
          </h2>


          <div className="mf-info-grid">

            <div>

              <span>
                Fund
              </span>

              <strong>
                {fund.name}
              </strong>

            </div>


            <div>

              <span>
                Symbol
              </span>

              <strong>
                {fund.symbol}
              </strong>

            </div>


            <div>

              <span>
                Current NAV
              </span>

              <strong>
                ₹
                {Number(
                  fund.price
                ).toFixed(2)}
              </strong>

            </div>


            <div>

              <span>
                Status
              </span>

              <strong>
                LIVE
              </strong>

            </div>

          </div>

        </div>


      </div>

    </div>
  );
}


export default MutualFundDetails;