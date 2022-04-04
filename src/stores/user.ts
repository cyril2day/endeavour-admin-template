import { getUserInfo, login } from '@/api/users'
import { removeToken, setToken, Token } from '@/utils/storage'
import { defineStore } from 'pinia'
import pinia from '@/stores/index'
import User from '@/types/user'

/**
 * Parameter types for user login
 *
 */

type ParamLogin = Pick<User.Account, 'username' | 'password'>

type UserToken = {
  token: string
}

/**
 * The user store state types
 *
 */
type UserStoreState = UserToken &
  Pick<User.Bio, 'id' | 'first_name' | 'last_name' | 'email' | 'phone_number'> &
  Pick<User.Account, 'username' | 'authy_verified' | 'default_auth_factor'> &
  User.Permission

/**
 * The user store state properties
 *
 */

const state: UserStoreState = {
  token: '',
  id: 0,
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  authy_verified: 0,
  default_auth_factor: 'sms',
  roles: [],
}

/**
 * Performs login POST request to the server. If user is
 * authenticated and has MFA enabled, sets token type to
 * `access_token`, otherwise it'll be `login_token`.
 *
 * @param params object containing username and password.
 * @returns response or error data
 */

const Login = async (params: ParamLogin) => {
  const { username, password } = params
  const result = await login({ username, password })
    .then((response) => {
      const token = response.data.data.token

      // determine type of token to set
      if (response.data.data.verify) {
        // set token type to type `login` if user
        // is mfa verifed
        setToken(Token.login, token)
      } else {
        // set to type `access` otherwise
        setToken(Token.access, token)
      }

      // set store token
      store.token = token

      return response
    })
    .catch((err) => err)

  return result
}

/**
 * Queries user info and saves it to the store.
 *
 */

const GetUserInfo = async () => {
  // check if token in user store already has value
  if (!store.token) throw Error('GetUserInfo: token is undefined!')

  const { data } = await getUserInfo()
  const {
    id,
    username,
    first_name,
    last_name,
    email,
    phone_number,
    authy_verified,
    default_auth_factor,
    roles,
  } = data.data
  /* eslint-disable-next-line */

  if (!roles) throw Error('GetUserInfo: roles must be a non-null array!')

  store.id = id
  store.username = username
  store.first_name = first_name
  store.last_name = last_name
  store.email = email
  store.roles = roles
  store.phone_number = phone_number
  store.authy_verified = authy_verified
  store.default_auth_factor = default_auth_factor
}

/**
 * Remove token from device storage, and clear state
 * token and roles.
 */

const ResetToken = () => {
  store.token = ''
  store.roles = []
  removeToken(Token.access)
}

const SetToken = (token: string) => {
  store.token = token
}

/**
 * Define a store instance for the app users.
 */

const useUserStore = defineStore('user', {
  state: () => state,
  actions: { Login, GetUserInfo, ResetToken, SetToken },
})

/**
 * Hoist this variable for local use.
 */

const store = useUserStore(await pinia({}))

/**
 * Export for global use
 */

export default useUserStore
