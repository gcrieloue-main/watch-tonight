import "./output.css";

import { useFetch } from "use-http";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "@nextui-org/react";
import { Pagination } from "./Pagination";
import { Menu } from "./Menu";
import { Movie } from "./Movie";

function App() {
  const [movies, setMovies] = useState([]);
  const [watchedIds, setWatchedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("now_playing");
  const [isLoading, setIsLoading] = useState(false);
  const { get, response } = useFetch({ data: [] });

  const loadMovies = useCallback(
    async (url) => {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(true);
      }, 300);
      const result = await get(url);
      if (response.ok) setMovies(result);
      clearTimeout(loadingTimeout);
      setIsLoading(false);
    },
    [get, response],
  );

  const loadWatchedIds = useCallback(async () => {
    const result = await get("/watchedIds");
    if (response.ok) setWatchedIds(result);
  }, [get, response]);

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
  }, [page, category, loadMovies]);

  useEffect(() => {
    if (category === "watched") {
      loadMovies("/watched");
    }
  }, [category, watchedIds, loadMovies]);

  useEffect(() => {
    loadWatchedIds();
  }, [loadWatchedIds]);

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
    fetch(`http://localhost:3001/watch/${id}`).then(async () => {
      setWatchedIds((currentWatchIds) => currentWatchIds.concat("" + id));
    });
  }

  function removeWatchdId(id) {
    if (!watchedIds?.includes("" + id)) {
      return;
    }
    fetch(`http://localhost:3001/watch/delete/${id}`).then(async () => {
      setWatchedIds((currentWatchIds) =>
        currentWatchIds.filter((current) => current !== "" + id),
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
            />
          ))}
      </div>
      {category !== "watched" && (
        <Pagination
          category={category}
          page={page}
          previous={previous}
          next={next}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default App;
