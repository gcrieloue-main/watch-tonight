import { Tabs, Tab } from '@nextui-org/react'
import { GenreSelector } from './genre-selector'
import { useState } from 'react'
import { Category } from '../types'
import styles from './styles.module.scss'
import { clsx } from 'clsx'

export function Menu({
  setGenre,
  setCategory,
  selectedCategory = 'now_playing',
  selectedGenre,
}: {
  setGenre: (number) => void
  setCategory: (string) => void
  selectedCategory?: Category
  selectedGenre?: number
}) {
  const WATCH_LIST_ENABLED = false

  return (
    <div className={clsx('flex w-full', styles.menu)}>
      <div>
        <Tabs
          selectedKey={selectedCategory}
          aria-label="Tabs radius"
          onSelectionChange={(category) => {
            setCategory(category)
          }}
        >
          {WATCH_LIST_ENABLED && <Tab key="watched" title="Watch list" />}
          <Tab key="upcoming" title="Upcoming" />
          <Tab key="now_playing" title="Now playing" />
          <Tab key="popular" title="Popular movies" />
          <Tab key="best" title="Best movies" />
        </Tabs>
      </div>
      <div className={styles.popGenre}>
        <GenreSelector
          selectedGenre={selectedGenre}
          setGenre={setGenre}
          isDisabled={selectedCategory === 'watched'}
        />
      </div>
    </div>
  )
}
