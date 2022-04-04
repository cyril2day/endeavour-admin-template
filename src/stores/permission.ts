import { asyncRoutes, constantRoutes } from '@/router/routes'
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router'
import pinia from '@/stores/index'
import User from '@/types/user'

/**
 * TYPES
 */

export interface IRouteRecordNormalized extends RouteRecordNormalized {
  meta: {
    roles?: string[]
  }
}

export interface IPermissionState {
  routes: RouteRecordRaw[]
  dynamicRoutes: RouteRecordRaw[]
}

const hasPermission = (
  roles: User.Permission['roles'],
  route: IRouteRecordNormalized
) => {
  if (route.meta) {
    return roles.some((role) => {
      if (route.meta.roles) {
        return route.meta.roles.includes(role.slug)
      }
    })
  } else {
    return true
  }
}

export const filterAsyncRoutes = (
  routes: RouteRecordRaw[],
  roles: User.Permission['roles']
) => {
  const res: RouteRecordRaw[] = []
  /* eslint-disable-next-line */
  routes.forEach((route: any) => {
    const r = { ...route }
    if (hasPermission(roles, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, roles)
      }
      res.push(r)
    }
  })
  return res
}

/**
 * STATE
 */

const state: IPermissionState = {
  routes: [],
  dynamicRoutes: [],
}

const GenerateRoutes = async (roles: User.Permission['roles']) => {
  /* eslint-disable-next-line */
  let accessedRoutes: any

  roles.forEach((role) => {
    if (role.slug === 'administrator') {
      accessedRoutes = asyncRoutes
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    }
  })

  store.routes = constantRoutes.concat(accessedRoutes)
  store.dynamicRoutes = accessedRoutes
}

/**
 * Define a store instance for the app permissions.
 */

const usePermissionStore = defineStore('permission', {
  state: () => state,
  actions: { GenerateRoutes },
})

/**
 * Hoist this variable for local use.
 */

const store = usePermissionStore(await pinia({}))

/**
 * Export for global use
 */

export default usePermissionStore
