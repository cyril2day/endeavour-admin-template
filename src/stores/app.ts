import { defineStore } from 'pinia'
import pinia from '@/stores/index'

type AppState = {
  leftDrawerIsShown: boolean
}

const state: AppState = {
  leftDrawerIsShown: true,
}

const GetLeftDrawerShownStatus = () => {
  return store.leftDrawerIsShown
}

const useAppStore = defineStore('app', {
  state: () => state,
  actions: { GetLeftDrawerShownStatus },
})

const store = useAppStore(await pinia({}))

export default useAppStore
