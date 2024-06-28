'use client'

import { useState } from 'react'
import { Spinner } from '@nextui-org/react'
import { Pagination } from './pagination'
import { Menu } from './menu'
import { Category, Movies } from '../types'
import { MoviesView } from '../movies-view/movies-view'
import styles from './styles.module.scss'
import { useQuery } from 'react-query'

const API_URL = '/api'

type SearchCriteria = {
  page: number
  category: Category
  genre?: number
}

function minDelay<T>(promise: Promise<T>, delay: number): Promise<T> {
  return new Promise((resolve) => {
    const startMs = Date.now()

    promise.then((result) => {
      const timeSpent = Date.now() - startMs

      if (timeSpent > delay) {
        resolve(result)
      } else {
        setTimeout(() => {
          resolve(result)
        }, delay - timeSpent)
      }
    })
  })
}

export function MoviesContainer() {
  const [searchCriteria, setSearchCriteria] = useState({
    category: 'now_playing',
    page: 1,
  } as SearchCriteria)
  const { data, isLoading } = useQuery({
    queryKey: ['movies', searchCriteria],
    queryFn: (key): Promise<Movies> => {
      return minDelay(
        fetch(`${API_URL}/movies`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(searchCriteria),
        }).then((res) => {
          setTimeout(() => {
            window.scrollTo(0, 0)
          }, 250) // scroll to top after autoanimate
          return res.json()
        }),
        500
      )
    },
  })

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

  function addMovieToRadarr(tmdbId) {
    fetch(`${API_URL}/add_to_radarr/${tmdbId}`).then(() => {
      console.log(`add ${tmdbId} to radarr`)
    })
  }

  return (
    <div className="App">
      {isLoading && (
        <div className={styles.spinner}>
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
      <MoviesView
        movies={data}
        isLoading={isLoading}
        addMovieToRadarr={addMovieToRadarr}
        searchCriteria={searchCriteria}
      />
      {searchCriteria.category !== 'watched' && (
        <Pagination
          page={searchCriteria.page}
          previous={previous}
          next={next}
        />
      )}
    </div>
  )
}
