import useUserStore from '@/stores/user'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'
import { installQuasarPlugin, TestMountingOptions } from 'app/vitest/test-hooks'
import { mergeWith } from 'lodash'
import LoginOtp from '../LoginOtp.vue'
import { useRouter } from 'vue-router'
import * as usersApi from '@/api/users'
import * as storage from '@/utils/storage'

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

  return mount(LoginOtp, mergeWith(defaultMountingOptions, overrides))
}

describe('Login OTP Component Test', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('redirects to login page if token is not set or undefined', () => {
    expect.assertions(3)
    vi.spyOn(console, 'warn').mockImplementationOnce(() => null)
    const wrapper = createWrapper()
    const router = useRouter()

    expect(wrapper.props().token).toBe(undefined)
    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith('/login')
  })

  test('backend checks if token is valid on before otp page is shown', async () => {
    expect.assertions(3)
    vi.spyOn(userStore, 'SetToken')
    const wrapper = createWrapper({ props: { token: 'token' } })

    await flushPromises()

    expect(wrapper.props().token).toBe('token')
    expect(usersApi.getUserInfo).toHaveBeenCalledTimes(1)
    expect(userStore.SetToken).toHaveBeenCalledTimes(1)
  })

  test('returns to login if token is invalid after verified in the backend, before page is shown', async () => {
    expect.assertions(2)
    const rejectResponse = () => Promise.reject()
    vi.spyOn(usersApi, 'getUserInfo').mockImplementationOnce(rejectResponse)

    const router = useRouter()
    createWrapper({ props: { token: 'token' } })

    await flushPromises()

    expect(router.push).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith('/login')
  })

  test('shows the OTP form when token is properly set', async () => {
    expect.assertions(3)
    const wrapper = createWrapper({ props: { token: 'token' } })

    await flushPromises()

    const form = wrapper.findComponent({ ref: 'otpForm' })
    const input = wrapper.findComponent({ ref: 'otpInput' })
    const submit = wrapper.findComponent({ ref: 'otpSubmit' })

    expect(form.exists()).toBe(true)
    expect(input.exists()).toBe(true)
    expect(submit.exists()).toBe(true)
  })

  test('back to login clears all stored token then returns to login page', async () => {
    vi.spyOn(userStore, 'ResetToken')
    vi.spyOn(storage, 'removeToken')
    const wrapper = createWrapper({ props: { token: 'token' } })

    await flushPromises()

    const backToLogin = wrapper.find('p.otp__back-to-login')
    expect(backToLogin.exists()).toBe(true)

    await backToLogin.trigger('click')
    expect(userStore.ResetToken).toHaveBeenCalledTimes(1)
    expect(storage.removeToken).toHaveBeenCalledTimes(1)
    expect(storage.removeToken).toHaveBeenCalledWith('login_token')
  })

  test('submit', async () => {
    const wrapper = createWrapper({ props: { token: 'token' } })

    await flushPromises()

    const input = wrapper.findComponent({ ref: 'otpInput' })
    const submit = wrapper.findComponent({ ref: 'otpSubmit' })
    const otpCode = '123456' // code must be 6 characters

    await input.setValue(otpCode)
    expect(input.props().modelValue).toBe(otpCode)

    await submit.trigger('click')
    expect(usersApi.validateCode).toHaveBeenCalledOnce()
    expect(usersApi.validateCode).toHaveBeenCalledWith({ code: otpCode })
  })

  test('shows error message if unable to validate otp code', async () => {
    const wrapper = createWrapper({ props: { token: 'token' } })

    await flushPromises()

    const input = wrapper.findComponent({ ref: 'otpInput' })
    const submit = wrapper.findComponent({ ref: 'otpSubmit' })
    const otpCode = '123457' // wrong otp code

    await input.setValue(otpCode)
    await submit.trigger('click')

    await flushPromises()

    const feedback = wrapper.find('.otp__feedback')

    expect(feedback.html()).toContain('Could not validate otp')
  })
})
