import { signInAction } from './actions'

export function SignIn() {
  return (
    <form action={signInAction}>
      <button type="submit">Signin with Google</button>
    </form>
  )
}
