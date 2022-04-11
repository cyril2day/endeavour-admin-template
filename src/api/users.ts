/* eslint-disable */
import { api as request } from 'boot/axios'

export const login = (params: any) =>
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

export const validateCode = (params: any) =>
  request({
    url: '/auth/mfa/verify',
    method: 'post',
    data: params,
  })

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

export const createUser = (params: any) =>
  request({
    url: '/user',
    method: 'post',
    data: params,
  })

export const updateUser = (params: any) =>
  request({
    url: `/user/${params.id}`,
    method: 'put',
    data: params.data,
  })

export const deleteUser = (id: number) =>
  request({
    url: `/user/${id}`,
    method: 'delete',
  })

export const changeUserPassword = (params: any) =>
  request({
    url: '/user/change',
    method: 'post',
    params,
  })
