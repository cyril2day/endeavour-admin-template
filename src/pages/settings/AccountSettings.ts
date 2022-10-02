import useAppStore from '@/stores/app'
import { useWindowSize } from '@vueuse/core'
import User from '@/types/user'
import RequestState from '@/types/request'
import { updateUser, changeUserPassword } from '@/api/users'
import { Fetch } from '@/utils/state'

/**
 * Local Types
 */
type User = Pick<
  User.Bio,
  'id' | 'first_name' | 'last_name' | 'email' | 'phone_number'
> &
  Pick<User.Account, 'username'>

export type HandleAccountUpdate = (
  user: User,
) => Promise<RequestState.Success | RequestState.Error>

export type ChangeUserPasswordPayload = {
  password: string
  password_current: string
  password_confirmation: string
}

export type HandleAccountPasswordChange = (
  payload: ChangeUserPasswordPayload,
) => Promise<RequestState.Success | RequestState.Error>

/**
 * Local mixins
 */
export const LEFT_DRAWER_WIDTH = 299
export const LEFT_DRAWER_BREAKPOINT = 1023

const appStore = useAppStore()
const { width } = useWindowSize()

export const leftDrawerWidth = computed(() => {
  return appStore.leftDrawerIsShown ? LEFT_DRAWER_WIDTH : 0
})

export const pageContainerWidth = computed(
  () => width.value - leftDrawerWidth.value,
)

/**
 * Handles user account update
 *
 * @params user user bio and account object
 * @returns normalized success or error state
 */
export const handleAccountUpdate: HandleAccountUpdate = async (user) => {
  return await Fetch(
    updateUser,
    { id: user.id, data: { ...user } },
    'User Updated',
  )
}

/**
 * Handles user password change for logged-in users.
 *
 * @param payload - user's current and newly entered password,
 * including the password confirmation.
 * @returns normalized success or error state
 */
export const handleAccountPasswordChange: HandleAccountPasswordChange = async (
  payload: ChangeUserPasswordPayload,
) => {
  return await Fetch(changeUserPassword, payload, 'Password Updated')
}
