// eslint-disable-next-line
// @ts-ignore
import { Quasar, QuasarPluginOptions } from 'quasar/dist/quasar.esm.prod'

import { cloneDeep } from 'lodash'
import { config } from '@vue/test-utils'
import { afterAll } from 'vitest'


/**
 * Fix mount error similar to this one:
 * https://github.com/quasarframework/quasar/issues/11424
 */

export function installQuasarPlugin(options?: Partial<QuasarPluginOptions>) {
  const globalConfigBackup = cloneDeep(config.global)

  // We must execute this outside a `beforeAll`
  // or `mount` calls outside `test` context (eg. called into a `describe` context and shared by multiple tests)
  // won't have those defaults applied
  config.global.plugins.unshift([Quasar, options])

  afterAll(() => {
    config.global = globalConfigBackup
  })
}


/**
 * Mock of window.matchMedia() method which is not implemented
 * in JSDOM.
 * source: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 */

export function matchMediaMock() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}
