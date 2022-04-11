export const loginResponseOK = {
  data: {
    error: false,
    data: {
      token: 'token',
      mfa_verified: false,
    },
  },
}

export const login = vi.fn(() => Promise.resolve(loginResponseOK))

// Get user info
export const getUserInfoResponseOK = {
  data: {
    error: false,
    data: {
      authy_enabled: 1,
      authy_verified: 1,
      default_auth_factor: 'sms',
      country_code: '63',
      created_at: '2021-09-22T03:55:40.000000Z',
      email: 'admin@email.com',
      first_name: 'John',
      google2fa_secret: null,
      id: 17,
      last_login: null,
      last_name: 'Weak',
      permissions: null,
      phone_number: '9072954081',
      roles: [{ id: 1, slug: 'administrator', name: 'Administrator' }],
      updated_at: '2021-09-22T12:51:48.000000Z',
      username: 'admin',
      uuid: 'some-uuid',
    },
    notification: 0,
  },
}

export const getUserInfo = vi.fn(() => Promise.resolve(getUserInfoResponseOK))
