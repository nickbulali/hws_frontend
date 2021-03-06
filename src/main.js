import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/index'
import apiCall from '@/utils/api'
import dotenv from 'dotenv'
import {ability} from './store'
import { abilitiesPlugin } from '@casl/vue'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(abilitiesPlugin, ability)

dotenv.config()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

document.addEventListener("deviceready", () => {
	console.log("here")
  window.FirebasePlugin.getToken(function(token) {
	  
    var formData = new FormData();
    formData.append("fcmToken", token);

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('user-token');
     axios.post("http://api.health.co.ke/api/userDevice",formData).then((response) => {
           resolve(response.data)
         }).catch((error) => {
           reject(new Error(error))
         });

     apiCall({url: '/api/userDevice', data: formData, method: 'POST' })
     .then(resp => {

     })
     .catch(error => {

     })
    console.log(token);
  }, function(error) {
    console.error(error);
  });


  console.log("Ready, Render the App1");  
  StatusBar.backgroundColorByHexString('#416184');
  //NavigationBar.backgroundColorByHexString('#ffffff');

});

// If we are not in Cordova, manually trigger the deviceready event
const isCordovaApp = (typeof window.cordova !== "undefined");
if (!isCordovaApp){
  document.dispatchEvent(new CustomEvent("deviceready", {}));
}
