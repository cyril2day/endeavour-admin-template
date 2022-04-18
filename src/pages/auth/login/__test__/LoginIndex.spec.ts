import useUserStore from '@/stores/user'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { mergeWith } from 'lodash'
import LoginIndex from '../LoginIndex.vue'
import {
  installQuasarPlugin,
  matchMediaMock,
  TestMountingOptions,
} from 'app/vitest/test-hooks'
import { createTestingPinia } from '@pinia/testing'
import { useRouter } from 'vue-router'
import RequestState from '@/types/request'

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
      stubs: ['vue-router', 'router-link'],
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

  test('showPwd button works correctly', async () => {
    expect.assertions(4)
    const password = wrapper.findComponent({ ref: 'loginPassword' })
    const showPwdBtn = wrapper.findComponent({ ref: 'showPwdBtn' })
    const focusPwd = vi.spyOn(password.find('input').element, 'focus')

    await showPwdBtn.trigger('click')
    // input type is now text, password is shown
    expect(password.props().type).toBe('text')
    // focus on password input
    expect(focusPwd).toHaveBeenCalledTimes(1)

    await showPwdBtn.trigger('click')
    // password is now hidden
    expect(password.props().type).toBe('password')
    // focus on password input
    expect(focusPwd).toHaveBeenCalledTimes(2)
  })

  test('login submit button is present', () => {
    expect.assertions(3)
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    expect(submit.exists()).toBe(true)
    expect(submit.props().label).toBe('Proceed')
    expect(submit.props().iconRight).toBe('arrow_right_alt')
  })

  test('login submit ok on user with mfa enabled', async () => {
    expect.assertions(5)
    const router = useRouter()
    const loginOk = {
      state: 'ok',
      message: 'User Login Success',
      data: { token: 'token', verify: true }, // user has mfa enabled
    } as RequestState.Success
    const login = vi.spyOn(userStore, 'Login').mockResolvedValue(loginOk)
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    await submit.trigger('click')

    expect(submit.props().loading).toBe(true) // disable button on click
    expect(login).toHaveBeenCalledTimes(1) // call login api request
    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith({
      name: 'Checkpoint',
      params: { token: 'token' },
    })

    // submit button is enabled after successful login call
    await nextTick()
    expect(submit.props().loading).toBe(false)
  })

  test('login submit ok on user without mfa enabled', async () => {
    const router = useRouter()
    const loginOk = {
      state: 'ok',
      message: 'User Login Success',
      data: { token: 'token', verify: false }, // user has no mfa enabled
    } as RequestState.Success
    const login = vi.spyOn(userStore, 'Login').mockResolvedValue(loginOk)
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    await submit.trigger('click')
    expect(submit.props().loading).toBe(true) // disable button on click
    expect(login).toHaveBeenCalledTimes(1) // call login api request
    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith('/')

    // submit button is enabled after successful login call
    await nextTick()
    expect(submit.props().loading).toBe(false)
  })

  test('failed login displays error feedbacks', async () => {
    expect.assertions(3)
    const loginFail = {
      state: 'error',
      message: 'Username or Password is Incorrect',
    } as RequestState.Error
    const login = vi.spyOn(userStore, 'Login').mockResolvedValue(loginFail)
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    await submit.trigger('click')
    await flushPromises()

    const feedback = wrapper.find('.login__feedback')

    expect(login).toHaveBeenCalledTimes(1) // call login api request
    expect(feedback.html()).toContain('Username or Password is Incorrect')

    // submit button is enabled after the login call
    await nextTick()
    expect(submit.props().loading).toBe(false)
  })

  test('redirects to the MFA page if login token is set in the device storage (Cookies)', async () => {
    document.cookie = 'login_token=token'
    createWrapper()
    await nextTick()
    const router = useRouter()

    expect(router.push).toHaveBeenCalledTimes(1)
  })

  /*
  test(
    'redirects to the MFA page if login token is set in the device storage (LocalStorage)',
    async() => {
      window.localStorage.setItem('login_token', 'token')
      createWrapper()
      await nextTick()
      const router = useRouter()

      expect(router.push).toHaveBeenCalledTimes(1)
    }
  )
  */
})
