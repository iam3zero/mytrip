import React from "react";
import { useState } from "react";
import "../styles/footer.scss";
import { Link } from 'react-router-dom';

const Footer = () => {

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <h2>TripMate</h2>
          <p>Travel Smart, Travel Together.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Menu</h4>
            <a href="/">Home</a>
            <a href="/explore">Explore</a>
            <a href="/community">Community</a>
            <a href="/mytrip">My Trip</a>
          </div>

          <div>
            <h4>Support</h4>
            <a onClick={() => setModalOpen(true)}>FAQ</a>
            <a onClick={() => setModalOpen(true)}>Contact</a>
            <a onClick={() => setModalOpen(true)}>Privacy Policy</a>
            <a onClick={() => setModalOpen(true)}>Terms</a>
          </div>
        </div>

        <div className="footer-social">
          <h4>Follow</h4>
          <div className="social-icons">
            <span onClick={() => setModalOpen(true)}>🌎</span>
            <span onClick={() => setModalOpen(true)}>📷</span>
            <span onClick={() => setModalOpen(true)}>✈️</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} TripMate. All rights reserved.
      </div>
    </footer>
    {modalOpen && (
        <div className="modal" onClick={() => setModalOpen(false)}>
            
            <div 
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            >
            <p>아직 준비되지 않은 서비스입니다.</p>
            <button onClick={() => setModalOpen(false)}>닫기</button>
            </div>

        </div>
        )}
    </>
  );
};

export default Footer;
