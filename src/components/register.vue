<template>
	<div class="register"> 
	<v-snackbar v-model="snackbar" :timeout="4000" top color="success">
		<span>Account Created. We've sent you an activation link via email.</span>
		<v-btn flat color="white" @click="errorsnackbar = false">Close</v-btn>
	</v-snackbar>
	<v-layout row justify-center>
		<v-card class="elevation-0" max-width="500">
			<Loading v-if='authLoading'/>
					<v-card-title primary-title>
						<div class="black--text darken-1 display-2 font-weight-black mb-3" style="font-family: Arial, Helvetica, sans-serif;">Create an Account</div>
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
									v-model="userData.name"
									:rules="nameRules"
									prepend-icon="person"
									name="name"
									label="Username"
									required
									outline
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm12 md12>
								<v-text-field
									v-model="userData.email"
									:rules="emailRules"
									prepend-icon="mail"
									name="email"
									label="E-mail"
									required
									outline
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm12 md12>
								<v-text-field
									v-model="userData.password"
									prepend-icon="lock"
									:rules="passwordRules"
									name="password"
									label="Password"
									type="password"
									outline
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm12 md12>
								<v-text-field
									v-model="confirmpassword"
									prepend-icon="lock"
									:rules="passwordConfirmRules"
									name="password"
									label="Confirm Password"
									type="password"
									outline
								></v-text-field>
							</v-flex>
						</v-layout>
							</v-form>
							<v-card-actions>								
								<v-btn color="primary" block :disabled="!valid" @click="create" :loading="loading">
												Create account
									</v-btn>
								<v-btn block to="login">
									Login
								</v-btn>
							</v-card-actions>
						
					</v-card-text>
		</v-card>
	</v-layout>
	</div>
</template>
<style>
	main{
		padding-top:0px !important;
	}
	#login-card{
		position: absolute;
		top:20vh;
		right:30vw;
		min-width: 400px;
		width:40vw;
		max-width: 800px;
	}
</style>
<script>
	import apiCall from '../utils/api'
	import Loading from './loading'
	import { mapState } from 'vuex'
	export default {
		name: 'Register',
		components: {
			Loading
		},
		data: () => {
			return {
				snackbar: false,
				errorsnackbar: false,
				loading: false,
				valid: true,

				confirmpassword: '',

				passwordConfirmRules: [
					v => !!v || 'Password Confirm is required'
				],
				
				nameRules: [
					v => !!v || 'Name is required'
				],
				
				passwordRules: [
					v => !!v || 'Password is required'
				],
				
				emailRules: [
					v => !!v || 'E-mail is required',
					v => /.+@.+/.test(v) || 'E-mail must be valid'
				],
				userData: {
					name: '',
					password: '',
					email: '',
				}
		};
		},

		methods: {
			reset () {
				this.$refs.form.reset()
			},
			create () {
				if (this.$refs.form.validate()) {
					this.loading = true
					apiCall({url: '/api/register', data: this.userData, method: 'POST' })
					.then(resp => {
						this.loading = false;
						this.snackbar = true;
					})
					.catch(error => {
						this.loading = false;
						this.errorsnackbar = true;
					})
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