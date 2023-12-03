import "./output.css";

import { useFetch } from "use-http";
import { useEffect, useState } from "react";
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

  const CATEGORY_WATCHED = "watched";

  const loadMovies = async (url) => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(true);
    }, 300);
    const result = await get(url);
    if (response.ok) setMovies(result);
    clearTimeout(loadingTimeout);
    setIsLoading(false);
    window.scrollTo(0, 0);
  };

  const loadWatchedIds = async () => {
    const url = "/watchedIds";
    const result = await get(url);
    if (response.ok) setWatchedIds(result);
  };

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    if (category === CATEGORY_WATCHED) {
      return;
    }

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
    if (category === CATEGORY_WATCHED) {
      console.log("load watched movies");
      const url = "/watched?ids=" + JSON.stringify(watchedIds);
      loadMovies(url);
    }
  }, [category, watchedIds]);

  useEffect(() => {
    loadWatchedIds();
  }, []);

  function next() {
    setPage((currentPage) => currentPage + 1);
  }

  function previous() {
    setPage((currentPage) => currentPage - 1);
  }

  function addWatchdId(id) {
    if (watchedIds?.includes(`${id}`)) {
      console.warn(`${id} already in watchedIds`, watchedIds);
      return;
    }
    fetch(`http://localhost:3001/watch/${id}`).then(async () => {
      setWatchedIds((currentWatchIds) => currentWatchIds.concat(`${id}`));
    });
  }

  function removeWatchdId(id) {
    if (!watchedIds?.includes(`${id}`)) {
      console.warn(`${id} already absent from watchedIds`, watchedIds);
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
        {category === CATEGORY_WATCHED && !(movies?.results?.length > 0) && (
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
              addWatchId={addWatchdId}
              removeWatchId={removeWatchdId}
            />
          ))}
      </div>
      {category !== CATEGORY_WATCHED && (
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
