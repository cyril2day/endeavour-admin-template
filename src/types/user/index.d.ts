export as namespace User

type role = {
  id: number
  name: string
  slug: string
  permissions: {
    [permission: string]: boolean
  }
  pivot?: {
    role_id: number
    user_id: number
    created_at: Date
    updated_at: Date
  }
}

declare namespace User {
  interface Bio {
    id: number
    uuid: string
    first_name: string
    last_name: string
    email: string
    phone_number: string
    date_of_birth?: Date
    created_at: Date
    updated_at: Date
  }

  interface Account {
    username: string
    password: string
    default_auth_factor: 'sms' | 'voice' | 'authenticator' | 'email'
    authy_id: number
    authy_enabled: number
    authy_verified: number
    last_login: Date
  }

  interface Permission {
    roles: role[]
  }
}

export = User
