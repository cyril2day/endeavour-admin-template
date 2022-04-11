import useUserStore from '@/stores/user'
import { mount, VueWrapper } from '@vue/test-utils'
import { mergeWith } from 'lodash'
import LoginIndex from '../LoginIndex.vue'
import {
  installQuasarPlugin,
  matchMediaMock,
  TestMountingOptions,
} from 'app/vitest/test-hooks'
import { createTestingPinia } from '@pinia/testing'

installQuasarPlugin()

vi.mock('@/api/users')

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const pinia = createTestingPinia()
const userStore = useUserStore()

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

const credentials = {
  username: 'admin',
  password: 'password12345',
}

describe('Login Index Component Test', () => {
  // eslint-disable-next-line
  let wrapper: VueWrapper<any>

  beforeAll(() => {
    matchMediaMock()
  })

  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    if (wrapper) wrapper.unmount()

    vi.clearAllMocks()
    vi.resetModules()
  })

  test('login text input elements are present and can be set with values', async () => {
    expect.assertions(4)
    const username = wrapper.findComponent({ ref: 'loginUsername' })
    const password = wrapper.findComponent({ ref: 'loginPassword' })

    expect(username.exists()).toBe(true)
    expect(password.exists()).toBe(true)

    await username.setValue(credentials.username)
    await password.setValue(credentials.password)

    expect(username.props().modelValue).toBe(credentials.username)
    expect(password.props().modelValue).toBe(credentials.password)
  })

  test('login submit button is present', () => {
    expect.assertions(3)
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    expect(submit.exists()).toBe(true)
    expect(submit.props().label).toBe('Proceed')
    expect(submit.props().iconRight).toBe('arrow_right_alt')
  })

  test('login submit', async () => {
    expect.assertions(3)
    const login = vi.spyOn(userStore, 'Login')
    const username = wrapper.findComponent({ ref: 'loginUsername' })
    const password = wrapper.findComponent({ ref: 'loginPassword' })
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    await username.setValue(credentials.username)
    await password.setValue(credentials.password)
    await submit.trigger('click')

    expect(submit.props().loading).toBe(true)
    expect(login).toHaveBeenCalledTimes(1)
    expect(login).toHaveBeenCalledWith(credentials)
  })
})
