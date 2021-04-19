import React, { useState, useEffect, useRef } from "react";
import "./Search.css";
import axios from "./axios";
import requests from "./Requsets";
import { useHistory, useParams } from "react-router-dom";

function Search() {
  const [search, setSearch] = useState("");
  const [found, setFound] = useState([]);
  let history = useHistory();

  const node = useRef();
  const redirect = (x) => {
    history.push(`/movie/${x}`);
    console.log(x);
  };
  useEffect(() => {
    axios
      .get(requests.searchURL + search)
      .then((response) => {
        setFound(response.data.results);
      })
      .catch((err) => {
        setFound([]);
      });
  }, [search]);

  const closeSearch = () => {
    setSearch("");
    setFound([]);
  };

  useEffect(() => {
    // add when mounted
    search.length > 1 && document.addEventListener("click", handleClick);
    // return function to be called when unmounted
    if (search === "") {
      document.removeEventListener("click", handleClick);
    }
    // return () => {
    //   document.removeEventListener("click", handleClick);
    // };
  }, [search]);

  const handleClick = (e) => {
    if (node.current?.contains(e.target)) {
      // inside click
      return;
    }
    setSearch("");
    setFound([]);
  };
  return (
    <div className="search_form" ref={node}>
      {search && (
        <div className="close_search" onClick={closeSearch}>
          <i class="fas fa-times search_close"></i>
        </div>
      )}

      <input
        className="search_input"
        placeholder="search"
        value={search}
        onChange={(e) => {
          e.preventDefault();
          setSearch(e.target.value);
        }}
      />
      <div>
        {found.map((movies, index) =>
          index < 6 ? (
            <div key={movies.id} className="search_box">
              <div
                className="search_container"
                onClick={() => redirect(movies.id)}
              >
                {" "}
                <img
                  className="search_img"
                  width="100"
                  src={`https://image.tmdb.org/t/p/original/${movies.poster_path}`}
                />
                <p className="search_title">{movies.original_title}</p>
                <p className="realease_date">
                  ({movies.release_date.slice(0, 4)})
                </p>{" "}
              </div>
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
}

export default Search;
