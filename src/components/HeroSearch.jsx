import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import "../styles/heroSearch.scss";
import searchSuggestions from "../data/searchSuggestions";

const keywords = [
  "경복궁",
  "제주도",
  "부산",
  "여수",
  "강릉",
  "속초",
  "전주",
];

const popularRegions = [
  { label: "서울" },
  { label: "부산" },
  { label: "제주" },
  { label: "강릉" },
  { label: "여수" },
  { label: "경주" },
];

const HeroSearch = ({ value, onChange, onSearch }) => {

  const [placeholder, setPlaceholder] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // placeholder 변경
  useEffect(() => {

    let index = 0;

    setPlaceholder(`🔍 ${keywords[0]}`);

    const interval = setInterval(() => {

      index = (index + 1) % keywords.length;

      setPlaceholder(`🔍 ${keywords[index]}`);

    }, 2500);

    return () => clearInterval(interval);

  }, []);




  useEffect(() => {

  if (!value.trim()) {
    setSuggestions([]);
    return;
  }

  const timer = setTimeout(() => {

    const filtered = searchSuggestions
      .filter((item) =>
        item.includes(value)
      )
      .slice(0, 8);

    setSuggestions(filtered);

  }, 80);

  return () => clearTimeout(timer);

}, [value]);



  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      onSearch();

      setSuggestions([]);

    }

  };

  return (
    <section className="hero-search">

      <span className="hero-badge">
        ✈️ 국내 여행을 쉽고 빠르게
      </span>

      <h1>
        국내 여행의 모든 것,
        <br />
        <strong>TripMate</strong>에서 시작하세요.
      </h1>

      <p>
        원하는 여행지를 검색하고
        새로운 여행을 계획해보세요.
      </p>

      <div className="search-box">

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />

        <button onClick={() => {
          onSearch();
          setSuggestions([]);
        }}>
          <FiSearch />
        </button>

      </div>

      {suggestions.length > 0 && (

        <ul className="search-dropdown">

          {suggestions.map((item)=>(

            <li
              key={item}
              onClick={() => onSearch(item)}
          >
              {item}
          </li>

          ))}

        </ul>

      )}

      <div className="popular-keywords">

        <span>🔥 인기 검색어</span>

        {popularRegions.map((region) => (

          <button
            key={region.label}
            onClick={() => onSearch(region.label)}
          >
            {region.label}
          </button>

        ))}

      </div>

    </section>
  );
};

export default HeroSearch;