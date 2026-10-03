
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Support.css";


function Support() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [message, setMessage] = useState("");


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!message.trim()) {

      alert("Please enter your message.");

      return;

    }

    alert(
      "Thank you! Our support team will contact you shortly."
    );

    setMessage("");

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="support-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="support-header">

        <div>

          <h1>
            24×7 Customer Support
          </h1>

          <p>
            We are here to help you with your TradeX account
          </p>

        </div>


        <button
          className="support-back-button"
          onClick={() => navigate(-1)}
        >

          ← Back

        </button>

      </div>



      {/* =================================================
          SUPPORT OPTIONS
      ================================================= */}

      <div className="support-options">


        {/* =================================================
            CHAT
        ================================================= */}

        <div className="support-card">

          <div className="support-icon">
            💬
          </div>

          <div>

            <h2>
              Live Chat
            </h2>

            <p>
              Chat with our support team for quick help.
            </p>

            <button
              onClick={() =>
                alert(
                  "Live Chat will be available shortly."
                )
              }
            >

              Start Chat

            </button>

          </div>

        </div>



        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="support-card">

          <div className="support-icon">
            📧
          </div>

          <div>

            <h2>
              Email Support
            </h2>

            <p>
              Send us your questions and we will reply.
            </p>

            <button
              onClick={() =>
                window.location.href =
                  "mailto:support@tradex.demo"
              }
            >

              Send Email

            </button>

          </div>

        </div>



        {/* =================================================
            PHONE
        ================================================= */}

        <div className="support-card">

          <div className="support-icon">
            📞
          </div>

          <div>

            <h2>
              Phone Support
            </h2>

            <p>
              Talk to our customer support team.
            </p>

            <button
              onClick={() =>
                alert(
                  "Phone support: +91 1800 123 4567"
                )
              }
            >

              Call Support

            </button>

          </div>

        </div>


      </div>



      {/* =================================================
          SUPPORT FORM
      ================================================= */}

      <div className="support-form-card">

        <h2>
          How can we help you?
        </h2>

        <p>
          Describe your issue and our support team
          will assist you.
        </p>


        <form onSubmit={handleSubmit}>

          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            rows="6"
          />


          <button
            type="submit"
            className="send-support-button"
          >

            Send Message

          </button>

        </form>

      </div>



      {/* =================================================
          FAQ
      ================================================= */}

      <div className="support-faq">

        <h2>
          Frequently Asked Questions
        </h2>


        <div className="faq-item">

          <h3>
            How can I reset my demo account?
          </h3>

          <p>
            Go to My Account and click
            "Reset Demo Account".
          </p>

        </div>


        <div className="faq-item">

          <h3>
            How can I change my profile photo?
          </h3>

          <p>
            Open My Account and use the
            "Change Photo" option.
          </p>

        </div>


        <div className="faq-item">

          <h3>
            Is TradeX real trading?
          </h3>

          <p>
            No. TradeX is a demo trading platform
            for learning and project demonstration.
          </p>

        </div>

      </div>



      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="support-footer">

        <strong>
          TradeX Support
        </strong>

        <p>
          Available 24×7 for demo account assistance.
        </p>

      </div>


    </div>

  );

}


export default Support;

