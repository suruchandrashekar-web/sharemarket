
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "./Report.css";

const Reports = () => {

  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const user = useMemo(() => {

    try {

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
      );

      if (loggedInUser) {
        return loggedInUser;
      }

      const googleUser = JSON.parse(
        localStorage.getItem("googleUser") || "null"
      );

      if (googleUser) {
        return googleUser;
      }

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (storedUser) {
        return storedUser;
      }

    } catch (error) {

      console.error("User error:", error);

    }

    return {
      name: "Demo Investor",
      email: "yourmail@gmail.com"
    };

  }, []);


  const userName =
    user?.name || "Demo Investor";


  // =====================================================
  // DEMO REPORT DATA
  // =====================================================

  const reports = [
    {
      id: "TXN1001",
      date: "30 Aug 2026",
      stock: "Reliance Industries",
      type: "BUY",
      quantity: 10,
      price: 1425.50,
      amount: 14255.00,
      status: "Completed"
    },
    {
      id: "TXN1002",
      date: "29 Aug 2026",
      stock: "TCS",
      type: "BUY",
      quantity: 5,
      price: 3180.25,
      amount: 15901.25,
      status: "Completed"
    },
    {
      id: "TXN1003",
      date: "28 Aug 2026",
      stock: "Infosys",
      type: "SELL",
      quantity: 8,
      price: 1725.75,
      amount: 13806.00,
      status: "Completed"
    },
    {
      id: "TXN1004",
      date: "27 Aug 2026",
      stock: "HDFC Bank",
      type: "BUY",
      quantity: 12,
      price: 1945.20,
      amount: 23342.40,
      status: "Completed"
    },
    {
      id: "TXN1005",
      date: "26 Aug 2026",
      stock: "ICICI Bank",
      type: "SELL",
      quantity: 15,
      price: 1280.50,
      amount: 19207.50,
      status: "Completed"
    }
  ];


  // =====================================================
  // SUMMARY
  // =====================================================

  const totalOrders = reports.length;

  const buyOrders =
    reports.filter(
      (item) => item.type === "BUY"
    ).length;

  const sellOrders =
    reports.filter(
      (item) => item.type === "SELL"
    ).length;

  const totalValue =
    reports.reduce(
      (total, item) =>
        total + item.amount,
      0
    );


  // Demo P&L
  const profitLoss = 8425.50;


  // =====================================================
  // MONEY FORMAT
  // =====================================================

  const formatMoney = (value) => {

    return Number(value).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

  };


  // =====================================================
  // DOWNLOAD REPORT
  // =====================================================

  const handleDownload = () => {

    const header =
      "Transaction ID,Date,Stock,Type,Quantity,Price,Amount,Status\n";

    const rows = reports
      .map(
        (item) =>
          `${item.id},${item.date},${item.stock},${item.type},${item.quantity},${item.price},${item.amount},${item.status}`
      )
      .join("\n");

    const csv =
      header + rows;

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "TradeX-Trading-Report.csv";

    link.click();

    URL.revokeObjectURL(url);

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="reports-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="reports-header">

        <div>

          <div className="reports-brand">
            Trade<span>X</span>
          </div>

          <h1>
            Trading Reports
          </h1>

          <p>
            Welcome back, {userName}. Here is your
            trading activity summary.
          </p>

        </div>


        <button
          className="reports-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

      </header>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <section className="report-summary">

        <div className="report-card">

          <div className="report-card-icon">
            📋
          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

            <small>
              All transactions
            </small>

          </div>

        </div>


        <div className="report-card">

          <div className="report-card-icon green">
            📈
          </div>

          <div>

            <span>
              Buy Orders
            </span>

            <strong>
              {buyOrders}
            </strong>

            <small>
              Completed buys
            </small>

          </div>

        </div>


        <div className="report-card">

          <div className="report-card-icon red">
            📉
          </div>

          <div>

            <span>
              Sell Orders
            </span>

            <strong>
              {sellOrders}
            </strong>

            <small>
              Completed sells
            </small>

          </div>

        </div>


        <div className="report-card">

          <div className="report-card-icon purple">
            💰
          </div>

          <div>

            <span>
              Trading Value
            </span>

            <strong>
              ₹{formatMoney(totalValue)}
            </strong>

            <small>
              Total transaction value
            </small>

          </div>

        </div>

      </section>


      {/* =================================================
          PROFIT LOSS
      ================================================= */}

      <section className="pnl-card">

        <div>

          <span>
            Overall Profit / Loss
          </span>

          <h2>
            ₹{formatMoney(profitLoss)}
          </h2>

          <p>
            Your demo portfolio is currently
            showing a positive return.
          </p>

        </div>


        <div className="pnl-right">

          <div className="pnl-icon">
            ↗
          </div>

          <strong>
            +12.45%
          </strong>

          <span>
            Overall Return
          </span>

        </div>

      </section>


      {/* =================================================
          REPORT TABLE HEADER
      ================================================= */}

      <section className="transactions-section">

        <div className="section-heading">

          <div>

            <h2>
              Transaction History
            </h2>

            <p>
              Recent buy and sell transactions
            </p>

          </div>


          <button
            className="download-button"
            onClick={handleDownload}
          >
            ↓ Download CSV
          </button>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Transaction
                </th>

                <th>
                  Date
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Type
                </th>

                <th>
                  Qty
                </th>

                <th>
                  Price
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {reports.map((item) => (

                <tr key={item.id}>

                  <td className="transaction-id">
                    {item.id}
                  </td>

                  <td>
                    {item.date}
                  </td>

                  <td className="stock-name">
                    {item.stock}
                  </td>

                  <td>

                    <span
                      className={
                        item.type === "BUY"
                          ? "type-badge buy"
                          : "type-badge sell"
                      }
                    >
                      {item.type}
                    </span>

                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    ₹{formatMoney(item.price)}
                  </td>

                  <td className="amount">
                    ₹{formatMoney(item.amount)}
                  </td>

                  <td>

                    <span className="status-badge">
                      ✓ {item.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* =================================================
          REPORT INFORMATION
      ================================================= */}

      <section className="report-info-grid">

        <div className="info-card">

          <div className="info-icon">
            📊
          </div>

          <div>

            <h3>
              Portfolio Report
            </h3>

            <p>
              View your current stocks,
              investments and portfolio performance.
            </p>

            <button
              onClick={() =>
                navigate("/holding")
              }
            >
              View Holdings →
            </button>

          </div>

        </div>


        <div className="info-card">

          <div className="info-icon">
            📋
          </div>

          <div>

            <h3>
              Order Report
            </h3>

            <p>
              Check all your completed,
              pending and cancelled orders.
            </p>

            <button
              onClick={() =>
                navigate("/order")
              }
            >
              View Orders →
            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          DEMO NOTICE
      ================================================= */}

      <div className="reports-notice">

        <strong>
          Demo Trading Report
        </strong>

        <p>
          This report contains simulated trading
          data for your TradeX project. It does not
          represent real market transactions or real
          financial returns.
        </p>

      </div>


    </div>

  );

};

export default Reports;

