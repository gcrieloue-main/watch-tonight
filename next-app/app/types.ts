export type Movie = {
  details: {
    backdrop_path: any
    overview: string
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
