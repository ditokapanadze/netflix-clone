import React, { useState, useEffect } from 'react'
import "./Row.css"
import axios from "./axios"

export default function Row({title, fetchURL, isLargeRow = false}) {
    const [movies, setMovies] = useState([])


    //  ფოტოს ბეიზ ურლ
    const base_url = "https://image.tmdb.org/t/p/original/"
    
    useEffect(() => {
        async function fetchData (){
            const request = await axios.get(fetchURL)
            setMovies(request.data.results)
            
        }
        fetchData()
    }, [fetchURL])
    
    
    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
            {movies.map((movie) => (
                // ზოგჯერ პოსტერის ლინკი არ მოყვება და ამ შემთხვევაში რენდერი არ უნდა მოხდეს ამ კომპონენტის
                ((isLargeRow && movie.poster_path) || 
                (!isLargeRow && movie.backdrop_path))
                && (
                    <img 
                    className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                    key={movie.id}
                    src={`${base_url}${
                    isLargeRow ?  movie.poster_path : movie.backdrop_path
                }`} alt={movie.name} />
                )
               
            ))}
            </div>
        </div>
    )
}
