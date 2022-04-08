import User from '@/types/user'

export as namespace Request

type UserData = User.Bio &
  Omit<User.Account, 'password' | 'last_login'> &
  User.Permission

type RoleData = Object

export type LoginData = {
  mfa_verified: boolean
  otp_sent_to: string
  token: string
  verify: boolean
}

type RequestSuccessData = UserData | RoleData | LoginData

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
