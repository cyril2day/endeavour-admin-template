import useAppStore from '@/stores/app'
import { useWindowSize } from '@vueuse/core'
import User from '@/types/user'
import Request from '@/types/request'
import { updateUser, changeUserPassword } from '@/api/users'
import { AxiosResponse } from 'axios'


type User = Pick<User.Bio, 'id' | 'first_name' | 'last_name' | 'email' | 'phone_number'> &
  Pick<User.Account, 'username'>

type HandleAccountUpdate = (
  user: User,
) => Promise<Request.Success | Request.Error>

type ChangeUserPasswordPayload = {
  password: string
  password_current: string
  password_confirmation: string
}

type HandleAccountPasswordChange = (
  payload: ChangeUserPasswordPayload,
) => Promise<Request.Success | Request.Error>

export const LEFT_DRAWER_WIDTH = 299
export const LEFT_DRAWER_BREAKPOINT = 1023

const appStore = useAppStore()
const { width } = useWindowSize()

export const leftDrawerWidth = computed(() => {
  return appStore.leftDrawerIsShown ? LEFT_DRAWER_WIDTH : 0
})

export const pageContainerWidth = computed(
  () => width.value - leftDrawerWidth.value
)

export const handleAccountUpdate: HandleAccountUpdate = async (user) => {
  const requestState = {} as Request.Success | Request.Error

  try {
    const { data } = await updateUser(user.id, { ...user })
    Object.assign(requestState, {
      state: 'ok',
      message: 'User Updated',
      data: data.data,
    })
  } catch(error) {
    const err = error as AxiosResponse
    Object.assign(requestState, {
      state: 'error',
      message: err.data.message,
      data: err.data.data,
    })
  }
  return requestState
}

export const handleAccountPasswordChange: HandleAccountPasswordChange = 
  async (payload: ChangeUserPasswordPayload) => {
    const requestState = {} as Request.Success | Request.Error

    try {
      const { data } = await changeUserPassword(payload)
      Object.assign(requestState, {
        state: 'ok',
        message: 'Password Updated',
        data: data.data,
      })
    } catch(error) {
      const err = error as AxiosResponse
      Object.assign(requestState, {
        state: 'error',
        message: err.data.message,
        data: err.data.data,
      })
    }
    return requestState
}
