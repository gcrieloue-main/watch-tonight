import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);
  const [watchedIds, setWatchedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);

  let title;
  switch (category) {
    case "popular":
      title = "Popular Movies";
      break;
    case "watched":
      title = "Watch list";
      break;
    case "now_playing":
      title = "Now playing";
      break;
    case "upcoming":
      title = "Upcoming";
      break;
    default:
      title = "Horror Movies";
  }

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    let url;
    if (category === "watched") {
      url = "http://localhost:3001/watched";
    } else if (category === "popular") {
      url = "http://localhost:3001/movies/popular/" + page;
    } else if (category === "upcoming") {
      url = "http://localhost:3001/movies/upcoming/" + page;
    } else if (category === "now_playing") {
      url = "http://localhost:3001/movies/now_playing/" + page;
    } else {
      url = "http://localhost:3001/movies/" + page;
    }
    setIsLoading(true);

    fetch(url, {
      signal: signal,
    })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.log("error is", error);
        }
      })
      .then(async (result) => {
        const m = await result;
        if (!m) return;
        const movies = await m.json();
        setMovies(movies);
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [page, category]);

  useEffect(() => {
    if (category === "watched") {
      fetch("http://localhost:3001/watched").then(async (result) => {
        const m = await result;
        setMovies(await m.json());
      });
    }
  }, [watchedIds]);

  useEffect(() => {
    fetch("http://localhost:3001/watchedIds").then(async (result) => {
      const m = await result;
      setWatchedIds(await m.json());
    });
  }, []);

  function next() {
    setPage((currentPage) => currentPage + 1);
  }

  function previous() {
    setPage((currentPage) => currentPage - 1);
  }

  function addWatchdId(id) {
    if (watchedIds.includes("" + id)) {
      return;
    }

    fetch(`http://localhost:3001/watch/${id}`).then(async (result) => {
      const m = await result;
      setWatchedIds((currentWatchIds) =>
        setWatchedIds(currentWatchIds.concat("" + id))
      );
    });
  }

  function removeWatchdId(id) {
    if (!watchedIds.includes("" + id)) {
      return;
    }

    fetch(`http://localhost:3001/watch/delete/${id}`).then(async (result) => {
      const m = await result;
      setWatchedIds((currentWatchIds) =>
        setWatchedIds(currentWatchIds.filter((current) => current != id))
      );
    });
  }

  return (
    <div className="App">
      <ul className="menu">
        <li onClick={() => setCategory("watched")}>Watch list</li>
        <li onClick={() => setCategory("upcoming")}>Upcoming</li>
        <li onClick={() => setCategory("now_playing")}>Now playing</li>
        <li onClick={() => setCategory("popular")}>Popular movies</li>
        <li onClick={() => setCategory("horror")}>Horror movies</li>
      </ul>
      <h1>{title}</h1>
      {/* <pre>Watched ids : {JSON.stringify(watchedIds)}</pre> */}
      {/* <pre>{JSON.stringify(movies?.results?.[0], null, 2)}</pre> */}
      <div className={"movies" + (isLoading ? " loading" : " ")}>
        {category == "watched" && !(movies?.results?.length > 0) && (
          <div>
            <p>No watched movie !</p>
          </div>
        )}
        {movies?.results
          ?.filter((result) => result.details.status_code != 34)
          ?.map((result) => (
            <div className="movie" key={result.details.original_title}>
              <h2>{result.details.original_title}</h2>
              <h3>{result.details.release_date}</h3>
              <div className="poster">
                {!watchedIds?.includes("" + result.details.id) && (
                  <span
                    className="watch_action watch__add"
                    onClick={() => addWatchdId(result.details.id)}
                  >
                    +
                  </span>
                )}
                {watchedIds?.includes("" + result.details.id) && (
                  <span
                    className="watch_action watch__add"
                    onClick={() => removeWatchdId(result.details.id)}
                  >
                    -
                  </span>
                )}
                {result.omdbDetails.imdbRating >= 6 &&
                  result.omdbDetails.imdbRating < 7 && (
                    <span className="approved">✓</span>
                  )}
                {result.omdbDetails.imdbRating >= 7 && (
                  <span className="approved approved_plus">✓+</span>
                )}
                <img
                  className={
                    result.omdbDetails.imdbRating < 5 ? "grayscale" : ""
                  }
                  loading="lazy"
                  src={
                    "https://www.themoviedb.org/t/p/w300_and_h450_bestv2" +
                    result.details.poster_path
                  }
                />
              </div>
              <div className="rating">
                <ul>
                  {result.details.imdb_id && (
                    <li>
                      <a
                        href={
                          "https://www.imdb.com/title/" +
                          result.details.imdb_id +
                          "/"
                        }
                      >
                        IMDB
                      </a>
                      <span>
                        {" "}
                        :{" "}
                        <strong>
                          {result.omdbDetails.imdbRating || "N/A"}
                        </strong>{" "}
                      </span>
                    </li>
                  )}
                  <li>
                    TMDB : {result.details.vote_average} (
                    {result.details.vote_count})
                  </li>
                </ul>
              </div>
              <p className="download">
                {result.torrentDetails?.seeds > 0 && (
                  <a href={result.torrentDetails.magnet}>
                    Download {result.torrentDetails.title} (
                    {result.torrentDetails.size})
                  </a>
                )}
              </p>
            </div>
          ))}
      </div>
      {category != "watched" && (
        <div className="buttons">
          {page > 1 && <button onClick={previous}>PREVIOUS</button>}
          {page > 1 && page}
          <button onClick={next}>NEXT</button>
        </div>
      )}
    </div>
  );
}

export default App;
