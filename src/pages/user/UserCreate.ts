import User from '@/types/user'
import { createUser, updateUser } from '@/api/users'
import { isValidEmail } from '@/utils/validate'
import RequestState from '@/types/request'
import { Fetch } from '@/utils/state'
import { ValidationRule } from 'quasar'

/**
 * Local types
 */

type User = Pick<User.Bio, 'first_name' | 'last_name' | 'email'> &
  Pick<User.Account, 'username'> &
  Partial<Pick<User.Account, 'password'>>

type HandleSubmit = (
  user: User,
  userId?: string
) => Promise<RequestState.Success | RequestState.Error>

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

/* c8 ignore start */
export const firstNameRules: ValidationRule[] = [
  (val: string) => !!val || 'First name is required',
  (val: string) => val.length >= 2 || 'Name is too short',
]

export const lastNameRules: ValidationRule[] = [
  (val: string) => !!val || 'Last name is required',
  (val: string) => val.length >= 2 || 'Name is too short',
]

export const emailRules: ValidationRule[] = [
  (val: string) => !!val || 'Email is required',
  (val: string) => isValidEmail(val) || 'Please enter a valid email address',
]

export const usernameRules: ValidationRule[] = [
  (val: string) => !!val || 'Username is required',
  (val: string) => val.length >= 5 || 'Username must be atleast 6 characters',
]

export const passwordRules: ValidationRule[] = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 6 || 'Password must be atleast 6 characters',
]
/* c8 ignore stop */

export const handleSubmit: HandleSubmit = async (user, userId) => {
  if (userId) {
    return await Fetch(
      updateUser,
      { id: userId, data: user },
      'User Update Success'
    )
  } else {
    return await Fetch(createUser, user, 'User Created')
  }
}
