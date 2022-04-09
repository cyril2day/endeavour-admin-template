import useUserStore from '@/stores/user'
import { mount, MountingOptions } from '@vue/test-utils'
import { mergeWith } from 'lodash'
import LoginIndex from '../LoginIndex.vue'
import { installQuasarPlugin, matchMediaMock } from 'app/vitest/test-hooks'
import { createTestingPinia } from '@pinia/testing'

installQuasarPlugin()

const userStore = useUserStore()
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const pinia = createTestingPinia()

type TestMountingOptions = MountingOptions<unknown>

const createWrapper = (overrides?: TestMountingOptions) => {
  const defaultMountingOptions: TestMountingOptions = {
    global: {
      plugins: [pinia],
      provide: [userStore],
      stubs: ['vue-router', 'pinia', 'router-link'],
    },
  }

  return mount(LoginIndex, mergeWith(defaultMountingOptions, overrides))
}

describe('Test Login Index', () => {
  beforeAll(() => {
    matchMediaMock()
  })

  test('sanity check', async () => {
    const wrapper = createWrapper()
    const username = wrapper.findComponent({ ref: 'loginUsername' })

    await username.setValue('admin')
    console.log(pinia.state.value)

    expect(username.props().modelValue).toBe('admin')
  })
})
