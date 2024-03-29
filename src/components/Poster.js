import classNames from "classnames";

export function Poster({ watchedIds, result, addWatchId, removeWatchId }) {
  return (
    <div className="poster">
      {!watchedIds?.includes("" + result.details.id) && (
        <span
          className="watch_action watch__add"
          onClick={() => addWatchId(result.details.id)}
        >
          +
        </span>
      )}
      {watchedIds?.includes("" + result.details.id) && (
        <span
          className="watch_action watch__remove"
          onClick={() => removeWatchId(result.details.id)}
        >
          -
        </span>
      )}
      {result.omdbDetails?.imdbRating >= 6 &&
        result.omdbDetails?.imdbRating < 7 && (
          <span className="approved">✓</span>
        )}
      {result.omdbDetails?.imdbRating >= 7 && (
        <span className="approved approved_plus">✓+</span>
      )}
      <img
        className={classNames({
          grayscale: result.omdbDetails?.imdbRating < 5,
        })}
        loading="lazy"
        alt=""
        src={
          "https://www.themoviedb.org/t/p/w300_and_h450_bestv2" +
          result.details.poster_path
        }
      />
    </div>
  );
}
