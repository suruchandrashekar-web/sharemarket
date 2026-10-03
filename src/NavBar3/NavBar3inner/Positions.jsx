
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "./Positions.css";

const Positions = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [positions, setPositions] = useState([]);
  const [livePrices, setLivePrices] = useState({});

  // =====================================================
  // LOAD STOCK + F&O POSITIONS
  // =====================================================

  const loadPositions = useCallback(() => {
    try {
      const stockPositions = JSON.parse(
        localStorage.getItem("positions") || "[]"
      );

      const foPositions = JSON.parse(
        localStorage.getItem("foPositions") || "[]"
      );

      const stocks = Array.isArray(stockPositions)
        ? stockPositions
        : [];

      const futuresOptions = Array.isArray(foPositions)
        ? foPositions
        : [];

      const allPositions = [
        ...stocks.map((position) => ({
          ...position,
          category: "STOCK",
        })),

        ...futuresOptions.map((position) => ({
          ...position,
          category: "F&O",
        })),
      ];

      setPositions(allPositions);
    } catch (error) {
      console.error("Load Positions Error:", error);
      setPositions([]);
    }
  }, []);

  // =====================================================
  // LOAD POSITIONS
  // =====================================================

  useEffect(() => {
    loadPositions();

    const interval = setInterval(() => {
      loadPositions();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loadPositions]);

  // =====================================================
  // FETCH STOCK LIVE PRICES
  // =====================================================

  const fetchLiveStockPrices = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/stocks"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        return;
      }

      setLivePrices((previousPrices) => {
        const updatedPrices = {
          ...previousPrices,
        };

        data.forEach((stock) => {
          const symbol = stock.symbol;
          const basePrice = Number(stock.price);

          if (!symbol || Number.isNaN(basePrice)) {
            return;
          }

          const oldPrice =
            updatedPrices[symbol] !== undefined
              ? Number(updatedPrices[symbol])
              : basePrice;

          // Small simulated market movement
          const movement =
            (Math.random() - 0.5) * 2;

          const newPrice = Number(
            (oldPrice + movement).toFixed(2)
          );

          updatedPrices[symbol] = Math.max(
            0.01,
            newPrice
          );
        });

        return updatedPrices;
      });
    } catch (error) {
      console.error(
        "Stock Price API Error:",
        error
      );
    }
  }, []);

  // =====================================================
  // STOCK PRICE INTERVAL
  // =====================================================

  useEffect(() => {
    fetchLiveStockPrices();

    const interval = setInterval(() => {
      fetchLiveStockPrices();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchLiveStockPrices]);

  // =====================================================
  // F&O LIVE PREMIUM
  // =====================================================

  useEffect(() => {
    const updateFOPremium = () => {
      setLivePrices((previousPrices) => {
        const updatedPrices = {
          ...previousPrices,
        };

        positions.forEach((position) => {
          if (position.category !== "F&O") {
            return;
          }

          const key = `FO-${position.id}`;

          const storedPremium =
            Number(position.currentPrice) ||
            Number(position.averagePrice) ||
            0;

          const oldPremium =
            updatedPrices[key] !== undefined
              ? Number(updatedPrices[key])
              : storedPremium;

          // Simulated F&O premium movement
          const movement =
            (Math.random() - 0.5) * 10;

          const newPremium = Math.max(
            1,
            Number(
              (oldPremium + movement).toFixed(2)
            )
          );

          updatedPrices[key] = newPremium;
        });

        return updatedPrices;
      });
    };

    if (positions.length > 0) {
      updateFOPremium();
    }

    const interval = setInterval(() => {
      updateFOPremium();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [positions]);

  // =====================================================
  // GET CURRENT PRICE
  // =====================================================

  const getCurrentPrice = (position) => {
    // -----------------------------------------------------
    // F&O
    // -----------------------------------------------------

    if (position.category === "F&O") {
      const key = `FO-${position.id}`;

      if (livePrices[key] !== undefined) {
        return Number(livePrices[key]);
      }

      return (
        Number(position.currentPrice) ||
        Number(position.averagePrice) ||
        0
      );
    }

    // -----------------------------------------------------
    // STOCK
    // -----------------------------------------------------

    if (
      livePrices[position.symbol] !== undefined
    ) {
      return Number(
        livePrices[position.symbol]
      );
    }

    return Number(position.buyPrice) || 0;
  };

  // =====================================================
  // GET BUY PRICE
  // =====================================================

  const getBuyPrice = (position) => {
    if (position.category === "F&O") {
      return Number(position.averagePrice) || 0;
    }

    return Number(position.buyPrice) || 0;
  };

  // =====================================================
  // GET ORDERS
  // =====================================================

  const getOrders = () => {
    try {
      const orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      return Array.isArray(orders)
        ? orders
        : [];
    } catch (error) {
      console.error(
        "Load Orders Error:",
        error
      );

      return [];
    }
  };

  // =====================================================
  // SAVE ORDER
  // =====================================================

  const saveOrder = (newOrder) => {
    const oldOrders = getOrders();

    localStorage.setItem(
      "orders",
      JSON.stringify([
        newOrder,
        ...oldOrders,
      ])
    );
  };

  // =====================================================
  // BUY F&O
  // SAME QUANTITY
  // =====================================================

  const buyFOPosition = (position) => {
    try {
      const oldPositions = JSON.parse(
        localStorage.getItem("foPositions") || "[]"
      );

      const index = oldPositions.findIndex(
        (item) => item.id === position.id
      );

      if (index === -1) {
        return;
      }

      const oldPosition = oldPositions[index];

      const oldQuantity =
        Number(oldPosition.quantity) || 0;

      if (oldQuantity <= 0) {
        return;
      }

      // -----------------------------------------------------
      // BUY SAME QUANTITY
      // -----------------------------------------------------

      const buyQuantity = oldQuantity;

      const oldAveragePrice =
        Number(oldPosition.averagePrice) || 0;

      const currentPremium =
        getCurrentPrice(position);

      // -----------------------------------------------------
      // NEW QUANTITY
      // -----------------------------------------------------

      const newQuantity =
        oldQuantity + buyQuantity;

      // -----------------------------------------------------
      // NEW AVERAGE PRICE
      // -----------------------------------------------------

      const newAveragePrice =
        (
          oldAveragePrice * oldQuantity +
          currentPremium * buyQuantity
        ) / newQuantity;

      // -----------------------------------------------------
      // NEW INVESTMENT
      // -----------------------------------------------------

      const newInvested =
        newAveragePrice * newQuantity;

      // -----------------------------------------------------
      // UPDATE POSITION
      // -----------------------------------------------------

      oldPositions[index] = {
        ...oldPosition,

        quantity: newQuantity,

        averagePrice: Number(
          newAveragePrice.toFixed(2)
        ),

        currentPrice: Number(
          currentPremium.toFixed(2)
        ),

        invested: Number(
          newInvested.toFixed(2)
        ),

        updatedAt:
          new Date().toLocaleString(),
      };

      // -----------------------------------------------------
      // SAVE F&O POSITION
      // -----------------------------------------------------

      localStorage.setItem(
        "foPositions",
        JSON.stringify(oldPositions)
      );

      // -----------------------------------------------------
      // ORDER HISTORY
      // -----------------------------------------------------

      const newOrder = {
        id: Date.now(),

        symbol: position.index,

        name:
          `${position.index} ${position.type}`,

        type: "BUY",

        category: "FUTURES & OPTIONS",

        optionType: position.type,

        strike: Number(
          position.strike
        ),

        quantity: buyQuantity,

        price: Number(
          currentPremium.toFixed(2)
        ),

        amount: Number(
          (
            currentPremium *
            buyQuantity
          ).toFixed(2)
        ),

        status: "COMPLETED",

        date:
          new Date().toLocaleString(),
      };

      saveOrder(newOrder);

      // -----------------------------------------------------
      // RELOAD
      // -----------------------------------------------------

      loadPositions();
    } catch (error) {
      console.error(
        "F&O BUY Error:",
        error
      );
    }
  };

  // =====================================================
  // SELL F&O
  // COMPLETE QUANTITY
  // =====================================================

  const sellFOPosition = (position) => {
    try {
      const oldPositions = JSON.parse(
        localStorage.getItem("foPositions") || "[]"
      );

      const index = oldPositions.findIndex(
        (item) => item.id === position.id
      );

      if (index === -1) {
        return;
      }

      const oldPosition =
        oldPositions[index];

      const oldQuantity =
        Number(oldPosition.quantity) || 0;

      if (oldQuantity <= 0) {
        return;
      }

      // -----------------------------------------------------
      // SELL COMPLETE QUANTITY
      // -----------------------------------------------------

      const sellQuantity = oldQuantity;

      const currentPremium =
        getCurrentPrice(position);

      // -----------------------------------------------------
      // REMOVE POSITION
      // -----------------------------------------------------

      const updatedPositions =
        oldPositions.filter(
          (item) =>
            item.id !== position.id
        );

      localStorage.setItem(
        "foPositions",
        JSON.stringify(
          updatedPositions
        )
      );

      // -----------------------------------------------------
      // ORDER HISTORY
      // -----------------------------------------------------

      const newOrder = {
        id: Date.now(),

        symbol: position.index,

        name:
          `${position.index} ${position.type}`,

        type: "SELL",

        category: "FUTURES & OPTIONS",

        optionType: position.type,

        strike: Number(
          position.strike
        ),

        quantity: sellQuantity,

        price: Number(
          currentPremium.toFixed(2)
        ),

        amount: Number(
          (
            currentPremium *
            sellQuantity
          ).toFixed(2)
        ),

        status: "COMPLETED",

        date:
          new Date().toLocaleString(),
      };

      saveOrder(newOrder);

      // -----------------------------------------------------
      // RELOAD
      // -----------------------------------------------------

      loadPositions();
    } catch (error) {
      console.error(
        "F&O SELL Error:",
        error
      );
    }
  };

  // =====================================================
  // STOCK BUY
  // =====================================================

  const buyStock = (position) => {
    if (!position.symbol) {
      return;
    }

    navigate(
      `/stocks/${position.symbol}`
    );
  };

  // =====================================================
  // STOCK SELL
  // =====================================================

  const sellStock = (position) => {
    if (!position.symbol) {
      return;
    }

    navigate(
      `/stocks/${position.symbol}`
    );
  };

  // =====================================================
  // OPEN POSITION
  // =====================================================

  const openPosition = (position) => {
    if (position.category === "F&O") {
      navigate("/futures-options");
      return;
    }

    if (position.symbol) {
      navigate(
        `/stocks/${position.symbol}`
      );
    }
  };

  // =====================================================
  // CLOSE POSITION
  // =====================================================

  const closePosition = (position) => {
    try {
      // -----------------------------------------------------
      // F&O
      // -----------------------------------------------------

      if (position.category === "F&O") {
        const oldFOPositions =
          JSON.parse(
            localStorage.getItem(
              "foPositions"
            ) || "[]"
          );

        const updatedFOPositions =
          oldFOPositions.filter(
            (item) =>
              item.id !== position.id
          );

        localStorage.setItem(
          "foPositions",
          JSON.stringify(
            updatedFOPositions
          )
        );
      }

      // -----------------------------------------------------
      // STOCK
      // -----------------------------------------------------

      else {
        const oldStockPositions =
          JSON.parse(
            localStorage.getItem(
              "positions"
            ) || "[]"
          );

        const updatedStockPositions =
          oldStockPositions.filter(
            (item) =>
              item.id !== position.id
          );

        localStorage.setItem(
          "positions",
          JSON.stringify(
            updatedStockPositions
          )
        );
      }

      loadPositions();
    } catch (error) {
      console.error(
        "Close Position Error:",
        error
      );
    }
  };

  // =====================================================
  // TOTAL INVESTMENT
  // =====================================================

  const totalInvestment =
    positions.reduce(
      (total, position) => {
        const buyPrice =
          getBuyPrice(position);

        const quantity =
          Number(position.quantity) || 0;

        return (
          total +
          buyPrice * quantity
        );
      },
      0
    );

  // =====================================================
  // CURRENT VALUE
  // =====================================================

  const currentValue =
    positions.reduce(
      (total, position) => {
        const currentPrice =
          getCurrentPrice(position);

        const quantity =
          Number(position.quantity) || 0;

        return (
          total +
          currentPrice * quantity
        );
      },
      0
    );

  // =====================================================
  // TOTAL PROFIT / LOSS
  // =====================================================

  const totalProfitLoss =
    currentValue -
    totalInvestment;

  // =====================================================
  // TOTAL P/L %
  // =====================================================

  const totalProfitLossPercentage =
    totalInvestment > 0
      ? (
          totalProfitLoss /
          totalInvestment
        ) * 100
      : 0;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="positions"
      style={{
        backgroundColor: "#07111f",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="positions-header">
        <div>
          <h1>⚡ Positions</h1>

          <p>
            Track your Stocks and
            Futures & Options positions.
          </p>
        </div>

        <button
          type="button"
          className="explore-button"
          onClick={() =>
            navigate("/")
          }
        >
          + Trade
        </button>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      {positions.length > 0 && (
        <div className="positions-summary">
          {/* TOTAL INVESTMENT */}

          <div className="summary-box">
            <span>
              Total Investment
            </span>

            <strong>
              ₹
              {totalInvestment.toFixed(2)}
            </strong>
          </div>

          {/* CURRENT VALUE */}

          <div className="summary-box">
            <span>
              Current Value
            </span>

            <strong>
              ₹
              {currentValue.toFixed(2)}
            </strong>
          </div>

          {/* PROFIT LOSS */}

          <div className="summary-box">
            <span>
              Profit / Loss
            </span>

            <strong
              className={
                totalProfitLoss >= 0
                  ? "profit"
                  : "loss"
              }
            >
              {totalProfitLoss >= 0
                ? "+"
                : ""}
              ₹
              {totalProfitLoss.toFixed(2)}
            </strong>

            <small
              className={
                totalProfitLoss >= 0
                  ? "profit"
                  : "loss"
              }
            >
              (
              {totalProfitLoss >= 0
                ? "+"
                : ""}
              {totalProfitLossPercentage.toFixed(
                2
              )}
              %)
            </small>
          </div>
        </div>
      )}

      {/* =================================================
          POSITIONS CARD
      ================================================= */}

      <div className="positions-card">
        <div className="card-header">
          <div>
            <h2>
              Open Positions
            </h2>

            <p>
              Stocks and F&O positions
            </p>
          </div>

          <span className="position-count">
            {positions.length}{" "}
            {positions.length === 1
              ? "Position"
              : "Positions"}
          </span>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {positions.length === 0 ? (
          <div className="no-positions">
            <div className="empty-icon">
              📊
            </div>

            <h2>
              No Open Positions
            </h2>

            <p>
              Buy a stock or F&O contract
              to see it here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
            >
              Explore Stocks
            </button>
          </div>
        ) : (
          <div className="positions-list">
            {positions.map(
              (position) => {
                // =========================================
                // VALUES
                // =========================================

                const buyPrice =
                  getBuyPrice(position);

                const quantity =
                  Number(
                    position.quantity
                  ) || 0;

                const currentPrice =
                  getCurrentPrice(
                    position
                  );

                const investment =
                  buyPrice * quantity;

                const positionCurrentValue =
                  currentPrice *
                  quantity;

                const profitLoss =
                  positionCurrentValue -
                  investment;

                const profitLossPercentage =
                  investment > 0
                    ? (
                        profitLoss /
                        investment
                      ) * 100
                    : 0;

                // =========================================
                // DISPLAY NAME
                // =========================================

                const displayName =
                  position.category ===
                  "F&O"
                    ? `${position.index} ${position.type}`
                    : position.name ||
                      "Stock";

                // =========================================
                // RETURN
                // =========================================

                return (
                  <div
                    className="position-item"
                    key={`${position.category}-${position.id}`}
                  >
                    {/* =================================
                        SYMBOL
                    ================================= */}

                    <div
                      className="position-stock"
                      onClick={() =>
                        openPosition(
                          position
                        )
                      }
                    >
                      <div className="stock-logo">
                        {position.category ===
                        "F&O"
                          ? position.type ===
                            "CALL"
                            ? "C"
                            : position.type ===
                              "PUT"
                            ? "P"
                            : "F"
                          : position.symbol
                          ? position.symbol.charAt(
                              0
                            )
                          : "S"}
                      </div>

                      <div>
                        <h3>
                          {position.category ===
                          "F&O"
                            ? position.index
                            : position.symbol ||
                              "Unknown"}
                        </h3>

                        <p>
                          {displayName}
                        </p>
                      </div>
                    </div>

                    {/* =================================
                        TYPE
                    ================================= */}

                    <div className="position-field">
                      <span>
                        Type
                      </span>

                      <strong className="intraday">
                        {position.category ===
                        "F&O"
                          ? `📈 ${position.type}`
                          : "⚡ INTRADAY"}
                      </strong>
                    </div>

                    {/* =================================
                        STRIKE
                    ================================= */}

                    {position.category ===
                      "F&O" && (
                      <div className="position-field">
                        <span>
                          Strike
                        </span>

                        <strong>
                          {position.strike}
                        </strong>
                      </div>
                    )}

                    {/* =================================
                        QUANTITY
                    ================================= */}

                    <div className="position-field">
                      <span>
                        Quantity
                      </span>

                      <strong>
                        {quantity}
                      </strong>
                    </div>

                    {/* =================================
                        BUY PRICE
                    ================================= */}

                    <div className="position-field">
                      <span>
                        Buy Price
                      </span>

                      <strong>
                        ₹
                        {buyPrice.toFixed(
                          2
                        )}
                      </strong>
                    </div>

                    {/* =================================
                        CURRENT PRICE
                    ================================= */}

                    <div className="position-field">
                      <span>
                        {position.category ===
                        "F&O"
                          ? "Current Premium"
                          : "Current Price"}
                      </span>

                      <strong className="live-price">
                        ₹
                        {currentPrice.toFixed(
                          2
                        )}
                      </strong>
                    </div>

                    {/* =================================
                        CURRENT VALUE
                    ================================= */}

                    <div className="position-field">
                      <span>
                        Current Value
                      </span>

                      <strong>
                        ₹
                        {positionCurrentValue.toFixed(
                          2
                        )}
                      </strong>
                    </div>

                    {/* =================================
                        P/L
                    ================================= */}

                    <div className="position-field">
                      <span>
                        P/L
                      </span>

                      <strong
                        className={
                          profitLoss >= 0
                            ? "profit"
                            : "loss"
                        }
                      >
                        {profitLoss >= 0
                          ? "+"
                          : ""}
                        ₹
                        {profitLoss.toFixed(
                          2
                        )}
                      </strong>

                      <small
                        className={
                          profitLoss >= 0
                            ? "profit"
                            : "loss"
                        }
                      >
                        (
                        {profitLoss >= 0
                          ? "+"
                          : ""}
                        {profitLossPercentage.toFixed(
                          2
                        )}
                        %)
                      </small>
                    </div>

                    {/* =================================
                        BUY BUTTON
                    ================================= */}

                    <button
                      type="button"
                      className="position-buy-button"
                      onClick={() => {
                        if (
                          position.category ===
                          "F&O"
                        ) {
                          buyFOPosition(
                            position
                          );
                        } else {
                          buyStock(
                            position
                          );
                        }
                      }}
                    >
                      🟢 BUY
                      {position.category ===
                        "F&O" &&
                        ` ${quantity}`}
                    </button>

                    {/* =================================
                        SELL BUTTON
                    ================================= */}

                    <button
                      type="button"
                      className="position-sell-button"
                      onClick={() => {
                        if (
                          position.category ===
                          "F&O"
                        ) {
                          sellFOPosition(
                            position
                          );
                        } else {
                          sellStock(
                            position
                          );
                        }
                      }}
                    >
                      🔴 SELL
                      {position.category ===
                        "F&O" &&
                        ` ${quantity}`}
                    </button>

                    {/* =================================
                        CLOSE BUTTON
                    ================================= */}

                    <button
                      type="button"
                      className="close-position"
                      onClick={() =>
                        closePosition(
                          position
                        )
                      }
                    >
                      Close
                    </button>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Positions;