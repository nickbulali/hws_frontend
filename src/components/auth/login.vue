<template>
	<div class="login primary lighten-2"> 
		<v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
			<span>{{message}}</span>
		</v-snackbar>
		<v-layout column>
			<v-flex xs12>
				<template>
					<v-parallax
						height="300"
						src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
					>
						<div
							align="center"
							justify="center"
							>
							<div align="center">
								<v-avatar size="130">
									<img
										src="logo.jpg"
									>
								</v-avatar>
								<h4 class="subheading mt-3">Fancy Tag Line</h4>
							</div>
						</div>
					</v-parallax>
				</template>
			</v-flex>
			<v-flex xs12>
				<v-card class="elevation-0">
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
										class="mt-4"
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
										class="mt-2"
									></v-text-field>
								</v-flex>
							</v-layout>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-layout column class="ma-1">
						
						<v-flex xs12 class="mb-5">
							<div align="right">
								<v-btn depressed flat class="text-none mb-5" to="reset-password">
									<a>Forgot Password</a>	
								</v-btn>
							</div>
						</v-flex>
						<v-flex xs12 class="mt-3">
							<div align="right">
								<v-btn depressed fab class="mr-2" color="primary" :disabled="!valid" @click="login" :loading="loading">
									<v-icon>
										arrow_right_alt
									</v-icon>
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
	import Loading from './loading'
	import { mapState } from 'vuex'
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