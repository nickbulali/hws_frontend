<template>
	<div id="inspire"> 
	<v-card class="elevation-3" id="login-card">
		<Loading v-if='authLoading'/>
		<v-toolbar class="elevation-0">
        <v-toolbar-title>R-Placement</v-toolbar-title>
        <v-spacer></v-spacer>
      	</v-toolbar>
		  <v-form class="px-3"
		    ref="form"
		    v-model="valid"
		    lazy-validation
		  >
			  <v-card-text>
			    <v-text-field
			      v-model="username"
			      :rules="emailRules"
			      prepend-icon="person"
			      name="username"
			      label="E-mail"
			      required
			    ></v-text-field>
			    <v-text-field
			    	v-model="password"
				    prepend-icon="lock"
				    :rules="passwordRules"
				    name="password"
				    label="Password"
				    type="password"
				  ></v-text-field>
				</v-card-text>
				<v-card-actions>
		        	<v-spacer></v-spacer>
					<v-btn color="primary" round :disabled="!valid" @click="login" :loading="loading">
				          Login
				    </v-btn>
				</v-card-actions>
		  </v-form>
	</v-card>
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
  import {AUTH_REQUEST} from '../store/actions/auth'
  import Loading from './loading'
  import { mapState } from 'vuex'
  export default {
  	name: 'Login',
    components: {
      Loading
    },
    data: () => {
    	return {
    	  loading: false,
	      valid: true,
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