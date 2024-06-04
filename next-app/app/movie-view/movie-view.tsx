import { Poster } from '../poster/poster'
import { Ratings } from '../ratings'
import { TorrentButon } from '../torrent-buton'
import { Button } from '@nextui-org/react'
import { Movie } from '../types'

import styles from './styles.module.scss'
import { useState } from 'react'

const DOWNLOAD_TORRENT_BUTTON_ENABLED = false

function MovieDetailsContent({ movie }: { movie: Movie }) {
  return (
    <>
      <p>
        <span className={styles.label}>Director :</span>
        {movie.omdbDetails.Director}
      </p>
      <p>
        <span className={styles.label}>Overview :</span>
        {movie.details.overview}
      </p>
      <p>
        <span className={styles.label}>Genre :</span>
        {movie.omdbDetails.Genre}
      </p>
      <p>
        <span className={styles.label}>Actors :</span>
        {movie.omdbDetails.Actors}
      </p>
      <p>
        <span className={styles.label}>Released :</span>
        {movie.omdbDetails.Released}
      </p>
    </>
  )
}

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
  const [flipped, setFlipped] = useState(false)
  const { title, release_date, id } = movie.details
  return (
    <div className={styles.flip}>
      <div
        className={styles.flipInner + (flipped ? ' ' + styles.enabled : '')}
        key={title}
      >
        <div className={styles.movie}>
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
            <Button
              className={styles.detailButton}
              isIconOnly
              color="primary"
              variant="bordered"
              onClick={() => {
                setFlipped(true)
              }}
            >
              ☰
            </Button>
          </div>
        </div>
        <div
          className={`${styles.movie} ${styles.back}`}
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${movie.details.backdrop_path})`,
          }}
        >
          {/* <img
          loading="lazy"
          src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${movie.details.backdrop_path}`}
        /> */}
          {/* <p>{JSON.stringify(movie.omdbDetails)}</p> */}
          <h2>{title}</h2>
          <div className={styles.details}>
            {movie?.omdbDetails?.Director && (
              <MovieDetailsContent movie={movie} />
            )}
          </div>
          <Button
            color="primary"
            variant="bordered"
            onClick={() => {
              setFlipped(false)
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
