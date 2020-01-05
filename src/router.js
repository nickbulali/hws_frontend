import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/auth/login.vue'
import ResetPass from './components/auth/resetPass.vue'
import Register from './components/auth/register.vue'

import Dashboard from './views/dashboard.vue'
import serviceRequest from './views/serviceRequest/index.vue'
import Favourite from './views/favourite/index.vue'

import Profile from './views/profile/index.vue'

import store from './store/index'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
    next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

export default new Router({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/reset-password',
      name: 'ResetPass',
      component: ResetPass,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/service-requests',
      name: 'serviceRequest',
      component: serviceRequest,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/favourites',
      name: 'favourite',
      component: Favourite,
      beforeEnter: ifAuthenticated,
    },
  ]
})
