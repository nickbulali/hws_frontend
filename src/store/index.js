import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import auth from './modules/auth'
import roles from  './modules/roles'

import workerCategories from './modules/workerCategories'

import VuexPersist from 'vuex-persist'
import { abilityPlugin, ability as appAbility } from './ability'

Vue.use(Vuex)

export const ability = appAbility
const debug = process.env.NODE_ENV !== 'production'

const vuexLocalStorage = new VuexPersist({
  key: 'hrh_app', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  filter: mutation => (true)
})

export default new Vuex.Store({
  plugins: [
    vuexLocalStorage.plugin,
    abilityPlugin
  ],

  modules: {
    user,
    auth,
    roles,
    workerCategories
  },
  strict: false,
})


