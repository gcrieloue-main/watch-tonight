'use client'

import { useFetch } from 'use-http'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Spinner } from '@nextui-org/react'
import { Pagination } from './pagination'
import { Menu } from './menu'
import { MovieView } from './movie-view/movie-view'
import autoAnimate from '@formkit/auto-animate'
import classNames from 'classnames'
import { Category, Movies } from './types'

const API_URL = '/api'

type SearchCriteria = {
  page: number
  category: Category
  genre?: number
}

function App() {
  const [movies, setMovies] = useState({ results: [] } as Movies)
  const [watchedIds, setWatchedIds] = useState([])
  const [searchCriteria, setSearchCriteria] = useState({
    category: 'now_playing',
    page: 1,
  } as SearchCriteria)
  const [isLoading, setIsLoading] = useState(false)
  const { get, response, post } = useFetch({ data: [] })
  const parent = useRef(null)

  const CATEGORY_WATCHED: Category = 'watched'

  const getLoadMovies = useCallback(
    async (url: string) => {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(true)
      }, 300)
      const result = await get(url)
      if (response.ok) setMovies(result)
      clearTimeout(loadingTimeout)
      setTimeout(() => {
        window.scrollTo(0, 0)
        setIsLoading(false)
      }, 250) // scroll to top after autoanimate
    },
    [get, response]
  )

  const postLoadMovies = useCallback(
    async (url: string, body: any) => {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(true)
      }, 300)
      const result = await post(url, body)
      if (response.ok) setMovies(result)
      clearTimeout(loadingTimeout)
      setTimeout(() => {
        window.scrollTo(0, 0)
        setIsLoading(false)
      }, 250) // scroll to top after autoanimate
    },
    [post, response]
  )

  const loadWatchedIds = useCallback(async () => {
    const url = `${API_URL}/watchedIds`
    const result = await get(url)
    if (response.ok) setWatchedIds(result)
  }, [get, response])

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  function loadMoviesFromCategoryAndPage(criteria: SearchCriteria) {
    const { genre, page, category } = criteria

    if (category === 'watched') {
      getLoadMovies(`${API_URL}/watched}`)
    } else {
      const processedSearchCriteria: SearchCriteria = {
        ...criteria,
        page: page || 1,
        genre: genre ? undefined : genre,
        category,
      }
      console.log('reload movies list', searchCriteria)
      postLoadMovies(API_URL + '/movies', processedSearchCriteria)
    }
  }

  useEffect(() => {
    if (searchCriteria.category === CATEGORY_WATCHED) {
      return
    }

    loadMoviesFromCategoryAndPage(searchCriteria)
  }, [searchCriteria.category, searchCriteria.page, searchCriteria.genre])

  useEffect(() => {
    if (searchCriteria.category === CATEGORY_WATCHED) {
      console.log('load watched movies')
      const url = `${API_URL}/watched?ids=${JSON.stringify(watchedIds)}`
      getLoadMovies(url)
    }
  }, [searchCriteria, watchedIds])

  useEffect(() => {
    loadWatchedIds()
  }, [loadWatchedIds])

  function next() {
    setSearchCriteria((currentCategoryAndPage) => ({
      ...currentCategoryAndPage,
      page: currentCategoryAndPage.page + 1,
    }))
  }

  function previous() {
    setSearchCriteria((currentCategoryAndPage) => ({
      ...currentCategoryAndPage,
      page: currentCategoryAndPage.page - 1,
    }))
  }

  function addWatchedId(id) {
    if (watchedIds?.includes(`${id}`)) {
      console.warn(`${id} already in watchedIds`, watchedIds)
      return
    }
    fetch(`${API_URL}/watch/${id}`).then(async () => {
      setWatchedIds((currentWatchIds) => currentWatchIds.concat(`${id}`))
    })
  }

  function addMovieToRadarr(tmdbId) {
    fetch(`${API_URL}/add_to_radarr/${tmdbId}`).then(() => {
      console.log(`add ${tmdbId} to radarr`)
    })
  }

  function removeWatchedId(id) {
    if (!watchedIds?.includes(`${id}`)) {
      console.warn(`${id} already absent from watchedIds`, watchedIds)
      return
    }
    fetch(`${API_URL}/watch/delete/${id}`).then(async () => {
      setWatchedIds((currentWatchIds) =>
        currentWatchIds.filter((current) => current !== '' + id)
      )
    })
  }

  return (
    <div className="App">
      {isLoading && (
        <div className="spinner">
          <Spinner size="lg" />
        </div>
      )}
      <Menu
        setCategory={(newCategory) => {
          console.log({ setCategory: newCategory })
          setSearchCriteria((searchCriteria) => ({
            genre: searchCriteria.genre,
            category: newCategory,
            page: 1,
          }))
        }}
        setGenre={(newGenre) => {
          console.log({ setGenre: newGenre })
          setSearchCriteria((searchCriteria) => ({
            category: searchCriteria.category,
            genre: newGenre,
            page: 1,
          }))
        }}
      />

      <div
        className={classNames('movies', { loading: isLoading })}
        ref={parent}
      >
        {searchCriteria.category === CATEGORY_WATCHED &&
          !(movies?.results?.length > 0) && (
            <div>
              <p>No watched movie !</p>
            </div>
            // eslint-disable-next-line indent
          )}

        {movies?.results
          ?.filter((result) => result.details.status_code !== 34)
          ?.map((result) => (
            <MovieView
              key={result.details.title}
              movie={result}
              watchedIds={watchedIds}
              addWatchedId={addWatchedId}
              removeWatchedId={removeWatchedId}
              addMovieToRadarr={addMovieToRadarr}
            />
          ))}
      </div>
      {searchCriteria.category !== CATEGORY_WATCHED && (
        <Pagination
          page={searchCriteria.page}
          previous={previous}
          next={next}
        />
      )}
    </div>
  )
}

export default App
