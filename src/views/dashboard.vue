<template>
  <div class="dashboard">
  <v-snackbar v-model="snackbar" :timeout="4000" top :color="snackbarColor">
			<span>{{message}}</span>
		</v-snackbar>
    <v-container>
      <template>
        <v-progress-linear :value="progressBar"  v-if="level2 == true"></v-progress-linear>
      </template>
      <div v-if="level2 == true">
        <v-layout column v-if="progress == 'Location'">
          <v-flex xs12>
            <p class="headline">Drop Pin</p>
          </v-flex>
          <v-flex xs12>
              <v-map ref="myMapRef" style="position: absolute; width: 92%; height: 85%; z-index: 2" zoom=15 :center="[latitude, longitude]">
                <v-icondefault class="mt-5"></v-icondefault>
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-marker  
                  ref = "myMarker"
                  :lat-lng="[latitude, longitude]"
                  :icon="icon"
                  :draggable='true'
                >
                  <v-popup content="Me"></v-popup>
                </v-marker>
                <v-btn class="secondary white--text text-none" style="position: absolute; z-index: 500; bottom: 5%;" block  @click="newPos">Next</v-btn>
              </v-map>
          </v-flex>
        </v-layout>
        <v-layout column v-if="progress == 'Time'">
          <v-flex xs12>
            <p class="headline">Pick Time</p>
          </v-flex>
          <v-flex xs12>
            <p>From</p>
            <v-menu
              ref="menu11"
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-left="170"
              :return-value.sync="requestData.from"
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="requestData.from"
                  label="From"
                  append-icon="access_time"
                  readonly
                  v-on="on"
                  outline
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu1"
                v-model="requestData.from"
                :allowed-minutes="allowedStep"
                full-width
                color="blue"
                @click:minute="$refs.menu11.save(requestData.from)"
                format="24hr"
                :min="now"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <p>To</p>
            <v-menu
              ref="menu12"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-left="170"
              :return-value.sync="requestData.to"
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="requestData.to"
                  label="To"
                  append-icon="access_time"
                  readonly
                  v-on="on"
                  outline
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="requestData.to"
                :allowed-minutes="allowedStep"
                full-width
                color="blue"
                @click:minute="$refs.menu12.save(requestData.to)"
                format="24hr"
                :min="requestData.from"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <v-btn class="secondary white--text text-none mt-5" block  @click="selectCategory">Next</v-btn>
          </v-flex>
        </v-layout>
        <v-layout column v-if="progress == 'Category'">
          <v-flex xs12>
            <p class="headline">Pick Category</p>
          </v-flex>
          <v-flex xs12>
            <v-layout column>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs6 class="mt-2">
                  <v-card
                      @click="pickCategory(1)"
                      :color="generalColor" class="white--text mx-1"
                    >
                      <v-card-text>
                      <div align="center" class="mt-3">
                          <v-img
                            src="general.png"
                            aspect-ratio="1"
                          ></v-img>
                        </div>
                        <div>
                          <div class="secondary--text headline mb-1">General Doctor</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs6 class="mt-2">
                  <v-card
                      @click="pickCategory(2)"
                      :color="specializedColor" class="white--text mx-1"
                    >
                      <v-card-text>
                      <div align="center" class="mt-3">
                          <v-img
                            src="doctor.png"
                            aspect-ratio="1"
                          ></v-img>
                        </div>
                        <div>
                          <div class="secondary--text headline mb-1">Specialised Doctor</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 class="mt-2">
                <v-layout row wrap>
                  <v-flex xs6>
                  <v-card
                      @click="pickCategory(3)"
                      :color="nurseColor" class="white--text mx-1"
                    >
                      <v-card-text>
                      <div align="center" class="mt-3">
                          <v-img
                            src="doctor.png"
                            aspect-ratio="1"
                          ></v-img>
                        </div>
                        <div>
                          <div class="secondary--text headline mb-1">Nurse</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </v-container>
  	<v-container class="my-5">
  		<v-layout column>
  		  <v-flex xs12 v-if="level1 == true">
          <div align="center" class="mt-3">
            <v-img
              src="home.png"
              aspect-ratio="1.9"
              max-width="200"
            ></v-img>
          </div>
        </v-flex>
        <div v-if="$can('individual_request_service') || $can('hospital_request_service')">
          <div v-if="level1 == true">
            <v-flex xs12 class="mt-4">
              <div class="primary login-circle mt-5" @click="newRequest">
                <v-layout row wrap>
                  <v-flex xs3>
                    <div align="center" class="mt-3">
                      <v-img
                        src="doctor.png"
                        aspect-ratio="1"
                        max-width="200"
                      ></v-img>
                    </div>
                  </v-flex>
                  <v-flex xs9>
                    <v-layout column>
                      <v-flex xs12>
                        <p class="white--text title mt-5 mb-5 ml-5">Request Here</p>
                      </v-flex>
                      <v-flex xs12>

                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
            <v-flex xs12>
              <div class="primary login-circle mt-3">
                <v-layout row wrap>
                  <v-flex xs3>
                    <div align="center" class="mt-3">
                      <v-img
                        src="doctor.png"
                        aspect-ratio="1"
                        max-width="200"
                      ></v-img>
                    </div>
                  </v-flex>
                  <v-flex xs9>
                    <v-layout column>
                      <v-flex xs12>
                        <p class="white--text title mt-5 mb-5 ml-5">Track Here</p>
                      </v-flex>
                      <v-flex xs12>

                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </div>
            </v-flex>
          </div>
        </div>
      </v-layout>
  	</v-container>

  </div>
</template>
<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
html, body {
  height: 100%;
  margin: 0;
}
</style>

<script>
  import apiCall from '@/utils/api'
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'

  import * as Vue2Leaflet from 'vue2-leaflet'
  import { latLng, Icon, icon } from 'leaflet'
  import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
  import iconUrl from 'leaflet/dist/images/marker-icon.png'
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

  Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)

  export default {
    components: {
      'v-map': Vue2Leaflet.LMap,
      'v-tilelayer': Vue2Leaflet.LTileLayer,
      'v-icondefault': Vue2Leaflet.LIconDefault,
      'v-marker': Vue2Leaflet.LMarker,
      'v-popup': Vue2Leaflet.LPopup
    },

    data () {
      let customicon = icon(Object.assign({},
        Icon.Default.prototype.options,
        {iconUrl, shadowUrl}
      ))

      return {
        level1: true,
        level2: false,
        menu1: false,
        menu2: false,

        snackbar: false,
        message: '',
        snackbarColor: '',

        generalColor: 'transparent',
        specializedColor: 'transparent',
        nurseColor: 'transparent',

        progress: 'Location',

        popupName: null,
        icon: customicon,
        clusterOptions: {},

        progressBar: 0,
        latitude: '-1.2921',
        longitude: '36.8219',
        location: '',

        requestData: {
          location: {},
          from: null,
          to: null,
          category: ''
        }
      }
    },
    created(){
      navigator.geolocation.getCurrentPosition(this.currentPosition);
    },
    watch: {
      
    },
    methods:{
      ...mapActions(['closestStation']),
      allowedStep: m => m % 15 === 0,
      currentPosition(position){
        var vm = this
        vm.latitude = position.coords.latitude.toString()
        vm.longitude = position.coords.longitude.toString()
        // Vue.set(this,"longitude", position.coords.longitude.toString())
        // Vue.set(this,"latitude", position.coords.latitude.toString())
      },
      newPos(){
        this.requestData.location = this.$refs.myMarker.mapObject.getLatLng()
        console.log("moved", this.requestData.location)
        this.progress = 'Time'
        this.progressBar = 25
      },
      selectCategory(){
        if(this.requestData.from == null || this.requestData.to == null){
          this.message = 'Please Pick Start/End Time'
          this.snackbar = true
          this.snackbarColor = 'error'
        }else{
          this.progress = 'Category'
          this.progressBar = 50
          this.menu1 = false
          this.menu2 = false
        }
        
      },
      newRequest(){
        this.level1 = false
        this.level2 = true
      },
      pickCategory(category){
        if(category == 1){
          if(this.requestData.category == 1){
            this.requestData.category = ''
            this.generalColor = 'transparent'
            this.specializedColor = 'transparent'
            this.nurseColor = 'transparent'
          } else {
            this.requestData.category = 1
            this.generalColor = 'primary'
            this.specializedColor = 'transparent'
            this.nurseColor = 'transparent'
          }
        } else if(category == 2){
          if(this.requestData.category == 2){
            this.requestData.category = ''
            this.specializedColor = 'transparent'
            this.generalColor = 'transparent'
            this.nurseColor = 'transparent'
          } else {
            this.requestData.category = 2
            this.specializedColor = 'primary'
            this.generalColor = 'transparent'
            this.nurseColor = 'transparent'
          }
        } else if(category == 3){
          if(this.requestData.category == 3){
            this.requestData.category = ''
            this.nurseColor = 'transparent'
             this.generalColor = 'transparent'
             this.specializedColor = 'transparent'
          } else {
            this.requestData.category = 3
            this.nurseColor = 'primary'
             this.generalColor = 'transparent'
             this.specializedColor = 'transparent'
          }
        }
          

      }
    },
    computed: {
      now(){
        var today = new Date();
        var now = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return now
      },
    }

  }
</script>
