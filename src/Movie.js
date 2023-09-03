import { Poster } from "./Poster";
import { Ratings } from "./Ratings";
import { TorrentButon } from "./TorrentButon";

export function Movie({
  result,
  watchedIds,
  addWatchdId,
  removeWatchdId,
  mapRatingSource,
  normalizeRating,
  dropDownOpen,
  setDropDownOpen,
}) {
  return (
    <div className="movie" key={result?.details?.original_title}>
      <h2>{result?.details?.original_title}</h2>
      <h3>{result?.details?.release_date}</h3>
      <Poster
        watchedIds={watchedIds}
        result={result}
        addWatchdId={addWatchdId}
        removeWatchdI={removeWatchdId}
      />
      <Ratings
        result={result}
        mapRatingSource={mapRatingSource}
        normalizeRating={normalizeRating}
      />
      <TorrentButon
        result={result}
        dropDownOpen={dropDownOpen}
        setDropDownOpen={setDropDownOpen}
      />
    </div>
  );
}
