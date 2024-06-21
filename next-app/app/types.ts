export type Rating = {
  Source: string
  Value: string
}

export type Movie = {
  details: {
    backdrop_path: string
    overview: string
    id: string
    title: string
    release_date: string
    poster_path: string
    status_code?: number
    [x: string]: any
  }
  omdbDetails?: {
    imdbRating: number | string
    Released: string
    Actors: string
    Genre: string
    Director: string
    Ratings: Rating[]
  }
  torrentDetails?: any
}
export type Movies = { results: Movie[] }
export type Category =
  | 'now_playing'
  | 'watched'
  | 'popular'
  | 'best'
  | 'upcoming'
