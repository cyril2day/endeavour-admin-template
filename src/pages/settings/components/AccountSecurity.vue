<script setup lang="ts">
import AccountPassword from '@/pages/settings/components/AccountPassword.vue'
import AccountMfa from '@/pages/settings/components/AccountMfa.vue'
import {
  LEFT_DRAWER_BREAKPOINT,
  pageContainerWidth,
} from '@/pages/settings/AccountSettings'

const tab = ref<'password' | 'otp' | 'accessToken'>('password')

const toggleResponsiveClass = () => {
  return pageContainerWidth.value > LEFT_DRAWER_BREAKPOINT ? 'col-md-6' : null
}
</script>

<template>
  <q-card
    class="account__security q-ma-md col-xs-12"
    :class="toggleResponsiveClass()"
  >
    <q-card-section>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          name="password"
          label="Password"
        />
        <q-tab
          name="otp"
          label="Multi-Factor Authentication"
        />
        <q-tab
          name="accessToken"
          label="Access Token"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
        keep-alive
      >
        <q-tab-panel name="password">
          <AccountPassword />
        </q-tab-panel>

        <q-tab-panel name="otp">
          <AccountMfa />
        </q-tab-panel>

        <q-tab-panel name="accessToken">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.account__security {
  min-height: 550px;
}
</style>
