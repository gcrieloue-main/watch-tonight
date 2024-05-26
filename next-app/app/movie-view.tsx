import { Poster } from './poster'
import { Ratings } from './ratings'
import { TorrentButon } from './torrent-buton'
import { Button } from '@nextui-org/react'
import { Movie } from './types'

const DOWNLOAD_TORRENT_BUTTON_ENABLED = false

export function MovieView({
  watchedIds,
  addWatchedId,
  removeWatchedId,
  addMovieToRadarr,
  movie,
}: {
  watchedIds: any
  addWatchedId: any
  removeWatchedId: any
  addMovieToRadarr: any
  movie: Movie
}) {
  const { title, release_date, id } = movie.details
  return (
    <div className="movie" key={title}>
      <h2>{title}</h2>
      <h3>{release_date}</h3>
      <Poster
        watchedIds={watchedIds}
        result={movie}
        addWatchedId={addWatchedId}
        removeWatchedId={removeWatchedId}
      />
      <Ratings result={movie} />
      <div className="download-buttons">
        {movie.torrentDetails && DOWNLOAD_TORRENT_BUTTON_ENABLED && (
          <TorrentButon torrentDetails={movie.torrentDetails} />
        )}
        <Button
          color="primary"
          variant="bordered"
          onClick={() => {
            addMovieToRadarr(id)
          }}
        >
          + Sonarr
        </Button>
      </div>
    </div>
  )
}
