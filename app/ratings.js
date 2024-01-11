import { CircularProgress } from "@nextui-org/react";

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

function normalizeRating(rating) {
  if (rating?.includes("%")) {
    return +rating.replace(/[^0-9]/g, "");
  } else if (rating?.includes("/100")) {
    return +rating.replace("/100", "");
  } else if (rating?.includes("/10")) {
    return +rating.replace("/10", "") * 10;
  } else return 0;
}

export function Ratings({ result }) {
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
