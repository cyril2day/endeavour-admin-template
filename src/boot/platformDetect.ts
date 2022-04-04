import { boot } from 'quasar/wrappers'
import { Platform } from 'quasar'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ router }) => {
  console.log(Platform.is)

  router.push('/')
})
