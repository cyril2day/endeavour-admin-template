import User from '@/types/user'
import { createUser, updateUser } from '@/api/users'
import { isValidEmail } from '@/utils/validate'
import Request from '@/types/request'
import { GetNormalizedRequestState } from '@/utils/state'

/**
 * Local types
 */

type User = Pick<User.Bio, 'first_name' | 'last_name' | 'email'> &
  Pick<User.Account, 'username'> &
  Partial<Pick<User.Account, 'password'>>

type HandleSubmit = (
  user: User,
  userId?: string
) => Promise<Request.Success | Request.Error>

/**
 * For use in UserCreate component
 */

export const userDefault: User = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
}

export const firstNameRules = [
  (val: string) => !!val || 'First name is required',
  (val: string) => val.length >= 2 || 'Name is too short',
]

export const lastNameRules = [
  (val: string) => !!val || 'Last name is required',
  (val: string) => val.length >= 2 || 'Name is too short',
]

export const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => isValidEmail(val) || 'Please enter a valid email address',
]

export const usernameRules = [
  (val: string) => !!val || 'Username is required',
  (val: string) => val.length >= 5 || 'Username must be atleast 6 characters',
]

export const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 6 || 'Password must be atleast 6 characters',
]

export const handleSubmit: HandleSubmit = async (user, userId) => {
  if (userId) {
    return await GetNormalizedRequestState(
      updateUser,
      { id: userId, data: user },
      'User Update Success'
    )
  } else {
    return await GetNormalizedRequestState(createUser, user, 'User Created')
  }
}
