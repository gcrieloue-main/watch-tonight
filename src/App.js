import "./output.css";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { CircularProgress, Spinner, Tooltip } from "@nextui-org/react";

function App() {
  const [movies, setMovies] = useState([]);
  const [watchedIds, setWatchedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);

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
        return null;
      })
      .then(async (result) => {
        const m = await result;
        if (!m || !m.ok) return;
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
      console.log("set watched ids");
      const watchedIds = (await m.json()) || [];
      setWatchedIds(watchedIds);
    });
  }, []);

  function next() {
    setPage((currentPage) => currentPage + 1);
  }

  function previous() {
    setPage((currentPage) => currentPage - 1);
  }

  function addWatchdId(id) {
    if (watchedIds?.includes("" + id)) {
      return;
    }
    console.log("add " + id);
    fetch(`http://localhost:3001/watch/${id}`).then(async (result) => {
      const m = await result;
      setWatchedIds((currentWatchIds) => currentWatchIds.concat("" + id));
    });
  }

  function removeWatchdId(id) {
    if (!watchedIds?.includes("" + id)) {
      return;
    }
    console.log("remove " + id);
    fetch(`http://localhost:3001/watch/delete/${id}`).then(async (result) => {
      const m = await result;
      setWatchedIds((currentWatchIds) =>
        currentWatchIds.filter((current) => current != "" + id)
      );
    });
  }

  return (
    <div className="App">
      {isLoading && (
        <div className="spinner">
          <Spinner size="lg" />
        </div>
      )}
      <div className="flex w-full flex-col menu">
        <Tabs
          aria-label="Tabs radius"
          onSelectionChange={(category) => setCategory(category)}
        >
          <Tab key="watched" title="Watch list" />
          <Tab key="upcoming" title="Upcoming" />
          <Tab key="now_playing" title="Now playing" />
          <Tab key="popular" title="Popular movies" />
          <Tab key="horror" title="Horror movies" />
        </Tabs>
      </div>
      {/* <h1>{title}</h1> */}
      {/* <pre>Watched ids : {JSON.stringify(watchedIds)}</pre> */}
      {/* <pre>{JSON.stringify(movies?.results?.[0], null, 2)}</pre> */}
      <div className={"movies" + (isLoading ? " loading" : " ")}>
        {category === "watched" && !(movies?.results?.length > 0) && (
          <div>
            <p>No watched movie !</p>
          </div>
        )}
        {movies?.results
          ?.filter((result) => result.details.status_code !== 34)
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
                {result.details.imdb_id && (
                  <div className="imdb_rating">
                    <a
                      href={
                        "https://www.imdb.com/title/" +
                        result.details.imdb_id +
                        "/"
                      }
                    >
                      <span>IMDB</span>
                      <CircularProgress
                        aria-label="Loading..."
                        size="lg"
                        value={
                          result.omdbDetails.imdbRating &&
                          result.omdbDetails.imdbRating !== "N/A"
                            ? result.omdbDetails.imdbRating * 10
                            : 0
                        }
                        color={
                          result.omdbDetails.imdbRating < 6
                            ? "warning"
                            : "success"
                        }
                        showValueLabel={true}
                      />
                    </a>
                  </div>
                )}
                <div className="tmdb_rating">
                  <span>TMDB</span>
                  <CircularProgress
                    aria-label="Loading..."
                    size="lg"
                    value={
                      result.details.vote_averag &&
                      result.details.vote_averag !== "N/A"
                        ? result.details.vote_averag * 10
                        : 0
                    }
                    color={
                      result.details.vote_average < 6 ? "warning" : "success"
                    }
                    showValueLabel={true}
                  />
                </div>
              </div>
              {result.torrentDetails?.seeds > 0 && (
                <Tooltip
                  placement="bottom"
                  content={
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">Download</div>
                      <div className="text-tiny">
                        {result.torrentDetails.title}
                      </div>
                      <div className="text-tiny">
                        {result.torrentDetails.size}
                      </div>
                    </div>
                  }
                >
                  <Button variant="bordered">
                    Download ({result.torrentDetails.size})
                  </Button>
                </Tooltip>
              )}
            </div>
          ))}
      </div>
      {category != "watched" && (
        <div className="buttons">
          <Button isDisabled={page < 2} onClick={previous}>
            PREVIOUS
          </Button>
          {page}
          <Button onClick={next}>NEXT</Button>
        </div>
      )}
    </div>
  );
}

export default App;
