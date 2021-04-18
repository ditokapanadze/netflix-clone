import React, { useState, useEffect } from "react";
import "./Banner.css";
import axios from "./axios";
import requests from "./Requsets";
import TypeWriterEffect from "react-typewriter-effect";

function Banner() {
  const [movie, setMovie] = useState([]);
  const [title, setTitle] = useState([]);
  // const [x, setX] = useState(0);
  const sacdeli = "aba vnaxot ra gamova";

  // რენდომ ფილმის ინფორმაციის ამოღება
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
    }

    fetchData();
  }, []);

  // აღწერას აპატარავებს თუ ზედმეტად დიდია
  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  }

  let x = -1;
  const timer = () => {
    setInterval(() => {
      x++;
      console.log(sacdeli.charAt(x));
    }, 1000);
  };

  timer();

  console.log("render");
  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
        backgroundPosition: " center center",
      }}
    >
      <div className="banner_contents">
        {/* სხვადასხვანაირად აბრუნებს სათაურებს აპი და ამიტოა საჭირო || სიმბოლოთი ჩაწერა */}
        <h1 className="banner_title">
          {/* {movie?.title || movie?.name || movie?.original_name} */}
          {
            <TypeWriterEffect
              startDelay={200}
              typeSpeed={50}
              cursorColor="none"
              text={movie?.title || movie?.name || movie?.original_name}
            />
          }
        </h1>
        <div className="banner_buttons">
          <button className="banner_button">Play</button>
          <button className="banner_button"> My List</button>
        </div>

        <h1 className="banner_description">
          <TypeWriterEffect
            startDelay={200}
            typeSpeed={30}
            cursorColor="none"
            text={movie?.overview}
          />

          {/* {truncate(movie?.overview, 150)} */}
        </h1>
      </div>
      {/* ბანერის ქვემოთ ამატებს შავ გრედიენტს დიზაინისთვის */}
      <div className="banner--fadeBottom"></div>
    </header>
  );
}

export default Banner;
