import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
  	primary: '#00519e',
  	success: '#58e2c9',
  	info: '#ffaa2c',
  	error: '#f83e70'
  }
})
