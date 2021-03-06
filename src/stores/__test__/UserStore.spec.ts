import { Cookies } from 'quasar/dist/quasar.esm.prod'
import useUserStore from '../user'
import { StoreBeforeEach } from './storeTestHelpers'
import { login } from '@/api/users'

vi.mock('@/api/users')
vi.spyOn(Cookies, 'remove')

StoreBeforeEach()

const credentials = {
  username: 'admin',
  password: 'password12345',
}

const userStore = useUserStore()

describe('User Store Unit Test', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('Login Action', async () => {
    expect.assertions(4)
    const result = await userStore.Login(credentials)

    expect(login).toHaveBeenCalledTimes(1)
    expect(login).toHaveBeenCalledWith(credentials)
    expect(result).toEqual({
      state: 'ok',
      message: 'User Login Success',
      data: { token: 'token', mfa_verified: false },
    })
    expect(userStore.token).toBe('token')
  })

  test('GetUserInfo Action', async () => {
    expect.assertions(2)
    await userStore.Login(credentials)
    await userStore.GetUserInfo()

    const expected = {
      token: 'token',
      id: 17,
      username: 'admin',
      first_name: 'John',
      last_name: 'Weak',
      email: 'admin@email.com',
      phone_number: '9072954081',
      authy_verified: 1,
      default_auth_factor: 'sms',
      roles: [{ slug: 'administrator', name: 'Administrator', id: 1 }],
    }

    expect(login).toHaveBeenCalledTimes(1)
    expect(userStore.$state).toEqual(expected)
  })

  test('ResetToken Action', async () => {
    expect.assertions(3)

    await userStore.Login(credentials)

    expect(login).toHaveBeenCalledTimes(1)
    expect(userStore.token).toBe('token')

    userStore.ResetToken()
    expect(userStore.token).toBe('')
  })

  test('SetToken Action', () => {
    expect.assertions(1)
    userStore.SetToken('newToken')

    expect(userStore.token).toBe('newToken')
  })
})
