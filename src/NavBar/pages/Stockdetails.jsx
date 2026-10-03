
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./StockDetails.css";

// =====================================================
// API CONFIGURATION
// =====================================================

const API_URL =  "https://sharemarket-da04.onrender.com/stocks"
const INITIAL_BALANCE = 100000;

const PERIODS = ["1D", "1W", "1M", "6M", "1Y", "5Y"];

// =====================================================
// SAFE LOCAL STORAGE
// =====================================================

const getStorageArray = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};

// =====================================================
// ACCOUNT
// =====================================================

const getAccountFromStorage = () => {
  try {
    const existingAccount = JSON.parse(
      localStorage.getItem("account")
    );

    if (
      existingAccount &&
      typeof existingAccount === "object"
    ) {
      return {
        balance: Number(existingAccount.balance) || 0,

        investedAmount:
          Number(existingAccount.investedAmount) || 0,

        holdings: Array.isArray(existingAccount.holdings)
          ? existingAccount.holdings
          : [],
      };
    }
  } catch (error) {
    console.error("Account read error:", error);
  }

  const newAccount = {
    balance: INITIAL_BALANCE,
    investedAmount: 0,
    holdings: [],
  };

  localStorage.setItem(
    "account",
    JSON.stringify(newAccount)
  );

  return newAccount;
};

// =====================================================
// SAVE ACCOUNT
// =====================================================

const saveAccount = (account) => {
  const safeAccount = {
    balance: Number(account.balance) || 0,

    investedAmount:
      Number(account.investedAmount) || 0,

    holdings: Array.isArray(account.holdings)
      ? account.holdings
      : [],
  };

  localStorage.setItem(
    "account",
    JSON.stringify(safeAccount)
  );

  return safeAccount;
};

// =====================================================
// FORMAT MONEY
// =====================================================

const formatMoney = (value) => {
  const number = Number(value) || 0;

  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// =====================================================
// GENERATE CHART DATA
// =====================================================

const generateChartData = (price, period) => {
  const data = [];

  const basePrice = Number(price) || 1;

  const points = 30;

  let currentPrice = basePrice;

  for (let i = 0; i < points; i++) {
    const movement =
      (Math.random() - 0.5) *
      basePrice *
      0.03;

    currentPrice = Math.max(
      1,
      currentPrice + movement
    );

    let label = "";

    if (period === "1D") {
      const totalMinutes = i * 15;

      const hour =
        9 + Math.floor(totalMinutes / 60);

      const minute = totalMinutes % 60;

      label =
        `${String(hour).padStart(2, "0")}:` +
        `${String(minute).padStart(2, "0")}`;
    } else if (
      period === "1W" ||
      period === "1M"
    ) {
      label = `Day ${i + 1}`;
    } else if (
      period === "6M" ||
      period === "1Y"
    ) {
      label = `Month ${i + 1}`;
    } else {
      label = `Year ${i + 1}`;
    }

    data.push({
      time: label,
      price: Number(currentPrice.toFixed(2)),
    });
  }

  return data;
};

// =====================================================
// NORMALIZE STOCK HOLDING
// =====================================================

const normalizeStockHolding = (holding) => {
  const quantity =
    Number(holding.quantity) || 0;

  const buyPrice =
    Number(
      holding.buyPrice ??
      holding.averagePrice
    ) || 0;

  const totalInvested =
    Number(holding.totalInvested) ||
    Number(
      (
        quantity * buyPrice
      ).toFixed(2)
    );

  return {
    ...holding,

    type: "STOCK",

    category: "STOCK",

    quantity,

    buyPrice,

    averagePrice: Number(
      buyPrice.toFixed(2)
    ),

    totalInvested: Number(
      totalInvested.toFixed(2)
    ),

    currentPrice: Number(
      holding.currentPrice ?? buyPrice
    ),

    totalValue: Number(
      holding.totalValue ??
      quantity * buyPrice
    ),

    realizedProfitLoss:
      Number(
        holding.realizedProfitLoss
      ) || 0,
  };
};

// =====================================================
// COMPONENT
// =====================================================

function StockDetails() {
  const { symbol } = useParams();

  const navigate = useNavigate();

  // ===================================================
  // STATES
  // ===================================================

  const [stock, setStock] =
    useState(null);

  const [chartData, setChartData] =
    useState([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState("1D");

  const [quantity, setQuantity] =
    useState("");

  const [orderType, setOrderType] =
    useState(null);

  const [tradeMode, setTradeMode] =
    useState(null);

  const [isWatchlisted, setIsWatchlisted] =
    useState(false);

  const [accountBalance, setAccountBalance] =
    useState(0);

  const [holdingRefresh, setHoldingRefresh] =
    useState(0);

  // ===================================================
  // LIVE PRICE REF
  // ===================================================

  const livePriceRef = useRef(null);

  // ===================================================
  // LOAD ACCOUNT BALANCE
  // ===================================================

  const loadAccountBalance = () => {
    const account =
      getAccountFromStorage();

    setAccountBalance(
      Number(account.balance) || 0
    );
  };

  // ===================================================
  // UPDATE ACCOUNT BALANCE
  // ===================================================

  const updateAccountBalance = (
    amount
  ) => {
    const account =
      getAccountFromStorage();

    const currentBalance =
      Number(account.balance) || 0;

    const newBalance =
      currentBalance +
      Number(amount || 0);

    const updatedAccount = {
      ...account,

      balance: Number(
        Math.max(
          0,
          newBalance
        ).toFixed(2)
      ),
    };

    saveAccount(updatedAccount);

    setAccountBalance(
      updatedAccount.balance
    );

    return updatedAccount;
  };

  // ===================================================
  // UPDATE INVESTED AMOUNT
  // ===================================================

  const updateInvestedAmount = (
    amount
  ) => {
    const account =
      getAccountFromStorage();

    const currentInvested =
      Number(
        account.investedAmount
      ) || 0;

    const newInvested =
      Math.max(
        0,
        currentInvested +
        Number(amount || 0)
      );

    const updatedAccount = {
      ...account,

      investedAmount:
        Number(
          newInvested.toFixed(2)
        ),
    };

    saveAccount(updatedAccount);

    return updatedAccount;
  };

  // ===================================================
  // SYNC ACCOUNT HOLDINGS
  // ===================================================

  const syncAccountHoldings = (
    holdings
  ) => {
    const account =
      getAccountFromStorage();

    const updatedAccount = {
      ...account,

      holdings:
        Array.isArray(holdings)
          ? holdings
          : [],
    };

    saveAccount(updatedAccount);
  };

  // ===================================================
  // INITIAL ACCOUNT LOAD
  // ===================================================

  useEffect(() => {
    loadAccountBalance();
  }, [holdingRefresh]);

  // ===================================================
  // CHECK WATCHLIST
  // ===================================================

  const checkWatchlist = (
    stockSymbol
  ) => {
    const watchlist =
      getStorageArray("watchlist");

    const exists =
      watchlist.some(
        (item) =>
          item.symbol ===
          stockSymbol
      );

    setIsWatchlisted(exists);
  };

  // ===================================================
  // FETCH STOCK
  // ===================================================

  const fetchStock = async () => {
    try {
      console.log(
        "Fetching stock API:",
        API_URL
      );

      const response =
        await fetch(API_URL);

      console.log(
        "API status:",
        response.status
      );

      // -------------------------------------------------
      // CHECK HTTP STATUS
      // -------------------------------------------------

      if (!response.ok) {
        throw new Error(
          `Stock API failed: ${response.status} ${response.statusText}`
        );
      }

      // -------------------------------------------------
      // CHECK CONTENT TYPE
      // -------------------------------------------------

      const contentType =
        response.headers.get(
          "content-type"
        );

      console.log(
        "API Content-Type:",
        contentType
      );

      if (
        !contentType ||
        !contentType.includes(
          "application/json"
        )
      ) {
        const text =
          await response.text();

        console.error(
          "Server returned non-JSON:",
          text.substring(0, 300)
        );

        throw new Error(
          "API did not return JSON. Check JSON Server port."
        );
      }

      // -------------------------------------------------
      // CONVERT RESPONSE TO JSON
      // -------------------------------------------------

      const data =
        await response.json();

      // -------------------------------------------------
      // CHECK ARRAY
      // -------------------------------------------------

      if (!Array.isArray(data)) {
        throw new Error(
          "Stock API response is not an array."
        );
      }

      // -------------------------------------------------
      // FIND STOCK
      // -------------------------------------------------

      const foundStock =
        data.find(
          (item) =>
            String(item.symbol)
              .toUpperCase() ===
            String(symbol)
              .toUpperCase()
        );

      if (!foundStock) {
        console.error(
          "Stock not found:",
          symbol
        );

        console.log(
          "Available stocks:",
          data
        );

        return;
      }

      // -------------------------------------------------
      // API PRICE
      // -------------------------------------------------

      const apiPrice =
        Number(foundStock.price) || 1;

      // -------------------------------------------------
      // INITIAL LIVE PRICE
      // -------------------------------------------------

      if (
        livePriceRef.current ===
        null
      ) {
        livePriceRef.current =
          apiPrice;
      }

      // -------------------------------------------------
      // PREVIOUS PRICE
      // -------------------------------------------------

      const previousPrice =
        Number(
          livePriceRef.current
        ) || apiPrice;

      // -------------------------------------------------
      // RANDOM PRICE MOVEMENT
      // -------------------------------------------------

      const movement =
        (Math.random() - 0.5) *
        previousPrice *
        0.01;

      const newPrice =
        Math.max(
          1,
          previousPrice +
          movement
        );

      livePriceRef.current =
        newPrice;

      // -------------------------------------------------
      // CHANGE %
      // -------------------------------------------------

      const basePrice =
        apiPrice;

      const newChange =
        (
          (newPrice -
            basePrice) /
          basePrice
        ) * 100;

      // -------------------------------------------------
      // UPDATED STOCK
      // -------------------------------------------------

      const updatedStock = {
        ...foundStock,

        price: Number(
          newPrice.toFixed(2)
        ),

        change: Number(
          newChange.toFixed(2)
        ),

        type: "STOCK",

        category: "STOCK",
      };

      // -------------------------------------------------
      // UPDATE STATE
      // -------------------------------------------------

      setStock(
        updatedStock
      );

      // -------------------------------------------------
      // WATCHLIST
      // -------------------------------------------------

      checkWatchlist(
        foundStock.symbol
      );

      // -------------------------------------------------
      // 1D LIVE CHART
      // -------------------------------------------------

      if (
        selectedPeriod ===
        "1D"
      ) {
        setChartData(
          (previousData) => {
            const newPoint = {
              time:
                new Date()
                  .toLocaleTimeString(
                    [],
                    {
                      hour:
                        "2-digit",

                      minute:
                        "2-digit",

                      second:
                        "2-digit",
                    }
                  ),

              price:
                updatedStock.price,
            };

            if (
              previousData.length ===
              0
            ) {
              const initialData =
                generateChartData(
                  updatedStock.price,
                  "1D"
                );

              return [
                ...initialData.slice(
                  0,
                  29
                ),
                newPoint,
              ];
            }

            return [
              ...previousData,
              newPoint,
            ].slice(-30);
          }
        );
      }
    } catch (error) {
      console.error(
        "Stock API Error:",
        error
      );
    }
  };

  // ===================================================
  // FETCH STOCK + LIVE UPDATE
  // ===================================================

  useEffect(() => {
    let mounted = true;

    const loadStock =
      async () => {
        if (!mounted) {
          return;
        }

        await fetchStock();
      };

    loadStock();

    const interval =
      setInterval(() => {
        if (mounted) {
          fetchStock();
        }
      }, 3000);

    return () => {
      mounted = false;

      clearInterval(
        interval
      );
    };
  }, [
    symbol,
    selectedPeriod,
  ]);

  // ===================================================
  // RESET LIVE PRICE
  // ===================================================

  useEffect(() => {
    livePriceRef.current =
      null;
  }, [symbol]);

  // ===================================================
  // NON 1D CHART
  // ===================================================

  useEffect(() => {
    if (
      stock &&
      selectedPeriod !==
        "1D"
    ) {
      setChartData(
        generateChartData(
          stock.price,
          selectedPeriod
        )
      );
    }
  }, [
    stock,
    selectedPeriod,
  ]);

  // ===================================================
  // CHANGE PERIOD
  // ===================================================

  const changePeriod = (
    period
  ) => {
    setSelectedPeriod(
      period
    );

    if (stock) {
      setChartData(
        generateChartData(
          stock.price,
          period
        )
      );
    }
  };

  // ===================================================
  // TOGGLE WATCHLIST
  // ===================================================

  const toggleWatchlist = () => {
    if (!stock) {
      return;
    }

    const existingWatchlist =
      getStorageArray(
        "watchlist"
      );

    // -------------------------------------------------
    // REMOVE
    // -------------------------------------------------

    if (isWatchlisted) {
      const updatedWatchlist =
        existingWatchlist.filter(
          (item) =>
            item.symbol !==
            stock.symbol
        );

      localStorage.setItem(
        "watchlist",
        JSON.stringify(
          updatedWatchlist
        )
      );

      setIsWatchlisted(
        false
      );

      alert(
        `${stock.symbol} removed from Watchlist`
      );

      return;
    }

    // -------------------------------------------------
    // CHECK EXISTING
    // -------------------------------------------------

    const alreadyExists =
      existingWatchlist.some(
        (item) =>
          item.symbol ===
          stock.symbol
      );

    if (alreadyExists) {
      setIsWatchlisted(
        true
      );

      return;
    }

    // -------------------------------------------------
    // ADD
    // -------------------------------------------------

    const updatedWatchlist = [
      ...existingWatchlist,

      {
        id: stock.id,

        symbol:
          stock.symbol,

        name:
          stock.name,

        price:
          stock.price,

        change:
          stock.change,

        type: "STOCK",

        category: "STOCK",
      },
    ];

    localStorage.setItem(
      "watchlist",
      JSON.stringify(
        updatedWatchlist
      )
    );

    setIsWatchlisted(
      true
    );

    alert(
      `${stock.symbol} added to Watchlist ⭐`
    );
  };

  // ===================================================
  // GET HOLDINGS
  // ===================================================

  const getHoldings = () => {
    const holdings =
      getStorageArray(
        "holdings"
      );

    const normalizedHoldings =
      holdings.map(
        (holding) => {
          if (
            holding.type ===
              "MUTUAL_FUND" ||
            holding.category ===
              "MUTUAL FUND"
          ) {
            return holding;
          }

          return normalizeStockHolding(
            holding
          );
        }
      );

    localStorage.setItem(
      "holdings",
      JSON.stringify(
        normalizedHoldings
      )
    );

    syncAccountHoldings(
      normalizedHoldings
    );

    return normalizedHoldings;
  };

  // ===================================================
  // GET POSITIONS
  // ===================================================

  const getPositions = () => {
    return getStorageArray(
      "positions"
    );
  };

  // ===================================================
  // CURRENT HOLDING
  // ===================================================

  const getCurrentHolding = () => {
    const holdings =
      getHoldings();

    return holdings.find(
      (item) =>
        item.symbol ===
          symbol &&
        (
          item.type ===
            "STOCK" ||
          item.category ===
            "STOCK"
        )
    );
  };

  // ===================================================
  // CURRENT POSITION
  // ===================================================

  const getCurrentPosition = () => {
    const positions =
      getPositions();

    return positions.find(
      (item) =>
        item.symbol ===
        symbol
    );
  };

  // ===================================================
  // HANDLE BUY
  // ===================================================

  const handleBuy = () => {
    if (!stock) {
      return;
    }

    setOrderType("BUY");

    setTradeMode(null);
  };

  // ===================================================
  // HANDLE SELL
  // ===================================================

  const handleSell = () => {
    if (!stock) {
      return;
    }

    const holding =
      getCurrentHolding();

    const position =
      getCurrentPosition();

    if (
      !holding &&
      !position
    ) {
      alert(
        `You don't own any ${stock.symbol} shares.`
      );

      return;
    }

    setOrderType("SELL");

    if (
      holding &&
      !position
    ) {
      setTradeMode(
        "HOLDING"
      );

      return;
    }

    if (
      position &&
      !holding
    ) {
      setTradeMode(
        "INTRADAY"
      );

      return;
    }

    setTradeMode(null);
  };

  // ===================================================
  // SELECT TRADE MODE
  // ===================================================

  const selectTradeMode = (
    mode
  ) => {
    setTradeMode(mode);
  };

  // ===================================================
  // CREATE ORDER
  // ===================================================

  const createOrder = (
    type,
    price,
    qty,
    mode
  ) => {
    const existingOrders =
      getStorageArray(
        "orders"
      );

    const orderPrice =
      Number(price);

    const orderQuantity =
      Number(qty);

    if (
      !Number.isFinite(
        orderPrice
      ) ||
      !Number.isInteger(
        orderQuantity
      ) ||
      orderQuantity < 1
    ) {
      return null;
    }

    const total =
      orderPrice *
      orderQuantity;

    const newOrder = {
      id: Date.now(),

      symbol:
        stock.symbol,

      name:
        stock.name,

      type,

      mode,

      assetType:
        "STOCK",

      category:
        "STOCK",

      quantity:
        orderQuantity,

      price: Number(
        orderPrice.toFixed(2)
      ),

      total: Number(
        total.toFixed(2)
      ),

      status:
        "PENDING",

      createdAt:
        new Date().toLocaleString(),

      completedAt:
        null,
    };

    localStorage.setItem(
      "orders",
      JSON.stringify([
        newOrder,
        ...existingOrders,
      ])
    );

    return newOrder;
  };

  // ===================================================
  // MARK ORDER COMPLETED
  // ===================================================

  const markOrderCompleted = (
    orderId
  ) => {
    const orders =
      getStorageArray(
        "orders"
      );

    const index =
      orders.findIndex(
        (order) =>
          order.id ===
          orderId
      );

    if (index === -1) {
      return false;
    }

    orders[index] = {
      ...orders[index],

      status:
        "COMPLETED",

      completedAt:
        new Date().toLocaleString(),
    };

    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );

    return true;
  };

  // ===================================================
  // MARK ORDER FAILED
  // ===================================================

  const markOrderFailed = (
    orderId
  ) => {
    const orders =
      getStorageArray(
        "orders"
      );

    const index =
      orders.findIndex(
        (order) =>
          order.id ===
          orderId
      );

    if (index === -1) {
      return false;
    }

    orders[index] = {
      ...orders[index],

      status:
        "FAILED",

      completedAt:
        new Date().toLocaleString(),
    };

    localStorage.setItem(
      "orders",
      JSON.stringify(orders)
    );

    return true;
  };

  // ===================================================
  // COMPLETE BUY - HOLDING
  // ===================================================

  const completeBuyHoldingOrder = (
    order
  ) => {
    const holdings =
      getHoldings();

    const existingHolding =
      holdings.find(
        (item) =>
          item.symbol ===
            order.symbol &&
          (
            item.type ===
              "STOCK" ||
            item.category ===
              "STOCK"
          )
      );

    // -------------------------------------------------
    // EXISTING STOCK
    // -------------------------------------------------

    if (existingHolding) {
      const oldQuantity =
        Number(
          existingHolding.quantity
        ) || 0;

      const oldInvestment =
        Number(
          existingHolding.totalInvested
        ) || 0;

      const newQuantity =
        Number(
          order.quantity
        );

      const newInvestment =
        Number(
          order.total
        );

      const totalQuantity =
        oldQuantity +
        newQuantity;

      const totalInvestment =
        oldInvestment +
        newInvestment;

      const averageBuyPrice =
        totalInvestment /
        totalQuantity;

      existingHolding.quantity =
        totalQuantity;

      existingHolding.totalInvested =
        Number(
          totalInvestment.toFixed(2)
        );

      existingHolding.buyPrice =
        Number(
          averageBuyPrice.toFixed(2)
        );

      existingHolding.averagePrice =
        Number(
          averageBuyPrice.toFixed(2)
        );

      existingHolding.currentPrice =
        Number(
          stock.price
        );

      existingHolding.totalValue =
        Number(
          (
            totalQuantity *
            Number(stock.price)
          ).toFixed(2)
        );

      existingHolding.type =
        "STOCK";

      existingHolding.category =
        "STOCK";
    }

    // -------------------------------------------------
    // NEW STOCK
    // -------------------------------------------------

    else {
      const newHolding = {
        id:
          order.id,

        symbol:
          order.symbol,

        name:
          order.name,

        type:
          "STOCK",

        category:
          "STOCK",

        quantity:
          Number(
            order.quantity
          ),

        buyPrice:
          Number(
            order.price
          ),

        averagePrice:
          Number(
            order.price
          ),

        totalInvested:
          Number(
            order.total
          ),

        currentPrice:
          Number(
            stock.price
          ),

        totalValue:
          Number(
            (
              Number(
                order.quantity
              ) *
              Number(
                stock.price
              )
            ).toFixed(2)
          ),

        realizedProfitLoss:
          0,
      };

      holdings.push(
        newHolding
      );
    }

    // -------------------------------------------------
    // SAVE
    // -------------------------------------------------

    localStorage.setItem(
      "holdings",
      JSON.stringify(
        holdings
      )
    );

    syncAccountHoldings(
      holdings
    );

    console.log(
      "STOCK HOLDING SAVED:",
      holdings
    );

    updateInvestedAmount(
      order.total
    );

    setHoldingRefresh(
      (previous) =>
        previous + 1
    );

    return true;
  };

  // ===================================================
  // COMPLETE BUY - INTRADAY
  // ===================================================

  const completeBuyIntradayOrder = (
    order
  ) => {
    const positions =
      getPositions();

    const existingPosition =
      positions.find(
        (item) =>
          item.symbol ===
          order.symbol
      );

    // -------------------------------------------------
    // EXISTING POSITION
    // -------------------------------------------------

    if (existingPosition) {
      const oldQuantity =
        Number(
          existingPosition.quantity
        ) || 0;

      const oldInvestment =
        Number(
          existingPosition.totalInvested
        ) || 0;

      const newQuantity =
        Number(
          order.quantity
        );

      const newInvestment =
        Number(
          order.total
        );

      const totalQuantity =
        oldQuantity +
        newQuantity;

      const totalInvestment =
        oldInvestment +
        newInvestment;

      const averageBuyPrice =
        totalInvestment /
        totalQuantity;

      existingPosition.quantity =
        totalQuantity;

      existingPosition.totalInvested =
        Number(
          totalInvestment.toFixed(2)
        );

      existingPosition.buyPrice =
        Number(
          averageBuyPrice.toFixed(2)
        );

      existingPosition.averagePrice =
        Number(
          averageBuyPrice.toFixed(2)
        );

      existingPosition.type =
        "STOCK";

      existingPosition.category =
        "STOCK";

      existingPosition.currentPrice =
        Number(
          stock.price
        );
    }

    // -------------------------------------------------
    // NEW POSITION
    // -------------------------------------------------

    else {
      positions.push({
        id:
          order.id,

        symbol:
          order.symbol,

        name:
          order.name,

        quantity:
          Number(
            order.quantity
          ),

        buyPrice:
          Number(
            order.price
          ),

        averagePrice:
          Number(
            order.price
          ),

        totalInvested:
          Number(
            order.total
          ),

        currentPrice:
          Number(
            stock.price
          ),

        type:
          "STOCK",

        category:
          "STOCK",

        mode:
          "INTRADAY",

        orderType:
          "BUY",

        status:
          "OPEN",

        realizedProfitLoss:
          0,

        createdAt:
          order.createdAt,
      });
    }

    localStorage.setItem(
      "positions",
      JSON.stringify(
        positions
      )
    );

    console.log(
      "STOCK INTRADAY POSITION SAVED:",
      positions
    );

    updateInvestedAmount(
      order.total
    );

    setHoldingRefresh(
      (previous) =>
        previous + 1
    );

    return true;
  };

  // ===================================================
  // COMPLETE SELL
  // ===================================================

  const completeSellOrder = (
    order
  ) => {
    const sellQuantity =
      Number(
        order.quantity
      );

    const sellValue =
      Number(
        order.total
      );

    // =================================================
    // INTRADAY SELL
    // =================================================

    if (
      order.mode ===
      "INTRADAY"
    ) {
      const positions =
        getPositions();

      const position =
        positions.find(
          (item) =>
            item.symbol ===
            order.symbol
        );

      if (!position) {
        alert(
          `You don't have any ${order.symbol} intraday position.`
        );

        markOrderFailed(
          order.id
        );

        return false;
      }

      const currentQuantity =
        Number(
          position.quantity
        ) || 0;

      if (
        sellQuantity >
        currentQuantity
      ) {
        alert(
          `You only have ${currentQuantity} shares of ${order.symbol}.`
        );

        markOrderFailed(
          order.id
        );

        return false;
      }

      const averageBuyPrice =
        Number(
          position.buyPrice
        ) || 0;

      const profitLoss =
        (
          Number(order.price) -
          averageBuyPrice
        ) *
        sellQuantity;

      const remainingQuantity =
        currentQuantity -
        sellQuantity;

      updateAccountBalance(
        sellValue
      );

      const remainingInvestment =
        remainingQuantity *
        averageBuyPrice;

      if (
        remainingQuantity ===
        0
      ) {
        const updatedPositions =
          positions.filter(
            (item) =>
              item.symbol !==
              order.symbol
          );

        localStorage.setItem(
          "positions",
          JSON.stringify(
            updatedPositions
          )
        );
      } else {
        position.quantity =
          remainingQuantity;

        position.totalInvested =
          Number(
            remainingInvestment.toFixed(
              2
            )
          );

        position.averagePrice =
          Number(
            averageBuyPrice.toFixed(
              2
            )
          );

        position.currentPrice =
          Number(
            stock.price
          );

        position.totalValue =
          Number(
            (
              remainingQuantity *
              Number(stock.price)
            ).toFixed(2)
          );

        position.realizedProfitLoss =
          Number(
            (
              Number(
                position.realizedProfitLoss ||
                0
              ) +
              profitLoss
            ).toFixed(2)
          );

        localStorage.setItem(
          "positions",
          JSON.stringify(
            positions
          )
        );
      }

      updateInvestedAmount(
        -(
          sellQuantity *
          averageBuyPrice
        )
      );

      markOrderCompleted(
        order.id
      );

      setHoldingRefresh(
        (previous) =>
          previous + 1
      );

      return true;
    }

    // =================================================
    // HOLDING SELL
    // =================================================

    const holdings =
      getHoldings();

    const holding =
      holdings.find(
        (item) =>
          item.symbol ===
            order.symbol &&
          (
            item.type ===
              "STOCK" ||
            item.category ===
              "STOCK"
          )
      );

    if (!holding) {
      alert(
        `You don't own ${order.symbol} shares.`
      );

      markOrderFailed(
        order.id
      );

      return false;
    }

    const currentQuantity =
      Number(
        holding.quantity
      ) || 0;

    if (
      sellQuantity >
      currentQuantity
    ) {
      alert(
        `You only have ${currentQuantity} shares of ${order.symbol}.`
      );

      markOrderFailed(
        order.id
      );

      return false;
    }

    const averageBuyPrice =
      Number(
        holding.buyPrice ??
        holding.averagePrice
      ) || 0;

    const profitLoss =
      (
        Number(order.price) -
        averageBuyPrice
      ) *
      sellQuantity;

    const remainingQuantity =
      currentQuantity -
      sellQuantity;

    updateAccountBalance(
      sellValue
    );

    const remainingInvestment =
      remainingQuantity *
      averageBuyPrice;

    if (
      remainingQuantity ===
      0
    ) {
      const updatedHoldings =
        holdings.filter(
          (item) =>
            item.symbol !==
            order.symbol
        );

      localStorage.setItem(
        "holdings",
        JSON.stringify(
          updatedHoldings
        )
      );

      syncAccountHoldings(
        updatedHoldings
      );
    } else {
      holding.quantity =
        remainingQuantity;

      holding.totalInvested =
        Number(
          remainingInvestment.toFixed(
            2
          )
        );

      holding.buyPrice =
        Number(
          averageBuyPrice.toFixed(
            2
          )
        );

      holding.averagePrice =
        Number(
          averageBuyPrice.toFixed(
            2
          )
        );

      holding.currentPrice =
        Number(
          stock.price
        );

      holding.totalValue =
        Number(
          (
            remainingQuantity *
            Number(stock.price)
          ).toFixed(2)
        );

      holding.type =
        "STOCK";

      holding.category =
        "STOCK";

      holding.realizedProfitLoss =
        Number(
          (
            Number(
              holding.realizedProfitLoss ||
              0
            ) +
            profitLoss
          ).toFixed(2)
        );

      localStorage.setItem(
        "holdings",
        JSON.stringify(
          holdings
        )
      );

      syncAccountHoldings(
        holdings
      );
    }

    updateInvestedAmount(
      -(
        sellQuantity *
        averageBuyPrice
      )
    );

    markOrderCompleted(
      order.id
    );

    setHoldingRefresh(
      (previous) =>
        previous + 1
    );

    return true;
  };

  // ===================================================
  // CONFIRM ORDER
  // ===================================================

  const confirmOrder = () => {
    if (!stock) {
      return;
    }

    const qty =
      Number(quantity);

    // -------------------------------------------------
    // QUANTITY
    // -------------------------------------------------

    if (
      quantity === "" ||
      !Number.isInteger(qty) ||
      qty < 1
    ) {
      alert(
        "Please enter a valid quantity (minimum 1)."
      );

      return;
    }

    // -------------------------------------------------
    // PRICE
    // -------------------------------------------------

    const price =
      Number(stock.price);

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      alert(
        "Invalid stock price."
      );

      return;
    }

    const total =
      price * qty;

    // =================================================
    // BUY
    // =================================================

    if (
      orderType ===
      "BUY"
    ) {
      if (!tradeMode) {
        alert(
          "Please select Intraday or Holding."
        );

        return;
      }

      const account =
        getAccountFromStorage();

      const balance =
        Number(
          account.balance
        ) || 0;

      if (
        total >
        balance
      ) {
        alert(
          `Insufficient account balance.\n\n` +
          `Available Balance: ₹${formatMoney(
            balance
          )}\n` +
          `Order Value: ₹${formatMoney(
            total
          )}\n\n` +
          `Please reduce the quantity.`
        );

        return;
      }

      const newOrder =
        createOrder(
          "BUY",
          price,
          qty,
          tradeMode
        );

      if (!newOrder) {
        alert(
          "Unable to create order."
        );

        return;
      }

      // Deduct balance

      updateAccountBalance(
        -total
      );

      let success =
        false;

      if (
        tradeMode ===
        "HOLDING"
      ) {
        success =
          completeBuyHoldingOrder(
            newOrder
          );
      } else {
        success =
          completeBuyIntradayOrder(
            newOrder
          );
      }

      if (!success) {
        updateAccountBalance(
          total
        );

        markOrderFailed(
          newOrder.id
        );

        alert(
          "Order could not be completed."
        );

        return;
      }

      markOrderCompleted(
        newOrder.id
      );

      const selectedMode =
        tradeMode;

      setOrderType(null);

      setTradeMode(null);

      setQuantity("");

      if (
        selectedMode ===
        "HOLDING"
      ) {
        navigate(
          "/holding"
        );
      } else {
        navigate(
          "/positions"
        );
      }

      return;
    }

    // =================================================
    // SELL
    // =================================================

    if (
      orderType ===
      "SELL"
    ) {
      if (!tradeMode) {
        alert(
          "Please select Holding or Intraday."
        );

        return;
      }

      const holdings =
        getHoldings();

      const positions =
        getPositions();

      let availableQuantity =
        0;

      // -------------------------------------------------
      // HOLDING
      // -------------------------------------------------

      if (
        tradeMode ===
        "HOLDING"
      ) {
        const holding =
          holdings.find(
            (item) =>
              item.symbol ===
                stock.symbol &&
              (
                item.type ===
                  "STOCK" ||
                item.category ===
                  "STOCK"
              )
          );

        if (!holding) {
          alert(
            `You don't own ${stock.symbol} in Holdings.`
          );

          return;
        }

        availableQuantity =
          Number(
            holding.quantity
          ) || 0;
      }

      // -------------------------------------------------
      // INTRADAY
      // -------------------------------------------------

      else {
        const position =
          positions.find(
            (item) =>
              item.symbol ===
              stock.symbol
          );

        if (!position) {
          alert(
            `You don't have an Intraday position for ${stock.symbol}.`
          );

          return;
        }

        availableQuantity =
          Number(
            position.quantity
          ) || 0;
      }

      // -------------------------------------------------
      // QUANTITY
      // -------------------------------------------------

      if (
        qty >
        availableQuantity
      ) {
        alert(
          `You only have ${availableQuantity} shares of ${stock.symbol}.`
        );

        return;
      }

      // -------------------------------------------------
      // CREATE SELL ORDER
      // -------------------------------------------------

      const sellOrder =
        createOrder(
          "SELL",
          price,
          qty,
          tradeMode
        );

      if (!sellOrder) {
        alert(
          "Unable to create sell order."
        );

        return;
      }

      // -------------------------------------------------
      // COMPLETE SELL
      // -------------------------------------------------

      const success =
        completeSellOrder(
          sellOrder
        );

      if (!success) {
        return;
      }

      setOrderType(null);

      setTradeMode(null);

      setQuantity("");

      navigate(
        "/orders"
      );
    }
  };

  // ===================================================
  // CLOSE POPUP
  // ===================================================

  const closePopup = () => {
    setOrderType(null);

    setTradeMode(null);
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (!stock) {
    return (
      <div className="loading">
        Loading stock...
      </div>
    );
  }

  // ===================================================
  // CURRENT HOLDING
  // ===================================================

  const currentHolding =
    getCurrentHolding();

  // ===================================================
  // CURRENT POSITION
  // ===================================================

  const currentPosition =
    getCurrentPosition();

  // ===================================================
  // HOLDING VALUES
  // ===================================================

  const holdingQuantity =
    currentHolding
      ? Number(
          currentHolding.quantity
        ) || 0
      : 0;

  const positionQuantity =
    currentPosition
      ? Number(
          currentPosition.quantity
        ) || 0
      : 0;

  const totalInvestment =
    currentHolding
      ? Number(
          currentHolding.totalInvested
        ) || 0
      : 0;

  const averageBuyPrice =
    holdingQuantity > 0
      ? totalInvestment /
        holdingQuantity
      : 0;

  // ===================================================
  // CURRENT VALUE
  // ===================================================

  const currentValue =
    holdingQuantity *
    Number(stock.price);

  // ===================================================
  // PROFIT / LOSS
  // ===================================================

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

  // ===================================================
  // ORDER TOTAL
  // ===================================================

  const orderTotal =
    Number(stock.price) *
    (Number(quantity) || 0);

  // ===================================================
  // SELL AVAILABLE
  // ===================================================

  const sellAvailableQuantity =
    tradeMode === "HOLDING"
      ? holdingQuantity
      : tradeMode === "INTRADAY"
        ? positionQuantity
        : 0;

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="details-page">

      {/* HEADER */}

      <header className="details-header">

        <button
          className="back-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back
        </button>

        <h1>
          📈 ShareMarket
        </h1>

        <div className="account-balance">
          💰 ₹
          {formatMoney(
            accountBalance
          )}
        </div>

        <button
          className="holdings-button"
          onClick={() =>
            navigate(
              "/holding"
            )
          }
        >
          📊 Holdings
        </button>

      </header>

      <div className="details-container">

        {/* STOCK INFORMATION */}

        <div className="stock-info">

          <div className="company-section">

            <div className="big-logo">
              {stock.symbol.charAt(0)}
            </div>

            <div>
              <h2>
                {stock.symbol}
              </h2>

              <p>
                {stock.name}
              </p>
            </div>

          </div>

          {/* WATCHLIST */}

          <button
            className={
              isWatchlisted
                ? "watchlist-button added"
                : "watchlist-button"
            }
            onClick={
              toggleWatchlist
            }
          >
            {isWatchlisted
              ? "⭐ Added"
              : "☆ Add to Watchlist"}
          </button>

          {/* PRICE */}

          <div className="current-price">
            ₹
            {Number(
              stock.price
            ).toFixed(2)}
          </div>

          {/* CHANGE */}

          <div
            className={
              stock.change >= 0
                ? "detail-change positive"
                : "detail-change negative"
            }
          >
            {stock.change >= 0
              ? "+"
              : ""}
            {stock.change}%
          </div>

          {/* LIVE */}

          <div className="live-status">
            <span></span>
            LIVE PRICE
          </div>

        </div>

        {/* GRAPH */}

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <h2>
                {stock.symbol} Price Chart
              </h2>

              <p>
                {selectedPeriod} price movement
              </p>
            </div>

            <div className="chart-live">
              ● LIVE
            </div>

          </div>

          <div className="chart">

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
                    "auto",
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

          <div className="time-buttons">

            {PERIODS.map(
              (period) => (
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

        {/* MY HOLDING */}

        <div className="my-holding-card">

          <div className="holding-title">

            <div>
              <h2>
                📦 My{" "}
                {stock.symbol} Holding
              </h2>

              <p>
                Your purchased shares
              </p>
            </div>

          </div>

          {holdingQuantity > 0 ? (

            <div className="holding-grid">

              <div className="holding-box">
                <span>
                  Shares Owned
                </span>

                <strong>
                  {holdingQuantity}
                </strong>
              </div>

              <div className="holding-box">
                <span>
                  Average Buy Price
                </span>

                <strong>
                  ₹
                  {averageBuyPrice.toFixed(
                    2
                  )}
                </strong>
              </div>

              <div className="holding-box">
                <span>
                  Total Investment
                </span>

                <strong>
                  ₹
                  {totalInvestment.toFixed(
                    2
                  )}
                </strong>
              </div>

              <div className="holding-box">
                <span>
                  Current Value
                </span>

                <strong>
                  ₹
                  {currentValue.toFixed(
                    2
                  )}
                </strong>
              </div>

              <div className="holding-box">
                <span>
                  Profit / Loss
                </span>

                <strong
                  className={
                    profitLoss >= 0
                      ? "positive"
                      : "negative"
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
              </div>

              <div className="holding-box">
                <span>
                  Return
                </span>

                <strong
                  className={
                    profitLossPercentage >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {profitLossPercentage >=
                  0
                    ? "+"
                    : ""}
                  {profitLossPercentage.toFixed(
                    2
                  )}
                  %
                </strong>
              </div>

            </div>

          ) : (

            <div className="no-holding">
              You don't own any shares
              of {stock.symbol}
            </div>

          )}

          {/* INTRADAY */}

          {positionQuantity > 0 && (
            <div className="no-holding">
              ⚡ Intraday Position:{" "}
              <strong>
                {positionQuantity}{" "}
                shares
              </strong>
            </div>
          )}

        </div>

        {/* TRADE CARD */}

        <div className="trade-card">

          <div className="trade-title">

            <h2>
              Trade {stock.symbol}
            </h2>

            <p>
              Buy or sell this stock
            </p>

          </div>

          <div className="trade-content">

            {/* QUANTITY */}

            <div className="quantity-box">

              <label>
                Quantity
              </label>

              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
              />

            </div>

            {/* ACCOUNT BALANCE */}

            <div className="total-box">

              <span>
                Account Balance
              </span>

              <strong>
                ₹
                {formatMoney(
                  accountBalance
                )}
              </strong>

            </div>

            {/* MARKET PRICE */}

            <div className="total-box">

              <span>
                Market Price
              </span>

              <strong>
                ₹
                {Number(
                  stock.price
                ).toFixed(2)}
              </strong>

            </div>

            {/* ORDER PRICE */}

            <div className="total-box">

              <span>
                Order Price
              </span>

              <strong>
                ₹
                {Number(
                  stock.price
                ).toFixed(2)}
              </strong>

            </div>

            {/* TOTAL */}

            <div className="total-box">

              <span>
                Total Investment
              </span>

              <strong>
                ₹
                {orderTotal.toFixed(
                  2
                )}
              </strong>

            </div>

            {/* WARNING */}

            {orderTotal >
              accountBalance &&
              orderType !==
                "SELL" && (
                <div className="investment-warning">

                  ⚠️ Insufficient
                  account balance.

                  <br />

                  Available: ₹
                  {accountBalance.toFixed(
                    2
                  )}

                </div>
              )}

            {/* BUTTONS */}

            <div className="trade-buttons">

              <button
                className="buy-button"
                onClick={
                  handleBuy
                }
              >
                🟢 BUY
              </button>

              <button
                className="sell-button"
                onClick={
                  handleSell
                }
              >
                🔴 SELL
              </button>

            </div>

          </div>

        </div>

        {/* STATISTICS */}

        <div className="statistics">

          <h2>
            Stock Information
          </h2>

          <div className="stats-grid">

            <div>
              <span>
                Current Price
              </span>

              <strong>
                ₹
                {Number(
                  stock.price
                ).toFixed(2)}
              </strong>
            </div>

            <div>
              <span>
                Change
              </span>

              <strong
                className={
                  stock.change >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {stock.change >= 0
                  ? "+"
                  : ""}
                {stock.change}%
              </strong>
            </div>

            <div>
              <span>
                Market
              </span>

              <strong>
                NSE
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

      {/* =================================================
          BUY / SELL POPUP
      ================================================= */}

      {orderType && (

        <div className="order-overlay">

          <div className="order-popup">

            {/* CLOSE */}

            <button
              className="popup-close"
              onClick={
                closePopup
              }
            >
              ✕
            </button>

            {/* =================================================
                BUY MODE SELECTION
            ================================================= */}

            {orderType === "BUY" &&
              !tradeMode && (

              <>
                <h2>
                  🟢 Buy{" "}
                  {stock.symbol}
                </h2>

                <p className="popup-subtitle">
                  Select your order type
                </p>

                <div className="popup-row">

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {quantity === ""
                      ? "Not entered"
                      : quantity}
                  </strong>

                </div>

                <div className="popup-total">

                  <span>
                    Total Investment
                  </span>

                  <strong>
                    ₹
                    {orderTotal.toFixed(
                      2
                    )}
                  </strong>

                </div>

                <div className="trade-mode-options">

                  {/* INTRADAY */}

                  <button
                    className="mode-card intraday-card"
                    onClick={() =>
                      selectTradeMode(
                        "INTRADAY"
                      )
                    }
                  >

                    <div className="mode-icon">
                      ⚡
                    </div>

                    <div>

                      <h3>
                        Intraday
                      </h3>

                      <p>
                        Buy and sell
                        within the same
                        trading day
                      </p>

                    </div>

                  </button>

                  {/* HOLDING */}

                  <button
                    className="mode-card holding-card"
                    onClick={() =>
                      selectTradeMode(
                        "HOLDING"
                      )
                    }
                  >

                    <div className="mode-icon">
                      📦
                    </div>

                    <div>

                      <h3>
                        Holding /
                        Delivery
                      </h3>

                      <p>
                        Buy and keep the
                        stock in your
                        holdings
                      </p>

                    </div>

                  </button>

                </div>

              </>

            )}

            {/* =================================================
                SELL MODE SELECTION
            ================================================= */}

            {orderType === "SELL" &&
              !tradeMode && (

              <>
                <h2>
                  🔴 Sell{" "}
                  {stock.symbol}
                </h2>

                <p className="popup-subtitle">
                  Select what you want
                  to sell
                </p>

                <div className="trade-mode-options">

                  {holdingQuantity >
                    0 && (

                    <button
                      className="mode-card holding-card"
                      onClick={() =>
                        selectTradeMode(
                          "HOLDING"
                        )
                      }
                    >

                      <div className="mode-icon">
                        📦
                      </div>

                      <div>

                        <h3>
                          Holding /
                          Delivery
                        </h3>

                        <p>
                          Available Shares:{" "}
                          <strong>
                            {
                              holdingQuantity
                            }
                          </strong>
                        </p>

                      </div>

                    </button>

                  )}

                  {positionQuantity >
                    0 && (

                    <button
                      className="mode-card intraday-card"
                      onClick={() =>
                        selectTradeMode(
                          "INTRADAY"
                        )
                      }
                    >

                      <div className="mode-icon">
                        ⚡
                      </div>

                      <div>

                        <h3>
                          Intraday
                        </h3>

                        <p>
                          Available Shares:{" "}
                          <strong>
                            {
                              positionQuantity
                            }
                          </strong>
                        </p>

                      </div>

                    </button>

                  )}

                </div>

              </>

            )}

            {/* =================================================
                BUY CONFIRMATION
            ================================================= */}

            {orderType === "BUY" &&
              tradeMode && (

              <>
                <h2>
                  {tradeMode ===
                  "INTRADAY"
                    ? "⚡ Intraday Buy"
                    : "📦 Holding Buy"}
                </h2>

                <div className="selected-mode">

                  {tradeMode ===
                  "INTRADAY"
                    ? "⚡ Intraday"
                    : "📦 Holding / Delivery"}

                </div>

                <div className="popup-row">

                  <span>
                    Account Balance
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      accountBalance
                    )}
                  </strong>

                </div>

                <div className="popup-row">

                  <span>
                    Stock
                  </span>

                  <strong>
                    {stock.symbol}
                  </strong>

                </div>

                <div className="popup-row">

                  <span>
                    Market Price
                  </span>

                  <strong>
                    ₹
                    {Number(
                      stock.price
                    ).toFixed(2)}
                  </strong>

                </div>

                <div className="popup-row">

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {quantity === ""
                      ? "Not entered"
                      : quantity}
                  </strong>

                </div>

                <div className="popup-row">

                  <span>
                    Order Price
                  </span>

                  <strong>
                    ₹
                    {Number(
                      stock.price
                    ).toFixed(2)}
                  </strong>

                </div>

                <div className="popup-total">

                  <span>
                    Total Investment
                  </span>

                  <strong>
                    ₹
                    {orderTotal.toFixed(
                      2
                    )}
                  </strong>

                </div>

                {orderTotal >
                  accountBalance && (

                  <div className="investment-warning">
                    ⚠️ Insufficient
                    account balance.
                  </div>

                )}

                <button
                  className="confirm-buy"
                  onClick={
                    confirmOrder
                  }
                  disabled={
                    quantity === "" ||
                    !Number.isInteger(
                      Number(
                        quantity
                      )
                    ) ||
                    Number(
                      quantity
                    ) < 1 ||
                    orderTotal >
                      accountBalance
                  }
                >
                  Confirm BUY ₹
                  {orderTotal.toFixed(
                    2
                  )}
                </button>

                <button
                  className="change-mode-button"
                  onClick={() =>
                    setTradeMode(
                      null
                    )
                  }
                >
                  ← Change Order Type
                </button>

              </>

            )}

            {/* =================================================
                SELL CONFIRMATION
            ================================================= */}

            {orderType === "SELL" &&
              tradeMode && (

              <>
                <h2>
                  🔴 Sell{" "}
                  {stock.symbol}
                </h2>

                <div className="selected-mode">

                  {tradeMode ===
                  "INTRADAY"
                    ? "⚡ Intraday"
                    : "📦 Holding / Delivery"}

                </div>

                <div className="popup-row">

                  <span>
                    Account Balance
                  </span>

                  <strong>
                    ₹
                    {formatMoney(
                      accountBalance
                    )}
                  </strong>

                </div>

                <div className="popup-row">

                  <span>
                    Stock
                  </span>

                  <strong>
                    {stock.symbol}
                  </strong>

                </div>

                <div className="popup-row">

                  <span>
                    Market Price
                  </span>

                  <strong>
                    ₹
                    {Number(
                      stock.price
                    ).toFixed(2)}
                  </strong>

                </div>

                <div className="popup-row">

                  <span>
                    Available Shares
                  </span>

                  <strong>
                    {
                      sellAvailableQuantity
                    }
                  </strong>

                </div>

                <div className="popup-row">

                  <span>
                    Sell Quantity
                  </span>

                  <strong>
                    {quantity === ""
                      ? "Not entered"
                      : quantity}
                  </strong>

                </div>

                {tradeMode ===
                  "HOLDING" && (

                  <div className="popup-row">

                    <span>
                      Average Buy Price
                    </span>

                    <strong>
                      ₹
                      {averageBuyPrice.toFixed(
                        2
                      )}
                    </strong>

                  </div>

                )}

                {tradeMode ===
                  "INTRADAY" &&
                  currentPosition && (

                  <div className="popup-row">

                    <span>
                      Average Buy Price
                    </span>

                    <strong>
                      ₹
                      {Number(
                        currentPosition.buyPrice
                      ).toFixed(2)}
                    </strong>

                  </div>

                )}

                <div className="popup-row">

                  <span>
                    Sell Price
                  </span>

                  <strong>
                    ₹
                    {Number(
                      stock.price
                    ).toFixed(2)}
                  </strong>

                </div>

                <div className="popup-total">

                  <span>
                    Money Added to Account
                  </span>

                  <strong>
                    ₹
                    {orderTotal.toFixed(
                      2
                    )}
                  </strong>

                </div>

                <button
                  className="confirm-sell"
                  onClick={
                    confirmOrder
                  }
                  disabled={
                    quantity === "" ||
                    !Number.isInteger(
                      Number(
                        quantity
                      )
                    ) ||
                    Number(
                      quantity
                    ) < 1 ||
                    Number(
                      quantity
                    ) >
                      sellAvailableQuantity
                  }
                >
                  Confirm SELL ₹
                  {orderTotal.toFixed(
                    2
                  )}
                </button>

                <button
                  className="change-mode-button"
                  onClick={() =>
                    setTradeMode(
                      null
                    )
                  }
                >
                  ← Change Sell Type
                </button>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

// =====================================================
// EXPORT
// =====================================================

export default StockDetails;

