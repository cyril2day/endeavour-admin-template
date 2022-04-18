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

// OTP Verify
export const verifyCodeResponseOK = {
  data: {
    error: false,
    data: {
      message: 'valid token',
      token: 'token2',
    },
    notification: 0,
  },
}

export const validateCode = vi.fn((request) => {
  if (request.code === '123456') {
    return Promise.resolve(verifyCodeResponseOK)
  } else {
    return Promise.reject({
      state: 'error',
      message: 'Invalid Token',
      data: [],
    })
  }
})

const createUserResponseOK = {
  error: false,
  data: {
    id: 22,
  },
  notification: 0,
}

export const createUser = vi.fn(() => Promise.resolve(createUserResponseOK))

export const getUserByIdResponseOK = {
  data: {
    error: false,
    data: {
      data: {
        id: 1,
        uuid: '6977c669-c202-4165-a465-645bc5d00659',
        slug: null,
        email: 'KirkWyman@deckow.com',
        role: ['administrator'],
        username: 'admin',
        permissions: null,
        first_name: 'John',
        last_name: 'Weak',
        created_at: 'Nov 24, 2021',
        updated_at: 'Nov 24, 2021',
      },
    },
    notification: 0,
  },
}

export const getUserById = vi.fn((a) => {
  if (a === '1') return Promise.resolve(getUserByIdResponseOK)
  else return Promise.reject('error')
})

/* UPDATE USER
 *
 */
export const updateUserResponseOK = {
  error: false,
  data: {
    authy_enabled: 1,
    authy_verified: 1,
    country_code: '63',
    created_at: '2021-09-22T03:55:40.000000Z',
    email: 'kirk@test.com',
    first_name: 'John',
    google2fa_secret: null,
    id: 17,
    last_login: null,
    last_name: 'Weak',
    permissions: null,
    phone_number: '9072954081',
    roles: [{ slug: 'administrator', name: 'Administrator' }],
    updated_at: '2021-09-22T12:51:48.000000Z',
    username: 'admin',
    uuid: 'some-uuid',
  },
  notification: 0,
}

export const updateUser = vi.fn(() => Promise.resolve(updateUserResponseOK))
