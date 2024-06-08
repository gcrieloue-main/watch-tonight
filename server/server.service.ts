// @ts-ignore
import TorrentSearchApi from 'torrent-search-api'
import _ from 'lodash'
import {
  TMDB_API_TOKEN,
  RADARR_API_KEY,
  RADARR_ROOT_FOLDER,
  RADARR_API_URL,
} from './config.json'
import { format } from 'date-fns'

export class ServerService {
  constructor() {
    TorrentSearchApi.enableProvider('ThePirateBay')
    TorrentSearchApi.enableProvider('Yts')

    this.getTmdbMovieDetails = _.memoize(this.getTmdbMovieDetails)
    this.getOmdbMovieDetails = _.memoize(this.getOmdbMovieDetails)
    this.getTorrentDetails = _.memoize(this.getTorrentDetails)
    this.getTmdbMovies = _.memoize(this.getTmdbMovies, (...args: any[]) =>
      JSON.stringify(args)
    )
    this.getData = _.memoize(this.getData, (...args: any[]) =>
      JSON.stringify(args)
    )
  }

  movieDbHeaders = {
    Accept: 'application/json',
    Authorization: `Bearer ${TMDB_API_TOKEN}`,
  }

  addMovieToRadarr = async (tmdbId?: string) => {
    await fetch(RADARR_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': RADARR_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tmdbId: tmdbId,
        qualityProfileId: '6',
        rootFolderPath: RADARR_ROOT_FOLDER,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData: any) => {
            if (errorData[0].errorCode !== 'MovieExistsValidator') {
              console.error(
                'Network response was not ok:',
                response.status,
                response.statusText,
                errorData
              )
              throw new Error('Network response was not ok')
            } else {
              console.log('Movie already added to sonar')
            }
          })
        }
        return response.json()
      })
      .then((_data) => {
        console.log('Movie added to sonar:', tmdbId)
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
    const data = await (
      await fetch(url, {
        headers: this.movieDbHeaders,
      })
    ).json()
    return data
  }

  getTmdbMovieDetails = async (id: string) => {
    return await (
      await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        headers: this.movieDbHeaders,
      })
    ).json()
  }

  getOmdbMovieDetails = async (title: string) => {
    const data = await (
      await fetch(`http://www.omdbapi.com/?apikey=f33929a7&t=${title}`, {
        headers: {
          Accept: 'application/json',
        },
      })
    ).json()
    return data
  }

  getTorrentDetails = async (title: string) => {
    if (!title) {
      return
    }

    try {
      const pirateBay = await TorrentSearchApi.search(
        ['ThePirateBay'],
        title,
        'Video',
        3
      )

      return {
        pirateBay: pirateBay.map((pirateBayItem: any) => ({
          ...pirateBayItem,
          provider: 'The Pirate Bay',
        })),
      }
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
