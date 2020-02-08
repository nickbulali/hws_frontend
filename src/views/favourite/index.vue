<template>
  <div class="dashboard">
    <v-snackbar v-model="snackbar" :timeout="4000" top :color="color">
        <span>{{message}}</span>
    </v-snackbar>
    <v-dialog 
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
      v-model="profileDialog">
      <v-card>
        <v-toolbar
          flat
          dark
          class="secondary"
        >
          <v-toolbar-title v-if="profileDialog">{{profile.worker.first_name}} {{profile.worker.last_name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="profileDialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="height: 100%; padding: 0px">
          <div v-if="profileDialog == true">
            <v-img
              height="100%"
              src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
            >
              <v-layout column>
                <v-flex xs12>
                  <v-avatar
                    class="profile"
                    color="grey"
                    size="164"
                    tile
                  >
                    <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex xs12>
                  <div class="ma-2" v-if="$can('individual_request_service')">
                    <div class="title white--text">{{profile.worker.first_name}} {{profile.worker.last_name}}</div>
                    <div class="white--text">{{profile.worker.health_worker_profile.worker_category.name}} - {{profile.worker.health_worker_profile.worker_sub_category.name}}</div>
                  </div>
                </v-flex>
              </v-layout>
            </v-img>
              <v-container>
                <div v-if="$can('individual_request_service')">{{profile.worker.health_worker_profile.bio}}</div>
                <div class="my-4 subtitle-1 black--text" v-if="$can('individual_request_service')">
                  {{profile.worker.health_worker_profile.residence}}
                </div>
                <div v-if="$can('individual_request_service')">
                  <v-rating
                    :value="profile.rating"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>
                </div>
                <div class="grey--text" v-if="$can('individual_request_service')"><v-icon small left>people</v-icon>{{profile.rating.toFixed(1)}}/5 ({{profile.reviewers}})</div>
                
                <div><v-icon small left>my_location</v-icon>{{profile.distance.toFixed(2)}}Km away</div>

                <v-divider class="mx-1 my-2"></v-divider>
                  <div class="my-2"><b>Quick Request</b></div>
                  <div v-if="profile.worker.health_worker_profile.active == 1">
                    <v-layout column>
                        <v-flex xs12>
                            <v-menu
                                ref="menu11"
                                v-model="menu1"
                                :close-on-content-click="false"
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
                                    label="Start Time"
                                    prepend-inner-icon="access_time"
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
                            <v-menu
                                ref="menu12"
                                v-model="menu2"
                                :close-on-content-click="false"
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
                                    label="End Time"
                                    prepend-inner-icon="access_time"
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
                        <v-flex xs12 >
                            <v-map v-if="$can('individual_request_service')" ref="myMapRef" style="position: relative; width: 100%; height: 180px; z-index: 2" :center="[latitude, longitude]" :zoom="15">
                                <v-icondefault class="mt-5"></v-icondefault>
                                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                                <v-marker
                                    ref = "myMarker"
                                    :lat-lng="[latitude, longitude]"
                                    :icon="icon"
                                    :draggable='true'
                                >
                                    <v-popup :content="profile.worker.first_name"></v-popup>
                                </v-marker>
                            </v-map>
                        </v-flex>
                        <v-flex xs12 class="mt-2">
                            <v-btn
                                :loading="loading"
                                depressed
                                block
                                class="primary white--text text-none mt-2"
                                @click="completeRequest"
                            >
                                Complete
                                <v-icon right class="white--text">
                                    done_all
                                </v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                  </div>
                  <div class="grey--text" v-if="profile.worker.health_worker_profile.active == 0">{{profile.worker.first_name}} {{profile.worker.last_name}} is currently Unavailable</div>
              </v-container>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container>
        <v-layout column>
          <div align="center" v-if="favourites.length == 0">No favourites added</div>
          <template v-for="(favourite, index) in favourites">
            <v-flex xs12 class="mb-1">
              <v-card
                elevation="0"
                class="grey lighten-4 login-circle pa-2"
                @click="goToHProfile(index)"
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
                    <div><b>{{favourite.worker.first_name}} {{favourite.worker.last_name}}</b></div>
                    <div class="grey--text">{{favourite.worker.health_worker_profile.worker_category.name}} - {{favourite.worker.health_worker_profile.worker_sub_category.name}}</div>
                    <div>
                      <v-rating
                      :value="favourite.rating"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                      ></v-rating>
                    </div>
                    <div class="mt-1">Last Seen: {{formattedDate(favourite.lastVisit.created_at)}}</div>
                    <div class="mt-1">Total Visits: {{favourite.totalVisits}}</div>
                    
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
        <div v-if="length" class="text-xs-center">
          <v-pagination
            :length="length"
            total-visible="5"
            v-model="favouritePagination.current_page"
            @input="pagination"
            circle>
          </v-pagination>
        </div>
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
import format from 'date-fns/format'
import { mapGetters, mapActions } from 'vuex'
import 'leaflet/dist/leaflet.css'
import Vue from 'vue'

import * as Vue2Leaflet from 'vue2-leaflet'
import { latLng, Icon, icon } from 'leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete Icon.Default.prototype._getIconUrl;

  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  });

export default {
    components: {
      'v-map': Vue2Leaflet.LMap,
      'v-tilelayer': Vue2Leaflet.LTileLayer,
      'v-icondefault': Vue2Leaflet.LIconDefault,
      'v-marker': Vue2Leaflet.LMarker,
      'v-popup': Vue2Leaflet.LPopup
    },

    data(){
        let customicon = icon(Object.assign({},
            Icon.Default.prototype.options,
            {iconUrl, shadowUrl}
        ))
		return{
            icon: customicon,
            menu1: false,
            menu2: false,

			color: '',
			message: '',
			snackbar: false,
            loading: false,
            profileDialog: false,

            profile: {},

            latitude: '',
            longitude: '',
            location: '',

            requestData: {
                location: {},
                from: null,
                to: null,
                category: null,
                workerId: null,
                subGroup: null,
            },
        }
    },
    created(){
        this.initialize()
        navigator.geolocation.getCurrentPosition(this.currentPosition);
    },
    methods: {
        ...mapActions(['fetchfavourites']),
        allowedStep: m => m % 5 === 0,
        initialize(){
            this.fetchfavourites(this.favouritePagination.current_page)
        },
        goToHProfile(index){
            this.profile = this.favourites[index]
            this.profileDialog = true
        },
        pagination(){
            this.fetchfavourites(this.favouritePagination.current_page)
        },
        formattedDate(date){
            return date ? format(date, 'Do MMM YYYY') : ''
        },
        currentPosition(position){
            var vm = this
            vm.latitude = position.coords.latitude.toString()
            vm.longitude = position.coords.longitude.toString()
            Vue.set(this,"longitude", position.coords.longitude.toString())
            Vue.set(this,"latitude", position.coords.latitude.toString())

            var formData = {
                longitude: vm.longitude,
                latitude: vm.latitude
            }

            apiCall({url: '/api/userDevice', data: formData, method: 'POST' })
            .then(resp => {

            })
            .catch(error => {
                
            })
        },
        completeRequest(){
            this.requestData.location = this.$refs.myMarker.mapObject.getLatLng()
            this.requestData.category = this.profile.worker.health_worker_profile.worker_category.id
            this.requestData.workerId = this.profile.worker.id
            this.loading = true
            apiCall({url: '/api/userRequest?type=complete', data: this.requestData, method: 'POST' })
                .then(resp => {
                this.message = "Request Completed Successfully."
                this.color = 'success'
                this.snackbar = true
                this.loading = false
                this.profileDialog = true
                })
                .catch(error => {
                this.loading = false
                this.message = "An Error Occured, Please Try Again."
                this.color = 'error'
                this.snackbar = true
                })
      },
    },
    computed: {
        ...mapGetters(['favourites', 'favouritePagination']),
        now(){
            var today = new Date();
            var now = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            return now
        },
        length: function() {
            return Math.ceil(this.favouritePagination.total / this.favouritePagination.per_page);
          },
    }
}

</script>