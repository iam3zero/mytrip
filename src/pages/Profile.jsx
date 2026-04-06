import React, { useContext } from 'react';
import '../styles/profile.scss';
import { AuthContext } from '../context/AuthContext';
import { TripContext } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { trips } = useContext(TripContext);
  const navigate = useNavigate();

  // 🔒 로그인 안 된 경우
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-empty">
          <h2>로그인이 필요합니다 🔒</h2>
          <p>TripMate 서비스를 이용하려면 로그인해주세요</p>
          <button onClick={() => navigate('/login')}>
            로그인 하러가기
          </button>
        </div>
      </div>
    );
  }

  // 🔥 로그아웃
  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다.");
    navigate('/');
  };

  return (
    <div className="profile-container">

      {/* 유저 정보 */}
      <div className="profile-header">
        <div className="profile-img">👤</div>
        <h2>{user.displayName || "Traveler"}</h2>
        <p>{user.email}</p>
      </div>

      {/* 여행 통계 */}
      <div className="profile-stats">
        <div className="stat">
          <h3>{trips.length}</h3>
          <p>Saved Trips</p>
        </div>
        <div className="stat">
          <h3>{trips.filter(t => t.status === 'planned').length}</h3>
          <p>Planned</p>
        </div>
        <div className="stat">
          <h3>{trips.filter(t => t.status === 'done').length}</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* 최근 여행 */}
      <div className="profile-trips">
        <Link to="/mytrip" className="trip-link">
            <h3>My Trips ✈️</h3>
        </Link>

        <div className="trip-preview">
          {trips.slice(0, 4).map((trip) => (
            <div key={trip.id} className="trip-card">
                <Link to="/mytrip">
                    <img src={trip.image} alt={trip.name} />
                </Link>
              <p>{trip.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 로그아웃 */}
      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>

    </div>
  );
};

export default Profile;