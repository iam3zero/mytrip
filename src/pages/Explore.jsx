import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TravelContext } from "../App";
import { fetchPlaceImage } from "../api/unsplashApi";
import { auth } from "../firebase";
import { db } from "../firebase";
import Loading from "../components/Loading";
import { useSearchParams } from "react-router-dom";
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import {
  searchTravelSpots,
  getTravelSpotsByRegion
} from '../api/travelApi';
import "../styles/Home.scss";

const Explore = () => {
  const [visibleCount, setVisibleCount] = useState(12);
  const { places, loading } = useContext(TravelContext);
  const navigate = useNavigate();

  const [images, setImages] = useState({});
  const [likedPlaces, setLikedPlaces] = useState({});


  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("search") || "";
  const REGION_MAP = {
    서울: { lon:126.9780, lat:37.5665 },
    부산: { lon:129.0756, lat:35.1796 },
    제주: { lon:126.5312, lat:33.4996 },
    강릉: { lon:128.8761, lat:37.7519 },
    여수: { lon:127.6622, lat:34.7604 },
    경주: { lon:129.2247, lat:35.8562 },
  };
      

  /* const filteredPlaces = places.filter((place) => {
    const name = place?.properties?.name;

    if (typeof name !== "string") return false;

    return name.toLowerCase().includes(keyword.toLowerCase());
  }); */


  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadResults = async () => {

      // 검색어 없으면 Home 데이터 사용
      if (!keyword) {
        setResults(places);
        return;
      }

      // 지역 버튼 클릭
      if (REGION_MAP[keyword]) {
        const { lon, lat } = REGION_MAP[keyword];

        const data = await getTravelSpotsByRegion(
          lon,
          lat,
          30000,
          24
        );

        setResults(data);
        return;
      }

      // 일반 검색 (경복궁 등)
      const data = await searchTravelSpots(keyword);

      // Geocoding 결과를 Explore 카드 형식으로 변환
      const converted = data.map((item, index) => ({
        properties: {
          place_id: item.properties.place_id || index,
          name:
            item.properties.name ||
            item.properties.address_line1 ||
            item.properties.formatted.split(",")[0],

          opening_hours:
            item.properties.city ||
            item.properties.state ||
            item.properties.county ||
            "",

          country: item.properties.country,
        },
      }));

      setResults(converted);

    };

    loadResults();
  }, [keyword, places]);

  // 🔥 로그인한 유저의 찜 목록 실시간 구독
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tripsRef = collection(db, "users", user.uid, "trips");

    const unsubscribe = onSnapshot(tripsRef, (snapshot) => {
      const likedMap = {};
      snapshot.forEach((doc) => {
        likedMap[doc.id] = true;
      });
      setLikedPlaces(likedMap);
    });

    return () => unsubscribe();
  }, []);

  if (loading || !Array.isArray(places)) {
    return <Loading />;
  }

  // 🔥 찜하기
  const handleLike = async (place) => {
    const user = auth.currentUser;

    if (!user) {
      alert("회원가입 후 이용해주세요 😊");
      navigate("/signup");
      return;
    }

    const placeId = place.properties.place_id;
    const name = place.properties.name;
    const country = place.properties.country;

    try {
      await setDoc(
        doc(db, "users", user.uid, "trips", String(placeId)),
        {
          name,
          country,
          image: images[placeId] || `${import.meta.env.BASE_URL}img/no-image.jpg`,
          status: "planned",
          place_id: placeId,
          createdAt: new Date(),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 찜 취소
  const handleUnlike = async (placeId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(
        doc(db, "users", user.uid, "trips", String(placeId))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home">
      <h2>
        {keyword
          ? `"${keyword}" 검색 결과`
          : "📍 추천 여행지"}
      </h2>

      {results.length === 0 ? (

        <div className="no-result">
            검색 결과가 없습니다 😢
        </div>

    ) : (
      <ul className="list">
        {results.slice(0, visibleCount).map((place)=>{
          const placeId = place.properties.place_id;
          const name = place.properties.name;
          const isLiked = likedPlaces[placeId];
         
          return (
            <li key={placeId} className="place-card">
              <Link to={`/explore/detail?pid=${placeId}`}>
                <div className="img-wrap">
                  <img
                    src={
                      images[placeId] ||
                      `${import.meta.env.BASE_URL}img/no-image.jpg`
                    }
                    alt={name}
                  />
                </div>
                <h3>{name}</h3>
                <p>{place.properties.opening_hours}</p>
              </Link>

              {isLiked ? (
                <button
                  className="btn liked"
                  onClick={() => handleUnlike(placeId)}
                >
                  💔 Unlike
                </button>
              ) : (
                <button
                  className="btn"
                  onClick={() => handleLike(place)}
                >
                  ❤️ Like
                </button>
              )}
            </li>
          );
        })}
      </ul>
      )}
      {visibleCount < results.length && (
        <div className="load-more">
          <button onClick={() => setVisibleCount(prev => prev + 12)}>
            여행지 더보기 ✈️
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
