<script setup lang="ts">
import { getUserById } from '@/api/users'
import { QForm, useQuasar } from 'quasar'
import {
  firstNameRules,
  lastNameRules,
  emailRules,
  usernameRules,
  passwordRules,
  userDefault,
  handleSubmit,
} from './UserCreate'

/**
 * The user id passed as component props
 */

const props = defineProps({
  userId: {
    type: String,
    default: '',
  },
})

/**
 * Define router and quasar instances
 */

const router = useRouter()
const q = useQuasar()

/**
 * Component variables for v-bind directive
 */

const user = ref(userDefault)
const userForm = ref<QForm | null>(null)
const feedbacks = ref<string[]>([])
const isEdit = ref(false)
const showPwd = ref(false)

/**
 * Local methods
 */

const submit = async () => {
  feedbacks.value = []
  const validate = await userForm.value?.validate()

  if (!validate) return

  const result = await handleSubmit(user.value, props.userId)

  if (result.state === 'error') {
    Object.keys(result.data).forEach((key) => {
      feedbacks.value.push(result.data[key][0])
    })
  }

  q.notify({
    color: result.state === 'ok' ? 'secondary' : 'negative',
    textColor: 'white',
    message: result.message,
    icon: result.state === 'ok' ? 'check' : 'error_outline',
    position: 'top',
    timeout: 2500,
  })
}

const reset = () => {
  user.value = { ...userDefault }
  userForm.value?.reset()
}

/**
 * Watch userId prop changes and act accordingly, as this
 * component is used on both edit and create.
 */

watchEffect(() => {
  if (!props.userId) {
    isEdit.value = false
    feedbacks.value = []

    reset()
  } else {
    isEdit.value = true
    nextTick(async () => {
      try {
        const { data } = await getUserById(props.userId)

        const { first_name, last_name, email, username } = data.data.data

        user.value = { first_name, last_name, email, username }
      } catch (err) {
        isEdit.value = false
        router.push('/user/create')
      }
    })
  }
})

defineExpose({
  q,
})
</script>

<template>
  <q-card class="q-ma-md user-create__card">
    <q-card-section class="user-create__section">
      <q-form
        ref="userForm"
        class="user-create__form"
        @submit.prevent="submit"
        @keyup.enter="submit"
      >
        <q-input
          ref="firstNameInput"
          v-model="user.first_name"
          label="First Name"
          :rules="firstNameRules"
          autofocus
        />

        <q-input
          ref="lastNameInput"
          v-model="user.last_name"
          label="Last Name"
          :rules="lastNameRules"
        />

        <q-input
          ref="emailInput"
          v-model="user.email"
          label="Email"
          type="email"
          :rules="emailRules"
        />

        <q-input
          ref="usernameInput"
          v-model="user.username"
          label="Username"
          :rules="usernameRules"
        />

        <q-input
          v-if="!isEdit"
          ref="passwordInput"
          v-model="user.password"
          label="Password"
          :type="showPwd ? 'text' : 'password'"
          :rules="passwordRules"
        >
          <template #append>
            <q-icon
              ref="showPwdToggle"
              :name="showPwd ? 'visibility_off' : 'visibility'"
              class="user-create__show-pwd"
              @click="showPwd = !showPwd"
            />
          </template>
        </q-input>
      </q-form>
    </q-card-section>

    <q-card-actions class="user-create__actions">
      <div
        v-if="feedbacks.length"
        class="user-create__feedback text-caption text-weight-light"
      >
        <q-list dense>
          <q-item v-for="feedback in feedbacks" :key="feedback">
            <q-item-section avatar>
              <q-icon
                v-show="feedback.length"
                name="circle"
                size="0.8em"
                class="q-pr-md"
                color="red"
              />
            </q-item-section>
            <q-item-section style="color: red">
              {{ feedback }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-btn
        ref="submitBtn"
        :label="isEdit ? 'Update' : 'Submit'"
        color="primary"
        :icon="isEdit ? 'save_as' : 'save'"
        @click="submit"
      ></q-btn>
      <q-btn
        v-if="!isEdit"
        ref="clearBtn"
        label="Clear"
        icon="clear"
        @click="reset"
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>

<style lang="scss">
.user-create__card {
  max-width: 800px;
}

.user-create__feedback {
  width: 100%;
  color: $primary;
  margin-top: 10px;
  clear: both;
  margin-bottom: 20px;
}

.user-create__section {
  padding-bottom: 0;
}

.user-create__show-pwd {
  cursor: pointer;
}
</style>
