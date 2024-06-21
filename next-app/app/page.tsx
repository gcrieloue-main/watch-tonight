import { MoviesContainer } from './movies-container/movies-container'
import { auth } from '@/auth'

async function App() {
  const session = await auth()
  console.log(session)
  return <MoviesContainer session={session} />
}

export default App
