<script setup lang="ts">
import { useQuasar } from 'quasar'
import { QInput } from 'quasar'
import { handleAccountPasswordChange } from '../AccountSettings'

const verified = ref(false)
const verifyPasswordLoading = ref(false)
const password = ref({ current: '', new: '', confirm: '' })
const newPwd = ref<QInput | null>(null)
const newPwdVisible = ref(false)
const confirmPwdVisible = ref(false)
const feedbacks = ref<string[]>([])
const q = useQuasar()

const validateCurrentPassword = (pass: string) => {
  verifyPasswordLoading.value = true

  setTimeout(() => {
    verified.value = true
    verifyPasswordLoading.value = false
    password.value.current = pass
  }, 2500)

  return verified.value
}

const updatePassword = async () => {
  feedbacks.value = []
  const payload = {
    password: password.value.new,
    password_current: password.value.current,
    password_confirmation: password.value.confirm,
  }
  const result = await handleAccountPasswordChange(payload)

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

  if (result.state === 'ok') {
    verified.value = false
    password.value = { new: '', current: '', confirm: '' }
  }
}

watch(
  () => verified.value,
  () => {
    if (verified.value) {
      nextTick(() => {
        newPwd.value?.focus()
      })
    }
  },
)
</script>

<template>
  <div class="account__password">
    <div v-if="!verified">
      <p class="text-body2">
        Password change needs verification. Click below to continue
      </p>

      <q-btn label="Change Password">
        <q-popup-edit
          v-model="password.current"
          auto-save
          :validate="validateCurrentPassword"
          :save="validateCurrentPassword"
        >
          <template v-slot="scope">
            <q-input
              autofocus
              counter
              dense
              type="password"
              v-model="scope.value"
              hint="Your current password"
              @keyup.enter="scope.set"
            >
              <template #append>
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="primary"
                  icon="arrow_forward_ios"
                  :loading="verifyPasswordLoading"
                  @click="scope.set"
                />
              </template>
            </q-input>
          </template>
        </q-popup-edit>
      </q-btn>
    </div>
    <div v-else>
      <p class="text-body2">
        <q-icon
          name="check_circle"
          color="secondary"
        />
        It's a good idea to use a strong password that you're not using
        elsewhere
      </p>
      <q-input
        type="password"
        :readonly="true"
        v-model="password.current"
        label="Current Password"
      />
    </div>
  </div>
  <q-separator />
  <q-form
    dense
    :disable="!verified"
    class="account__password-form"
    @submit.prevent
    @keyup.enter="updatePassword"
  >
    <q-input
      ref="newPwd"
      :disable="!verified"
      :type="newPwdVisible ? 'text' : 'password'"
      v-model="password.new"
      label="New Password"
    >
      <template #append>
        <q-icon
          :name="newPwdVisible ? 'visibility' : 'visibility_off'"
          @click="newPwdVisible = !newPwdVisible"
          style="cursor: pointer"
        />
      </template>
    </q-input>
    <q-input
      :disable="!verified"
      :type="confirmPwdVisible ? 'text' : 'password'"
      v-model="password.confirm"
      label="Confirm Password"
    >
      <template #append>
        <q-icon
          :name="confirmPwdVisible ? 'visibility' : 'visibility_off'"
          @click="confirmPwdVisible = !confirmPwdVisible"
          style="cursor: pointer"
        />
      </template>
    </q-input>
  </q-form>

  <div
    v-if="feedbacks.length"
    class="account__password-feedback text-caption text-weight-light"
  >
    <q-list dense>
      <q-item
        v-for="feedback in feedbacks"
        :key="feedback"
      >
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
    v-if="verified"
    class="account__update-password-btn"
    label="Update Password"
    color="primary"
    @click="updatePassword"
  ></q-btn>
</template>

<style lang="scss">
.account__password,
.account__password-form {
  margin: 10px auto;
  min-height: 120px;
}

.account__update-password-btn {
  margin-top: 20px;
}

.account__password-feedback {
  width: 100%;
  color: $primary;
  margin-top: 10px;
  clear: both;
  margin-bottom: 20px;
}
</style>
