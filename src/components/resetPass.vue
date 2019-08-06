<template>
  <div class="login"> 
    <v-snackbar v-model="snackbar" :timeout="4000" top :color="snackbarColor">
      <span>{{message}}</span>
      <v-btn flat color="white" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-layout row justify-center>
      <v-card class="elevation-0">
        <v-card-title primary-title>
          <div class="black--text darken-1 display-2 font-weight-black mb-3" style="font-family: Arial, Helvetica, sans-serif;">Reset Password</div>
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
                  v-model="email"
                  :rules="emailRules"
                  prepend-icon="person"
                  name="username"
                  label="E-mail"
                  required
                  outline
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-layout column class="ma-1">
            <v-flex xs12 class="mb-2">
              <v-btn large block color="primary" :disabled="!valid" @click="reset" :loading="loading">
                Reset
              </v-btn>
            </v-flex>
          </v-layout>
          
          
        </v-card-actions>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'ResetPass',
    data: () => {
      return {
        snackbar: false,
        snackbarColor: '',
        loading: false,
        valid: true,
        message: '',
        email: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
      };
    },
    methods: {
      reset: function () {
        if (this.$refs.form.validate()) {
          apiCall({url: "/api/password/create", data: this.email, method: 'POST'})
          .then(resp => {
              this.message = "Email with Instructions Sent Successfully"
              this.snackbarColor = "success"
              this.snackbar = true           
              this.resetLoader = false
          })
          .catch(error => {
            this.message = "Someting Went Wrong"
            this.snackbarColor = "error"
            this.snackbar = true
            this.resetLoader = false
          });
        }
      }
    },
    computed: {
      
    },
  }
</script>