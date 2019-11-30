<template>
	<v-app class="grey lighten-3">
		<Navbar v-if="['Login', 'Register', 'ResetPass'].indexOf($route.name) == -1"/>
		<v-content>
			<router-view></router-view>
		</v-content>

	</v-app>
</template>

<script>
import Navbar from '@/components/layout/navbar'

export default {
	name: 'App',
	components: {
		Navbar
	},
	data () {
		return {
			//
		}
	}
}
</script>
