<script setup lang="ts">
import TopHeader from './TopHeader.vue'
import LeftDrawer from './LeftDrawer.vue'
import useAppStore from '@/stores/app'

const drawerIsShown = ref(false)
const appStore = useAppStore()

const handleDrawerIsShown = (event: boolean) => {
  drawerIsShown.value = event
}

watchEffect(() => {
  appStore.leftDrawerIsShown = drawerIsShown.value
})
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="text-dark main-layout__top-header bordered fixed-top">
      <TopHeader
        :drawer-is-shown="drawerIsShown"
        @drawer-is-shown="handleDrawerIsShown"
      />
    </q-header>

    <q-drawer v-model="drawerIsShown" show-if-above bordered>
      <left-drawer />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
