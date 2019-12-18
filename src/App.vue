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
	}
}
</script>
