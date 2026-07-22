import axios from "axios";

const API_KEY = "e5f133b293844ba595a7ce4a567f5e33";
const BASE_URL = "https://api.geoapify.com/v2/places";

/**
 * Home에서 사용하는 기본 관광지
 * (기존 함수 - App.jsx와 호환)
 */
export const getTravelSpots = async () => {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        categories: "tourism.attraction",
        filter: "circle:126.9780,37.5665,15000",
        limit: 36,
        apiKey: API_KEY,
      },
    });

    return res.data.features;

  } catch (err) {
    console.error(err);
    return [];
  }
};

/**
 * 지역별 관광지 가져오기
 * ex)
 * getTravelSpotsByRegion(126.9780,37.5665)
 */
export const getTravelSpotsByRegion = async (
  lon,
  lat,
  radius = 15000,
  limit = 12
) => {

  try {

    const res = await axios.get(BASE_URL, {
      params: {
        categories: "tourism.attraction",
        filter: `circle:${lon},${lat},${radius}`,
        limit,
        apiKey: API_KEY,
      },
    });

    return res.data.features;

  } catch (err) {

    console.error(err);
    return [];
  }
};

/**
 * 검색
 */
export const searchTravelSpots = async (keyword) => {

  if (!keyword.trim()) return [];

  try {

    const res = await axios.get(BASE_URL, {
      params: {
        categories: "tourism.attraction",
        filter: "rect:124.5,33.0,132.0,39.0",
        name: keyword,
        limit: 30,
        apiKey: API_KEY,
      },
    });

    return res.data.features;

  } catch (err) {

    console.error(err);
    return [];

  }

};