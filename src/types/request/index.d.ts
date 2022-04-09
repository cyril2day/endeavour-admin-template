import User from '@/types/user'

export as namespace Request

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

type RoleData = unknown

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

declare namespace Request {
  interface Success {
    state: 'ok'
    data: RequestSuccessData
    message: string
  }

  interface Error {
    state: 'error'
    data: RequestErrorData
    message: string
  }
}

export = Request
