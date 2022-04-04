import User from '@/types/user'

export as namespace Request

type UserData = User.Bio &
  Omit<User.Account, 'password' | 'last_login'> &
  User.Permission

type RoleData = Object

type RequestSuccessData = UserData | RoleData

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
