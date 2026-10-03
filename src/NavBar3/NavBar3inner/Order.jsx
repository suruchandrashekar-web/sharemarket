
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Order.css";

const Order = () => {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  const loadOrders = () => {

    const savedOrders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    setOrders(savedOrders);

  };


  // ==========================================
  // PAGE LOAD
  // ==========================================

  useEffect(() => {

    loadOrders();

    const interval =
      setInterval(() => {

        loadOrders();

      }, 500);

    return () => {

      clearInterval(interval);

    };

  }, []);


  // ==========================================
  // 5 SECOND ORDER PROCESSING
  // ==========================================

  useEffect(() => {

    const pendingOrders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    const pendingOrder =
      pendingOrders.find(
        order =>
          order.status === "PENDING"
      );

    if (!pendingOrder) {

      return;

    }


    // ========================================
    // 5 SECONDS
    // ========================================

    const timer =
      setTimeout(() => {

        const latestOrders =
          JSON.parse(
            localStorage.getItem("orders")
          ) || [];


        const orderIndex =
          latestOrders.findIndex(
            order =>
              order.id === pendingOrder.id
          );


        if (orderIndex === -1) {

          return;

        }


        // ======================================
        // COMPLETE ORDER
        // ======================================

        latestOrders[orderIndex] = {

          ...latestOrders[orderIndex],

          status: "COMPLETED",

          completedAt:
            new Date().toLocaleString()

        };


        localStorage.setItem(

          "orders",

          JSON.stringify(
            latestOrders
          )

        );


        // ======================================
        // UPDATE HOLDINGS
        // ======================================

        const existingHoldings =
          JSON.parse(
            localStorage.getItem("holdings")
          ) || [];


        // ======================================
        // BUY
        // ======================================

        if (
          pendingOrder.type === "BUY"
        ) {

          const existingStock =
            existingHoldings.find(
              item =>
                item.symbol ===
                pendingOrder.symbol
            );


          if (existingStock) {

            existingStock.quantity =
              Number(
                existingStock.quantity
              ) +
              Number(
                pendingOrder.quantity
              );


            existingStock.totalInvested =
              Number(
                existingStock.totalInvested
              ) +
              Number(
                pendingOrder.total
              );


            existingStock.buyPrice =
              existingStock.totalInvested /
              existingStock.quantity;

          }

          else {

            existingHoldings.push({

              id:
                pendingOrder.id,

              symbol:
                pendingOrder.symbol,

              name:
                pendingOrder.name,

              quantity:
                Number(
                  pendingOrder.quantity
                ),

              buyPrice:
                Number(
                  pendingOrder.price
                ),

              totalInvested:
                Number(
                  pendingOrder.total
                )

            });

          }

        }


        // ======================================
        // SELL
        // ======================================

        if (
          pendingOrder.type === "SELL"
        ) {

          const existingStock =
            existingHoldings.find(
              item =>
                item.symbol ===
                pendingOrder.symbol
            );


          if (existingStock) {

            existingStock.quantity =
              Number(
                existingStock.quantity
              ) -
              Number(
                pendingOrder.quantity
              );


            existingStock.totalInvested =
              existingStock.quantity *
              Number(
                existingStock.buyPrice
              );

          }

        }


        // ======================================
        // REMOVE ZERO QUANTITY
        // ======================================

        const updatedHoldings =
          existingHoldings.filter(
            item =>
              Number(item.quantity) > 0
          );


        localStorage.setItem(

          "holdings",

          JSON.stringify(
            updatedHoldings
          )

        );


        // ======================================
        // GO TO HOLDINGS
        // ======================================

        setTimeout(() => {

          navigate("/holding");

        }, 500);


      }, 5000);


    return () => {

      clearTimeout(timer);

    };

  }, [navigate]);


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="order">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="order-header">

        <div>

          <h1>
            📋 Orders
          </h1>

          <p>
            View all your buy and sell orders.
          </p>

        </div>


        <button
          onClick={() =>
            navigate("/")
          }
        >
          ← Back
        </button>

      </div>


      {/* =====================================
          NO ORDERS
      ===================================== */}

      {orders.length === 0 ? (

        <div className="order-card">

          <div className="empty-order-icon">
            📋
          </div>

          <h2>
            No Orders Found
          </h2>

          <p>
            Your completed and pending orders
            will appear here.
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Explore Stocks
          </button>

        </div>

      ) : (


        <div className="orders-list">


          {orders.map(order => (

            <div
              className="order-card"
              key={order.id}
            >


              {/* TOP */}

              <div className="order-top">

                <div>

                  <h2>
                    {order.symbol}
                  </h2>

                  <p>
                    {order.name}
                  </p>

                </div>


                <span
                  className={
                    order.type === "BUY"
                      ? "order-buy"
                      : "order-sell"
                  }
                >
                  {order.type}
                </span>

              </div>


              {/* DETAILS */}

              <div className="order-details">

                <div>

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {order.quantity}
                  </strong>

                </div>


                <div>

                  <span>
                    Price
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.price
                    ).toFixed(2)}
                  </strong>

                </div>


                <div>

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.total
                    ).toFixed(2)}
                  </strong>

                </div>

              </div>


              {/* STATUS */}

              <div className="order-status">

                <span>
                  Order Status
                </span>


                {order.status ===
                "COMPLETED" ? (

                  <strong className="status-completed">

                    ✓ COMPLETED

                  </strong>

                ) : (

                  <strong className="status-pending">

                    ⏳ PENDING

                  </strong>

                )}

              </div>


              {/* TIME */}

              <div className="order-time">

                <p>
                  Order Time:
                  {" "}
                  {order.createdAt}
                </p>


                {order.completedAt && (

                  <p>
                    Completed:
                    {" "}
                    {order.completedAt}
                  </p>

                )}

              </div>


              {/* MESSAGE */}

              {order.status ===
                "COMPLETED" && (

                <div className="completed-message">

                  ✓ Order completed successfully

                </div>

              )}


              {order.status ===
                "PENDING" && (

                <div className="pending-message">

                  ⏳ Your order is being processed...
                  <br />
                  Please wait 5 seconds.

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

};


export default Order;

