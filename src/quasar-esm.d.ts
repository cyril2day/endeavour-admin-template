/**
 * Declare module 'quasar.esm.prod' and alias its types to 'quasar'. This
 * is to prevent vitest from referencing the cjs module which causes
 * initialization errors.
 */

declare module 'quasar/dist/quasar.esm.prod' {
  import { Quasar, QuasarPluginOptions } from 'quasar'

  export { Quasar, QuasarPluginOptions }
}
