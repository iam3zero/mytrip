import React, { useContext } from "react";
import { TripContext } from "../context/TripContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

import "../styles/mytrip.scss";

const Mytrip = () => {

  const { trips, loading } = useContext(TripContext);
  const { user } = useContext(AuthContext);


  // 🔥 Firestore 로딩중
  if (loading) {

    return <h2>불러오는 중...</h2>;

  }


  // 🔥 로그인 안된 경우
  if (!user) {

    return (

      <div className="mytrip-container">
        <h1>📍 My Trip</h1>
        <div className="empty-trip">
  
          <h2>로그인이 필요합니다.</h2>
          <p>로그인 후 여행을 추가해보세요 ✈️</p>
  
          <Link to="/login" className="login-btn">
            로그인 하러가기
          </Link>
  
        </div>
      </div>

    );

  }


  // 🔥 로그인 했지만 여행 없음
  if (trips.length === 0) {

    return (

      <div className="mytrip-container">
        <h1>📍 My Trip</h1>
        <div className="empty-trip">
  
          <h2>아직 저장된 여행이 없습니다.</h2>
          <p>마음에 드는 여행지를 추가해보세요 ✈️</p>
  
        </div>
      </div>

    );

  }



  // 🔥 정상 출력
  return (

    <div className="mytrip-container">

      <h1>📍 My Trip</h1>

      <ul className="trip-list">

        {trips.map((trip) => (

          <li key={trip.id} className="trip-item">

            <img
              src={trip.image || "/public/img/no-image.jpg"}
            />

            <div>

              <h3>{trip.name}</h3>

              <p>{trip.country}</p>

            </div>

          </li>

        ))}

      </ul>

    </div>

  );

};

export default Mytrip;