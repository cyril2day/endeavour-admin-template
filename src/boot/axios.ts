import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import useUserStore from '@/stores/user'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.SERVER_BASEURL })

/* c8 ignore start */
// Request interceptors
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // Add X-Access-Token header to every request, you can add other custom headers here
    const userToken = userStore.token
    if (userToken && config.headers)
      config.headers.Authorization = `Bearer ${userToken}`

    return config
  },
  (error) => Promise.reject(error)
)
// Response Interceptors
api.interceptors.response.use(
  (response) => {
    if (response.data) return response

    return Promise.reject(response)
  },
  (error) => Promise.reject(error.response)
)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})
/* c8 ignore stop */

export { api }
