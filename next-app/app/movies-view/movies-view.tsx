import { useRef } from 'react'
import { MovieView } from '../movie-view/movie-view'
import clsx from 'clsx'
import { Category, Movies } from '../types'
import styles from './styles.module.scss'

export function MoviesView({
  isLoading,
  movies,
  searchCriteria,
  addMovieToRadarr,
}: {
  isLoading: boolean
  movies: Movies
  searchCriteria: any
  addMovieToRadarr: (any) => void
}) {
  const parent = useRef(null)

  const CATEGORY_WATCHED: Category = 'watched'
  return (
    <div
      className={clsx(styles.movies, isLoading ? styles.loading : undefined)}
      ref={parent}
    >
      {searchCriteria.category === CATEGORY_WATCHED &&
        !(movies?.results?.length > 0) && (
          <div>
            <p>No watched movie !</p>
          </div>
          // eslint-disable-next-line indent
        )}

      {movies?.results
        ?.filter((result) => result.details.status_code !== 34)
        ?.map((result) => (
          <MovieView
            key={result.details.title}
            movie={result}
            addMovieToRadarr={addMovieToRadarr}
          />
        ))}
    </div>
  )
}
