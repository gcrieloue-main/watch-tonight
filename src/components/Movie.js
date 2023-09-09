import { Poster } from "./Poster";
import { Ratings } from "./Ratings";
import { TorrentButon } from "./TorrentButon";

function normalizeRating(rating) {
  if (rating?.includes("%")) {
    return +rating.replace(/[^0-9]/g, "");
  } else if (rating?.includes("/100")) {
    return +rating.replace("/100", "");
  } else if (rating?.includes("/10")) {
    return +rating.replace("/10", "") * 10;
  } else return 0;
}

function mapRatingSource(source) {
  switch (source) {
    case "Internet Movie Database":
      return "IMDB";
    case "Rotten Tomatoes":
      return "RT";
    case "Metacritic":
      return "MT";
    default:
      return source;
  }
}

export function Movie({ result, watchedIds, addWatchId, removeWatchId }) {
  return (
    <div className="movie" key={result?.details?.original_title}>
      <h2>{result?.details?.original_title}</h2>
      <h3>{result?.details?.release_date}</h3>
      <Poster
        watchedIds={watchedIds}
        result={result}
        addWatchId={addWatchId}
        removeWatchId={removeWatchId}
      />
      <Ratings
        result={result}
        mapRatingSource={mapRatingSource}
        normalizeRating={normalizeRating}
      />
      <TorrentButon torrentDetails={result.torrentDetails} />
    </div>
  );
}
