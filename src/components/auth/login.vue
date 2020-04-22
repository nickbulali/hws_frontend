<template>
	<div id="login_div"> 
		<v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
			<span>{{message}}</span>
		</v-snackbar>
		<v-layout column>
			<v-flex xs12 class="mt-3">
			</v-flex>
			<v-flex xs12 class="mt-5">
			</v-flex>
			<v-flex xs12 class="mt-5">
			</v-flex>
			<v-flex xs12 class="mt-5">
				<div align="center" class="mt-5">
					<p class="headline white--text"><b>Welcome Back!</b></p>
					<p class="white--text">Login to continue HRH Connect</p>
				</div>
			</v-flex>
			<v-flex xs12 class="ma-2">
				<v-card 
					color="transparent"
					class="elevation-0">
					<v-card-text>
						<v-form
							ref="form"
							v-model="valid"
							lazy-validation
						>
							<v-layout row wrap>
								<v-flex xs12>
									<v-text-field
										v-model="username"
										:rules="emailRules"
										prepend-inner-icon="mail_outline"
										name="username"
										label="E-mail"
										outline
										class="text_field"
									></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-text-field
										v-model="password"
										prepend-inner-icon="lock"
										:rules="passwordRules"
										name="password"
										label="Password"
										type="password"
										class="text_field mt-4"
										outline
									></v-text-field>
								</v-flex>
								<v-flex xs12 class="mb-5">
									<div align="right" class="mt-3">
										<v-btn flat class="text-none">
											<a router to="reset-password" class="white--text">Forgot Password?</a>
										</v-btn>										
									</div>
								</v-flex>
							</v-layout>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-layout column class="ma-1">
							<v-flex xs12 class="mt-5">
								<div align="right">
									<v-btn style="opacity: 0.8; box-shadow: -3px 3px 17px 6px rgba(0,0,0,0.75);" large block color="primary text-none" :disabled="!valid" @click="login" :loading="loading">
										Log In
										<v-icon>
											arrow_right_alt
										</v-icon>
									</v-btn>
								</div>
							</v-flex>
							<v-flex>
								<div align="center" class="mt-2">
									<v-btn small class="mx-2 mb-3 text-none" large flat router to="/register">
										<a class="white--text">New User? Sign Up</a>
									</v-btn>									
								</div>
							</v-flex>
						</v-layout>						
					</v-card-actions>
				</v-card>
			</v-flex>
			
		</v-layout>
	</div>
</template>

<script>
	import {AUTH_REQUEST} from '@/store/actions/auth'
	import DisableAutocomplete from 'vue-disable-autocomplete';
	import Loading from './loading'
	import { mapState } from 'vuex'
	import Vue from 'vue'

	Vue.use(DisableAutocomplete);

	export default {
		name: 'Login',
		components: {
			Loading
		},
		data: () => {
			return {
				color: '',
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
							this.color = 'error'
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