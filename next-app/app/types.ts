export type Movie = {
  details: {
    id: string
    title: string
    release_date: string
    poster_path: string
    status_code: number
  }
  omdbDetails?: any
  torrentDetails?: any
}
export type Movies = { results: Movie[] }
export type Category =
  | 'now_playing'
  | 'watched'
  | 'popular'
  | 'best'
  | 'upcoming'
