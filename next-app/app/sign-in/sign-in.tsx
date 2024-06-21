import { signInAction, signOutAction } from '@/app/actions'
import { Session } from 'next-auth'
import styles from './styles.module.scss'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  Button,
} from '@nextui-org/react'

export function SignIn({ session }: { session: Session }) {
  return (
    <div className={styles.connected}>
      {!session && (
        <Button
          variant="light"
          className="capitalize"
          onClick={() => signInAction()}
        >
          Sign In
        </Button>
      )}
      {session && (
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: session?.user?.image,
              }}
              className="transition-transform"
              description={session.user.email}
              name={session.user.name}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem
              key="logout"
              color="danger"
              onClick={async () => await signOutAction()}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  )
}
