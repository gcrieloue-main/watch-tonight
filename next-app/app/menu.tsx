import { Tabs, Tab } from '@nextui-org/react'
import { GenreSelector } from './genre-selector'
import { useState } from 'react'
import { Category } from './types'

export function Menu({
  setGenre,
  setCategory,
  defaultSelectedKey = 'now_playing',
}: {
  setGenre: (number) => void
  setCategory: (string) => void
  defaultSelectedKey?: Category
}) {
  const [internalCategory, setInternalCategory] = useState(
    defaultSelectedKey as Category
  )

  return (
    <div className="flex w-full menu">
      <div>
        <Tabs
          defaultSelectedKey={defaultSelectedKey}
          aria-label="Tabs radius"
          onSelectionChange={(category) => {
            setInternalCategory(category as Category)
            setCategory(category)
          }}
        >
          <Tab key="watched" title="Watch list" />
          <Tab key="upcoming" title="Upcoming" />
          <Tab key="now_playing" title="Now playing" />
          <Tab key="popular" title="Popular movies" />
          <Tab key="best" title="Best movies" />
        </Tabs>
      </div>
      <div className="popGenre">
        <GenreSelector
          setGenre={setGenre}
          isDisabled={internalCategory === 'watched'}
        />
      </div>
    </div>
  )
}
