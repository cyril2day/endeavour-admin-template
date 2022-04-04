import { boot } from 'quasar/wrappers'
import NProgress from 'nprogress'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import useUserStore from '@/stores/user'
import { setLastPath, getToken, getLastPath, Token } from '@/utils/storage'
import usePermissionStore from '@/stores/permission'

/* Turn off loading spinner
 *
 */

NProgress.configure({ showSpinner: false })

/* Define routes accessible by unauthenticated
 * app users.
 */

const whiteList = ['/login', 'auth-redirect', '/mfa']

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router }) => {
  /**
   * Callback function to pass on beforeGuard hook.
   */

  async function beforeGuard(
    to: RouteLocationNormalized,
    _: RouteLocationNormalized,
    next: NavigationGuardNext
  ) {
    const lastPath = getLastPath()?.toString()
    const { path: targetPath } = to

    /**
     * Instantiate user store
     */

    const userStore = useUserStore()

    /**
     * Instantiate permission store
     */

    const permissionStore = usePermissionStore()

    /**
     * Retrieve token if present from device storage
     */

    const { token } = userStore

    if (!token) userStore.token = getToken(Token.access)

    // Start the progress bar
    NProgress.start()

    if (token) {
      if (targetPath === '/login') {
        // If is logged in, redirect to the home page
        next({ path: lastPath ?? '/' })
        NProgress.done()
      } else {
        // Check whether the user has obtained his permission roles
        if (userStore.roles.length === 0) {
          try {
            await userStore.GetUserInfo()
            const { roles } = userStore

            permissionStore.GenerateRoutes(roles)

            permissionStore.dynamicRoutes.forEach((route) => {
              router.addRoute(route)
            })

            // Hack: ensure addRoutes is complete
            // Set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          } catch (err) {
            userStore.ResetToken()
            next(`/login?redirect=${targetPath}`)
            NProgress.done()
          }
        } else {
          next()
        }
      }
    } else {
      // Has no token
      if (whiteList.indexOf(targetPath) !== -1) {
        // In the free login whitelist, go directly
        next()
      } else {
        // Other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${targetPath}`)
        NProgress.done()
      }
    }
  }

  /**
   * Trigger global hook before the actual navigation
   */

  router.beforeEach(beforeGuard)

  /**
   * Set nprogress to done when route is resolved. Also
   * set the app title.
   */

  router.afterEach((to: RouteLocationNormalized) => {
    const { name, path } = to
    document.title = ''

    // Finish progress bar
    // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    NProgress.done()

    // set page title.
    const title = 'App'
    document.title = `${name?.toString()} - ${title}`

    if (name !== 'NotFound')
      setLastPath(path)
  })
})
