import { MoviesContainer } from './movies-container/movies-container'
// import { auth } from '@/auth'

// const AUTH_ENABLED = false

async function App() {
  const session = null
  // const session = AUTH_ENABLED ? await auth() : null
  console.log(session ?? ' no session')
  return <MoviesContainer session={session} />
}

export default App
