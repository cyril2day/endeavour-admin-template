<script setup lang="ts">
import { useQuasar } from 'quasar'
import { leftDrawerWidth, LEFT_DRAWER_BREAKPOINT } from './AccountSettings'
import AccountProfile from './components/AccountProfile.vue'
import AccountSecurity from './components/AccountSecurity.vue'

const q = useQuasar()

const handleScreenChange = () => {
  return q.screen.width - leftDrawerWidth.value < LEFT_DRAWER_BREAKPOINT
    ? 'justify-evenly'
    : 'justify-start'
}
</script>

<template>
  <div
    class="row q-ma-xs"
    :class="handleScreenChange()"
  >
    <AccountProfile />

    <AccountSecurity />
  </div>
</template>
