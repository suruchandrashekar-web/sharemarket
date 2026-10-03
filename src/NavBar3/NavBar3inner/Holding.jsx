import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "./Holding.css";
import { getAccount } from "../../NavBar/Pages/acc.js";

function Holding() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [stockHoldings, setStockHoldings] = useState([]);
  const [mutualFundHoldings, setMutualFundHoldings] = useState([]);

  const [livePrices, setLivePrices] = useState({});
  const [liveNAVs, setLiveNAVs] = useState({});

  // =====================================================
  // SAFE NUMBER
  // =====================================================

  const numberValue = (value, fallback = 0) => {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
  };

  // =====================================================
  // NORMALIZE TYPE
  // =====================================================

  const normalizeType = (value) => {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");
  };

  // =====================================================
  // GET HOLDING TYPE
  // =====================================================

  const getHoldingType = (holding) => {
    if (!holding) {
      return "";
    }

    return normalizeType(
      holding.type ||
        holding.assetType ||
        holding.instrumentType ||
        holding.category
    );
  };

  // =====================================================
  // STOCK CHECK
  // =====================================================

  const isStock = (holding) => {
    const type = getHoldingType(holding);

    // Main type created by acc.js
    if (type === "STOCK") {
      return true;
    }

    // Other possible stock types
    if (
      type === "STOCKS" ||
      type === "EQUITY" ||
      type === "EQUITIES" ||
      type === "SHARE" ||
      type === "SHARES"
    ) {
      return true;
    }

    return false;
  };

  // =====================================================
  // MUTUAL FUND CHECK
  // =====================================================
const isMutualFund = (holding) => {
  const type = getHoldingType(holding);

  return (
    type === "MUTUAL_FUND" ||
    type === "MUTUALFUNDS" ||
    type === "MUTUALFUND" ||
    type === "MUTUAL" ||
    type === "FUND" ||
    type === "MF" ||
    type === "MUTUAL_FUNDS"
  );
};
  // =====================================================
  // LOAD HOLDINGS
  // =====================================================

  const loadHoldings = useCallback(() => {
    try {
      const account = getAccount();

      const holdings =
        account &&
        Array.isArray(account.holdings)
          ? account.holdings
          : [];

      console.log("=================================");
      console.log("ACCOUNT:", account);
      console.log("ALL HOLDINGS:", holdings);

      holdings.forEach((holding, index) => {
        console.log(
          `Holding ${index + 1}:`,
          {
            symbol: holding.symbol,
            name: holding.name,
            type: holding.type,
            category: holding.category,
            quantity: holding.quantity,
            averagePrice: holding.averagePrice,
            investedAmount: holding.investedAmount
          }
        );
      });

      console.log("=================================");

      // =================================================
      // FILTER STOCKS
      // =================================================

      const stocks = holdings.filter((holding) => {
        return isStock(holding);
      });

      // =================================================
      // FILTER MUTUAL FUNDS
      // =================================================

      const funds = holdings.filter((holding) => {
        return isMutualFund(holding);
      });

      console.log("STOCK HOLDINGS:", stocks);
      console.log("MUTUAL FUND HOLDINGS:", funds);

      setStockHoldings(stocks);
      setMutualFundHoldings(funds);

    } catch (error) {
      console.error(
        "Load Holdings Error:",
        error
      );

      setStockHoldings([]);
      setMutualFundHoldings([]);
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadHoldings();

    const handleAccountUpdate = () => {
      console.log(
        "accountUpdated event received"
      );

      loadHoldings();
    };

    window.addEventListener(
      "accountUpdated",
      handleAccountUpdate
    );

    return () => {
      window.removeEventListener(
        "accountUpdated",
        handleAccountUpdate
      );
    };
  }, [loadHoldings]);

  // =====================================================
  // BACKUP REFRESH
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      loadHoldings();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [loadHoldings]);

  // =====================================================
  // LIVE STOCK PRICES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchLivePrices = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/stocks"
        );

        if (!response.ok) {
          throw new Error(
            `Stock API Error: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data) || !mounted) {
          return;
        }

        setLivePrices((previousPrices) => {
          const prices = {
            ...previousPrices
          };

          data.forEach((stock) => {
            const symbol = String(
              stock.symbol || ""
            )
              .trim()
              .toUpperCase();

            const basePrice = numberValue(
              stock.price
            );

            if (!symbol || basePrice <= 0) {
              return;
            }

            const oldPrice =
              prices[symbol] !== undefined
                ? prices[symbol]
                : basePrice;

            const movement =
              (Math.random() - 0.5) * 2;

            const livePrice = Number(
              (
                oldPrice + movement
              ).toFixed(2)
            );

            prices[symbol] = Math.max(
              1,
              livePrice
            );
          });

          return prices;
        });

      } catch (error) {
        console.error(
          "Stock Price API Error:",
          error
        );
      }
    };

    fetchLivePrices();

    const interval = setInterval(
      fetchLivePrices,
      1000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // LIVE MUTUAL FUND NAV
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchLiveNAVs = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/mutualFunds"
        );

        if (!response.ok) {
          throw new Error(
            `Mutual Fund API Error: ${response.status}`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data) || !mounted) {
          return;
        }

        setLiveNAVs((previousNAVs) => {
          const navs = {
            ...previousNAVs
          };

          data.forEach((fund) => {
            const symbol = String(
              fund.symbol || ""
            )
              .trim()
              .toUpperCase();

            const baseNAV = numberValue(
              fund.price
            );

            if (!symbol || baseNAV <= 0) {
              return;
            }

            const oldNAV =
              navs[symbol] !== undefined
                ? navs[symbol]
                : baseNAV;

            const movement =
              (Math.random() - 0.5) * 0.5;

            const liveNAV = Number(
              (
                oldNAV + movement
              ).toFixed(2)
            );

            navs[symbol] = Math.max(
              1,
              liveNAV
            );
          });

          return navs;
        });

      } catch (error) {
        console.error(
          "Mutual Fund NAV API Error:",
          error
        );
      }
    };

    fetchLiveNAVs();

    const interval = setInterval(
      fetchLiveNAVs,
      1000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // STOCK INVESTMENT
  // =====================================================

  const stockInvestment =
    stockHoldings.reduce(
      (total, stock) => {
        const buyPrice = numberValue(
          stock.averagePrice ??
            stock.buyPrice ??
            stock.price ??
            stock.currentPrice
        );

        const quantity = numberValue(
          stock.quantity ??
            stock.units
        );

        const investment = numberValue(
          stock.investedAmount,
          buyPrice * quantity
        );

        return total + investment;
      },
      0
    );

  // =====================================================
  // STOCK CURRENT VALUE
  // =====================================================

  const stockCurrentValue =
    stockHoldings.reduce(
      (total, stock) => {
        const symbol = String(
          stock.symbol || ""
        )
          .trim()
          .toUpperCase();

        const buyPrice = numberValue(
          stock.averagePrice ??
            stock.buyPrice ??
            stock.price ??
            stock.currentPrice
        );

        const currentPrice =
          livePrices[symbol] !== undefined
            ? livePrices[symbol]
            : numberValue(
                stock.currentPrice,
                buyPrice
              );

        const quantity = numberValue(
          stock.quantity ??
            stock.units
        );

        return (
          total +
          currentPrice * quantity
        );
      },
      0
    );

  // =====================================================
  // STOCK PROFIT / LOSS
  // =====================================================

  const stockProfitLoss =
    stockCurrentValue -
    stockInvestment;

  const stockProfitPercentage =
    stockInvestment > 0
      ? (
          stockProfitLoss /
          stockInvestment
        ) * 100
      : 0;

  // =====================================================
  // MUTUAL FUND INVESTMENT
  // =====================================================

  const mutualFundInvestment =
    mutualFundHoldings.reduce(
      (total, fund) => {
        const units = numberValue(
          fund.quantity ??
            fund.units
        );

        const buyNAV = numberValue(
          fund.averagePrice ??
            fund.buyNAV ??
            fund.nav ??
            fund.price
        );

        const investment = numberValue(
          fund.investedAmount,
          buyNAV * units
        );

        return total + investment;
      },
      0
    );

  // =====================================================
  // MUTUAL FUND CURRENT VALUE
  // =====================================================

  const mutualFundCurrentValue =
    mutualFundHoldings.reduce(
      (total, fund) => {
        const symbol = String(
          fund.symbol || ""
        )
          .trim()
          .toUpperCase();

        const buyNAV = numberValue(
          fund.averagePrice ??
            fund.buyNAV ??
            fund.nav ??
            fund.price
        );

        const currentNAV =
          liveNAVs[symbol] !== undefined
            ? liveNAVs[symbol]
            : numberValue(
                fund.currentPrice ??
                  fund.currentNAV ??
                  fund.nav,
                buyNAV
              );

        const units = numberValue(
          fund.quantity ??
            fund.units
        );

        return (
          total +
          currentNAV * units
        );
      },
      0
    );

  // =====================================================
  // MUTUAL FUND PROFIT / LOSS
  // =====================================================

  const mutualFundProfitLoss =
    mutualFundCurrentValue -
    mutualFundInvestment;

  const mutualFundProfitPercentage =
    mutualFundInvestment > 0
      ? (
          mutualFundProfitLoss /
          mutualFundInvestment
        ) * 100
      : 0;

  // =====================================================
  // OPEN STOCK
  // =====================================================

  const openStock = (symbol) => {
    if (!symbol) {
      return;
    }

    navigate(
      `/stocks/${symbol}`
    );
  };

  // =====================================================
  // OPEN MUTUAL FUND
  // =====================================================

  const openMutualFund = (symbol) => {
    if (!symbol) {
      return;
    }

    navigate(
      `/mutual-funds/${symbol}`
    );
  };

  // =====================================================
  // MONEY FORMAT
  // =====================================================

  const money = (value) => {
    return numberValue(value).toFixed(2);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="holdings-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="holdings-header">

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <h1>
          📊 My Holdings
        </h1>

        <button
          className="explore-button"
          onClick={() => navigate("/")}
        >
          + Explore
        </button>

      </header>

      <div className="holdings-container">

        {/* =================================================
            STOCK PORTFOLIO
        ================================================= */}

        <section className="portfolio-section stock-summary">

          <div className="portfolio-section-title">

            <div>
              <h2>
                📈 Stock Portfolio
              </h2>

              <p>
                Your stock investment summary
              </p>
            </div>

            <button
              className="section-buy-button"
              onClick={() => navigate("/")}
            >
              + Buy Stocks
            </button>

          </div>

          <div className="portfolio-grid">

            <div className="portfolio-card">
              <span>
                Total Investment
              </span>

              <h2>
                ₹{money(stockInvestment)}
              </h2>

              <small>
                {stockHoldings.length} stock
                {stockHoldings.length !== 1
                  ? "s"
                  : ""}
              </small>
            </div>

            <div className="portfolio-card">

              <span>
                Current Value
              </span>

              <h2>
                ₹{money(stockCurrentValue)}
              </h2>

              <small>
                Live market value
              </small>

            </div>

            <div className="portfolio-card">

              <span>
                Profit / Loss
              </span>

              <h2
                className={
                  stockProfitLoss >= 0
                    ? "profit"
                    : "loss"
                }
              >
                {stockProfitLoss >= 0
                  ? "+"
                  : ""}
                ₹{money(stockProfitLoss)}
              </h2>

              <small
                className={
                  stockProfitLoss >= 0
                    ? "profit"
                    : "loss"
                }
              >
                (
                {stockProfitLoss >= 0
                  ? "+"
                  : ""}
                {stockProfitPercentage.toFixed(2)}
                %)
              </small>

            </div>

          </div>

        </section>

        {/* =================================================
            MY STOCKS
        ================================================= */}

        <section className="holdings-card stock-card">

          <div className="section-header">

            <div>
              <h2>
                📈 My Stocks
              </h2>

              <p>
                {stockHoldings.length} holdings
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
            >
              + Buy Stocks
            </button>

          </div>

          {stockHoldings.length === 0 ? (

            <div className="empty-holdings">

              <div className="empty-icon">
                📈
              </div>

              <h3>
                No Stock Holdings
              </h3>

              <p>
                Buy a stock to see it here.
              </p>

              <button
                onClick={() => navigate("/")}
              >
                Explore Stocks
              </button>

            </div>

          ) : (

            <div className="holding-list">

              {stockHoldings.map(
                (stock, index) => {

                  const symbol =
                    String(
                      stock.symbol || ""
                    )
                      .trim()
                      .toUpperCase();

                  const buyPrice =
                    numberValue(
                      stock.averagePrice ??
                        stock.buyPrice ??
                        stock.price ??
                        stock.currentPrice
                    );

                  const quantity =
                    numberValue(
                      stock.quantity ??
                        stock.units
                    );

                  const investment =
                    numberValue(
                      stock.investedAmount,
                      buyPrice * quantity
                    );

                  const currentPrice =
                    livePrices[symbol] !==
                    undefined
                      ? livePrices[symbol]
                      : numberValue(
                          stock.currentPrice,
                          buyPrice
                        );

                  const currentValue =
                    currentPrice *
                    quantity;

                  const profit =
                    currentValue -
                    investment;

                  const profitPercentage =
                    investment > 0
                      ? (
                          profit /
                          investment
                        ) * 100
                      : 0;

                  return (

                    <div
                      className="holding-item"
                      key={
                        stock.id ||
                        `${symbol}-${index}`
                      }
                      onClick={() =>
                        openStock(symbol)
                      }
                    >

                      <div className="holding-left">

                        <div className="holding-logo">
                          {(symbol || "S")
                            .charAt(0)}
                        </div>

                        <div>

                          <h3>
                            {symbol ||
                              "STOCK"}
                          </h3>

                          <p>
                            {stock.name ||
                              "Stock"}
                          </p>

                        </div>

                      </div>

                      <div className="holding-data">

                        <span>
                          Quantity
                        </span>

                        <strong>
                          {quantity}
                        </strong>

                      </div>

                      <div className="holding-data">

                        <span>
                          Buy Price
                        </span>

                        <strong>
                          ₹{money(buyPrice)}
                        </strong>

                      </div>

                      <div className="holding-data">

                        <span>
                          Current Price
                        </span>

                        <strong className="live-price">
                          ₹{money(currentPrice)}
                        </strong>

                      </div>

                      <div className="holding-data">

                        <span>
                          Investment
                        </span>

                        <strong>
                          ₹{money(investment)}
                        </strong>

                      </div>

                      <div className="holding-right">

                        <span>
                          Current Value
                        </span>

                        <strong>
                          ₹{money(currentValue)}
                        </strong>

                        <small
                          className={
                            profit >= 0
                              ? "profit"
                              : "loss"
                          }
                        >
                          {profit >= 0
                            ? "+"
                            : ""}
                          ₹{money(profit)}
                          {" "}
                          (
                          {profit >= 0
                            ? "+"
                            : ""}
                          {profitPercentage.toFixed(
                            2
                          )}
                          %)
                        </small>

                      </div>

                      <div className="holding-arrow">
                        →
                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* =================================================
            MUTUAL FUND PORTFOLIO
        ================================================= */}

        <section className="portfolio-section mutual-summary">

          <div className="portfolio-section-title">

            <div>

              <h2>
                📊 Mutual Fund Portfolio
              </h2>

              <p>
                Your mutual fund investment summary
              </p>

            </div>

            <button
              className="section-buy-button"
              onClick={() =>
                navigate("/mutual-funds")
              }
            >
              + Buy Funds
            </button>

          </div>

          <div className="portfolio-grid">

            <div className="portfolio-card">

              <span>
                Total Investment
              </span>

              <h2>
                ₹{money(mutualFundInvestment)}
              </h2>

              <small>
                {mutualFundHoldings.length} fund
                {mutualFundHoldings.length !== 1
                  ? "s"
                  : ""}
              </small>

            </div>

            <div className="portfolio-card">

              <span>
                Current Value
              </span>

              <h2>
                ₹{money(mutualFundCurrentValue)}
              </h2>

              <small>
                Live NAV value
              </small>

            </div>

            <div className="portfolio-card">

              <span>
                Profit / Loss
              </span>

              <h2
                className={
                  mutualFundProfitLoss >= 0
                    ? "profit"
                    : "loss"
                }
              >
                {mutualFundProfitLoss >= 0
                  ? "+"
                  : ""}
                ₹{money(
                  mutualFundProfitLoss
                )}
              </h2>

              <small
                className={
                  mutualFundProfitLoss >= 0
                    ? "profit"
                    : "loss"
                }
              >
                (
                {mutualFundProfitLoss >= 0
                  ? "+"
                  : ""}
                {mutualFundProfitPercentage.toFixed(
                  2
                )}
                %)
              </small>

            </div>

          </div>

        </section>

        {/* =================================================
            MY MUTUAL FUNDS
        ================================================= */}

        <section className="holdings-card mutual-card">

          <div className="section-header">

            <div>

              <h2>
                📊 My Mutual Funds
              </h2>

              <p>
                {mutualFundHoldings.length} holdings
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/mutual-funds")
              }
            >
              + Buy Funds
            </button>

          </div>

          {mutualFundHoldings.length === 0 ? (

            <div className="empty-holdings">

              <div className="empty-icon">
                📊
              </div>

              <h3>
                No Mutual Fund Holdings
              </h3>

              <p>
                Buy a mutual fund to see it here.
              </p>

              <button
                onClick={() =>
                  navigate("/mutual-funds")
                }
              >
                Explore Funds
              </button>

            </div>

          ) : (

            <div className="holding-list">

              {mutualFundHoldings.map(
                (fund, index) => {

                  const symbol =
                    String(
                      fund.symbol || ""
                    )
                      .trim()
                      .toUpperCase();

                  const buyNAV =
                    numberValue(
                      fund.averagePrice ??
                        fund.buyNAV ??
                        fund.nav ??
                        fund.price
                    );

                  const units =
                    numberValue(
                      fund.quantity ??
                        fund.units
                    );

                  const investment =
                    numberValue(
                      fund.investedAmount,
                      buyNAV * units
                    );

                  const currentNAV =
                    liveNAVs[symbol] !==
                    undefined
                      ? liveNAVs[symbol]
                      : numberValue(
                          fund.currentPrice ??
                            fund.currentNAV ??
                            fund.nav,
                          buyNAV
                        );

                  const currentValue =
                    currentNAV * units;

                  const profit =
                    currentValue -
                    investment;

                  const profitPercentage =
                    investment > 0
                      ? (
                          profit /
                          investment
                        ) * 100
                      : 0;

                  return (

                    <div
                      className="holding-item"
                      key={
                        fund.id ||
                        `${symbol}-${index}`
                      }
                      onClick={() =>
                        openMutualFund(symbol)
                      }
                    >

                      <div className="holding-left">

                        <div className="holding-logo">
                          {(symbol || "M")
                            .charAt(0)}
                        </div>

                        <div>

                          <h3>
                            {symbol ||
                              "MUTUAL FUND"}
                          </h3>

                          <p>
                            {fund.name ||
                              fund.fundName ||
                              "Mutual Fund"}
                          </p>

                        </div>

                      </div>

                      <div className="holding-data">

                        <span>
                          Units
                        </span>

                        <strong>
                          {units.toFixed(4)}
                        </strong>

                      </div>

                      <div className="holding-data">

                        <span>
                          Buy NAV
                        </span>

                        <strong>
                          ₹{money(buyNAV)}
                        </strong>

                      </div>

                      <div className="holding-data">

                        <span>
                          Current NAV
                        </span>

                        <strong className="live-price">
                          ₹{money(currentNAV)}
                        </strong>

                      </div>

                      <div className="holding-data">

                        <span>
                          Investment
                        </span>

                        <strong>
                          ₹{money(investment)}
                        </strong>

                      </div>

                      <div className="holding-right">

                        <span>
                          Current Value
                        </span>

                        <strong>
                          ₹{money(currentValue)}
                        </strong>

                        <small
                          className={
                            profit >= 0
                              ? "profit"
                              : "loss"
                          }
                        >
                          {profit >= 0
                            ? "+"
                            : ""}
                          ₹{money(profit)}
                          {" "}
                          (
                          {profit >= 0
                            ? "+"
                            : ""}
                          {profitPercentage.toFixed(
                            2
                          )}
                          %)
                        </small>

                      </div>

                      <div className="holding-arrow">
                        →
                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default Holding;