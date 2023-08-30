import "./output.css";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { CircularProgress, Spinner, Tooltip } from "@nextui-org/react";

async function fetchData(url, callback, signal) {
  try {
    await fetch(url, {
      signal: signal,
    }).then(async (result) => {
      const m = await result;
      if (!m || !m.ok) return;
      const json = await m.json();
      callback(json);
    });
  } catch (error) {
    if (error.name !== "AbortError") {
      console.log(error);
    }
  }
}

function App() {
  const [movies, setMovies] = useState([]);
  const [watchedIds, setWatchedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("now_playing");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
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

    const controller = new AbortController();
    const signal = controller.signal;

    fetchData(
      url,
      (json) => {
        setMovies(json);
        setIsLoading(false);
      },
      signal
    );

    return () => {
      controller?.abort();
    };
  }, [page, category]);

  useEffect(() => {
    if (category === "watched") {
      const controller = new AbortController();
      const signal = controller.signal;
      fetchData(
        "http://localhost:3001/watched",
        (json) => {
          setMovies(json);
        },
        signal
      );

      return () => {
        controller.abort();
      };
    }
  }, [watchedIds]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchData(
      "http://localhost:3001/watchedIds",
      (json) => {
        const watchedIds = json || [];
        setWatchedIds(watchedIds);
      },
      signal
    );

    return () => {
      controller.abort();
    };
  }, []);

  function normalizeRating(rating) {
    if (rating?.includes("%")) {
      return +rating.replace(/[^0-9]/g, "");
    } else if (rating?.includes("/100")) {
      return +rating.replace("/100", "");
    } else if (rating?.includes("/10")) {
      return +rating.replace("/10", "") * 10;
    } else return 0;
  }

  function mapRatingSource(source) {
    switch (source) {
      case "Internet Movie Database":
        return "IMDB";
      case "Rotten Tomatoes":
        return "RT";
      case "Metacritic":
        return "MT";
      default:
        return source;
    }
  }

  function next() {
    setPage((currentPage) => currentPage + 1);
    // window.scrollTo(0, 0)
  }

  function previous() {
    setPage((currentPage) => currentPage - 1);
    //  window.scrollTo(0, 0)
  }

  function addWatchdId(id) {
    if (watchedIds?.includes("" + id)) {
      return;
    }
    fetch(`http://localhost:3001/watch/${id}`).then(async (result) => {
      const m = await result;
      setWatchedIds((currentWatchIds) => currentWatchIds.concat("" + id));
    });
  }

  function removeWatchdId(id) {
    if (!watchedIds?.includes("" + id)) {
      return;
    }
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
      {menu(setCategory, category)}
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
          ?.map((result) =>
            movie(
              result,
              watchedIds,
              addWatchdId,
              removeWatchdId,
              mapRatingSource,
              normalizeRating
            )
          )}
      </div>
      {pagination(category, page, previous, next)}
    </div>
  );
}

function pagination(category, page, previous, next) {
  return (
    category != "watched" && (
      <div className="buttons">
        <Button isDisabled={page < 2} onClick={previous}>
          PREVIOUS
        </Button>
        {page}
        <Button onClick={next}>NEXT</Button>
      </div>
    )
  );
}

function menu(setCategory, category) {
  return (
    <div className="flex w-full flex-col menu">
      <Tabs
        aria-label="Tabs radius"
        onSelectionChange={(category) => setCategory(category)}
        defaultSelectedKey={category}
      >
        <Tab key="watched" title="Watch list" />
        <Tab key="upcoming" title="Upcoming" />
        <Tab key="now_playing" title="Now playing" />
        <Tab key="popular" title="Popular movies" />
        <Tab key="horror" title="Horror movies" />
      </Tabs>
    </div>
  );
}

function movie(
  result,
  watchedIds,
  addWatchdId,
  removeWatchdId,
  mapRatingSource,
  normalizeRating
) {
  return (
    <div className="movie" key={result.details.original_title}>
      <h2>{result.details.original_title}</h2>
      <h3>{result.details.release_date}</h3>
      {poster(watchedIds, result, addWatchdId, removeWatchdId)}
      {ratings(result, mapRatingSource, normalizeRating)}
      {torrentButon(result)}
    </div>
  );
}

function poster(watchedIds, result, addWatchdId, removeWatchdId) {
  return (
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
        className={result.omdbDetails.imdbRating < 5 ? "grayscale" : ""}
        loading="lazy"
        src={
          "https://www.themoviedb.org/t/p/w300_and_h450_bestv2" +
          result.details.poster_path
        }
      />
    </div>
  );
}

function ratings(result, mapRatingSource, normalizeRating) {
  return (
    <div className="ratings">
      {result.omdbDetails?.Ratings?.map((rating) => (
        <div key={rating.Source} className="rating">
          <a
            href={"https://www.imdb.com/title/" + result.details.imdb_id + "/"}
          >
            <span>{mapRatingSource(rating.Source)}</span>
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={normalizeRating(rating.Value)}
              color={normalizeRating(rating.Value) < 60 ? "warning" : "success"}
              showValueLabel={true}
            />
          </a>
        </div>
      ))}
      {!result?.omdbDetails?.Ratings?.length && result.details.imdb_id && (
        <div className="rating">
          <a
            href={"https://www.imdb.com/title/" + result.details.imdb_id + "/"}
          >
            <span>TMDB</span>
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={result.details.vote_average * 10}
              color={result.details.vote_average < 6 ? "warning" : "success"}
              showValueLabel={true}
            />
          </a>
        </div>
      )}
    </div>
  );
}

function torrentButon(result) {
  return (
    result.torrentDetails?.seeds > 0 && (
      <Tooltip
        placement="bottom"
        content={
          <div className="px-1 py-2">
            <div className="text-small font-bold">Download</div>
            <div className="text-tiny">{result.torrentDetails.title}</div>
            <div className="text-tiny">{result.torrentDetails.size}</div>
          </div>
        }
      >
        <Button variant="bordered">
          Download ({result.torrentDetails.size})
        </Button>
      </Tooltip>
    )
  );
}

export default App;
