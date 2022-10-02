<script setup lang="ts">
// import { removeToken } from '@/utils/storage';
import useUserStore from '../stores/user'
import { useRouter } from 'vue-router'

const props = defineProps({
  drawerIsShown: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['drawerIsShown'])

const store = useUserStore()
const router = useRouter()

const signout = async () => {
  store.ResetToken()

  router.push('/login')
}

const toggleDrawerShow = () => {
  emit('drawerIsShown', !props.drawerIsShown)
}
</script>

<style lang="scss">
.topheader__actions {
  min-width: 150px;
}
</style>

<template>
  <q-toolbar>
    <q-btn
      flat
      dense
      round
      icon="menu_open"
      aria-label="Menu"
      @click="toggleDrawerShow"
      :class="props.drawerIsShown ? '' : 'drawer-left__toggle--open'"
    />

    <q-toolbar-title></q-toolbar-title>

    <q-btn
      round
      flat
      icon="account_circle"
    >
      <q-menu
        transition-show="flip-right"
        transition-hide="flip-left"
        auto-close
        class="topheader__actions"
      >
        <q-list style="min-width: 200px">
          <q-item
            clickable
            dense
            padding
            to="/settings"
          >
            <q-item-section class="text-body2 text-weight-light"
              >Account Settings</q-item-section
            >
            <q-item-section avatar>
              <q-icon
                name="settings"
                size="xs"
              />
            </q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section class="text-body2 text-weight-light"
              >Support</q-item-section
            >
            <q-item-section avatar>
              <q-icon
                name="support"
                size="xs"
              />
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item
            clickable
            @click="signout"
          >
            <q-item-section class="text-body2 text-weight-light"
              >Logout</q-item-section
            >
            <q-item-section avatar>
              <q-icon
                name="logout"
                size="xs"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-toolbar>
</template>

<style lang="scss">
button.drawer-left__toggle--open {
  span i.q-icon {
    transform: rotate(180deg);
  }
}
</style>
