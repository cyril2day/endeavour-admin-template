import { setActivePinia, createPinia } from 'pinia'

export const StoreBeforeEach  = () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
}

export const expectedAdminRoutes = [
  { name: 'User'},
  { name: 'Role'},
]
