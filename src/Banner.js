import React, { useState, useEffect } from "react";
import "./Banner.css";
import axios from "./axios";
import requests from "./Requsets";
import TypeWriterEffect from "react-typewriter-effect";
import Youtube from "react-youtube";

function Banner() {
  const [movie, setMovie] = useState([]);
  const [title, setTitle] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [active, setActive] = useState(false);
  // const [x, setX] = useState(0);
  const sacdeli = "aba vnaxot ra gamova";

  // რენდომ ფილმის ინფორმაციის ამოღება
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchTrending);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
    }

    fetchData();
  }, []);
  console.log(movie);
  // აღწერას აპატარავებს თუ ზედმეტად დიდია
  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  }

  const trailerPopup = () => {
    setActive(!active);
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      axios
        .get(
          `/movie/${movie.id}/videos?api_key=0b753f6cb66d441479c1e758d1f8f62e`
        )
        .then((res) => {
          console.log(res.data.results[0].key);
          setTrailerUrl(res.data.results[0].key);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  console.log(trailerUrl);
  const opts = {
    height: "500",
    width: "900",
    playerVars: {
      autoplay: 0,
    },
  };

  const close = () => {
    console.log("sd");
    setActive(false);
  };
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
              typeSpeed={100}
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
            text={truncate(movie?.overview, 200)}
          />

          {/* {truncate(movie?.overview, 150)} */}
        </h1>
        <button onClick={trailerPopup} className="trailer_btn">
          watch trailer
        </button>
      </div>
      {/* ბანერის ქვემოთ ამატებს შავ გრედიენტს დიზაინისთვის */}
      <div className="banner--fadeBottom"></div>
      {active && (
        <div className="trailer_container ">
          <div className="trailer">
            <div onClick={close} className="close_btn">
              <i class="fas fa-times"></i>
            </div>
            {<Youtube videoId={trailerUrl} opts={opts} className="as" />}
          </div>
        </div>
      )}
    </header>
  );
}

export default Banner;
