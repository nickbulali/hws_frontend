<template>
    <v-bottom-nav
      fixed
      app
      :active.sync="bottomNav"
      :value="true"
      color="white"
    >
      <v-btn
      icon
        flat
        router to="/"
      >
        <span>Home</span>
        <v-icon dark>home</v-icon>
      </v-btn>

      <v-btn
        router to="/service-requests"
      >
        <span>Service Requests</span>
        <v-icon dark>touch_app</v-icon>
      </v-btn>

      <v-btn
        v-if="$can('receive_service')"
        router to="/hospitals"
      >
        <span>Hospitals</span>
        <v-icon dark>local_hospital</v-icon>
      </v-btn>

      <v-btn
        router to="/favourites"
      >
        <span>Favourites</span>
        <v-icon>star</v-icon>
      </v-btn>

    </v-bottom-nav>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        bottomNav: 'dashboard',
      }
    },
    methods: {
      signOut: function () {
        this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
      },
    },
    created(){
      
    },
    computed: {
      
    },
    methods:{
      ...mapActions(['USER_REQUEST']),
    }
  }
</script>