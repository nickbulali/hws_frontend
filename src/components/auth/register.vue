<template>
	<div class="secondary"> 
	<v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
		<span>{{message}}</span>
	</v-snackbar>
	</v-label> 
	<v-layout row justify-center>
		<v-card class="elevation-0" color="transparent" max-width="500">
			<Loading v-if='authLoading'/>
					<v-card-title primary-title>
						<v-layout row wrap>
							<v-flex xs2>
								<v-btn fab flat to="login">
									<v-icon>
										arrow_back
									</v-icon>
								</v-btn>
							</v-flex>
							<v-flex xs10>
								<div class="primary--text display-1 font-weight-black mt-3">Healthcare Connect</div>
							</v-flex>
						</v-layout>
						
					</v-card-title>
						<v-layout column>
							<v-flex xs12>
							<div align="center">
								<v-img
									src="logo.png"
									aspect-ratio="1"
									max-width="200"
								></v-img>
							</div>
								
							</v-flex>
						</v-layout>
					<v-card-text>
						<v-form
							ref="form"
							v-model="valid"
							lazy-validation
						>
						<v-layout row wrap class="ma-2">
							<v-flex xs12 sm12 md12>
								<v-text-field
									v-model="userData.name"
									:rules="nameRules"
									prepend-inner-icon="person"
									name="name"
									label="Name"
									required
									class="text_field_2 mt-4"
										outline
										
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm12 md12>
								<v-text-field
									
									v-model="userData.email"
									:rules="emailRules"
									prepend-inner-icon="mail"
									name="email"
									label="Email Address"
									required
									class="text_field_2 mt-4"
										outline
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm12 md12>
								<v-text-field
									
									v-model="userData.phone_no"
									:rules="phoneRules"
									prepend-inner-icon="local_phone"
									name="name"
									label="Phone No."
									required
									class="text_field_2 mt-4"
										outline
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm12 md12>
								<v-text-field
									
									v-model="userData.password"
									prepend-inner-icon="lock"
									:rules="passwordRules"
									name="password"
									label="Password"
									type="password"
									class="text_field_2 mt-4"
										outline
								></v-text-field>
							</v-flex>
							<v-flex xs12 sm12 md12 class="mb-5">
								<v-text-field
									
									v-model="confirmpassword"
									prepend-inner-icon="lock"
									:rules="passwordConfirmRules"
									name="password"
									label="Confirm Password"
									type="password"
									class="text_field_2 mt-4"
										outline
								></v-text-field>
							</v-flex>
						</v-layout>
							</v-form>
							<v-card-actions>								
								<v-btn style="opacity: 0.8; box-shadow: -3px 3px 17px 6px rgba(0,0,0,0.75);" large block class="primary text-none my-3" block :disabled="!valid" @click="create" :loading="loading">
									Register
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
	import apiCall from '@/utils/api'
	import DisableAutocomplete from 'vue-disable-autocomplete';
	import Loading from './loading'
	import { mapState } from 'vuex'
	import Vue from 'vue'

	Vue.use(DisableAutocomplete);
	export default {
		name: 'Register',
		components: {
			Loading
		},
		data: () => {
			return {
				snackbar: false,
				message: '',
				color: '',

				loading: false,
				valid: true,

				confirmpassword: '',

				passwordConfirmRules: [
					v => !!v || 'Password Confirm is required'
				],
				
				nameRules: [
					v => !!v || 'Name is required'
				],
				phoneRules: [
					v => !!v || 'Phone Number is required'
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
					phone_no: '',
				}
		};
		},

		methods: {
			reset () {
				this.$refs.form.reset()
			},
			create () {
				if (this.$refs.form.validate()) {
					if(this.confirmpassword != this.userData.password){
						this.message = "Passwords do not match"
						this.snackbar = true
						this.color = 'error'
					}else{
						this.loading = true
						apiCall({url: '/api/register', data: this.userData, method: 'POST' })
						.then(resp => {
							this.message = "Account Created. We've sent you an activation link via email."
							this.loading = false
							this.color = 'success'
							this.snackbar = true
						})
						.catch(error => {
							this.loading = false
							this.message = "Email/Phone No. already registered"
							this.color = 'error'
							this.snackbar = true
						})
					}
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