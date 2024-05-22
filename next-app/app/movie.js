import { Poster } from './poster'
import { Ratings } from './ratings'
import { TorrentButon } from './torrentButon'
import { Button } from '@nextui-org/react'

const DOWNLOAD_TORRENT_BUTTON_ENABLED = false

export function Movie({
  result,
  watchedIds,
  addWatchedId,
  removeWatchedId,
  addMovieToRadarr,
}) {
  const { title, release_date, id } = result?.details
  return (
    <div className="movie" key={title}>
      <h2>{title}</h2>
      <h3>{release_date}</h3>
      <Poster
        watchedIds={watchedIds}
        result={result}
        addWatchedId={addWatchedId}
        removeWatchedId={removeWatchedId}
      />
      <Ratings result={result} />
      <div className="download-buttons">
        {result.torrentDetails && DOWNLOAD_TORRENT_BUTTON_ENABLED && (
          <TorrentButon torrentDetails={result.torrentDetails} />
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
