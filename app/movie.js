import { Poster } from "./poster";
import { Ratings } from "./ratings";
import { TorrentButon } from "./torrentButon";

function normalizeRating(rating) {
  if (rating?.includes("%")) {
    return +rating.replace(/[^0-9]/g, "");
  } else if (rating?.includes("/100")) {
    return +rating.replace("/100", "");
  } else if (rating?.includes("/10")) {
    return +rating.replace("/10", "") * 10;
  } else return 0;
}

export function Movie({ result, watchedIds, addWatchdId, removeWatchdId }) {
  const { original_title, release_date } = result?.details;
  return (
    <div className="movie" key={original_title}>
      <h2>{original_title}</h2>
      <h3>{release_date}</h3>
      <Poster
        watchedIds={watchedIds}
        result={result}
        addWatchdId={addWatchdId}
        removeWatchdI={removeWatchdId}
      />
      <Ratings result={result} />
      <TorrentButon result={result} />
    </div>
  );
}
