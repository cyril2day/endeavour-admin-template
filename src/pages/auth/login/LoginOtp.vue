<script setup lang="ts">
import { getUserInfo, validateCode } from '@/api/users'
import useUserStore from '@/stores/user'
import { removeToken, setToken, Token } from '@/utils/storage'
import { useRouter } from 'vue-router'

/**
 * OTP form stricly requires the token
 * to be passed via the vue router.
 */

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
})

/**
 * The router and user store intances
 */

const router = useRouter()
const userStore = useUserStore()
const isAuthenticated = ref(false)

/**
 * For two-way attribute binding on
 * form input elements.
 */

const submitBtnLoading = ref(false)
const otp = ref('')
const feedback = ref('')

/**
 * Validate the otp form. `login` token is
 * then replaced with the actual `access`
 * token on success.
 */

const submit = async () => {
  submitBtnLoading.value = true

  try {
    const { data } = await validateCode({ code: otp.value })

    removeToken(Token.login)
    setToken(Token.access, data.data.token)
    userStore.SetToken(data.data.token)

    router.push('/')
    /* eslint-disable-next-line */
  } catch (error: any) {
    if (
      typeof error === 'object' &&
      !Array.isArray(error) &&
      'message' in error
    )
      feedback.value = error.message

    feedback.value = 'Could not validate otp.'
  } finally {
    /**
     * Enable submit after requests are handled
     */
    submitBtnLoading.value = false
  }
}

/**
 * Back to login page. Removes login token.
 */

const backToLogin = () => {
  removeToken(Token.login)
  userStore.ResetToken()
  router.push('/login')
}

/**
 * Clears the form feedback paragraph.
 */

const clearFeedback = () => {
  feedback.value = ''
}

/**
 * Lifecycle Hooks:
 * https://vuejs.org/guide/essentials/lifecycle.html
 */

onBeforeMount(async () => {
  /**
   * Do not render the OTP form unless token
   * prop is passed a value. Falls back to
   * the login page.
   */
  if (!props.token) {
    router.push('/login')
  } else {
    // hydrate modified token from mfa props
    try {
      await getUserInfo().then(() => {
        isAuthenticated.value = true
        userStore.SetToken(props.token)
      })
    } catch (err) {
      backToLogin()
    }
  }
})
</script>

<template>
  <q-card
    v-if="isAuthenticated"
    class="otp__card q-mx-lg q-my-lg q-px-lg q-py-lg"
    flat
    bordered
  >
    <q-card-section>
      <q-form ref="otpForm" class="otp__form" @submit.prevent="submit">
        <q-input
          ref="otpInput"
          v-model="otp"
          label="Enter OTP Code"
          lazy-rules
          @update:model-value="clearFeedback"
          autofocus
        >
          <template #prepend>
            <q-icon name="pin" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>
    <q-card-actions class="otp__actions">
      <div v-if="feedback" class="otp__feedback text-caption text-weight-light">
        <q-icon v-show="feedback" name="warning_amber" class="q-pr-md" />
        {{ feedback }}
      </div>
      <q-btn
        ref="otpSubmit"
        label="Proceed"
        type="submit"
        color="blue-grey-7"
        class="otp__actions--submit q-mx-lg q-my-md"
        :loading="submitBtnLoading"
        :disable="submitBtnLoading"
        icon-right="arrow_right_alt"
        @click="submit"
      />

      <div class="otp__change-user">
        <p class="otp__back-to-login text-dark" @click="backToLogin">
          Login as different user?
        </p>
      </div>
    </q-card-actions>
  </q-card>
</template>

<style lang="scss" scoped>
@import '@/css/quasar.variables.scss';

.otp__card {
  max-width: 580px;
  margin: 160px auto;
}

.otp__actions--submit {
  width: 100%;
}

.otp__feedback {
  height: 1rem;
  width: 100%;
  color: $loginWarning;
  margin-top: 10px;
  clear: both;
}

.otp__back-to-login {
  cursor: pointer;
}

.otp__change-user {
  margin-top: 20px;
  a {
    text-decoration: none;

    &:hover {
      color: $primary !important;
    }
  }
}
</style>
