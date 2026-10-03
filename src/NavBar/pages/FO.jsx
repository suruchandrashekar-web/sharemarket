
import { useEffect, useState } from "react";
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

import "./FO.css";

const FO = () => {

  const navigate = useNavigate();

  // ==========================================
  // SELECTED INDEX
  // ==========================================

  const [selectedIndex, setSelectedIndex] =
    useState("NIFTY 50");


  // ==========================================
  // MARKET DATA
  // ==========================================

  const [marketData, setMarketData] = useState({

    "NIFTY 50": {
      price: 25150,
      change: 120,
      percentage: 0.48
    },

    "BANK NIFTY": {
      price: 56850,
      change: -85,
      percentage: -0.15
    },

    "FINNIFTY": {
      price: 26300,
      change: 45,
      percentage: 0.17
    }

  });


  // ==========================================
  // CHART DATA
  // ==========================================

  const [chartData, setChartData] =
    useState([]);


  // ==========================================
  // CALL OPTIONS
  // ==========================================

  const [callOptions, setCallOptions] =
    useState([

      {
        strike: 25000,
        premium: 235,
        change: 12.5,
        oi: "12.4L"
      },

      {
        strike: 25100,
        premium: 165,
        change: 8.4,
        oi: "9.8L"
      },

      {
        strike: 25200,
        premium: 105,
        change: 5.2,
        oi: "8.2L"
      },

      {
        strike: 25300,
        premium: 62,
        change: -3.5,
        oi: "6.4L"
      }

    ]);


  // ==========================================
  // PUT OPTIONS
  // ==========================================

  const [putOptions, setPutOptions] =
    useState([

      {
        strike: 25000,
        premium: 85,
        change: -4.2,
        oi: "7.5L"
      },

      {
        strike: 25100,
        premium: 120,
        change: 3.6,
        oi: "8.9L"
      },

      {
        strike: 25200,
        premium: 175,
        change: 7.8,
        oi: "10.2L"
      },

      {
        strike: 25300,
        premium: 245,
        change: 11.4,
        oi: "11.8L"
      }

    ]);


  // ==========================================
  // QUANTITY MODAL
  // ==========================================

  const [showQuantityModal, setShowQuantityModal] =
    useState(false);

  const [quantity, setQuantity] =
    useState(1);

  const [selectedOrder, setSelectedOrder] =
    useState(null);


  // ==========================================
  // CURRENT INDEX
  // ==========================================

  const current =
    marketData[selectedIndex];


  // ==========================================
  // GENERATE CHART
  // ==========================================

  const generateChartData = (price) => {

    const data = [];

    let currentPrice = price;


    for (let i = 0; i < 30; i++) {

      const movement =
        (Math.random() - 0.5) * 120;


      currentPrice += movement;


      data.push({

        time:
          `${9 + Math.floor(i / 6)}:${String(
            (i * 10) % 60
          ).padStart(2, "0")}`,

        price:
          Number(
            currentPrice.toFixed(2)
          )

      });

    }


    return data;

  };


  // ==========================================
  // INITIAL CHART
  // ==========================================

  useEffect(() => {

    setChartData(
      generateChartData(
        marketData[selectedIndex].price
      )
    );

  }, [selectedIndex]);


  // ==========================================
  // LIVE MARKET PRICE
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setMarketData(previousData => {

          const updatedData = {
            ...previousData
          };


          Object.keys(updatedData).forEach(
            index => {

              const oldPrice =
                updatedData[index].price;


              const movement =
                (Math.random() - 0.5) * 20;


              const newPrice =
                Number(
                  (
                    oldPrice +
                    movement
                  ).toFixed(2)
                );


              const change =
                Number(
                  (
                    newPrice -
                    oldPrice
                  ).toFixed(2)
                );


              const percentage =
                Number(
                  (
                    (
                      change /
                      oldPrice
                    ) * 100
                  ).toFixed(2)
                );


              updatedData[index] = {

                ...updatedData[index],

                price:
                  newPrice,

                change:
                  change,

                percentage:
                  percentage

              };

            }
          );


          return updatedData;

        });

      }, 1000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // LIVE CALL PREMIUM
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setCallOptions(
          previousOptions => {

            return previousOptions.map(
              option => {

                const oldPremium =
                  option.premium;


                const movement =
                  (Math.random() - 0.5) * 10;


                const newPremium =
                  Math.max(

                    1,

                    Number(
                      (
                        oldPremium +
                        movement
                      ).toFixed(2)
                    )

                  );


                const percentageChange =
                  Number(
                    (
                      (
                        (
                          newPremium -
                          oldPremium
                        ) /
                        oldPremium
                      ) * 100
                    ).toFixed(2)
                  );


                return {

                  ...option,

                  premium:
                    newPremium,

                  change:
                    percentageChange

                };

              }
            );

          }
        );

      }, 1000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // LIVE PUT PREMIUM
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setPutOptions(
          previousOptions => {

            return previousOptions.map(
              option => {

                const oldPremium =
                  option.premium;


                const movement =
                  (Math.random() - 0.5) * 10;


                const newPremium =
                  Math.max(

                    1,

                    Number(
                      (
                        oldPremium +
                        movement
                      ).toFixed(2)
                    )

                  );


                const percentageChange =
                  Number(
                    (
                      (
                        (
                          newPremium -
                          oldPremium
                        ) /
                        oldPremium
                      ) * 100
                    ).toFixed(2)
                  );


                return {

                  ...option,

                  premium:
                    newPremium,

                  change:
                    percentageChange

                };

              }
            );

          }
        );

      }, 1000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // UPDATE CHART EVERY SECOND
  // ==========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        setChartData(previousData => {

          if (
            previousData.length === 0
          ) {

            return previousData;

          }


          const last =
            previousData[
              previousData.length - 1
            ];


          const movement =
            (Math.random() - 0.5) * 40;


          const newPrice =
            Number(
              (
                last.price +
                movement
              ).toFixed(2)
            );


          const newPoint = {

            time:
              new Date().toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                }
              ),

            price:
              newPrice

          };


          return [

            ...previousData.slice(-29),

            newPoint

          ];

        });

      }, 1000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // OPEN QUANTITY MODAL
  // ==========================================

  const openQuantityModal = (
    type,
    strike,
    premium
  ) => {

    setSelectedOrder({

      type:
        type,

      strike:
        Number(strike),

      premium:
        Number(premium)

    });


    setQuantity(1);

    setShowQuantityModal(true);

  };


  // ==========================================
  // CLOSE QUANTITY MODAL
  // ==========================================

  const closeQuantityModal = () => {

    setShowQuantityModal(false);

    setSelectedOrder(null);

    setQuantity(1);

  };


  // ==========================================
  // CONFIRM BUY
  // ==========================================

  const confirmBuy = () => {

    if (!selectedOrder) {

      return;

    }


    const finalQuantity =
      Number(quantity);


    // ========================================
    // VALIDATE QUANTITY
    // ========================================

    if (
      !Number.isInteger(finalQuantity) ||
      finalQuantity <= 0
    ) {

      return;

    }


    const type =
      selectedOrder.type;

    const strike =
      selectedOrder.strike;

    const premium =
      selectedOrder.premium;


    try {

      // ======================================
      // OLD POSITIONS
      // ======================================

      const oldPositions =
        JSON.parse(
          localStorage.getItem(
            "foPositions"
          ) || "[]"
        );


      // ======================================
      // POSITION KEY
      // ======================================

      const positionKey =
        `${selectedIndex}-${type}-${strike}`;


      // ======================================
      // CHECK EXISTING POSITION
      // ======================================

      const existingIndex =
        oldPositions.findIndex(
          position =>
            position.positionKey ===
            positionKey
        );


      let updatedPositions;


      // ======================================
      // EXISTING POSITION
      // ======================================

      if (
        existingIndex !== -1
      ) {

        updatedPositions =
          [...oldPositions];


        const oldPosition =
          updatedPositions[
            existingIndex
          ];


        const oldQuantity =
          Number(
            oldPosition.quantity
          ) || 0;


        const oldAveragePrice =
          Number(
            oldPosition.averagePrice
          ) || 0;


        // ====================================
        // NEW QUANTITY
        // ====================================

        const newQuantity =
          oldQuantity +
          finalQuantity;


        // ====================================
        // AVERAGE PRICE
        // ====================================

        const newAveragePrice =
          (
            (
              oldAveragePrice *
              oldQuantity
            ) +

            (
              premium *
              finalQuantity
            )
          ) /
          newQuantity;


        // ====================================
        // INVESTED
        // ====================================

        const newInvested =
          newAveragePrice *
          newQuantity;


        updatedPositions[
          existingIndex
        ] = {

          ...oldPosition,

          quantity:
            newQuantity,

          averagePrice:
            Number(
              newAveragePrice.toFixed(2)
            ),

          currentPrice:
            Number(
              premium.toFixed(2)
            ),

          invested:
            Number(
              newInvested.toFixed(2)
            ),

          updatedAt:
            new Date().toLocaleString()

        };

      }


      // ======================================
      // NEW POSITION
      // ======================================

      else {

        const invested =
          premium *
          finalQuantity;


        const newPosition = {

          id:
            Date.now(),

          positionKey:
            positionKey,

          index:
            selectedIndex,

          type:
            type,

          strike:
            Number(strike),

          quantity:
            finalQuantity,

          averagePrice:
            Number(
              premium.toFixed(2)
            ),

          currentPrice:
            Number(
              premium.toFixed(2)
            ),

          invested:
            Number(
              invested.toFixed(2)
            ),

          status:
            "OPEN",

          createdAt:
            new Date().toLocaleString()

        };


        updatedPositions = [

          ...oldPositions,

          newPosition

        ];

      }


      // ======================================
      // SAVE POSITION
      // ======================================

      localStorage.setItem(

        "foPositions",

        JSON.stringify(
          updatedPositions
        )

      );


      // ======================================
      // ORDER HISTORY
      // ======================================

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
          selectedIndex,

        name:
          `${selectedIndex} ${type}`,

        type:
          "BUY",

        category:
          "FUTURES & OPTIONS",

        optionType:
          type,

        strike:
          Number(strike),

        quantity:
          finalQuantity,

        price:
          Number(
            premium.toFixed(2)
          ),

        amount:
          Number(
            (
              premium *
              finalQuantity
            ).toFixed(2)
          ),

        status:
          "COMPLETED",

        date:
          new Date().toLocaleString()

      };


      localStorage.setItem(

        "orders",

        JSON.stringify([

          newOrder,

          ...oldOrders

        ])

      );


      // ======================================
      // CLOSE MODAL
      // ======================================

      closeQuantityModal();


      // ======================================
      // GO TO POSITIONS
      // ======================================

      navigate(
        "/positions"
      );

    }

    catch (error) {

      console.error(
        "BUY F&O Error:",
        error
      );

    }

  };


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="fo-container">


      {/* ======================================
          HEADER
      ====================================== */}

      <div className="fo-header">

        <div>

          <h1>
            📊 Futures & Options
          </h1>

          <p>
            Trade simulated index options
          </p>

        </div>


        <div className="fo-market-status">

          <span></span>

          Market Open

        </div>

      </div>


      {/* ======================================
          INDEX SELECTOR
      ====================================== */}

      <div className="fo-index-selector">

        {Object.keys(
          marketData
        ).map(index => {

          const data =
            marketData[index];


          return (

            <button
              key={index}

              className={
                selectedIndex === index
                  ? "selected"
                  : ""
              }

              onClick={() =>
                setSelectedIndex(index)
              }

            >

              <span>
                {index}
              </span>


              <strong>
                ₹{data.price.toFixed(2)}
              </strong>


              <small

                className={
                  data.change >= 0
                    ? "green"
                    : "red"
                }

              >

                {data.change >= 0
                  ? "+"
                  : ""}

                {data.change.toFixed(2)}

                {" ("}

                {data.percentage >= 0
                  ? "+"
                  : ""}

                {data.percentage.toFixed(2)}

                {"%)"}

              </small>

            </button>

          );

        })}

      </div>


      {/* ======================================
          PRICE CARD
      ====================================== */}

      <div className="fo-price-card">

        <div>

          <span>
            {selectedIndex}
          </span>


          <h2>
            ₹{current.price.toFixed(2)}
          </h2>


          <p

            className={
              current.change >= 0
                ? "green"
                : "red"
            }

          >

            {current.change >= 0
              ? "+"
              : ""}

            {current.change.toFixed(2)}

            {"  "}

            (

            {current.percentage >= 0
              ? "+"
              : ""}

            {current.percentage.toFixed(2)}

            %)

          </p>

        </div>


        <div className="fo-live">

          <span></span>

          LIVE

        </div>

      </div>


      {/* ======================================
          CHART
      ====================================== */}

      <div className="fo-chart-card">

        <div className="fo-card-header">

          <div>

            <h2>
              {selectedIndex} Chart
            </h2>

            <p>
              Intraday price movement
            </p>

          </div>


          <span className="chart-live">
            ● LIVE
          </span>

        </div>


        <div className="fo-chart">

          <ResponsiveContainer
            width="100%"
            height={420}
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
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                animationDuration={300}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* ======================================
          OPTION CHAIN
      ====================================== */}

      <div className="fo-options-card">

        <div className="fo-card-header">

          <div>

            <h2>
              Option Chain
            </h2>

            <p>
              {selectedIndex} • Near ATM strikes
            </p>

          </div>


          <div className="expiry">

            Expiry

            <strong>
              Weekly
            </strong>

          </div>

        </div>


        <div className="option-table-header">

          <span>
            CALL
          </span>

          <span>
            STRIKE
          </span>

          <span>
            PUT
          </span>

        </div>


        {callOptions.map(
          (call, index) => {

            const put =
              putOptions[index];


            return (

              <div
                className="option-row"
                key={call.strike}
              >


                {/* CALL */}

                <div className="option-side call-side">

                  <div>

                    <strong>
                      ₹{call.premium.toFixed(2)}
                    </strong>


                    <small

                      className={
                        call.change >= 0
                          ? "green"
                          : "red"
                      }

                    >

                      {call.change >= 0
                        ? "+"
                        : ""}

                      {call.change.toFixed(2)}%

                    </small>

                  </div>


                  <span>
                    OI {call.oi}
                  </span>


                  <button

                    className="call-buy-btn"

                    onClick={() =>
                      openQuantityModal(
                        "CALL",
                        call.strike,
                        call.premium
                      )
                    }

                  >

                    BUY CALL

                  </button>

                </div>


                {/* STRIKE */}

                <div className="strike-price">

                  <strong>
                    {call.strike}
                  </strong>

                  <small>
                    Strike
                  </small>

                </div>


                {/* PUT */}

                <div className="option-side put-side">

                  <button

                    className="put-buy-btn"

                    onClick={() =>
                      openQuantityModal(
                        "PUT",
                        put.strike,
                        put.premium
                      )
                    }

                  >

                    BUY PUT

                  </button>


                  <span>
                    OI {put.oi}
                  </span>


                  <div>

                    <strong>
                      ₹{put.premium.toFixed(2)}
                    </strong>


                    <small

                      className={
                        put.change >= 0
                          ? "green"
                          : "red"
                      }

                    >

                      {put.change >= 0
                        ? "+"
                        : ""}

                      {put.change.toFixed(2)}%

                    </small>

                  </div>

                </div>

              </div>

            );

          }
        )}

      </div>


      {/* ======================================
          FUTURES
      ====================================== */}

      <div className="fo-futures-card">

        <div className="fo-card-header">

          <div>

            <h2>
              Futures
            </h2>

            <p>
              Index futures contracts
            </p>

          </div>

        </div>


        <div className="future-row">

          <div>

            <strong>
              {selectedIndex} Futures
            </strong>

            <span>
              Weekly Contract
            </span>

          </div>


          <div>

            <span>
              LTP
            </span>

            <strong>

              ₹{(
                current.price +
                45
              ).toFixed(2)}

            </strong>

          </div>


          <div>

            <span>
              Change
            </span>

            <strong

              className={
                current.change >= 0
                  ? "green"
                  : "red"
              }

            >

              {current.change >= 0
                ? "+"
                : ""}

              {current.change.toFixed(2)}

            </strong>

          </div>


          <button

            className="future-buy-btn"

            onClick={() =>
              openQuantityModal(
                "FUTURES",
                current.price,
                current.price + 45
              )
            }

          >

            BUY FUTURES

          </button>

        </div>

      </div>


      {/* ======================================
          QUANTITY MODAL
      ====================================== */}

      {showQuantityModal && selectedOrder && (

        <div
          className="quantity-modal-overlay"
          onClick={closeQuantityModal}
        >

          <div
            className="quantity-modal"
            onClick={event =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="quantity-modal-header">

              <div>

                <h2>
                  Buy {selectedOrder.type}
                </h2>

                <p>
                  {selectedIndex}
                </p>

              </div>


              <button
                type="button"
                className="quantity-close"
                onClick={closeQuantityModal}
              >

                ×

              </button>

            </div>


            {/* ORDER DETAILS */}

            <div className="quantity-order-details">

              <div>

                <span>
                  Type
                </span>

                <strong>
                  {selectedOrder.type}
                </strong>

              </div>


              <div>

                <span>
                  Strike
                </span>

                <strong>
                  {selectedOrder.strike}
                </strong>

              </div>


              <div>

                <span>
                  Price
                </span>

                <strong>
                  ₹{selectedOrder.premium.toFixed(2)}
                </strong>

              </div>

            </div>


            {/* QUANTITY */}

            <div className="quantity-input-section">

              <label>
                Quantity
              </label>


              <div className="quantity-control">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      previous =>
                        Math.max(
                          1,
                          Number(previous) - 1
                        )
                    )
                  }
                >

                  −

                </button>


                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={event =>
                    setQuantity(
                      event.target.value
                    )
                  }
                />


                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      previous =>
                        Number(previous) + 1
                    )
                  }
                >

                  +

                </button>

              </div>

            </div>


            {/* TOTAL */}

            <div className="quantity-total">

              <span>
                Total Amount
              </span>


              <strong>

                ₹{(
                  selectedOrder.premium *
                  Number(quantity || 0)
                ).toFixed(2)}

              </strong>

            </div>


            {/* BUTTONS */}

            <div className="quantity-modal-actions">

              <button
                type="button"
                className="quantity-cancel-button"
                onClick={closeQuantityModal}
              >

                Cancel

              </button>


              <button
                type="button"
                className="quantity-confirm-button"
                onClick={confirmBuy}
                disabled={
                  !Number.isInteger(
                    Number(quantity)
                  ) ||
                  Number(quantity) <= 0
                }
              >

                🟢 Confirm Buy

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};


export default FO;

