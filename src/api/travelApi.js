/* e5f133b293844ba595a7ce4a567f5e33 */
import axios from "axios";

const API_KEY = "e5f133b293844ba595a7ce4a567f5e33";

export const getTravelSpots = async () => {
  try {
    const res = await axios.get(
      "https://api.geoapify.com/v2/places",
      {
        params: {
          categories: "tourism.attraction",
          filter: "circle:126.9780,37.5665,5000",
          limit: 10,
          apiKey: API_KEY,
        },
      }
    );

    return res.data.features;

  } catch (err) {
    console.log(err);
    return [];
  }
};
