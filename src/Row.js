import React, { useState, useEffect } from 'react';
import axios from './axios';
import './Row.css';
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = 'https://image.tmdb.org/t/p/original/';

function Row({ title, fetchUrl, isLargeRow}) { 
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    // A snippet of code which runs based on a specific condition
    useEffect(() => {
        // if [] is empty run once
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height:"390",
        width:"100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoPlay:1,
        }
    }
    const handleClick = (movie) =>{
        if(trailerUrl){
            setTrailerUrl('');
        }
        else{
            movieTrailer(movie?.name || "")
            .then((url) =>{
                // http://www.youtube.com/watch?v=XtMThy8QKqU
                const urlParams =  new URLSearchParams(new URL(url).search);//`https://api.themoviedb.org/3/movie/${movie}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
                setTrailerUrl(urlParams.get('v'));
            })
            .catch((error) => console.log(error));
        }
    }

    console.table(movies)
    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row_posters">
            {/* several row_poster(s)*/}

            {movies.map(movie => (
                <img
                key={movie.id}
                onClick={() => handleClick(movie)}
                className={`row_poster ${isLargeRow && "row_posterLarge"}`} 
                src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                alt={movie.name} />
            ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts = {opts}/>}
        </div>
    )
}

export default Row
