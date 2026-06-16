import React, { useEffect, useState } from 'react'

export default function Landing() {

    const [trendingMovies, setTrendingMovies] = useState<any[]>([]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzM2YmI4ZmJhMTBmYjMwYThkZWY4MmVlNjM0NDViNCIsIm5iZiI6MTYzMjgyMTUxNy41MzIsInN1YiI6IjYxNTJlMTBkZDFjYTJhMDA0MjYxZjk4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L8uAoa4O5gbaiqm8pIPdbpBKb9spKVlS7Ng5M0fF41Y'
            }
        };

        const loadTrendingMovies = async () => {

            try {
                fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options).
                    then(res => res.json()).
                    then(data => {
                        setTrendingMovies(data.results)
                    })
            } catch (error) {
                console.log("Error getting movies", error)
            }

        }

        loadTrendingMovies();



        // const trending = fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
        //     .then(res => res.json())
        //     .then(res => console.log(res))
        //     .catch(err => console.error(err)
        //     );


    }, [])

    console.log(trendingMovies);

    return (
        <div>
            {
                trendingMovies.map((movie) => (

                    <div>
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                            alt={movie.title}
                            loading="lazy"
                        />
                        <h2>{movie.title}</h2>
                    </div>

                ))
            }
        </div>
    )
}
