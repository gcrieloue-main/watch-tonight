import Image from 'next/image'
import { Movie } from '../types'
import styles from './styles.module.scss'
import clsx from 'clsx'

export function Poster({ result }: { result: Movie }) {
  const { poster_path } = result.details
  const { imdbRating } = result.omdbDetails
  const src = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2${poster_path}`

  return (
    <div className={styles.poster}>
      {typeof imdbRating === 'number' && imdbRating >= 6 && imdbRating < 7 && (
        <span className={styles.approved}>✓</span>
      )}
      {typeof imdbRating === 'number' && imdbRating >= 7 && (
        <span className={clsx(styles.approved, styles.approvedPlus)}>✓+</span>
      )}
      {poster_path && (
        <Image
          className={clsx(
            typeof imdbRating === 'number' && imdbRating < 5 && styles.grayscale
          )}
          loading="lazy"
          width="300"
          height="450"
          src={src}
          alt=""
        />
      )}
      {!poster_path && (
        <div className={styles.posterPlaceholder}>NO POSTER</div>
      )}
    </div>
  )
}
