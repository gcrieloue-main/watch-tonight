import { Tabs, Tab } from '@nextui-org/react'

export function Menu({ setCategory, category }) {
  return (
    <div className="flex w-full flex-col menu">
      <Tabs
        aria-label="Tabs radius"
        onSelectionChange={(category) => setCategory(category)}
        defaultSelectedKey={category}
      >
        <Tab key="watched" title="Watch list" />
        <Tab key="upcoming" title="Upcoming" />
        <Tab key="now_playing" title="Now playing" />
        <Tab key="popular" title="Popular movies" />
        <Tab key="horror" title="Horror movies" />
      </Tabs>
    </div>
  )
}
