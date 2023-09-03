import "./output.css";

import { useFetch } from "use-http";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "@nextui-org/react";
import { Pagination } from "./Pagination";
import { Menu } from "./Menu";
import { Movie } from "./Movie";

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
  const { get, post, response, loading, error } = useFetch({ data: [] });

  const loadMovies = useCallback(
    async (url) => {
      setIsLoading(true);
      const result = await get(url);
      if (response.ok) setMovies(result);
      setIsLoading(false);
    },
    [get, response],
  );

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const urls = {
      watched: "watched",
      popular: "movies/popular/" + page,
      upcoming: "movies/upcoming/" + page,
      now_playing: "movies/now_playing/" + page,
      default: "movies/" + page,
    };
    loadMovies(urls[category] || urls["default"]);
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
        signal,
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
      signal,
    );

    return () => {
      controller.abort();
    };
  }, []);

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
        currentWatchIds.filter((current) => current != "" + id),
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
      <Menu setCategory={setCategory} category={category} />
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
            <Movie
              key={result.details.original_title}
              result={result}
              watchedIds={watchedIds}
              addWatchdId={addWatchdId}
              removeWatchdId={removeWatchdId}
              mapRatingSource={mapRatingSource}
            />
          ))}
      </div>
      {category != "watched" && (
        <Pagination
          category={category}
          page={page}
          previous={previous}
          next={next}
        />
      )}
    </div>
  );
}

export default App;
