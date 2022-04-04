import { api as request } from 'boot/axios'

type LoginParams = {
  username: string
  password: string
}

type ValidateCodeParams = {
  code: string
}

type ChangeUserPasswordParams = {
  password: string
  password_current: string
  password_confirmation: string
}

export const login = (params: LoginParams) =>
  request({
    url: '/auth/login',
    method: 'post',
    data: params,
  })

export const getUserInfo = () =>
  request({
    url: '/auth/me',
    method: 'get',
  })

export const validateCode = (params: ValidateCodeParams) =>
  request({
    url: '/auth/mfa/verify',
    method: 'post',
    data: params,
  })

/* eslint-disable-next-line */
export const getUsers = (params: any) =>
  request({
    url: '/user',
    method: 'get',
    params,
  })

export const getUserById = (id: string) =>
  request({
    url: `/user/${id}`,
    method: 'get',
  })

/* eslint-disable-next-line */
export const createUser = (params: any) =>
  request({
    url: '/user',
    method: 'post',
    data: params,
  })

/* eslint-disable-next-line */
export const updateUser = (id: number, params: any) =>
  request({
    url: `/user/${id}`,
    method: 'put',
    data: params,
  })

export const deleteUser = (id: number) =>
  request({
    url: `/user/${id}`,
    method: 'delete',
  })

export const changeUserPassword = (params: ChangeUserPasswordParams) => 
  request({
    url: '/user/change',
    method: 'post',
    params,
  })
