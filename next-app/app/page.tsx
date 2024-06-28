'use client'

import { QueryClient, QueryClientProvider } from 'react-query'
import { MoviesContainer } from './movies-container/movies-container'

const queryClient = new QueryClient()

// eslint-disable-next-line @next/next/no-async-client-component
async function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MoviesContainer />
    </QueryClientProvider>
  )
}

export default App
