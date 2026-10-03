
import React, { useEffect, useState } from "react";
import "./NavBar2.css";
import { Link } from "react-router-dom";

const NavBar2 = () => {

  // Initial index data
  const initialData = [
    {
      name: "NIFTY",
      price: 24638,
      change: 11.35,
      percentage: 0.05,
      path: "/nifty"
    },
    {
      name: "SENSEX",
      price: 78954.76,
      change: 337.76,
      percentage: 0.48,
      path: "/sensex"
    },
    {
      name: "BANKNIFTY",
      price: 58063,
      change: 323.35,
      percentage: 0.56,
      path: "/banknifty"
    },
    {
      name: "MIDCPNIFTY",
      price: 14812.60,
      change: -67.75,
      percentage: -0.45,
      path: "/midcpnifty"
    },
    {
      name: "FINNIFTY",
      price: 26638,
      change: 19.65,
      percentage: 0.07,
      path: "/finnifty"
    },
    {
      name: "BANKEX",
      price: 65838,
      change: 559.35,
      percentage: 0.89,
      path: "/bankex"
    }
  ];

  const [indices, setIndices] = useState(initialData);

  // ==========================================
  // CHANGE PRICE EVERY 1 SECOND
  // ==========================================

  useEffect(() => {

    const interval = setInterval(() => {

      setIndices(previousData => {

        return previousData.map(index => {

          // Small random price movement
          const movement =
            (Math.random() - 0.5) * 20;

          const newPrice =
            Number(
              (index.price + movement).toFixed(2)
            );

          // Calculate change
          const newChange =
            Number(
              (index.change +
                (Math.random() - 0.5) * 2
              ).toFixed(2)
            );

          // Calculate percentage
          const newPercentage =
            Number(
              (
                (newChange / newPrice) * 100
              ).toFixed(2)
            );

          return {
            ...index,
            price: newPrice,
            change: newChange,
            percentage: newPercentage
          };

        });

      });

    }, 1000);

    // Clear interval when component is removed
    return () => {
      clearInterval(interval);
    };

  }, []);


  return (

    <div className="ticker-wrapper">

      <div className="ticker-container">

        <div className="ticker">

          {indices.map(index => (

            <Link
              key={index.name}
              to={index.path}
              className="ticker-link"
            >

              <span>

                {index.name}{" "}

                {index.price.toLocaleString("en-IN", {
                  minimumFractionDigits:
                    index.name === "SENSEX" ||
                    index.name === "MIDCPNIFTY"
                      ? 2
                      : 0,

                  maximumFractionDigits: 2
                })}

                {" "}

                <span
                  className={
                    index.change >= 0
                      ? "green"
                      : "red"
                  }
                >

                  {index.change >= 0
                    ? "+"
                    : ""}

                  {index.change.toFixed(2)}

                  {" ("}

                  {index.percentage >= 0
                    ? "+"
                    : ""}

                  {index.percentage.toFixed(2)}

                  {"%)"}

                </span>

              </span>

            </Link>

          ))}

        </div>

      </div>

    </div>

  );

};

export default NavBar2;

