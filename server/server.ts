import express from 'express'
import _ from 'lodash'
import { ServerService } from './server.service'
import {
  loadWatchedMoviesIds,
  addIdToWatchedMovies,
  removeIdFromWatchedMovies,
} from './watched-movies.service'

const app = express()
const port = process.env.PORT || 3001
const serverService = new ServerService()

app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/movies', async (_req, res) => {
  res.send(await serverService.getData(1))
})

app.get('/movies/:page', async function (req, res) {
  const movies = await serverService.getData(+req.params.page)
  res.send(movies)
  serverService.getData(+req.params.page + 1)
})

app.get('/add_to_radarr/:tmdb_id', async (req, res) => {
  await serverService.addMovieToRadarr(req.params.tmdb_id)

  res.send(`${req.params.tmdb_id} added to radarr`)
})

app.get(
  '/movies/:type(popular|upcoming|now_playing|best)/:page?',
  async (req, res) => {
    const movies = await serverService.getData(+req.params.page || 1, {
      type: req.params.type,
    })
    res.send(movies)
    serverService.getData(+req.params.page + 1, { type: req.params.type })
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
  const watchedMovies = await serverService.getDataForMoviesIds(watchedIds)
  res.send(watchedMovies)
})

app.listen(port, () => {
  console.log(`Movie DB on port ${port}`)
  serverService.loadCache()
})
