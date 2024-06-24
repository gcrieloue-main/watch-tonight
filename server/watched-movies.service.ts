import fs from 'fs'
import config from './config'

export function loadWatchedMoviesIds() {
  const watched = fs.readFileSync(config.WATCHED_FILE_PATH, 'utf8')
  return watched.split('\n').filter((id) => id !== '')
}
export function addIdToWatchedMovies(movieId: string) {
  fs.appendFile(config.WATCHED_FILE_PATH, movieId + '\n', (err) => {
    if (err) {
      console.error(err)
    }
  })
}
export function removeIdFromWatchedMovies(id: string) {
  const alreadyWatched = loadWatchedMoviesIds()
  const newIds = alreadyWatched
    .filter((existingId) => existingId !== id)
    .join('\n')
  if (alreadyWatched.includes(id)) {
    {
      fs.writeFile(config.WATCHED_FILE_PATH, newIds, (err) => {
        if (err) {
          console.error(err)
        }
      })
    }
    return newIds
  }
}
