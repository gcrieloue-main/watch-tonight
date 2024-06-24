// @ts-ignore
import TorrentSearchApi from 'torrent-search-api'
import config from './config'
import { format } from 'date-fns'
import NodeCache from 'node-cache'

export class ServerService {
  private cache: NodeCache
  private TTL = 3600
  constructor() {
    TorrentSearchApi.enableProvider('ThePirateBay')
    TorrentSearchApi.enableProvider('Yts')

    this.cache = new NodeCache()
  }

  movieDbHeaders = {
    Accept: 'application/json',
    Authorization: `Bearer ${config.TMDB_API_TOKEN}`,
  }

  addMovieToRadarr = async (tmdbId?: string) => {
    await fetch(config.RADARR_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': config.RADARR_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tmdbId: tmdbId,
        qualityProfileId: '6',
        rootFolderPath: config.RADARR_ROOT_FOLDER,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData: any) => {
            if (errorData[0].errorCode === 'MovieExistsValidator') {
              console.log('Movie already added to radarr')
            } else {
              console.error(
                'Network response was not ok:',
                response.status,
                response.statusText,
                errorData
              )
              throw new Error('Network response was not ok')
            }
          })
        }
        return response.json()
      })
      .then((_data) => {
        console.log('Movie added to radarr:', tmdbId)
      })
      .catch((reason) => {
        console.log('Error adding to radarr:', reason)
      })
  }

  getTmdbMovies = async (
    page = 1,
    options: {
      genre?: number
      type?: string
    } = {
      genre: 27,
      type: 'none',
    }
  ) => {
    const cacheKey = 'tmdb_movies_' + JSON.stringify({ page, options })

    if (this.cache.has(cacheKey)) {
      console.log({ cacheKey })
      return this.cache.get(cacheKey)
    }

    console.log('# Query', { ...options, page })
    const pageId = page
    const tmdbApi = 'https://api.themoviedb.org/3'
    const today = new Date()
    const minDate = format(today, 'yyyy-MM-dd')
    const minDateNowPlaying = format(
      new Date().setDate(today.getDate() - 10),
      'yyyy-MM-dd'
    )
    const withGenre = options.genre ? `with_genres=${options.genre}&` : ''
    let url: string
    switch (options.type) {
      case 'now_playing':
        url = `${tmdbApi}/discover/movie?${withGenre}include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_release_type=2|3&release_date.gte=${minDateNowPlaying}&release_date.lte=${minDate}&page=${pageId}`
        break
      case 'popular':
        url = `${tmdbApi}/discover/movie?${withGenre}include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=${pageId}`
        break
      case 'upcoming':
        url = `${tmdbApi}/discover/movie?${withGenre}include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_release_type=2|3&primary_release_date.gte=${minDate}&page=${pageId}`
        break
      case 'best':
        url = `${tmdbApi}/discover/movie?${withGenre}include_adult=false&include_video=false&language=en-US&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200&page=${pageId}`
        break
      default:
        url = `${tmdbApi}/discover/movie?${withGenre}vote_average.gte=6&vote_count.gte=10&sort_by=primary_release_date.desc&page=${pageId}`
    }

    console.log(url)

    const result = await (
      await fetch(url, {
        headers: this.movieDbHeaders,
      })
    ).json()

    this.cache.set(cacheKey, result, 3600)

    return result
  }

  getTmdbMovieDetails = async (id: string) => {
    const cacheKey = 'tmdb_movie_details_' + id

    if (this.cache.has(cacheKey)) {
      console.log({ cacheKey })
      return this.cache.get(cacheKey)
    }

    const result = await (
      await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        headers: this.movieDbHeaders,
      })
    ).json()

    this.cache.set(cacheKey, result, 3600)

    return result
  }

  getOmdbMovieDetails = async (title: string) => {
    const cacheKey = 'omdb_movie_details_' + title

    if (this.cache.has(cacheKey)) {
      console.log({ cacheKey })
      return this.cache.get(cacheKey)
    }

    const result = await (
      await fetch(`http://www.omdbapi.com/?apikey=f33929a7&t=${title}`, {
        headers: {
          Accept: 'application/json',
        },
      })
    ).json()

    this.cache.set(cacheKey, result, 3600)

    return result
  }

  getTorrentDetails = async (title: string) => {
    if (!title) {
      return
    }

    const cacheKey = 'torrent_details_' + title

    if (this.cache.has(cacheKey)) {
      console.log({ cacheKey })
      return this.cache.get(cacheKey)
    }

    try {
      const pirateBay = await TorrentSearchApi.search(
        ['ThePirateBay'],
        title,
        'Video',
        3
      )

      const result = {
        pirateBay: pirateBay.map((pirateBayItem: any) => ({
          ...pirateBayItem,
          provider: 'The Pirate Bay',
        })),
      }

      this.cache.set(cacheKey, result, 3600)

      return result
    } catch (error) {
      console.error('Piratebay error on', title, error)
      return
    }
  }

  loadCache() {
    const cacheParams: [
      page: number,
      options?: { genre?: number; type?: string },
    ][] = [
      [1],
      [2],
      [1, { type: 'popular' }],
      [1, { type: 'upcoming' }],
      [1, { type: 'now_playing' }],
      [2, { type: 'popular' }],
      [2, { type: 'upcoming' }],
      [2, { type: 'now_playing' }],
    ]

    cacheParams.forEach((params) => {
      this.getData.apply(null, params)
    })
  }

  getData = async (
    page: number,
    options?: {
      genre?: number
      type?: string
    }
  ) => {
    const tmdbMovieDetails = await this.getTmdbMovies(page, options)

    const resultsWithDetails = await Promise.all(
      tmdbMovieDetails.results?.map(async (data: any) => {
        return await this.addAdditionalDetails(data)
      })
    )

    return { ...tmdbMovieDetails, results: resultsWithDetails }
  }

  getDataForMoviesIds = async (ids: string[]) => {
    console.log('# Query Watched Movies...')
    return {
      results: await Promise.all(
        ids.map(async (id: string) => {
          const detail = await this.getTmdbMovieDetails(id)
          return this.addAdditionalDetails(detail)
        })
      ),
    }
  }

  addAdditionalDetails = async (tmdbMovieDetail: any) => {
    try {
      return {
        details: await this.getTmdbMovieDetails(tmdbMovieDetail.id),
        omdbDetails: await this.getOmdbMovieDetails(tmdbMovieDetail.title),
        torrentDetails: await this.getTorrentDetails(tmdbMovieDetail.title),
      }
    } catch (error) {
      console.log(error)
      return {}
    }
  }
}
