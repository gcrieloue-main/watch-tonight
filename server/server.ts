import express from 'express'
import _ from 'lodash'
import {
  addMovieToRadarr,
  memoGetOmdbMovieDetails,
  memoGetTmdbMovieDetails,
  memoGetTmdbMovies,
  memoGetTorrentDetails,
} from './server.service'
import {
  loadWatchedMoviesIds,
  addIdToWatchedMovies,
  removeIdFromWatchedMovies,
} from './watched-movies.service'

const app = express()
const port = process.env.PORT || 3001

app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

async function getData(
  page: number,
  options?: {
    genre?: number
    type?: string
  }
) {
  console.log('# Query data...')

  const tmdbMovieDetails = await memoGetTmdbMovies(page, options)

  const resultsWithDetails = await Promise.all(
    tmdbMovieDetails.results?.map(async (data: any) => {
      return await addAdditionalDetails(data)
    })
  )

  return { ...tmdbMovieDetails, results: resultsWithDetails }
}

async function addAdditionalDetails(tmdbMovieDetail: any) {
  try {
    return {
      details: await memoGetTmdbMovieDetails(tmdbMovieDetail.id),
      omdbDetails: await memoGetOmdbMovieDetails(tmdbMovieDetail.title),
      torrentDetails: await memoGetTorrentDetails(tmdbMovieDetail.title),
    }
  } catch (error) {
    console.log(error)
    return {}
  }
}

async function loadWatchedMovies(ids: string[]) {
  console.log('# Query Watched Movies...')
  return {
    results: await Promise.all(
      ids.map(async (id: string) => {
        const detail = await memoGetTmdbMovieDetails(id)
        return addAdditionalDetails(detail)
      })
    ),
  }
}

function loadCache() {
  const cacheParams: [
    page: number,
    options?: { genre?: number; type?: string },
  ][] = [
    [1],
    [2],
    [1, { type: 'popular' }],
    [1, { type: 'upcoming' }],
    [1, { type: 'now_playing' }],
    [2, { type: 'popular' }],
    [2, { type: 'upcoming' }],
    [2, { type: 'now_playing' }],
  ]

  cacheParams.forEach((params) => {
    memoGetData.apply(null, params)
  })
}

const memoGetData = _.memoize(getData, (...args: any[]) => JSON.stringify(args))

app.get('/movies', async (_req, res) => {
  res.send(await memoGetData(1))
})

app.get('/movies/:page', async function (req, res) {
  const movies = await memoGetData(+req.params.page)
  res.send(movies)
  memoGetData(+req.params.page + 1)
})

app.get('/add_to_radarr/:tmdb_id', async (req, res) => {
  await addMovieToRadarr(req.params.tmdb_id)

  res.send(`${req.params.tmdb_id} added to radarr`)
})

app.get(
  '/movies/:type(popular|upcoming|now_playing|best)/:page?',
  async (req, res) => {
    const movies = await memoGetData(+req.params.page || 1, {
      type: req.params.type,
    })
    res.send(movies)
    memoGetData(+req.params.page + 1, { type: req.params.type })
  }
)

app.get('/watch/:id', async function (req, res) {
  const id = req.params.id
  const alreadyWatched = await loadWatchedMoviesIds()
  if (alreadyWatched.includes(id)) {
    res.send(id + ' already added')
    return
  }

  addIdToWatchedMovies(id)
  console.log('add watched ' + id)
  res.send(alreadyWatched.concat([id]))
})

app.get('/watch/delete/:id', async function (req, res) {
  const id = req.params.id

  const watchedIds = removeIdFromWatchedMovies(id)
  console.log('remove watched ' + id)

  res.send(watchedIds)
})

app.get('/watchedIds', async function (_req, res) {
  const data = await loadWatchedMoviesIds()
  res.send(data)
})

app.get('/watched', async function (_req, res) {
  const watchedIds = loadWatchedMoviesIds()
  const watchedMovies = await loadWatchedMovies(watchedIds)
  res.send(watchedMovies)
})

app.listen(port, () => {
  console.log(`Movie DB on port ${port}`)
  loadCache()
})
