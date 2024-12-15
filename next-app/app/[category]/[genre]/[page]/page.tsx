'use client'

import { QueryClient, QueryClientProvider } from 'react-query'
import { MoviesContainer } from '../../../movies-container/movies-container'
import { useParams } from 'next/navigation'
import { Category } from '../../../types'

const queryClient = new QueryClient()

function App() {
  const queryParams = useParams<{
    category: string
    genre: string
    page: string
  }>()

  return (
    <QueryClientProvider client={queryClient}>
      <MoviesContainer
        searchCriteria={{
          category: (queryParams.category as Category) || 'now_playing',
          page: queryParams.page ? Number(queryParams.page) : 1,
          genre: queryParams.genre ? Number(queryParams.genre) : 1,
        }}
      />
    </QueryClientProvider>
  )
}

export default App
