import User from '@/types/user'

export as namespace RequestState

/**
 * User info request success data without
 * the password, last_login field
 */

type UserData = User.Bio &
  Omit<User.Account, 'password' | 'last_login'> &
  User.Permission

/**
 * For use in Roles list.
 * TODO: refine this
 */

type RoleData = {
  id: number
}

/**
 * User store login request success data
 */
type LoginData = {
  mfa_verified: boolean
  otp_sent_to: string
  token: string
  verify: boolean
}

/**
 * Union of possible request success data
 */

type RequestSuccessData = UserData | RoleData | LoginData

/**
 * Request error data is dynamic, depends on erring fields
 */

type RequestErrorData = {
  [field: string]: string[]
}

declare namespace RequestState {
  interface Success {
    state: 'ok'
    message: string
    data: RequestSuccessData
  }

  interface Error {
    state: 'error'
    message: string
    data?: RequestErrorData
  }
}

export = RequestState
