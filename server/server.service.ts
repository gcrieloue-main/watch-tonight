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

TorrentSearchApi.enableProvider('ThePirateBay')
TorrentSearchApi.enableProvider('Yts')

const movieDbHeaders = {
  Accept: 'application/json',
  Authorization: `Bearer ${TMDB_API_TOKEN}`,
}

async function addMovieToRadarr(tmdbId?: string) {
  await fetch(RADARR_API_URL, {
    method: 'POST',
    headers: {
      'X-Api-Key': RADARR_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tmdbId: tmdbId,
      qualityProfileId: '1',
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

async function getTmdbMovies(
  page = 1,
  options: {
    genre?: number
    type?: string
  } = {
    genre: 27,
    type: 'none',
  }
) {
  console.log(page, options)
  const pageId = page
  const tmdbApi = 'https://api.themoviedb.org/3'
  const minDate = format(new Date(), 'yyyy-MM-dd')
  let url: string
  switch (options.type) {
    case 'now_playing':
    case 'popular':
      url = `${tmdbApi}/movie/${options.type}?page=${pageId}`
      break
    case 'upcoming':
      url = `${tmdbApi}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3&primary_release_date.gte=${minDate}&page=${pageId}`
      break
    case 'best':
      url = `${tmdbApi}/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200&page=${pageId}`
      break
    default:
      url = `${tmdbApi}/discover/movie?with_genres=${options.genre}&vote_average.gte=6&vote_count.gte=10&sort_by=primary_release_date.desc&page=${pageId}`
  }

  console.log(url)
  const data = await (
    await fetch(url, {
      headers: movieDbHeaders,
    })
  ).json()
  return data
}

async function getTmdbMovieDetails(id: string) {
  return await (
    await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
      headers: movieDbHeaders,
    })
  ).json()
}

async function getOmdbMovieDetails(title: string) {
  const data = await (
    await fetch(`http://www.omdbapi.com/?apikey=f33929a7&t=${title}`, {
      headers: {
        Accept: 'application/json',
      },
    })
  ).json()
  return data
}

async function getTorrentDetails(title: string) {
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

const memoGetTmdbMovieDetails = _.memoize(getTmdbMovieDetails)
const memoGetOmdbMovieDetails = _.memoize(getOmdbMovieDetails)
const memoGetTorrentDetails = _.memoize(getTorrentDetails)
const memoGetTmdbMovies = _.memoize(getTmdbMovies, (...args: any[]) =>
  JSON.stringify(args)
)

export {
  memoGetTmdbMovieDetails,
  memoGetOmdbMovieDetails,
  memoGetTorrentDetails,
  memoGetTmdbMovies,
  addMovieToRadarr,
}
