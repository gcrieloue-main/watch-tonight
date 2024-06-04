import express from 'express'
import _ from 'lodash'
import { ServerService } from './server.service'
import {
  loadWatchedMoviesIds,
  addIdToWatchedMovies,
  removeIdFromWatchedMovies,
} from './watched-movies.service'

import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 3001
const serverService = new ServerService()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.post('/movies', async (req: any, res: any) => {
  const page = +(req.body.page || 1)
  const genre = +req.body.genre
  const movies = await serverService.getData(page, {
    genre: Number.isNaN(genre) ? undefined : genre,
    type: req.body.category,
  })
  res.send(movies)
  serverService.getData(page + 1, { genre })
})

app.get('/add_to_radarr/:tmdb_id', async (req, res) => {
  await serverService.addMovieToRadarr(req.params.tmdb_id)

  res.send(`${req.params.tmdb_id} added to radarr`)
})

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
