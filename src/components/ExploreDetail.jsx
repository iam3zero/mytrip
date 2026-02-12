import { useSearchParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { TravelContext } from "../App";
import { fetchPlaceImage } from "../api/unsplashApi";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import "../styles/ExploreDetail.scss";

const ExploreDetail = () => {
  const { places, loading: contextLoading } = useContext(TravelContext);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const placeId = searchParams.get("pid");

  const [place, setPlace] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  // 🔵 place 찾기
  useEffect(() => {
    if (!placeId || places.length === 0) return;

    const found = places.find(
      (item) => String(item.properties.place_id) === placeId
    );

    setPlace(found);
  }, [placeId, places]);

  // 🔵 이미지 가져오기
  useEffect(() => {
    if (!place?.properties?.name) return;

    const loadImage = async () => {
      const query = `${place.properties.name} ${place.properties.country}`;
      const img = await fetchPlaceImage(query);
      setImage(img);
      setLoading(false);
    };

    loadImage();
  }, [place]);

  // 🔥 이미 찜했는지 실시간 체크
  useEffect(() => {
    const user = auth.currentUser;
    if (!user || !placeId) return;

    const tripRef = doc(db, "users", user.uid, "trips", placeId);

    const unsubscribe = onSnapshot(tripRef, (docSnap) => {
      setIsLiked(docSnap.exists());
    });

    return () => unsubscribe();
  }, [placeId]);

  if (contextLoading || loading) return <p>로딩중...</p>;
  if (!place) return <p>여행지 정보를 찾을 수 없습니다.</p>;

  const {
    name,
    website,
    district,
    categories,
    address_line1,
    address_line2,
    country,
    city,
  } = place.properties;

  // 🔥 찜하기
  const handleLike = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("회원가입 후 이용해주세요 😊");
      navigate("/signup");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid, "trips", placeId),
        {
          name,
          country,
          city,
          image,
          status: "planned",
          createdAt: new Date(),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 찜 취소
  const handleUnlike = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(
        doc(db, "users", user.uid, "trips", placeId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="explore-detail">
      <img src={image} alt={name} />

      <h1>{name}</h1>

      <ul className="info">
        {Array.isArray(categories) && (
          <li>
            <strong>카테고리</strong>
            <span>
              {categories
                .map((c) => c.replaceAll(".", " · "))
                .join(", ")}
            </span>
          </li>
        )}

        {district && (
          <li>
            <strong>지역</strong>
            <span>{district}</span>
          </li>
        )}

        {(address_line1 || address_line2) && (
          <li>
            <strong>주소</strong>
            <span>
              {address_line1} {address_line2}
            </span>
          </li>
        )}

        {(city || country) && (
          <li>
            <strong>위치</strong>
            <span>
              {city} / {country}
            </span>
          </li>
        )}

        {website && (
          <li>
            <strong>웹사이트</strong>
            <a href={website} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </li>
        )}
      </ul>

      {/* 🔥 버튼 분기 */}
      {isLiked ? (
        <button className="likebtn liked" onClick={handleUnlike}>
          💔 Unlike
        </button>
      ) : (
        <button className="likebtn" onClick={handleLike}>
          ❤️ Like
        </button>
      )}
    </div>
  );
};

export default ExploreDetail;
