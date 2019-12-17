import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
	primary: '#F26937',
	secondary: '#4C729A',
	success: '#8fd0e6',
	background: '#dedee7',
  	info: '#d59de0',
  	error: '#f83e70'
  }
})
