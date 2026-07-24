import axios from "axios";

const API_KEY = "e5f133b293844ba595a7ce4a567f5e33";
const PLACES_URL = "https://api.geoapify.com/v2/places";
const GEOCODE_URL = "https://api.geoapify.com/v1/geocode/search";

/**
 * Home 기본 관광지 (서울 중심)
 */
export const getTravelSpots = async () => {
  try {
    const res = await axios.get(PLACES_URL, {
      params: {
        categories: "tourism.attraction,entertainment,heritage,catering",
        filter: "circle:126.9780,37.5665,15000",
        limit: 12,
        apiKey: "e5f133b293844ba595a7ce4a567f5e33",
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
 * 예: 서울, 제주, 부산
 */
export const getTravelSpotsByRegion = async (
  lon,
  lat,
  radius = 30000,
  limit = 24
) => {
  try {
    const res = await axios.get(PLACES_URL, {
      params: {
        categories: "tourism.attraction",
        filter: `circle:${lon},${lat},${radius}`,
        limit,
        apiKey: "e5f133b293844ba595a7ce4a567f5e33",
      },
    });

    return res.data.features;
  } catch (err) {
    console.error(err);
    return [];
  }
};

/**
 * 전국 관광지 검색 (경복궁, 남산타워 등)
 * Geocoding API 사용
 */
export const searchTravelSpots = async (keyword) => {

  if (!keyword.trim()) return [];

  try {

    const res = await axios.get(GEOCODE_URL, {
      params: {
        text: keyword,
        lang: "ko",
        limit: 10,
        filter: "countrycode:kr",
        apiKey: API_KEY,
      },
    });

    console.log("Geoapify 응답", res.data);

    return res.data.features || [];

  } catch (err) {

    console.error(err);
    return [];

  }

};


export const getSearchSuggestions = async (keyword) => {

  if (!keyword.trim()) return [];

  try {

    const res = await axios.get(GEOCODE_URL, {
      params: {
        text: keyword,
        lang: "ko",
        filter: "countrycode:kr",
        limit: 5,
        apiKey: API_KEY,
      },
    });

    return res.data.features;

  } catch (err) {

    console.error(err);
    return [];

  }

};