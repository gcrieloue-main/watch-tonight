'use client'

import { useFetch } from 'use-http'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Spinner } from '@nextui-org/react'
import { Pagination } from './pagination'
import { Menu } from './menu'
import { Movie } from './movie'
import autoAnimate from '@formkit/auto-animate'
import classNames from 'classnames'

const API_URL = '/api'

function App() {
  const [movies, setMovies] = useState([])
  const [watchedIds, setWatchedIds] = useState([])
  // const [page, setPage] = useState(1)
  // const [category, setCategory] = useState('now_playing')
  const [categoryAndPage, setCategoryAndPage] = useState({
    category: 'now_playing',
    page: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { get, response } = useFetch({ data: [] })
  const parent = useRef(null)

  const CATEGORY_WATCHED = 'watched'

  const loadMovies = useCallback(
    async (url) => {
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

  const loadWatchedIds = useCallback(async () => {
    const url = `${API_URL}/watchedIds`
    const result = await get(url)
    if (response.ok) setWatchedIds(result)
  }, [get, response])

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  function loadMoviesFromCategoryAndPage(category, page) {
    const urls = {
      watched: 'watched',
      popular: 'movies/popular/' + page,
      upcoming: 'movies/upcoming/' + page,
      now_playing: 'movies/now_playing/' + page,
      best: 'movies/best/' + page,
      default: 'movies/' + page,
    }
    loadMovies(`${API_URL}/${urls[category] || urls.default}`)
  }

  useEffect(() => {
    if (categoryAndPage.category === CATEGORY_WATCHED) {
      return
    }

    loadMoviesFromCategoryAndPage(
      categoryAndPage.category,
      categoryAndPage.page
    )
  }, [categoryAndPage.category, categoryAndPage.page])

  useEffect(() => {
    if (categoryAndPage.category === CATEGORY_WATCHED) {
      console.log('load watched movies')
      const url = `${API_URL}/watched?ids=${JSON.stringify(watchedIds)}`
      loadMovies(url)
    }
  }, [categoryAndPage, watchedIds])

  useEffect(() => {
    loadWatchedIds()
  }, [loadWatchedIds])

  function next() {
    setCategoryAndPage((currentCategoryAndPage) => ({
      ...currentCategoryAndPage,
      page: currentCategoryAndPage.page + 1,
    }))
  }

  function previous() {
    setCategoryAndPage((currentCategoryAndPage) => ({
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
          setCategoryAndPage((currentCategoryAndPage) => ({
            category: newCategory,
            page: 1,
          }))
        }}
        category={categoryAndPage.category}
      />
      <div
        className={classNames('movies', { loading: isLoading })}
        ref={parent}
      >
        {categoryAndPage.category === CATEGORY_WATCHED &&
          !(movies?.results?.length > 0) && (
            <div>
              <p>No watched movie !</p>
            </div>
          )}
        {movies?.results
          ?.filter((result) => result.details.status_code !== 34)
          ?.map((result) => (
            <Movie
              key={result.details.title}
              result={result}
              watchedIds={watchedIds}
              addWatchedId={addWatchedId}
              removeWatchedId={removeWatchedId}
              addMovieToRadarr={addMovieToRadarr}
            />
          ))}
      </div>
      {categoryAndPage.category !== CATEGORY_WATCHED && (
        <Pagination
          category={categoryAndPage.category}
          page={categoryAndPage.page}
          previous={previous}
          next={next}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

export default App
