import React, { useState, useEffect } from "react";
import "./style.css";
const monsterBaseUrl = "https://www.aidedd.org/dnd/monstres.php?vo=";
const spellBaseUrl = "http://dnd5e.wikidot.com/spell:";

function App() {
  const itemsPerPage = 15;
  let totalPages = 1;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currDisplay, setCurrDisplay] = useState("monsters");
  const [currPage, setCurrPage] = useState(1);
  const [currUrl, setCurrUrl] = useState(monsterBaseUrl);
  const [searchTerm, setSearchTerm] = useState("");

  const showMonsters = () => {
    setCurrPage(1);
    setCurrDisplay("monsters");
    setCurrUrl(monsterBaseUrl);
    setSearchTerm(""); // Clear the search term when switching pages
  };

  const showSpells = () => {
    setCurrPage(1);
    setCurrDisplay("spells");
    setCurrUrl(spellBaseUrl);
    setSearchTerm(""); // Clear the search term when switching pages
  };

  const filterData = (e) => {
    setCurrPage(1);
    setSearchTerm(e.target.value);
    const filteredArr = data.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredData(filteredArr);
  };

  const getPageData = () => {
    const startIndex = (currPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    totalPages = Math.ceil(filteredData.length / itemsPerPage);
    return filteredData.slice(startIndex, endIndex);
  };

  const prevPage = () => {
    if (currPage == 1) setCurrPage(totalPages);
    else setCurrPage(currPage - 1);
  };

  const nextPage = () => {
    if (currPage == totalPages) setCurrPage(1);
    else setCurrPage(currPage + 1);
  };

  useEffect(() => {
    // Update filteredData when searchTerm changes
    const filteredArr = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredArr);
  }, [searchTerm, data]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.dnd5eapi.co/api/${currDisplay}`
        );
        if (!response.ok) throw new Error("Something went wrong");

        const result = await response.json();

        if (isMounted) {
          setData(result.results);
          setFilteredData(result.results);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function to set isMounted to false when component unmounts
      isMounted = false;
    };
  }, [currUrl, currDisplay]);

  return (
    <div>
      <div className="buttonsContainer">
        <button
          className={currDisplay === "monsters" ? "activeBtn" : ""}
          onClick={showMonsters}
        >
          Monsters
        </button>
        <button
          className={currDisplay === "spells" ? "activeBtn" : ""}
          onClick={showSpells}
        >
          Spells
        </button>
      </div>
      <label htmlFor="monsterSearch">Search </label>
      <div className="inputContainer">
        <input
          id="monsterSearch"
          type="text"
          value={searchTerm}
          onChange={filterData}
        />
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => setSearchTerm("")}
        ></i>
      </div>
      <ul>
        {getPageData().map((item) => (
          <li key={item.index}>
            <a target="_blank" href={`${currUrl}${item.index}`}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="paginationContainer">
        <button onClick={prevPage} /*disabled={currPage === 1}*/>
          Previous
        </button>
        <p>
          {currPage}/{totalPages}
        </p>
        <button
          onClick={nextPage}
          /*disabled={getPageData().length < itemsPerPage}*/
        >
          Next
        </button>
      </div>
      <div className="footer">
        <p>
          <span>Powered by</span>
          <a href="https://www.dnd5eapi.co/" target="_blank">
            D&D 5e Api{" "}
          </a>
          ,
        </p>{" "}
        <p>
          <a
            href="https://www.aidedd.org/dnd-filters/monsters.php"
            target="_blank"
          >
            Aidedd{" "}
          </a>
          ,
          <a href="http://dnd5e.wikidot.com/" target="_blank">
            Wikidot
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
