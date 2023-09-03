import { CircularProgress } from "@nextui-org/react";

export function Ratings({ result, mapRatingSource, normalizeRating }) {
  return (
    <div className="ratings">
      {result.omdbDetails?.Ratings?.map((rating) => (
        <div key={rating.Source} className="rating">
          <a
            href={"https://www.imdb.com/title/" + result.details.imdb_id + "/"}
          >
            <span>{mapRatingSource(rating.Source)}</span>
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={normalizeRating(rating.Value)}
              color={normalizeRating(rating.Value) < 60 ? "warning" : "success"}
              showValueLabel={true}
            />
          </a>
        </div>
      ))}
      {!result?.omdbDetails?.Ratings?.length && result.details.imdb_id && (
        <div className="rating">
          <a
            href={"https://www.imdb.com/title/" + result.details.imdb_id + "/"}
          >
            <span>TMDB</span>
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={result.details.vote_average * 10}
              color={result.details.vote_average < 6 ? "warning" : "success"}
              showValueLabel={true}
            />
          </a>
        </div>
      )}
    </div>
  );
}
