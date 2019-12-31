<template>
  <div class="dashboard">
  <v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
    <span>{{message}}</span>
  </v-snackbar>
    <v-container>
      <v-tabs
        color="transparent"
        grow
        dark
        slider-color="primary"
        show-arrows
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.id"
          ripple
          @click="updateTab(tab.id)"
          >
          <div class="text-none black--text">{{ tab.name }}</div>
        </v-tab>
        <v-tab-item
          :transition="false" :reverse-transition="false"
          :key="tab.id"
          v-for="tab in tabs"
        >
        </v-tab-item>
      </v-tabs>
      <div v-if="activeTab == 1 && $can('individual_request_service')" class="mt-2">
        <v-layout column>
            <v-flex xs12 v-for="(worker, index) in allIndividualUpcoming" :key="index" class="mb-1">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
                @click="goToProfile(index)"
              >
                <v-layout row wrap>
                  <v-flex xs3>
                    <v-avatar
                      size="70"
                      color="grey lighten-4"
                    >
                      <img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" alt="avatar">
                    </v-avatar>
                  </v-flex>
                  <v-flex xs9>
                    <div><b>{{worker.recipient.first_name}} {{worker.recipient.last_name}}</b></div>
                    <div class="grey--text">{{worker.recipient.health_worker_profile.worker_category.name}} - {{worker.recipient.health_worker_profile.worker_sub_category.name}}</div>
                    <div>
                      <v-rating
                      :value="4.5"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                      ></v-rating>
                    </div>
                    <div class="mt-2">{{worker.recipient.health_worker_profile.bio.substring(0,80)+".."}}</div>
                    <div class="mt-1"><v-icon small class="mr-2">my_location</v-icon>{{worker.distance.toFixed(2)}}Km from Destination</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-layout>
      </div>
    </v-container>
  </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        data () {
            return{
                snackbar: false,
                message: '',
                color: '',
                loading: false,

                activeTab: 1,

                tabs: [
                  {id: 1, name: 'Upcoming'},
                  {id: 2, name: 'Historical'},
                ]
            }
        },
        created(){
          this.initialize()
        },
        methods:{
           ...mapActions(['fetchIndividualUpcoming', 'fetchIndividualHistorical']),
          initialize(){
            this.fetchIndividualUpcoming()
          },
          updateTab(tab){
            if(tab == 1){
              this.activeTab = 1
            } else {
              this.activeTab = 2
            }
          }
        },
        computed: {
        ...mapGetters(['allIndividualUpcoming']),

        }
    }
</script>