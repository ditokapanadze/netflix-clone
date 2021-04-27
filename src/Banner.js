import React, { useState, useEffect } from "react";
import "./Banner.css";
import axios from "./axios";
import requests from "./Requsets";
import TypeWriterEffect from "react-typewriter-effect";
import Youtube from "react-youtube";
import db from "./firebase";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function Banner() {
  const [movie, setMovie] = useState([]);
  const [title, setTitle] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [active, setActive] = useState(false);
  const [list, setList] = useState([]);
  const [button, setButton] = useState("");
  const inventory = [
    { name: "apples", quantity: 2 },
    { name: "bananas", quantity: 0 },
    { name: "cherries", quantity: 5 },
  ];

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

    // db.collection("customers")
    //   .doc(user.uid)
    //   .collection("watchList")
    //   .get()
    //   .then((querySnapshot) => {
    //     let test = [];
    //     querySnapshot.forEach((snap) => {
    //       test.push(snap.data());
    //       setList(test);
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  // useEffect(() => {
  //   db.collection("customers")
  //     .doc(user.uid)
  //     .collection("watchList")
  //     .get()
  //     .then((querySnapshot) => {
  //       let test = [];
  //       querySnapshot.forEach((snap) => {
  //         test.push(snap.data());
  //         setList(test);
  //       });
  //     })
  //     .then((x) => {
  //       const result = list.find(({ listItem }) => listItem === 80828);

  //       console.log(result);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

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
          `/movie/${movie?.id}/videos?api_key=0b753f6cb66d441479c1e758d1f8f62e`
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
    // customer-ში ქმნის ახალ კოლექციას ვოშლისტს და ამატებს ფილმის აიდის
    db.collection("customers")
      .doc(user.uid)
      .collection("watchList")
      .add({ listItem: movie?.id });
  };

  var array = [{ name: "string 1" }, { name: "string 2" }];
  const watchlist = user.watchList;

  const test = (e) => e.name === "string 2";

  const check = () => {
    for (var i = 0; i < watchlist.length; i++) {
      if (watchlist[i].listItem === movie?.id) {
        console.log("vipove");
        break;
      } else {
        console.log("ver vipove");
      }
    }
  };

  // const cc = () => {
  //   watchlist.map((x, item) => console.log(x));
  // };

  // cc();
  // let x = 12;
  // const check = () => {
  //   if (x < 10) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  // console.log(watchlist.map((x) => x.name).indexOf("string 2"));

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
          <button disabled={true} className="banner_button">
            Play
          </button>
          {watchlist.map((x) => x.listItem).indexOf(movie.id) < 0 ? (
            <button
              type="button"
              onClick={() => addTolist(movie.id)}
              className="banner_button"
              disabled
            >
              Add in watchlist
            </button>
          ) : (
            <button className="in_watchlist"> already in watchlist</button>
          )}
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
