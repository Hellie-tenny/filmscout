import { useEffect, useState } from 'react'
import Hero from './Hero';
import Featured from './Featured';

export default function Landing() {

    const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
    const [genresList, setGenresList] = useState<{[key: number]: string}>({});

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

        const fetchGenres = async () => {
            try {
                const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", options);

                if (!res.ok) {
                    throw new Error(`HTTP ERROR ${res.status}`)
                }

                const data = await res.json();
                const fetchedGenres = data.genres;

                const genresMap: {} = Object.fromEntries(
                    fetchedGenres.map((genre: any) => [genre.id, genre.name])
                );
                setGenresList(genresMap);
                console.log("Here are the generes", genresMap)

            } catch (error) {
                console.log("Error fetching genres", error)
            }
        }

        fetchGenres();



        // const trending = fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
        //     .then(res => res.json())
        //     .then(res => console.log(res))
        //     .catch(err => console.error(err)
        //     );


    }, [])

    console.log(trendingMovies);


    const featuredMovies = trendingMovies.slice(0, 3);

    return (
        <div>

            <div className='py-5'>

                <Hero />

                <Featured
                    movies={featuredMovies}
                    genresList={genresList}
                />

                <div>
                    
                </div>

            </div>


        </div>
    )
}
