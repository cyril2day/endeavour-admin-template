import useUserStore from '@/stores/user'
import { mount, MountingOptions } from '@vue/test-utils'
import { mergeWith } from 'lodash'
import LoginIndex from '../LoginIndex.vue'
import { installQuasarPlugin } from 'app/vitest/install-quasar-plugin'



installQuasarPlugin()

const userStore = useUserStore()
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('pinia', () => ({
  //
}))

type TestMountingOptions = MountingOptions<unknown>

const createWrapper = (overrides?: TestMountingOptions) => {
  const defaultMountingOptions: TestMountingOptions = {
    global: {
      provide: [userStore],
      stubs: ['vue-router', 'pinia', 'router-link'],
    },
  }

  return mount(LoginIndex, mergeWith(defaultMountingOptions, overrides))
}

describe('Test Login Index', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  test('sanity check', async () => {
    const wrapper = createWrapper()
    const username = wrapper.findComponent({ ref: 'loginUsername' })

    await username.setValue('admin')

    expect(username.props().modelValue).toBe('admin')
  })
})
