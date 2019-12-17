<template>
	<nav>
		<v-snackbar v-model="snackbar" :timeout="4000" top color="success">
			<span>{{message}}</span>
			<v-btn flat color="white" @click="snackbar = false">Close</v-btn>
		</v-snackbar>
		<v-toolbar app color="secondary" flat>
			<!--<v-toolbar-side-icon class="white--text" @click="drawer = !drawer"></v-toolbar-side-icon>-->
			<v-avatar
                  size="36px"
                >
                  <img
                    alt="Avatar"
                    src="logo.png"
                  >
                </v-avatar>
			<v-toolbar-title class="text-uppercase white--text">
				<span class="white--text text-none">Healthcare Connect</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-menu left>
				<v-badge
					slot="activator"
					overlap
					color="red">
					<v-icon
						color="white"
					>
						notifications_none
					</v-icon>
					
				</v-badge>
			</v-menu>

			<!--dropdown menu-->
			<v-menu left offset-y>
				<v-btn icon slot="activator">
					<v-icon color="white">more_vert</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile @click="">
					<v-list-tile-title>
						<v-icon left>
						person
						</v-icon>
						Profile
					</v-list-tile-title>
					</v-list-tile>
					<v-list-tile  @click="signOut">
					<v-list-tile-title>
						<v-icon left>
						lock
						</v-icon>
						Sign Out
					</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-toolbar>

		<v-navigation-drawer app v-model="drawer" class="primary">
			<v-layout column align-center>
				<v-flex class="mt-5">
					<v-avatar size="100">
						<img src="avatar-1.png">
					</v-avatar>
					<p class="white--text subheading mt-1">
						Benjamin Ace
					</p>
				</v-flex>
			</v-layout>
			<v-list>
				<v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
					<v-list-tile-action>
						<v-icon class="white--text">{{link.icon}}</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title class="white--text">{{link.text}}</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
				<v-list-tile @click="signOut">
					<v-list-tile-action>
						<v-icon>exit_to_app</v-icon>
					</v-list-tile-action>
					<v-list-tile-content>
						<v-list-tile-title>Sign Out</v-list-tile-title>
					</v-list-tile-content>
				</v-list-tile>
			</v-list>
		</v-navigation-drawer>
	</nav>
	
</template>

<script>
  	import { AUTH_LOGOUT } from '@/store/actions/auth'
export default {
	components: {
		
	},
	data(){
		return{
			color: '',
			message: '',
			snackbar: false,
			drawer: false,
			links: [
				{icon: 'account_circle', text: 'Dashboard', route: '/profile'},
			],
		}
	},
	methods: {
      signOut: function () {
        this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
      },
    },
}
</script>