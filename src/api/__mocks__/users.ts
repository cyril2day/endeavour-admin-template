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
