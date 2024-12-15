'use client'

import { Spinner } from '@nextui-org/react'
import { Pagination } from './pagination'
import { Menu } from './menu'
import { Movies, SearchCriteria } from '../types'
import { MoviesView } from '../movies-view/movies-view'
import styles from './styles.module.scss'
import { useQuery } from 'react-query'
import { useRouter } from 'next/navigation'

const API_URL = '/api'

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

export function MoviesContainer({
  searchCriteria,
}: {
  searchCriteria: SearchCriteria
}) {
  const router = useRouter()

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
          console.log('why')
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
    router.push(
      `/${searchCriteria.category}/${searchCriteria.genre}/${
        searchCriteria.page + 1
      }`
    )
  }

  function previous() {
    router.push(
      `/${searchCriteria.category}/${searchCriteria.genre}/${
        searchCriteria.page - 1
      }`
    )
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
          router.push(`/${newCategory}/${searchCriteria.genre}/1`)
        }}
        setGenre={(newGenre) => {
          router.push(`/${searchCriteria.category}/${newGenre}/1`)
        }}
        selectedCategory={searchCriteria.category}
        selectedGenre={searchCriteria.genre}
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
