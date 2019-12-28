<template>
	<v-app>
		<Navbar v-if="['Login', 'Register', 'ResetPass'].indexOf($route.name) == -1"/>
		<v-content>
			<router-view></router-view>
		</v-content>
		<BottomNav v-if="['Login', 'Register', 'ResetPass'].indexOf($route.name) == -1"/>
	</v-app>
</template>

<script>
import Navbar from '@/components/layout/navbar'
import BottomNav from '@/components/layout/bottomNav'
import Echo from "laravel-echo";

export default {
	name: 'App',
	components: {
		Navbar,
		BottomNav
	},
	data () {
		return {
			//
		}
	},
	created(){
		window.Pusher = require('pusher-js');
	    window.Echo = new Echo({
	      authEndpoint : process.env.VUE_APP_API_URL +'/broadcasting/auth',
	        broadcaster: 'pusher',
	        auth: {
	            headers: {
	                'Authorization': localStorage.getItem('user-token')
	            }
	        },
	        key: 'a10beda06c429197af5c',
			cluster: 'mt1',
			encrypted: true,
	    });
	}
}
</script>
