import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { mergeWith } from 'lodash'
import { installQuasarPlugin, TestMountingOptions } from 'app/vitest/test-hooks'
import UserCreate from '../UserCreate.vue'
import { Notify } from 'quasar/dist/quasar.esm.prod'
import * as request from '@/api/users'
import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from '@/router/routes'

installQuasarPlugin({
  plugins: {
    Notify: Notify,
  },
})

vi.mock('@/api/users')

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

const createWrapper = (overrides?: TestMountingOptions) => {
  const defaultMountingOptions: TestMountingOptions = {
    global: {
      plugins: [router],
      stubs: ['router-link', 'vue-router'],
    },
  }

  return mount(UserCreate, mergeWith(defaultMountingOptions, overrides))
}

describe('User Create Test', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('form input elements have rules props', async () => {
    expect.assertions(5)
    await flushPromises()

    const firstName = wrapper.findComponent({ ref: 'firstNameInput' })
    const lastName = wrapper.findComponent({ ref: 'lastNameInput' })
    const email = wrapper.findComponent({ ref: 'emailInput' })
    const username = wrapper.findComponent({ ref: 'usernameInput' })
    const password = wrapper.findComponent({ ref: 'passwordInput' })

    expect(firstName.props().rules).toHaveLength(2)
    expect(lastName.props().rules).toHaveLength(2)
    expect(email.props().rules).toHaveLength(2)
    expect(username.props().rules).toHaveLength(2)
    expect(password.props().rules).toHaveLength(2)
  })

  test('submit and clear buttons are shown on user create', () => {
    expect.assertions(3)
    const submit = wrapper.findComponent({ ref: 'submitBtn' })
    const clear = wrapper.findComponent({ ref: 'clearBtn' })

    expect(submit.exists()).toBe(true)
    expect(submit.props().label).toBe('Submit')
    expect(clear.exists()).toBe(true)
  })

  test('password field is shown if creating user', () => {
    expect.assertions(1)
    const password = wrapper.findComponent({ ref: 'passwordInput' })

    expect(password.exists()).toBe(true)
  })

  test('password visibility can be toggled', async () => {
    expect.assertions(3)
    const password = wrapper.findComponent({ ref: 'passwordInput' })
    const showPwdToggle = wrapper.findComponent({ ref: 'showPwdToggle' })

    expect(showPwdToggle.exists()).toBe(true)

    await password.setValue('password12345')
    expect(password.props().type).toBe('password')

    await showPwdToggle.trigger('click')
    expect(password.props().type).toBe('text')
  })

  test('submit works correctly', async () => {
    expect.assertions(4)

    await nextTick()

    const notify = vi.spyOn(wrapper.vm.q, 'notify')

    const firstName = wrapper.findComponent({ ref: 'firstNameInput' })
    const lastName = wrapper.findComponent({ ref: 'lastNameInput' })
    const email = wrapper.findComponent({ ref: 'emailInput' })
    const username = wrapper.findComponent({ ref: 'usernameInput' })
    const password = wrapper.findComponent({ ref: 'passwordInput' })
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    const expected = {
      first_name: 'John',
      last_name: 'Weak',
      email: 'lebron@gmail.com',
      username: 'lebrongoat',
      password: 'password12345',
    }

    const expectedNotif = {
      color: 'secondary',
      textColor: 'white',
      message: 'User Created',
      position: 'top',
      timeout: 2500,
      icon: 'check',
    }

    await firstName.setValue(expected.first_name)
    await lastName.setValue(expected.last_name)
    await email.setValue(expected.email)
    await username.setValue(expected.username)
    await password.setValue(expected.password)

    await submit.trigger('click')

    await flushPromises()

    expect(request.createUser).toHaveBeenCalledTimes(1)
    expect(request.createUser).toHaveBeenCalledWith(expected)
    expect(notify).toHaveBeenCalledTimes(1)
    expect(notify).toHaveBeenCalledWith(expectedNotif)
  })

  test('form does not submit data if not properly validated', async () => {
    expect.assertions(1)

    const form = wrapper.findComponent({ ref: 'userForm' })
    const formValidated = await form.vm.validate()
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    await submit.trigger('click')

    expect(formValidated).toBe(false)
  })

  test('backend validation takes place if submitted data has errors', async () => {
    expect.assertions(2)

    await nextTick()

    const firstName = wrapper.findComponent({ ref: 'firstNameInput' })
    const lastName = wrapper.findComponent({ ref: 'lastNameInput' })
    const email = wrapper.findComponent({ ref: 'emailInput' })
    const username = wrapper.findComponent({ ref: 'usernameInput' })
    const password = wrapper.findComponent({ ref: 'passwordInput' })
    const submit = wrapper.findComponent({ ref: 'submitBtn' })

    const response = {
      data: {
        state: 'error',
        message: 'Data validation failed',
        data: {
          email: ['The email has already been taken.'],
        },
      },
    } as any
    vi.spyOn(request, 'createUser').mockRejectedValueOnce(response)

    const user = {
      first_name: 'Dong',
      last_name: 'Bringer',
      email: 'lebron@gmail.com',
      username: 'dongbringer',
      password: 'password12345',
    }

    const notify = vi.spyOn(wrapper.vm.q, 'notify')
    const expectedNotif = {
      color: 'negative',
      textColor: 'white',
      message: 'Data validation failed',
      position: 'top',
      timeout: 2500,
      icon: 'error_outline',
    }

    await firstName.setValue(user.first_name)
    await lastName.setValue(user.last_name)
    await email.setValue(user.email)
    await username.setValue(user.username)
    await password.setValue(user.password)

    await submit.trigger('click')

    await flushPromises()

    expect(request.createUser).toHaveBeenCalledTimes(1)
    expect(notify).toHaveBeenCalledWith(expectedNotif)
  })
})

describe('User Edit Test', () => {
  let wrapper: VueWrapper<any>
  const userId = '1'

  beforeEach(() => {
    wrapper = createWrapper({
      props: {
        userId: userId,
      },
    })
  })

  afterEach(() => {
    if (wrapper) wrapper.unmount()

    vi.clearAllMocks()
    vi.resetModules()
  })

  test('Update button is shown while Clear button is not visible', async () => {
    expect.assertions(2)
    const submit = wrapper.findComponent({ ref: 'submitBtn' })
    const clear = wrapper.findComponent({ ref: 'clearBtn' })

    expect(submit.props().label).toBe('Update')
    expect(clear.exists()).toBe(false)
  })

  test('Gets user data when userId props is provided', async () => {
    expect.assertions(3)

    await flushPromises()

    expect(wrapper.props().userId).toBe(userId)
    expect(request.getUserById).toHaveBeenCalledTimes(1)
    expect(request.getUserById).toHaveBeenCalledWith(userId)
  })

  test('redirects to the user create page if userId is non-existent', async () => {
    expect.assertions(5)
    vi.spyOn(router, 'push')
    const nonExistentId = '99'
    const wrapper = createWrapper({
      props: {
        userId: nonExistentId,
      },
    })
    const getUserByIdSpy = vi.spyOn(request, 'getUserById')
    const { push } = router

    await flushPromises()

    expect(wrapper.props().userId).toBe(nonExistentId)
    expect(request.getUserById).toHaveBeenCalledWith(nonExistentId)
    expect(getUserByIdSpy).rejects.toThrowError()
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/user/create')
  })

  test('update user', async () => {
    expect.assertions(3)
    const submitSpy = vi.spyOn(request, 'updateUser')

    await flushPromises()

    const email = wrapper.findComponent({ ref: 'emailInput' })
    expect(email.props().modelValue).toBe('KirkWyman@deckow.com')

    await email.setValue('kirk@test.com')
    expect(email.props().modelValue).toBe('kirk@test.com')

    const submit = wrapper.findComponent({ ref: 'submitBtn' })
    await submit.trigger('click')
    await flushPromises()

    expect(submitSpy).toHaveBeenCalledTimes(1)
  })
})
