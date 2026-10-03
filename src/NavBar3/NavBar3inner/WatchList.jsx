
import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "./Watchlist.css";


const WatchList = () => {

  const navigate =
    useNavigate();


  const [watchlist, setWatchlist] =
    useState([]);


  // ==========================================
  // LOAD WATCHLIST
  // ==========================================

  const loadWatchlist = () => {

    const savedWatchlist =
      JSON.parse(
        localStorage.getItem(
          "watchlist"
        ) || "[]"
      );


    setWatchlist(
      savedWatchlist
    );

  };


  // ==========================================
  // FETCH LIVE STOCKS + MUTUAL FUNDS
  // ==========================================

  const fetchLiveData = async () => {

    try {

      // ======================================
      // FETCH STOCKS
      // ======================================

      const stockResponse =
        await fetch(
                 "https://sharemarket-da04.onrender.com/stocks"

        );


      if (!stockResponse.ok) {

        throw new Error(
          "Failed to fetch stocks"
        );

      }


      const stocks =
        await stockResponse.json();


      // ======================================
      // FETCH MUTUAL FUNDS
      // ======================================

      const mutualFundResponse =
        await fetch(
          "http://localhost:3000/mutualFunds"
        );


      if (!mutualFundResponse.ok) {

        throw new Error(
          "Failed to fetch mutual funds"
        );

      }


      const mutualFunds =
        await mutualFundResponse.json();


      // ======================================
      // GET WATCHLIST
      // ======================================

      const savedWatchlist =
        JSON.parse(
          localStorage.getItem(
            "watchlist"
          ) || "[]"
        );


      // ======================================
      // UPDATE EVERY WATCHLIST ITEM
      // ======================================

      const updatedWatchlist =
        savedWatchlist.map(
          item => {


            // ==================================
            // MUTUAL FUND
            // ==================================

            if (
              item.type ===
              "MUTUAL_FUND"
            ) {

              const liveFund =
                mutualFunds.find(
                  fund =>
                    fund.symbol ===
                    item.symbol
                );


              if (!liveFund) {

                return item;

              }


              // ================================
              // FAKE LIVE MUTUAL FUND NAV
              // ================================

              const basePrice =
                Number(
                  liveFund.price
                );


              const randomChange =
                (
                  Math.random() -
                  0.5
                ) * 2;


              const newPrice =
                Number(
                  (
                    basePrice +
                    randomChange
                  ).toFixed(2)
                );


              // ================================
              // CHANGE %
              // ================================

              const newChange =
                basePrice > 0
                  ? Number(
                      (
                        (
                          (
                            newPrice -
                            basePrice
                          ) /
                          basePrice
                        ) *
                        100
                      ).toFixed(2)
                    )
                  : 0;


              return {

                ...item,

                name:
                  liveFund.name,

                price:
                  newPrice,

                change:
                  newChange,

                type:
                  "MUTUAL_FUND"

              };

            }


            // ==================================
            // STOCK
            // ==================================

            const liveStock =
              stocks.find(
                stock =>
                  stock.symbol ===
                  item.symbol
              );


            if (!liveStock) {

              return item;

            }


            // ================================
            // FAKE LIVE STOCK PRICE
            // ================================

            const basePrice =
              Number(
                liveStock.price
              );


            const randomChange =
              (
                Math.random() -
                0.5
              ) * 10;


            const newPrice =
              Number(
                (
                  basePrice +
                  randomChange
                ).toFixed(2)
              );


            // ================================
            // CHANGE %
            // ================================

            const newChange =
              basePrice > 0
                ? Number(
                    (
                      (
                        (
                          newPrice -
                          basePrice
                        ) /
                        basePrice
                      ) *
                      100
                    ).toFixed(2)
                  )
                : 0;


            return {

              ...item,

              name:
                liveStock.name,

              price:
                newPrice,

              change:
                newChange,

              type:
                item.type ||
                "STOCK"

            };

          }
        );


      // ======================================
      // UPDATE STATE
      // ======================================

      setWatchlist(
        updatedWatchlist
      );


      // ======================================
      // SAVE TO LOCAL STORAGE
      // ======================================

      localStorage.setItem(
        "watchlist",
        JSON.stringify(
          updatedWatchlist
        )
      );

    }

    catch (error) {

      console.error(
        "WatchList API Error:",
        error
      );

    }

  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadWatchlist();

  }, []);


  // ==========================================
  // LIVE UPDATE
  // ==========================================

  useEffect(() => {

    fetchLiveData();


    const interval =
      setInterval(() => {

        fetchLiveData();

      }, 1000);


    return () => {

      clearInterval(
        interval
      );

    };

  }, []);


  // ==========================================
  // REMOVE FROM WATCHLIST
  // ==========================================

  const removeFromWatchlist = (
    symbol,
    type
  ) => {


    const updatedWatchlist =
      watchlist.filter(
        item =>
          !(
            item.symbol === symbol &&
            item.type === type
          )
      );


    // ========================================
    // SAVE
    // ========================================

    localStorage.setItem(
      "watchlist",
      JSON.stringify(
        updatedWatchlist
      )
    );


    // ========================================
    // UPDATE UI
    // ========================================

    setWatchlist(
      updatedWatchlist
    );

  };


  // ==========================================
  // OPEN ITEM
  // ==========================================

  const openItem = (
    item
  ) => {


    // ========================================
    // MUTUAL FUND
    // ========================================

    if (
      item.type ===
      "MUTUAL_FUND"
    ) {

      navigate(
        `/mutual-funds/${item.symbol}`
      );

      return;

    }


    // ========================================
    // STOCK
    // ========================================

    navigate(
      `/stocks/${item.symbol}`
    );

  };


  // ==========================================
  // EMPTY WATCHLIST
  // ==========================================

  if (
    watchlist.length === 0
  ) {

    return (

      <div className="watchlist">


        <div className="watchlist-header">

          <div>

            <h1>
              ⭐ WatchList
            </h1>

            <p>
              Keep track of your favorite
              stocks and mutual funds.
            </p>

          </div>


          <button
            className="watchlist-back"
            onClick={() =>
              navigate("/")
            }
          >

            ← Back

          </button>

        </div>



        <div className="watchlist-card empty-watchlist">


          <div className="empty-icon">

            ⭐

          </div>


          <h2>

            No Items Added

          </h2>


          <p>

            Add your favorite stocks
            or mutual funds to your
            watchlist.

          </p>


          <div className="empty-actions">


            <button
              className="explore-button"
              onClick={() =>
                navigate("/")
              }
            >

              📈 Explore Stocks

            </button>


            <button
              className="explore-button"
              onClick={() =>
                navigate(
                  "/mutual-funds"
                )
              }
            >

              📊 Explore Mutual Funds

            </button>


          </div>


        </div>


      </div>

    );

  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="watchlist">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="watchlist-header">


        <div>

          <h1>

            ⭐ WatchList

          </h1>


          <p>

            Track your favorite stocks
            and mutual funds.

          </p>

        </div>


        <button
          className="watchlist-back"
          onClick={() =>
            navigate("/")
          }
        >

          ← Back

        </button>


      </div>



      {/* ======================================
          WATCHLIST CARD
      ====================================== */}

      <div className="watchlist-card">


        <div className="watchlist-title">


          <div>

            <h2>

              My Watchlist

            </h2>


            <p>

              {watchlist.length}

              {" "}

              {watchlist.length === 1
                ? "item"
                : "items"}

              {" "}added

            </p>

          </div>


        </div>



        {/* ====================================
            WATCHLIST ITEMS
        ==================================== */}

        <div className="watchlist-items">


          {watchlist.map(
            item => {


              const isMutualFund =
                item.type ===
                "MUTUAL_FUND";


              return (

                <div
                  className="watchlist-item"
                  key={`${item.type || "STOCK"}-${item.symbol}`}
                  onClick={() =>
                    openItem(
                      item
                    )
                  }
                >


                  {/* ==========================
                      LOGO
                  =========================== */}

                  <div className="watchlist-logo">

                    {isMutualFund
                      ? "📊"
                      : item.symbol.charAt(0)}

                  </div>



                  {/* ==========================
                      NAME
                  =========================== */}

                  <div className="watchlist-stock-name">


                    <h3>

                      {item.symbol}

                    </h3>


                    <p>

                      {item.name}

                    </p>


                    {/* TYPE */}

                    <small>

                      {isMutualFund
                        ? "📊 Mutual Fund"
                        : "📈 Stock"}

                    </small>


                  </div>



                  {/* ==========================
                      LIVE PRICE / NAV
                  =========================== */}

                  <div className="watchlist-price">


                    <span>

                      {isMutualFund
                        ? "Live NAV"
                        : "Live Price"}

                    </span>


                    <strong>

                      ₹
                      {Number(
                        item.price
                      ).toFixed(2)}

                    </strong>


                  </div>



                  {/* ==========================
                      LIVE CHANGE
                  =========================== */}

                  <div
                    className={
                      Number(
                        item.change
                      ) >= 0
                        ? "watch-positive"
                        : "watch-negative"
                    }
                  >

                    {Number(
                      item.change
                    ) >= 0
                      ? "+"
                      : ""}

                    {Number(
                      item.change
                    ).toFixed(2)}

                    %

                  </div>



                  {/* ==========================
                      VIEW BUTTON
                  =========================== */}

                  <button
                    className="watch-view-button"
                    onClick={(e) => {

                      e.stopPropagation();

                      openItem(
                        item
                      );

                    }}
                  >

                    View

                  </button>



                  {/* ==========================
                      REMOVE BUTTON
                  =========================== */}

                  <button
                    className="watch-remove-button"
                    onClick={(e) => {

                      e.stopPropagation();

                      removeFromWatchlist(
                        item.symbol,
                        item.type ||
                        "STOCK"
                      );

                    }}
                  >

                    ✕

                  </button>


                </div>

              );

            }
          )}


        </div>


      </div>


    </div>

  );

};


export default WatchList;

