import Image from 'next/image'

export function Poster({ watchedIds, result, addWatchedId, removeWatchedId }) {
  const { id, poster_path } = result.details
  const { imdbRating } = result.omdbDetails

  return (
    <div className="poster">
      {!watchedIds?.includes(`${id}`) ? (
        <span
          className="watch_action watch__add"
          onClick={() => addWatchedId(id)}
        >
          +
        </span>
      ) : (
        <span
          className="watch_action watch__add"
          onClick={() => removeWatchedId(id)}
        >
          -
        </span>
      )}
      {imdbRating >= 6 && imdbRating < 7 && <span className="approved">✓</span>}
      {imdbRating >= 7 && <span className="approved approved_plus">✓+</span>}
      <Image
        className={imdbRating < 5 ? 'grayscale' : ''}
        loading="lazy"
        width="300"
        height="450"
        src={`https://www.themoviedb.org/t/p/w300_and_h450_bestv2${poster_path}`}
        alt=""
      />
    </div>
  )
}
