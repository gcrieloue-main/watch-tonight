import { Poster } from "./poster";
import { Ratings } from "./ratings";
import { TorrentButon } from "./torrentButon";

export function Movie({ result, watchedIds, addWatchedId, removeWatchedId }) {
  const { original_title, release_date } = result?.details;
  return (
    <div className="movie" key={original_title}>
      <h2>{original_title}</h2>
      <h3>{release_date}</h3>
      <Poster
        watchedIds={watchedIds}
        result={result}
        addWatchedId={addWatchedId}
        removeWatchedId={removeWatchedId}
      />
      <Ratings result={result} />
      <TorrentButon result={result} />
    </div>
  );
}
