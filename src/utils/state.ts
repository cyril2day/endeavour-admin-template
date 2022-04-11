import Request from '@/types/request'
import { AxiosPromise, AxiosResponse } from 'axios'

/**
 * Generic type for a callback fn.
 * @param params - can be any, see `src/api/users` for reference.
 * @returns AxiosPromise
 */

type CallBackFn = <T>(params: T) => AxiosPromise

/**
 * Normalizes success or error state of a
 * requested resource.
 *
 * @param callback - the axios request api for
 * a particular resource.
 * @param params - the callback parameter(s)
 * @param message - custom message to pass on success.
 *
 * @returns the normalized request state
 */

export const GetNormalizedRequestState = async <
  T = Request.Success | Request.Error
>(
  callback: CallBackFn,
  params: unknown,
  message = ''
): Promise<T> => {
  const requestState = {} as T

  try {
    const { data } = await callback(params)
    Object.assign(requestState, {
      state: 'ok',
      message: data.message ?? message,
      data: data.data,
    })
  } catch (error) {
    const { data } = error as AxiosResponse
    Object.assign(requestState, {
      state: 'error',
      message: data.message,
      data: data.data,
    })
  }
  return requestState
}
