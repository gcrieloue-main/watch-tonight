// @ts-ignore
import TorrentSearchApi from 'torrent-search-api'
import _ from 'lodash'
import {
  TMDB_API_TOKEN,
  RADARR_API_KEY,
  RADARR_ROOT_FOLDER,
  RADARR_API_URL,
} from './server.config'

TorrentSearchApi.enableProvider('ThePirateBay')
TorrentSearchApi.enableProvider('Yts')

const movieDbHeaders = {
  Accept: 'application/json',
  Authorization: `Bearer ${TMDB_API_TOKEN}`,
}

export async function addMovieToRadarr(tmdbId?: string) {
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
    .then((data) => {
      console.log('Movie added to sonar:', tmdbId)
    })
    .catch((reason) => {
      console.log('Error adding to radarr:', reason)
    })
}

export async function getTmdbMovies(
  page: number,
  options: {
    genre?: number
    type?: string
  } = {
    genre: 27,
    type: 'none',
  }
) {
  console.log(page, options)
  const pageId = page || 1
  let url
  switch (options.type) {
    case 'now_playing':
    case 'upcoming':
    case 'popular':
      url = `https://api.themoviedb.org/3/movie/${options.type}?page=${pageId}`
      break
    default:
      url = `https://api.themoviedb.org/3/discover/movie?with_genres=${options.genre}&vote_average.gte=6&vote_count.gte=10&sort_by=primary_release_date.desc&page=${pageId}`
  }

  console.log(url)
  const data = await (
    await fetch(url, {
      headers: movieDbHeaders,
    })
  ).json()
  return data
}

export async function getTmdbMovieDetails(id: string) {
  return await (
    await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
      headers: movieDbHeaders,
    })
  ).json()
}

export async function getOmdbMovieDetails(title: string) {
  const data = await (
    await fetch(`http://www.omdbapi.com/?apikey=f33929a7&t=${title}`, {
      headers: {
        Accept: 'application/json',
      },
    })
  ).json()
  return data
}

export async function getTorrentDetails(title: string) {
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
      pirateBay: { ...pirateBay[0], provider: 'The Pirate Bay' },
      pirateBay2: { ...pirateBay[1], provider: 'The Pirate Bay' },
      pirateBay3: { ...pirateBay[2], provider: 'The Pirate Bay' },
    }
  } catch (error) {
    console.error(error)
    return {}
  }
}
