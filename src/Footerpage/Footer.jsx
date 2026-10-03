
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {

  const navigate = useNavigate();

  return (

    <footer className="small-footer">

      {/* TOP */}
      <div className="footer-top">

        <div className="footer-logo">
          Trade<span>X</span>
        </div>

        <p>
          Demo trading platform for learning and practicing
          stock market concepts with virtual money.
        </p>

      </div>


      {/* LINKS */}
      <div className="footer-links">

        <button onClick={() => navigate("/")}>
          Market
        </button>

        <button onClick={() => navigate("/watchlist")}>
          Watchlist
        </button>

        <button onClick={() => navigate("/holding")}>
          Holdings
        </button>

        <button onClick={() => navigate("/positions")}>
          Positions
        </button>

        <button onClick={() => navigate("/order")}>
          Orders
        </button>

        <button onClick={() => navigate("/account")}>
          Account
        </button>

        <button onClick={() => navigate("/support")}>
          24×7 Support
        </button>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <span>
          © 2026 TradeX. All rights reserved.
        </span>

        <span>
          Demo Trading Platform • Virtual Money Only
        </span>

      </div>

    </footer>

  );
};

export default Footer;

