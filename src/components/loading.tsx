import React from 'react';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <h1 className="loading-text">Loading Please Wait ...</h1>
      <p className="loading-subtext mt-2 ">Weaving heritage into into fashion</p>
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          color: #343a40;
          font-family: 'Arial', sans-serif;
          text-align: center;
        }

        .spinner {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .dot {
          width: 16px;
          height: 16px;
          background-color: #495057;
          border-radius: 50%;
          animation: bounce 1.5s infinite ease-in-out;
        }

        .dot:nth-child(1) {
          animation-delay: 0s;
        }

        .dot:nth-child(2) {
          animation-delay: 0.3s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .loading-text {
          font-size: 1.8rem;
          font-weight: bold;
          margin: 0;
        }

        .loading-subtext {
          font-size: 1rem;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .loading-text {
            font-size: 1.5rem;
          }

          .loading-subtext {
            font-size: 0.9rem;
          }

          .dot {
            width: 12px;
            height: 12px;
          }
        }

        @media (max-width: 480px) {
          .loading-text {
            font-size: 1.2rem;
          }

          .loading-subtext {
            font-size: 0.8rem;
          }

          .dot {
            width: 10px;
            height: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
