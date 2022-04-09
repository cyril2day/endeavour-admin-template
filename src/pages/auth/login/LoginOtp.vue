<script setup lang="ts">
import { validateCode } from '@/api/users'
import useUserStore from '@/stores/user'
import { getToken, removeToken, setToken, Token } from '@/utils/storage'
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
    setToken(Token.access, data.token)
    userStore.SetToken(data.token)

    router.push('/')
  } catch (error) {
    if (error instanceof Error) feedback.value = error.message

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

onBeforeMount(() => {
  /**
   * Do not render the OTP form unless token
   * prop is passed a value. Falls back to
   * the login page.
   */
  if (!props.token) {
    router.push('/login')
  } else {
    // hydrate modified token from mfa props
    userStore.SetToken(props.token ?? `${getToken()}`)
  }
})
</script>

<template>
  <q-card
    v-if="props.token"
    class="otp__card q-mx-lg q-my-lg q-px-lg q-py-lg"
    flat
    bordered
  >
    <q-card-section>
      <q-form class="otp__form" @submit.prevent="submit">
        <q-input
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
      <div
        :visibility="feedback ? 'visible' : 'none'"
        class="otp__feedback text-caption text-weight-light"
      >
        <q-icon v-show="feedback" name="warning_amber" class="q-pr-md" />
        {{ feedback }}
      </div>
      <q-btn
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
        <router-link to="/login" class="text-dark" @click="backToLogin"
          >Login as different user?</router-link
        >
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
