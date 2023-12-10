import { Poster } from "./Poster";
import { Ratings } from "./Ratings";
import { TorrentButon } from "./TorrentButon";

export function Movie({ result, watchedIds, addWatchId, removeWatchId }) {
  return (
    <div className="movie" key={result?.details?.title}>
      <h2>{result?.details?.title}</h2>
      <h3>{result?.details?.release_date}</h3>
      <Poster
        watchedIds={watchedIds}
        result={result}
        addWatchId={addWatchId}
        removeWatchId={removeWatchId}
      />
      <Ratings result={result} />
      {result.torrentDetails && (
        <TorrentButon torrentDetails={result.torrentDetails} />
      )}
    </div>
  );
}
