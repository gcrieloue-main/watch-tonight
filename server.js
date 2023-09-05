const TorrentSearchApi = require("torrent-search-api");
TorrentSearchApi.enableProvider("ThePirateBay");
TorrentSearchApi.enableProvider("Torrent9");

const express = require("express");
const fs = require("fs");
const _ = require("lodash");
const app = express();
const port = 3001;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

async function getTmdbMovies(
  page,
  options = {
    genre: 27,
    type: "none",
  },
) {
  console.log(page, options);
  const pageId = page || 1;
  let url;
  switch (options.type) {
    case "now_playing":
      url = `https://api.themoviedb.org/3/movie/now_playing?page=${pageId}`;
      break;
    case "upcoming":
      url = `https://api.themoviedb.org/3/movie/upcoming?page=${pageId}`;
      break;
    case "popular":
      url = `https://api.themoviedb.org/3/movie/popular?page=${pageId}`;
      break;
    default:
      url = `https://api.themoviedb.org/3/discover/movie?with_genres=${options.genre}&vote_average.gte=6&vote_count.gte=10&sort_by=primary_release_date.desc&page=${pageId}`;
  }

  console.log(url);
  const data = await (
    await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWRjOWVhZWY2OTZlNjRhZDYyNjYwYjI1NjBhYjdmYyIsInN1YiI6IjY0ZWE0MjdkNTk0Yzk0MDBhY2IwOGFkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.91n344WTAJ3PahMIVEBcj1aqE6BQGMBgaXleFtQL2wQ",
      },
    })
  ).json();
  //  console.log(data)
  return data;
}

async function getTmdbMovieDetails(id) {
  return await (
    await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWRjOWVhZWY2OTZlNjRhZDYyNjYwYjI1NjBhYjdmYyIsInN1YiI6IjY0ZWE0MjdkNTk0Yzk0MDBhY2IwOGFkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.91n344WTAJ3PahMIVEBcj1aqE6BQGMBgaXleFtQL2wQ",
      },
    })
  ).json();
}

async function getOmdbMovieDetails(title) {
  // const movies =  await (await fetch('http://www.omdbapi.com/?apikey=f33929a7&t=star+wars')).json()
  // console.log(movies);
  const data = await (
    await fetch(`http://www.omdbapi.com/?apikey=f33929a7&t=` + title, {
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWRjOWVhZWY2OTZlNjRhZDYyNjYwYjI1NjBhYjdmYyIsInN1YiI6IjY0ZWE0MjdkNTk0Yzk0MDBhY2IwOGFkYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.91n344WTAJ3PahMIVEBcj1aqE6BQGMBgaXleFtQL2wQ",
      },
    })
  ).json();
  // console.log(data)
  return data;
}

async function getTorrentDetails(title) {
  if (!title) {
    return;
  }
  const pirateBay = await TorrentSearchApi.search(
    ["ThePirateBay"],
    title,
    "Video",
    1,
  );

  const firstPirateBayTorrent = pirateBay[0];

  const torrent9 = await TorrentSearchApi.search(
    ["Torrent9"],
    title,
    "Movies",
    1,
  );

  console.log(title, torrent9);

  const firstTorrent9 = torrent9?.[0];
  const firstTorrent9Magnet = firstTorrent9
    ? await TorrentSearchApi.getMagnet(torrent9[0])
    : null;

  return {
    pirateBay: firstPirateBayTorrent,
    torrent9: { ...firstTorrent9, magnet: firstTorrent9Magnet },
  };
}

async function getData(page, options) {
  console.log("# Query data...");

  const data = await getTmdbMovies(page, options);

  const resultsWithDetails = await Promise.all(
    data.results?.map(async (data) => {
      return await addTmdbMovieDetail(data);
    }),
  );

  return { ...data, results: resultsWithDetails };
}

async function addTmdbMovieDetail(data) {
  let result = {};
  try {
    result = { ...result, details: await memoGetTmdbMovieDetails(data.id) };
    result = {
      ...result,
      omdbDetails: await memoGetOmdbMovieDetails(data.original_title),
    };
    result = {
      ...result,
      torrentDetails: await memoGetTorrentDetails(data.original_title),
    };
  } catch (error) {
    console.log(error);
  }
  return result;
}

function loadWatchedMoviesIds() {
  const watched = fs.readFileSync("./watch.txt", "utf8");
  return watched.split("\n").filter((id) => id != "");
}

async function loadWatchedMovies(ids) {
  console.log("# Query Watched Movies...");
  return {
    results: await Promise.all(
      ids.map(async (id) => {
        const detail = await memoGetTmdbMovieDetails(id);
        return addTmdbMovieDetail(detail);
      }),
    ),
  };
}

const memoGetTmdbMovieDetails = _.memoize(getTmdbMovieDetails);
const memoGetOmdbMovieDetails = _.memoize(getOmdbMovieDetails);
const memoGetTorrentDetails = _.memoize(getTorrentDetails);
const memoGetData = _.memoize(getData, (...args) => JSON.stringify(args));

memoGetData(1);

app.get("/movies", async (req, res) => {
  res.send(await memoGetData(1));
});

app.get("/movies/:page", async function (req, res) {
  const movies = await memoGetData(+req.params.page);
  res.send(movies);
  memoGetData(+req.params.page + 1);
});

app.get("/movies/popular", async (req, res) => {
  res.send(await memoGetData(1, { type: "popular" }));
});

app.get("/movies/popular/:page", async (req, res) => {
  const movies = await memoGetData(+req.params.page, { type: "popular" });
  res.send(movies);
  memoGetData(+req.params.page + 1, { type: "popular" });
});

app.get("/movies/upcoming", async (req, res) => {
  res.send(await memoGetData(1, { type: "upcoming" }));
});

app.get("/movies/upcoming/:page", async (req, res) => {
  const movies = await memoGetData(+req.params.page, { type: "upcoming" });
  res.send(movies);
  memoGetData(+req.params.page + 1, { type: "upcoming" });
});

app.get("/movies/now_playing", async (req, res) => {
  res.send(await memoGetData(1, { type: "now_playing" }));
});

app.get("/movies/now_playing/:page", async (req, res) => {
  const movies = await memoGetData(+req.params.page, { type: "now_playing" });
  res.send(movies);
  memoGetData(+req.params.page + 1, { type: "now_playing" });
});

app.get("/watch/:id", async function (req, res) {
  const id = req.params.id;
  const alreadyWatched = await loadWatchedMoviesIds();
  if (alreadyWatched.includes(id)) {
    res.send(id + " already added");
    return;
  }

  fs.appendFile("./watch.txt", id + "\n", (err) => {
    if (err) {
      console.error(err);
    }
  });

  console.log("add watched " + id);

  res.send(alreadyWatched.concat([id]));
});

app.get("/watch/delete/:id", async function (req, res) {
  const id = req.params.id;
  const alreadyWatched = await loadWatchedMoviesIds();
  if (!alreadyWatched.includes(id)) {
    res.send(alreadyWatched);
    return;
  }

  fs.writeFile(
    "./watch.txt",
    alreadyWatched.filter((existingId) => existingId != id).join("\n"),
    (err) => {
      if (err) {
        console.error(err);
      }
    },
  );

  console.log("remove watched " + id);

  res.send(alreadyWatched.filter((existingId) => existingId != id));
});

app.get("/watchedIds", async function (req, res) {
  const data = await loadWatchedMoviesIds();
  // console.log(data);
  res.send(data);
});

app.get("/watched", async function (req, res) {
  const watchedIds = await loadWatchedMoviesIds();
  res.send(await loadWatchedMovies(watchedIds));
});

app.listen(port, () => {
  console.log(
    "Active torrent providers :",
    TorrentSearchApi.getActiveProviders(),
  );
  console.log(`Movie DB on port ${port}`);
});
