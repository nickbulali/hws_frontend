<template>
	<nav>
		<v-snackbar v-model="snackbar" :timeout="4000" top color="success">
			<span>{{message}}</span>
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
					<span v-if="notifications != 0" slot="badge"> {{notifications.length}} </span>
				</v-badge>
				<v-list two-line>
				<template v-if="notifications" v-for="(notification, index) in notifications">
					
					<v-list-tile
						:key="notification.id"
						avatar
						@click="readNotification(notification)"
						router :to = "{ name: 'serviceRequests', params: { id: notification.data.serviceRequest.id } }"
						v-if="notification.type == 'App\\Notifications\\NewServiceRequest' "
						>
						<v-list-tile-content>
							<v-list-tile-title>{{notification.data.requester.first_name}} {{notification.data.requester.last_name}}</v-list-tile-title>
							<v-list-tile-sub-title>Individual Service Request</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile
						:key="notification.id"
						avatar
						@click="readNotification(notification)"
						router :to = "{ name: 'serviceRequests', params: { id: notification.data.serviceRequest.id } }"
						v-if="notification.type == 'App\\Notifications\\AcceptServiceRequest' "
						>
						<v-list-tile-content>
							<v-list-tile-title>{{notification.data.recipient.first_name}} {{notification.data.recipient.last_name}}</v-list-tile-title>
							<v-list-tile-sub-title>Service Request Accepted</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile
						:key="notification.id"
						avatar
						@click="readNotification(notification)"
						router :to = "{ name: 'serviceRequests', params: { id: notification.data.serviceRequest.id } }"
						v-if="notification.type == 'App\\Notifications\\RejectServiceRequest' "
						>
						<v-list-tile-content>
							<v-list-tile-title>{{notification.data.recipient.first_name}} {{notification.data.recipient.last_name}}</v-list-tile-title>
							<v-list-tile-sub-title>Service Request Rejected</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-divider
					:key="index"
					></v-divider>
				</template>
				<template v-if="notifications.length==0">
					<v-list-tile
					@click=""
					>
					<v-list-tile-content>
						<v-list-tile-sub-title>No New Notification</v-list-tile-sub-title>
					</v-list-tile-content>
				</v-list-tile>
				</template>

				</v-list>

			</v-menu>

			<!--dropdown menu-->
			<v-menu left offset-y>
				<v-btn icon slot="activator">
					<v-icon color="white">more_vert</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile router to="/profile">
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
	import { mapGetters, mapState, mapActions } from 'vuex'
	import apiCall from '@/utils/api'
  	import Pusher from 'pusher-js'

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
	created(){
		this.initialize()
	},
	methods: {
		...mapActions([
			'fetchnotifications'
		]),
		initialize(){
			Echo.private(`App.User.${this.getProfile.id}`).
			notification((notification)=>{
				if(notification.type == 'App\\Notifications\\NewServiceRequest'){
					this.message = "New Service Request"
					this.color="success"
				}  else if (notification.type == 'App\\Notifications\\AcceptServiceRequest'){
					this.message = "Service Request Accepted"
					this.color="success"
				} else if (notification.type == 'App\\Notifications\\RejectServiceRequest'){
					this.message = "Service Request Rejected"
					this.color="error"
				}
				
				this.snackbar=true
				this.fetchnotifications()
				//this.notifications = this.notifications.concat(notification);
			});
			this.fetchnotifications()
		},
		readNotification(Item){
			const index = this.notifications.indexOf(Item)
			this.notifications.splice(index, 1)
			apiCall({url: '/api/notificationRead/'+Item.id, method: 'GET' })
			.then(resp => {
				console.log("notification cleared")
			})
			.catch(error => {
				console.log(error.response)
			})
		},

      	signOut: function () {
        	this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
      	},
    },
	computed: {
		...mapGetters([
			'notifications',
			'isAuthenticated',
			'getProfile'
		]),
	}
}
</script>