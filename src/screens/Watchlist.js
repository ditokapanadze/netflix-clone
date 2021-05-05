import React, { useState, useEffect } from "react";
import Nav from "../Nav";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import requests from "../Requsets";
import axios from "../axios";
import { useHistory } from "react-router-dom";
import "./Watchlist.css";
import db from "../firebase";
function Watchlist() {
  const [movies, setMovies] = useState([]);
  const API_KEY = "0b753f6cb66d441479c1e758d1f8f62e";
  const user = useSelector(selectUser);
  const basePhoto = "https://image.tmdb.org/t/p/original/";
  let history = useHistory();
  const [moviesId, setMoviesId] = useState([]);
  let tt = [
    {
      listItem: 559581,
    },
    {
      listItem: 85720,
    },
    {
      listItem: 615457,
    },
    {
      listItem: 615678,
    },
    {
      listItem: 88396,
    },
  ];

  const test1 = () => {
    moviesId.map((x) => {
      console.log("x");
    });
  };

  const asd = () => {
    const arr = [...moviesId].map((_, i) => moviesId[i]);
    arr.map((x) => {
      console.log(x);
    });
  };

  useEffect(() => {
    let arr = [...moviesId].map((_, i) => moviesId[i]);
    console.log(arr);
    console.log(moviesId);
    console.log("8sd");
  }, [moviesId]);

  useEffect(() => {
    let movieId = [];
    db.collection("customers")
      .doc(user.uid)
      .collection("watchList")
      .get()
      .then((snapshot) => {
        snapshot.forEach((snap) => {
          movieId.push(snap.data());
        });
      })
      .catch((error) => {
        console.log(error);
      });
    setMoviesId(movieId);

    // movieId.map((x) => {
    //   console.log(x);
    //   axios.get(`/movie/${x.listItem}?api_key=${API_KEY}`).then((res) => {
    //     setMovies((prevState) => prevState.concat(res.data));
    //   });
    // });
  }, []);

  const handleClick = (id) => {
    history.push(`/movie/${id}`);
  };

  const handleDelete = (id) => {
    //ბაზიდან შლის წათჩლისტის ელემენტს
    db.collection("customers")
      .doc(user.uid)
      .collection("watchList")
      .where("listItem", "==", id)
      .get()
      .then((x) =>
        x.forEach((y) => {
          db.collection("customers")
            .doc(user.uid)
            .collection("watchList")
            .doc(y.id)
            .delete()
            .then((x) => {
              console.log("d");
            });
        })
      );

    // .delete()
    // .then((result) => {
    //   console.log(result);
    // });
    // .delete()
    // .then(() => {
    //   console.log("deleted");
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  };
  let x = 5;

  return (
    <div className="watchlist">
      <Nav />
      <div className="watchlist_content">
        {movies.map((movie) => (
          <div className="watchlist_container">
            <img
              class="watchlist_poster"
              src={`${basePhoto}${movie.poster_path}`}
            />
            <div className="movie_info">
              <h4>{movie.title}</h4>
              <p>{movie.overview}</p>
              <button
                className="info_btn"
                onClick={() => handleClick(movie.id)}
              >
                see full info
              </button>
              <button
                onClick={() => handleDelete(movie.id)}
                className="remove_btn"
              >
                remove from wathclist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;
