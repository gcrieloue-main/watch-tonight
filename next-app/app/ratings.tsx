import { CircularProgress } from '@nextui-org/react'
import { Movie, Rating } from './types'

const ratingSourcesMapping = new Map([
  ['Internet Movie Database', 'IMDB'],
  ['Rotten Tomatoes', 'RT'],
  ['Metacritic', 'MT'],
])

const mapRatingSource = (source: string): string => {
  return ratingSourcesMapping.get(source) ?? source
}

function normalizeRating(rating: string) {
  if (rating?.includes('%')) {
    return +rating.replace(/[^0-9]/g, '')
  } else if (rating?.includes('/100')) {
    return +rating.replace('/100', '')
  } else if (rating?.includes('/10')) {
    return +rating.replace('/10', '') * 10
  } else return 0
}

function omdbRatings(Ratings: Rating[], imdb_id: number) {
  return (
    <>
      {Ratings?.map((rating) => (
        <div key={rating.Source} className="rating">
          {mapRatingSource(rating.Source) === 'IMDB' ? (
            <a href={`https://www.imdb.com/title/${imdb_id}/`}>
              <span>{mapRatingSource(rating.Source)}</span>
              <CircularProgress
                aria-label="Loading..."
                size="lg"
                value={normalizeRating(rating.Value)}
                color={
                  normalizeRating(rating.Value) < 60 ? 'warning' : 'success'
                }
                showValueLabel={true}
              />
            </a>
          ) : (
            <div>
              <span>{mapRatingSource(rating.Source)}</span>
              <CircularProgress
                aria-label="Loading..."
                size="lg"
                value={normalizeRating(rating.Value)}
                color={
                  normalizeRating(rating.Value) < 60 ? 'warning' : 'success'
                }
                showValueLabel={true}
              />
            </div>
          )}
        </div>
      ))}
    </>
  )
}

export function Ratings({ result }: { result: Movie }) {
  const { imdb_id, vote_average, id } = result.details
  const { Ratings } = result.omdbDetails
  return (
    <div className="ratings">
      {!Ratings?.length && imdb_id && (
        <div className="rating">
          <a href={`https://www.imdb.com/title/${imdb_id}/`}>
            <span>IMDB</span>
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={0}
              color={'warning'}
              showValueLabel={true}
            />
          </a>
        </div>
      )}
      {omdbRatings(Ratings, imdb_id)}
      {(!Ratings?.length ||
        !Ratings?.some((rating) => rating.Source === 'TMDB')) && (
        <div className="rating">
          <a href={`https://www.themoviedb.org/movie/${id}/`}>
            <span>TMDB</span>
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={vote_average * 10}
              color={vote_average < 6 ? 'warning' : 'success'}
              showValueLabel={true}
            />
          </a>
        </div>
      )}
    </div>
  )
}
