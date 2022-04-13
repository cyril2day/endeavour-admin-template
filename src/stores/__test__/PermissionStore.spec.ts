import usePermissionStore from '../permission'
import { StoreBeforeEach, expectedAdminRoutes } from './storeTestHelpers'

StoreBeforeEach()

const permissionStore = usePermissionStore()

const hasAdminRoutes = () => {
  return permissionStore.routes.some((route) => {
    return expectedAdminRoutes.find((e) => e.name === route.name)
  })
}

describe('Permission Store Unit Test', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('Generates routes for admin users', () => {
    const roles = [{ id: 1, slug: 'administrator', name: 'Administrator' }]

    permissionStore.GenerateRoutes(roles)

    expect(hasAdminRoutes()).toBe(true)
    expect(permissionStore.dynamicRoutes.length).toBe(3)
  })

  test('Non-admin users cannot access admin routes', () => {
    const roles = [{ id: 2, slug: 'subscriber', name: 'Subscriber' }]

    permissionStore.GenerateRoutes(roles)

    expect(hasAdminRoutes()).toBe(false)
    expect(permissionStore.dynamicRoutes.length).toBe(1)
  })
})
