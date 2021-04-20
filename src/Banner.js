import React, { useState, useEffect } from "react";
import "./Banner.css";
import axios from "./axios";
import requests from "./Requsets";
import TypeWriterEffect from "react-typewriter-effect";
import Youtube from "react-youtube";
import db from "./firebase";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";

function Banner() {
  const [movie, setMovie] = useState([]);
  const [title, setTitle] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [active, setActive] = useState(false);
  const [list, setList] = useState([]);
  // const [x, setX] = useState(0);
  const sacdeli = "aba vnaxot ra gamova";
  const user = useSelector(selectUser);
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

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("watchList")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((snap) => {
          setList(list.concat(snap.data()));
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const opts = {
    height: "500",
    width: "900",
    playerVars: {
      autoplay: 1,
    },
  };

  const close = () => {
    setActive(false);
  };

  const addTolist = (id) => {
    // customer-ში ქმნის ახალ კოლექციას ვოშლისტს და ამარებს ფილმის აიდის
    db.collection("customers")
      .doc(user.uid)
      .collection("watchList")
      .add({ listItem: movie.id });
  };
  console.log(list);
  return (
    <header
      className="banner"
      style={{
        marginTop: "200",
        paddingTop: "300",
        backgroundSize: "cover",
        backgroundImage: `url('https://image.tmdb.org/t/p/original/${movie?.backdrop_path}')`,
        backgroundPosition: "center center",
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
          <button onClick={() => addTolist(movie.id)} className="banner_button">
            {" "}
            {/* {list.map((x) =>
              x.listItem === movie.id
                ? "already in watchlis"
                : "add in watchlist"
            )} */}
          </button>
        </div>

        <h1 className="banner_description">
          <TypeWriterEffect
            startDelay={200}
            typeSpeed={30}
            cursorColor="none"
            text={truncate(movie?.overview, 220)}
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
              <i class="fas fa-times trailer_close"></i>
            </div>
            {<Youtube videoId={trailerUrl} opts={opts} className="as" />}
          </div>
        </div>
      )}
    </header>
  );
}

export default Banner;
