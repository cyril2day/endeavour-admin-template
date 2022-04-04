import { RouteRecordRaw } from 'vue-router'
import Layout from 'layouts/MainLayout.vue'

/**
 * Routes accessible for users with no special
 * permissions use-cases.
 */

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/auth/login/LoginIndex.vue'),
    name: 'Login',
  },

  {
    path: '/mfa',
    component: () => import('pages/auth/login/LoginOtp.vue'),
    name: 'Mfa',
    props: true,
  },

  {
    path: '/',
    component: markRaw(Layout),
    redirect: '/dashboard',
    name: 'Dashboard',
    meta: {
      icon: 'home',
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('pages/IndexPage.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },

  {
    path: '/settings',
    component: markRaw(Layout),
    redirect: '/settings/index',
    name: 'Settings',
    meta: {
      hidden: true,
    },
    children: [
      {
        path: 'index',
        component: () => import('@/pages/settings/AccountSettings.vue'),
        name: 'Account Settings',
        meta: {
          title: 'settings',
          icon: 'user',
        },
      },
    ],
  },
]

/**
 * Will be loaded to users with elevated rights
 * e.g. admin, moderator, staff etc.
 */

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    component: markRaw(Layout),
    redirect: '/user/index',
    name: 'User',
    meta: {
      title: 'users',
      icon: 'person',
      roles: ['administrator'],
    },
    children: [
      {
        path: 'index',
        component: () => import('pages/user/UserIndex.vue'),
        name: 'User Index',
        meta: {
          title: 'View User List',
          icon: 'user',
        },
      },

      {
        path: 'create',
        component: () => import('pages/user/UserCreate.vue'),
        name: 'User Create',
        meta: {
          title: 'Add New User',
          icon: 'group_add',
        },
      },

      {
        path: ':userId',
        component: () => import('pages/user/UserCreate.vue'),
        props: true,
        name: 'User Edit',
        meta: {
          title: 'Edit User',
          icon: 'group_add',
          hidden: true,
        },
      },
    ],
  },

  {
    path: '/role',
    component: markRaw(Layout),
    redirect: '/role/index',
    name: 'Role',
    meta: {
      title: 'roles',
      icon: 'admin_panel_settings',
      roles: ['administrator'],
    },
    children: [
      {
        path: 'index',
        // component: () => import('pages/role/RoleIndex.vue'),
        component: () => import('pages/role/RoleIndex.vue'),
        name: 'Role Index',
        meta: {
          title: 'Show Roles List',
          icon: 'people',
        },
      },
      {
        path: 'create',
        component: () => import('pages/role/RoleCreate.vue'),
        name: 'Role Create',
        meta: {
          title: 'Create Role',
          icon: 'group_add',
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]
