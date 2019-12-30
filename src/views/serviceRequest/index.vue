<template>
  <div class="dashboard">
  <v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
    <span>{{message}}</span>
  </v-snackbar>
    
  </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import { USER_REQUEST } from '@/store/actions/user'

    export default {
        data () {
            return{
                snackbar: false,
                message: '',
                color: '',
                loading: false,
            }
        },
        created(){

        },
        methods:{

        }
    }
</script>