<script setup lang="ts">
import { useQuasar } from 'quasar'
import useUserStore from '@/stores/user'
import {
  handleAccountUpdate,
  LEFT_DRAWER_BREAKPOINT,
  pageContainerWidth,
} from '@/pages/settings/AccountSettings'

const { id, email, username, first_name, last_name, phone_number, roles } =
  useUserStore()
const q = useQuasar()
const role = roles[0]
const feedbacks = ref<string[]>([])

const user = ref({
  id: id,
  email: email,
  username: username,
  first_name: first_name,
  last_name: last_name,
  phone_number: phone_number,
})

const update = async () => {
  feedbacks.value = []
  const result = await handleAccountUpdate(user.value)

  if (result.state === 'error') {
    Object.keys(result.data).forEach((key) => {
      feedbacks.value.push(result.data[key][0])
    })
  } else useUserStore().GetUserInfo()

  q.notify({
    color: result.state === 'ok' ? 'secondary' : 'negative',
    textColor: 'white',
    message: result.message,
    icon: result.state === 'ok' ? 'check' : 'error_outline',
    position: 'top',
    timeout: 2500,
  })
}

const toggleResponsiveClass = () => {
  return pageContainerWidth.value > LEFT_DRAWER_BREAKPOINT ? 'col-md-5' : null
}
</script>

<template>
  <q-card
    class="account__profile q-ma-md col-xs-12"
    :class="toggleResponsiveClass()"
  >
    <q-card-section>
      <div class="row justify-between">
        <div class="account__heading text-h6">Account</div>
        <q-chip
          color="blue-grey-2"
          icon="person_outline"
          >{{ role.slug }}</q-chip
        >
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form
        dense
        @submit.prevent
        @keyup.enter="update"
      >
        <q-input
          v-model="user.username"
          label="Username"
        />

        <q-input
          v-model="user.first_name"
          label="First Name"
        />

        <q-input
          v-model="user.last_name"
          label="Last Name"
        />

        <q-input
          v-model="user.email"
          label="Email"
        />

        <q-input
          v-model="user.phone_number"
          label="Phone"
        />
      </q-form>
    </q-card-section>

    <q-card-actions>
      <div
        v-if="feedbacks.length"
        class="account__feedback text-caption text-weight-light"
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

      <div class="q-ma-xs">
        <q-btn
          label="Update"
          type="submit"
          color="primary"
          @click="update"
        />
      </div>
    </q-card-actions>
  </q-card>
</template>

<style lang="scss" scoped>
.account__profile {
  min-height: 550px;
}

.account__heading {
  margin: 4px;
}

.account__feedback {
  width: 100%;
  color: $primary;
  margin-top: 10px;
  clear: both;
  margin-bottom: 20px;
}
</style>
