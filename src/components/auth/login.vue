<template>
	<div class="login"> 
		<v-snackbar v-model="snackbar" :timeout="4000" top color="error">
			<span>{{message}}</span>
			<v-btn flat color="white" @click="snackbar = false">Close</v-btn>
		</v-snackbar>
		<v-layout row justify-center>
			<v-card class="elevation-0">
				<Loading v-if='authLoading'/>
				<v-card-title primary-title>
					<div class="black--text darken-1 display-2 font-weight-black mb-3" style="font-family: Arial, Helvetica, sans-serif;">Log In</div>
				</v-card-title>
				<v-card-text>
					<v-form
						ref="form"
						v-model="valid"
						lazy-validation
					>
						<v-layout row wrap>
							<v-flex xs12 sm12 md12>
								<v-text-field
									v-model="username"
									:rules="emailRules"
									prepend-icon="person"
									name="username"
									label="E-mail"
									required
									outline
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm12 md12>
								<v-text-field
									v-model="password"
									prepend-icon="lock"
									:rules="passwordRules"
									name="password"
									label="Password"
									type="password"
									outline
								></v-text-field>
							</v-flex>
						</v-layout>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-layout column class="ma-1">
					  <v-flex xs12 class="mb-2">
					    <v-btn large block color="primary" :disabled="!valid" @click="login" :loading="loading">
								Login
							</v-btn>
					  </v-flex>
					  <v-flex xs12 class="mb-2">
					    <v-btn block large to="reset-password">
								Reset Password
							</v-btn>
					  </v-flex>
					  <v-flex xs12 class="mb-2">
					    <v-btn block large flat to="register">
								Create an account
							</v-btn>
					  </v-flex>
					</v-layout>
					
					
				</v-card-actions>
			</v-card>
		</v-layout>
	</div>
</template>

<script>
	import {AUTH_REQUEST} from '@/store/actions/auth'
	import Loading from './loading'
	import { mapState } from 'vuex'
	export default {
		name: 'Login',
		components: {
			Loading
		},
		data: () => {
			return {
				snackbar: false,
				loading: false,
				valid: true,
				message: '',
				password: '',
				passwordRules: [
					v => !!v || 'Password is required'
				],
				username: '',
				emailRules: [
					v => !!v || 'E-mail is required',
					v => /.+@.+/.test(v) || 'E-mail must be valid'
				],
			};
		},
		methods: {
			reset () {
				this.$refs.form.reset()
			},
			login: function () {
				console.log(this.$store)
				if (this.$refs.form.validate()) {
					this.loading = true
				 	const { username, password } = this
					this.$store.dispatch(AUTH_REQUEST, { username, password })
						.then((response) => {
							this.$router.push('/')
					 	}).catch((response) => {
					 		this.message = 'Email/Password wrong or Account is not activated'
							this.snackbar = true
							this.loading = false
					 	});
				}
	 		}
		},
		computed: {
			...mapState({
				authLoading: state => state.auth.status === 'loading',
			})
		},
	}
</script>