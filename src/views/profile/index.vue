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
            <v-spacer></v-spacer>
            <v-toolbar-title>Edit Profile</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
            icon
            dark
            @click="profileDialog = false"
            >
            <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <v-container>
                <v-layout column>
                    <div>
                        <p class="title"><b>Basic</b></p>
                        <v-flex xs12>
                            <v-text-field
                                v-model="profile.fname"
                                :rules="inputRules"
                                prepend-inner-icon="person"
                                name="fname"
                                label="First Name"
                                outline
                                class="text_field"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                v-model="profile.lname"
                                :rules="inputRules"
                                prepend-inner-icon="person"
                                name="lname"
                                label="Last Name"
                                outline
                                class="text_field mt-2"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                v-model="profile.email"
                                :rules="inputRules"
                                prepend-inner-icon="mail"
                                name="email"
                                label="E-mail"
                                outline
                                class="text_field mt-2"
                            ></v-text-field>
                        </v-flex>
                    </div>
                    <v-divider class="my-4"></v-divider>
                    <div v-if="$can('health_worker_profile')">
                        <p class="title"><b>Professional</b></p>
                    </div>
                    
                </v-layout>
            </v-container>
        </v-card-text>
        </v-card>
    </v-dialog>
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
                <div class="ma-2">
                    <div class="title white--text">{{getProfile.first_name}} {{getProfile.last_name}}</div>
                    <div class="white--text" v-if="$can('health_worker_profile')">{{getProfile.health_worker_profile.worker_category.name}} - {{getProfile.health_worker_profile.worker_sub_category.name}}</div>
                </div>
            </v-flex>
        </v-layout>
        </v-img>
    <v-card
        class="mx-auto"
        max-width="374"
        elevation="0"
    >
        <v-card-text v-if="$can('health_worker_profile')">
            <div>{{getProfile.health_worker_profile.bio}}</div>
            <div class="my-4 subtitle-1 black--text">
                {{getProfile.health_worker_profile.residence}}
            </div>
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
            <div class="grey--text">4.5 (413)</div>
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
       
            <div align="center">
                <v-btn
                    depressed
                    class="primary white--text text-none mt-2"
                    text
                    @click="profileDialog = true"
                >
                    Edit
                    <v-icon right class="white--text">
                        edit
                    </v-icon>
                </v-btn>
            </div>
    </v-card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { USER_REQUEST } from '@/store/actions/user'

export default {
    data(){
		return{
			color: '',
			message: '',
			snackbar: false,
            profileDialog: false,
            inputRules: [
				v => !!v || 'Field is required'
			],

            profile: {
                fname: '',
                lname: '',
                email: ''
            }
		}
	},
    created(){
        this.initialize()
    },
    mounted() {
        this.profile.fname = this.getProfile.first_name
        this.profile.lname = this.getProfile.last_name
        this.profile.email = this.getProfile.email
    },
	methods: {
        ...mapActions(['fetchWorkerCategories', 'USER_REQUEST']),
        initialize(){
            this.fetchWorkerCategories()
            this.USER_REQUEST()
        }
    },
    computed: {
        ...mapGetters(['allWorkerCategories', 'getProfile']),
    }
}
</script>>