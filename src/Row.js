import React, { useState, useEffect } from "react";
import "./Row.css";
import axios from "./axios";
import { useHistory, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/swiper-bundle.css";
// import "./styles.css";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default function Row({ title, fetchURL, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  let history = useHistory();
  //  ფოტოს ბეიზ ურლ
  const base_url = "https://image.tmdb.org/t/p/original/";
  console.log(movies);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchURL);
      console.log(request.data.results[0]);
      setMovies(request.data.results);
    }
    fetchData();
  }, [fetchURL]);
  const handleClick = (id) => {
    history.push(`movie/${id}`);
  };

  let slides = [];
  for (let i = 0; i <= movies.length; i += 1) {
    movies.map(
      (movie) =>
        slides.push(
          <SwiperSlide>
            {((isLargeRow && movie.poster_path) ||
              (!isLargeRow && movie.backdrop_path)) && (
              <div className="movie_row_container">
                <img
                  onClick={() => handleClick(movie.id)}
                  className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                  key={movie.id}
                  src={`${base_url}${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                  }`}
                  alt={movie.name}
                />
                <p className="movie_slider_title">
                  {movie.title || movie.name}
                </p>
              </div>
            )}
          </SwiperSlide>
        )
      // ზოგჯერ პოსტერის ლინკი არ მოყვება და ამ შემთხვევაში რენდერი არ უნდა მოხდეს ამ კომპონენტის
    );
  }
  return (
    <React.Fragment>
      {/* <div className="row">
        <h2>{title}</h2>
        <div className="row_posters">
          <Swiper>{slides}</Swiper>
        </div>
      </div> */}
      <h2 className="row_title">{title}</h2>
      <Swiper navigation>{slides}</Swiper>
    </React.Fragment>

    // <div className="row">
    //   <h2>{title}</h2>
    //   <div className="row_posters">
    //     {movies.map(
    //       (movie) =>
    //         // ზოგჯერ პოსტერის ლინკი არ მოყვება და ამ შემთხვევაში რენდერი არ უნდა მოხდეს ამ კომპონენტის
    //         ((isLargeRow && movie.poster_path) ||
    //           (!isLargeRow && movie.backdrop_path)) && (
    //           <img
    //             onClick={() => handleClick(movie.id)}
    //             className={`row_poster ${isLargeRow && "row_posterLarge"}`}
    //             key={movie.id}
    //             src={`${base_url}${
    //               isLargeRow ? movie.poster_path : movie.backdrop_path
    //             }`}
    //             alt={movie.name}
    //           />
    //         )
    //     )}
    //   </div>
    // </div>
  );
}
