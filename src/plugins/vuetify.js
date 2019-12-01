import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
	primary: '#3662ee',
	secondary: 'F813D7',
	success: '#8fd0e6',
	background: '#dedee7',
  	info: '#d59de0',
  	error: '#f83e70'
  }
})
