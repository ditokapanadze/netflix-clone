import React, { useEffect, useState } from "react";
import "./MoviePage.css";
import Nav from "../Nav";
import axios from "../axios";

import { useHistory, useParams } from "react-router-dom";

import Youtube from "react-youtube";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const API_KEY = "0b753f6cb66d441479c1e758d1f8f62e";

function MoviePage() {
  const [movie, setMovie] = useState([]);
  const [crewCast, setCrewCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [test, setTest] = useState([]);
  let history = useHistory();
  const [trailerUrl, setTrailerUrl] = useState("");
  const [button, setButton] = useState(false);
  const imdb = movie.imdb_id;
  const user = useSelector(selectUser);
  useEffect(() => {
    axios
      .get(`/movie/${slug}/videos?api_key=0b753f6cb66d441479c1e758d1f8f62e`)
      .then((res) => {
        console.log(res.data.results[0].key);
        setTrailerUrl(res.data.results[0].key);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios.get(`/movie/${slug}?api_key=${API_KEY}`).then((request) => {
      setMovie(request.data);

      axios
        .get(`/movie/${slug}/credits?api_key=${API_KEY}`)
        .then((request) => {
          setCrewCast(request.data.cast);
          setCrew(request.data.crew);
        })
        // .then((x) => {
        //   for (const property in crewCast.crew) {
        //     console.log({ property });
        //   }
        //   console.log(crewCast.crew);
        // })
        .catch((error) => {
          console.log(error);
        });
    });
  }, []);
  const basePhoto = "https://image.tmdb.org/t/p/original/";
  let { slug } = useParams();

  // const findDirector = () => {
  //   crewCast.crew.map((crewMember) => {
  //     crewMember.job === "director" && console.log(crewMember.name);
  //   });
  // };
  // findDirector();
  // const director = () => {
  //   crew.map((member) => {
  //     member.job === "Director" && console.log(member.name);
  //   });
  // };
  // director();
  const opts = {
    height: "300",
    width: "700",
    playerVars: {
      autoplay: 0,
    },
  };

  useEffect(() => {
    axios
      .get(`movie/${slug}/similar?api_key=${API_KEY}`)
      .then((response) => setSimilar(response.data.results));
  }, []);

  const handleClick = (id) => {
    // history.push(`/`);

    history.push(`/movie/${id}`);
    history.go();
  };

  const addMovie = (id) => {
    setButton(true);
    db.collection("customers")
      .doc(user.uid)
      .collection("watchList")
      .add({ listItem: id });
  };

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("watchList")
      .get()
      .then((snapshot) => {
        let movieId = [];
        snapshot.forEach((snap) => {
          movieId.push(snap.data());
        });
        setTest(movieId);
      });
  }, []);
  console.log(test[2]);

  // useEffect(() => {
  //   console.log("fg");
  //   db.collection("products")
  //     .where("active", "==", true)
  //     .get()
  //     .then((querySnapshot) => {
  //       const products = {};
  //       querySnapshot.forEach(async (productDoc) => {
  //         products[productDoc.id] = productDoc.data();
  //         console.log("sdf");
  //         //  productDoc.data() არ მოაქვს ფასები, ფასები ცალკე კოლექცია და ამიტო ცალკე უნდა ამოვიღოთ
  //         // ქვედა ფუნქცია მაგას აკეთებს
  //         //productDoc.ref იმისთვის გვჭირდება რო იგივე პროდუქტის price ამოვიღოთ
  //         const priceSnap = await productDoc.ref.collection("prices").get();
  //         priceSnap.docs.forEach((price) => {
  //           products[productDoc.id].prices = {
  //             priceId: price.id,
  //             priceData: price.data(),
  //           };
  //         });
  //       });
  //       setProducts(products);
  //     });
  //   console.log(products);
  // }, []);

  useEffect(() => {
    console.log("testaaaaaaa");
  }, []);

  const deleteItem = () => {
    setButton(false);
    console.log(typeof slug);
    db.collection("customers")
      .doc(user.uid)
      .collection("watchList")
      .where("listItem", "==", Number(slug))
      .get()
      .then((x) =>
        x.forEach((y) => {
          db.collection("customers")
            .doc(user.uid)
            .collection("watchList")
            .doc(y.id)
            .delete()
            .then((res) => {
              console.log(res);
            });
        })
      )
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="movie_page">
      <Nav />

      <div className="movie_page_container">
        <div className="poster_container">
          <img
            className="movie_poster"
            src={`${basePhoto}${movie.poster_path}`}
            alt=""
          />
        </div>

        <div className="info_container">
          <div className="info_header">
            {(test?.map((x) => x.listItem).indexOf(movie?.id) < 0 ||
              test?.map((x) => x.listItem).indexOf(movie?.id) === undefined) &&
            button === false ? (
              <div
                onClick={() => addMovie(movie.id)}
                className="moviepage_add_btn"
              >
                <i class="fas fa-plus"></i>
              </div>
            ) : (
              <div onClick={deleteItem} className="check">
                <i class="fas fa-check"></i>
              </div>
            )}

            <h1 className="">{movie.title}</h1>
            <span className="tooltip2">click to remove from watchlist</span>
            <div
              onClick={() => history.push("/wathclist")}
              className="wathclist_popup1"
            >
              view watchlist <text>&#8594;</text>{" "}
            </div>
            <span className="tooltip">click to add to watchlist</span>
          </div>

          <p className="movie_page_overview">{movie.overview}</p>
          <ul>
            <li>
              <p>
                <span> Genre :</span>
                {movie.genres &&
                  movie.genres.map((item, index) =>
                    index === movie.genres.length - 1
                      ? item.name
                      : item.name + ", "
                  )}
                {/* {movie.genres.map((x) => {
                  <p>{x.name}</p>;
                })} */}
              </p>
            </li>
            <li>
              <p>
                {" "}
                <span>year :</span> {movie.release_date?.slice(0, 4)}
              </p>
            </li>
            <li>
              <p>
                <span>run time : </span>
                {movie.runtime} minutes
              </p>
            </li>
            <li>
              {crew.map(
                (member) =>
                  member.job === "Director" && (
                    <p>
                      {" "}
                      <span>Director : </span> {member.name}
                    </p>
                  )
              )}
            </li>
          </ul>

          <span
            className="imdbRatingPlugin"
            data-user="ur26177280"
            data-title={imdb}
            data-style="p1"
          >
            <a
              target="blank"
              href={`https://www.imdb.com/title/${imdb}/?ref_=plg_rt_1`}
            >
              <img
                className="imdb_logo"
                src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_46x22.png"
                alt={movie.title}
              />
            </a>
          </span>
          {(function (d, s, id) {
            var js,
              stags = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
              return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src =
              "https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";
            stags.parentNode.insertBefore(js, stags);
          })(document, "script", "imdb-rating-api")}

          <div className="cast_container">
            {crewCast.map((actor, index) => {
              if (index < 6) {
                return (
                  <div className="actor_container">
                    <img
                      alt={`${actor.name}`}
                      className="prof_pic"
                      src={`${basePhoto}${actor.profile_path}`}
                    />
                    <p className="actor_name">{actor.name}</p>
                    <p className="character">as {actor.character}</p>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
      <div className="test">
        {<Youtube videoId={trailerUrl} opts={opts} className="page_trailer" />}
      </div>

      <h3 className="simliar_head">You may also like</h3>
      <div className="similar_container">
        {similar.map((movie) => {
          return (
            <div
              key={movie.id}
              className="similar_movie"
              onClick={() => handleClick(movie.id)}
            >
              <img
                alt={movie.title}
                className="similar_poster"
                src={`${basePhoto}${movie.poster_path}`}
              />
              <p className="similar_title">
                {movie.title} ({movie.release_date.slice(0, 4)})
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MoviePage;
