import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/index'
import dotenv from 'dotenv'
import {ability} from './store'
import { abilitiesPlugin } from '@casl/vue'

Vue.config.productionTip = false
Vue.use(abilitiesPlugin, ability)

dotenv.config()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
