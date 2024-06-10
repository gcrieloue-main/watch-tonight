'use server'
import { signIn } from '@/auth'

export async function signInAction() {
  'use server'
  await signIn('google')
}
