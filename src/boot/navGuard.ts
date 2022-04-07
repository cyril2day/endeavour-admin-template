import { boot } from 'quasar/wrappers'
import NProgress from 'nprogress'
import { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router'
import useUserStore from '@/stores/user'
import usePermissionStore from '@/stores/permission'


/* Turn off loading spinner
 *
 */

NProgress.configure({ showSpinner: false })


/* Define routes accessible by unauthenticated
 * app users.
 */

const whiteList = ['/login', 'auth-redirect', '/mfa', '/register']


/**
 * Restrict access to these route if logged in.
 */

const restrictedRoutesIfLogged = ['/login', '/register']

/**
 * Instantiate user store
 */

const userStore = useUserStore()


/**
 * Instantiate permission store
 */

const permissionStore = usePermissionStore()


/**
 * The temporary router placeholder
 */
let Router: Router


/**
 * Callback function to pass on beforeGuard hook.
 */

async function beforeGuard(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const { path: targetPath } = to

  /**
   * Retrieve token from user store
   */

  const { token } = userStore

  /** Start the progress bar
   *
   */
  NProgress.start()

  if (token) {
    
    if (restrictedRoutesIfLogged.includes(targetPath)) {

      // if visiting restricted routes while logged in,
      // redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // Check whether the user has obtained his permission roles
      if (userStore.roles.length === 0) {
        try {
          await userStore.GetUserInfo()
          const { roles } = userStore

          permissionStore.GenerateRoutes(roles)

          permissionStore.dynamicRoutes.forEach((route) => {
            Router.addRoute(route)
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


// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router }) => {

  /**
   * Pass the actual router now initialized.
   * source: https://quasar.dev/quasar-cli-vite/boot-files#quasar-app-flow
   */

  Router = router


  /**
   * Trigger global beforeEach hook before the actual navigation
   */

  router.beforeEach(beforeGuard)


  /**
   * In the global afterEach hook, set nprogress to done when 
   * route is resolved. Also set the app title.
   */

  router.afterEach((to: RouteLocationNormalized) => {
    const { name } = to
    document.title = ''

    // set page title.
    const title = 'App'
    document.title = `${name?.toString()} - ${title}`

    // Finish progress bar
    // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    NProgress.done()
  })
})
