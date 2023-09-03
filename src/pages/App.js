import "./output.module.css";
import { NextUIProvider } from "@nextui-org/react";

import { useEffect, useState } from "react";
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
    <NextUIProvider>
    <main className="dark text-foreground bg-background"></main>
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
    </div></NextUIProvider>
  );
}

export default App;
