import React from "react";
import "../styles/loading.scss";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
        <h2>✈️ TripMate</h2>
        <p>당신의 여행을 준비하는 중...</p>
    </div>
  );
};

export default Loading;