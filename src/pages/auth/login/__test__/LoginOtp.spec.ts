import useUserStore from '@/stores/user'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { installQuasarPlugin, TestMountingOptions } from 'app/vitest/test-hooks'
import { mergeWith } from 'lodash'
import LoginOtp from '../LoginOtp.vue'
import { useRouter } from 'vue-router'
import { validateCode } from '@/api/users'

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

  test('shows the OTP form when token is properly set', async () => {
    expect.assertions(3)
    const wrapper = createWrapper({
      props: {
        token: 'token',
      },
    })
    const form = wrapper.findComponent({ ref: 'otpForm' })
    const input = wrapper.findComponent({ ref: 'otpInput' })
    const submit = wrapper.findComponent({ ref: 'otpSubmit' })

    expect(form.exists()).toBe(true)
    expect(input.exists()).toBe(true)
    expect(submit.exists()).toBe(true)
  })

  test('submit', async () => {
    const wrapper = createWrapper({
      props: {
        token: 'token',
      },
    })
    const input = wrapper.findComponent({ ref: 'otpInput' })
    const submit = wrapper.findComponent({ ref: 'otpSubmit' })
    const otpCode = '123456' // code must be 6 characters

    await input.setValue(otpCode)
    expect(input.props().modelValue).toBe(otpCode)

    await submit.trigger('click')
    expect(validateCode).toHaveBeenCalledOnce()
    expect(validateCode).toHaveBeenCalledWith({ code: otpCode })
  })
})
